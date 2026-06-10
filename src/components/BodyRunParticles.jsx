import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { sampleImageParticles } from './ParticleImageSampler.js';

const FULL_BODY_IMAGES = ['/assets/fox-full-body.png', '/src/assets/fox-full-body.png'];
const FALLBACK_IMAGE = '/assets/fox.png';
const BODY_PARTICLES = 38000;

const vertexShader = `
  attribute float aSize;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vAlpha;
  uniform float uOpacity;
  uniform float uSoftness;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = aSize * (10.4 + uSoftness * 2.0) / max(-mvPosition.z, 2.2);
    vColor = aColor;
    vAlpha = uOpacity * (0.76 + smoothstep(1.0, 2.8, aSize) * 0.22);
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  uniform float uSoftness;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv);
    float dotShape = smoothstep(0.5, 0.12, d);
    float glow = smoothstep(0.5, 0.0, d) * (0.32 + uSoftness * 0.18);
    float alpha = (dotShape + glow) * vAlpha;
    if (alpha < 0.02) discard;
    gl_FragColor = vec4(vColor * 1.04, alpha);
  }
`;

export default function BodyRunParticles({ bodyRevealRef, productIntroRef }) {
  const groupRef = useRef();
  const bodyMaterialRef = useRef();
  const projectionVector = useRef(new THREE.Vector3());
  const mouse = useRef(new THREE.Vector2(9, 9));
  const mouseTarget = useRef(new THREE.Vector2(9, 9));
  const { gl, viewport, camera } = useThree();
  const [particleData, setParticleData] = useState(null);

  useEffect(() => {
    let mounted = true;

    loadParticleTarget(FULL_BODY_IMAGES).then((standing) => {
      if (!mounted) return;
      const count = Math.min(standing.count, BODY_PARTICLES);
      setParticleData({ standing, count });
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const canvas = gl.domElement;

    const handleMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      mouseTarget.current.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -(((event.clientY - rect.top) / rect.height) * 2 - 1),
      );
    };

    const handleLeave = () => {
      mouseTarget.current.set(9, 9);
    };

    canvas.addEventListener('pointermove', handleMove);
    canvas.addEventListener('pointerleave', handleLeave);

    return () => {
      canvas.removeEventListener('pointermove', handleMove);
      canvas.removeEventListener('pointerleave', handleLeave);
    };
  }, [gl]);

  const geometry = useMemo(() => {
    if (!particleData) return null;
    const { standing, count } = particleData;
    const bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.setAttribute('position', new THREE.BufferAttribute(standing.original.slice(0, count * 3), 3));
    bufferGeometry.setAttribute('aSize', new THREE.BufferAttribute(standing.sizes.slice(0, count), 1));
    bufferGeometry.setAttribute('aColor', new THREE.BufferAttribute(standing.colors.slice(0, count * 3), 3));
    return bufferGeometry;
  }, [particleData]);

  const uniforms = useMemo(() => ({ uOpacity: { value: 0 }, uSoftness: { value: 0 } }), []);

  useFrame(({ clock }) => {
    if (!particleData || !geometry) return;

    const elapsed = clock.getElapsedTime();
    const reveal = bodyRevealRef?.current ?? 0;
    const intro = productIntroRef?.current ?? 0;
    const positions = geometry.attributes.position.array;
    const { standing, count } = particleData;
    mouse.current.lerp(mouseTarget.current, 0.14);

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      const seed = standing.seeds[i];
      const sx = standing.original[i3];
      const sy = standing.original[i3 + 1];
      const sz = standing.original[i3 + 2];
      const tailRegion = smoothstepRange(0.45, 1.55, sx) * smoothstepRange(-0.2, 1.2, sy);
      const tailWave = Math.sin(elapsed * 1.9 + sx * 1.1 + seed) * tailRegion * 0.045;
      const breathe = Math.sin(elapsed * 0.7 + seed) * 0.02;
      const driftX = simplexLike(sx * 0.28, sy * 0.24, elapsed * 0.12 + seed) * 0.014;
      const driftY = simplexLike(sy * 0.26 + 11.0, sx * 0.22, elapsed * 0.11 + seed) * 0.014;

      let tx = sx + breathe + tailWave + driftX;
      let ty = sy + driftY;
      let tz = sz + Math.cos(elapsed * 1.6 + seed) * 0.025;

      const ndc = worldToNdc(tx, ty, tz, groupRef.current, camera, projectionVector.current);
      const dx = ndc.x - mouse.current.x;
      const dy = ndc.y - mouse.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy) + 0.0001;
      const force = Math.max(0, 0.22 - dist) / 0.22;

      if (force > 0) {
        const push = force * force;
        tx += (dx / dist) * push * 0.42;
        ty += (dy / dist) * push * 0.32;
        tz += push * 0.22;
      }

      positions[i3] = tx;
      positions[i3 + 1] = ty;
      positions[i3 + 2] = tz;
    }

    geometry.attributes.position.needsUpdate = true;

    if (groupRef.current) {
      const fitScale = Math.min(1, viewport.width / 8.2, viewport.height / 6.4);
      const zoomScale = THREE.MathUtils.lerp(0.72, 0.88, reveal);
      const retreatScale = THREE.MathUtils.lerp(1, 0.35, intro);
      const scale = fitScale * zoomScale * retreatScale;
      const settleX = 0.08;
      const settleY = -0.72;

      groupRef.current.position.x = settleX;
      groupRef.current.position.y = settleY + Math.sin(elapsed * 0.9) * 0.035 * reveal;
      groupRef.current.position.z = -0.72 - intro * 1.5;
      groupRef.current.scale.setScalar(scale);
      groupRef.current.rotation.z = 0;
    }

    if (bodyMaterialRef.current) {
      bodyMaterialRef.current.uniforms.uOpacity.value = reveal * THREE.MathUtils.lerp(1, 0.3, intro);
      bodyMaterialRef.current.uniforms.uSoftness.value = intro;
    }
  });

  if (!geometry) return null;

  return (
    <group ref={groupRef} position={[0, -0.3, 0.2]}>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={bodyMaterialRef}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

async function loadParticleTarget(sources) {
  const candidates = [...sources, FALLBACK_IMAGE];

  for (const src of candidates) {
    try {
      return await sampleImageParticles(src, {
        maxParticles: BODY_PARTICLES,
        threshold: 9,
        scale: 5.4,
        depth: 0.72,
        preserveColor: true,
        foxPalette: true,
        focusFoxOnly: false,
        removeEyePixels: false,
        adaptiveDensity: false,
        contourBoost: false,
      });
    } catch {
      // Try the next supported asset location.
    }
  }

  return sampleImageParticles(FALLBACK_IMAGE, {
      maxParticles: BODY_PARTICLES,
      threshold: 9,
      scale: 5.4,
      depth: 0.72,
      preserveColor: true,
      foxPalette: true,
      focusFoxOnly: false,
      removeEyePixels: false,
      adaptiveDensity: false,
      contourBoost: false,
  });
}

function random(value) {
  const raw = Math.sin(value) * 43758.5453123;
  return raw - Math.floor(raw);
}

function worldToNdc(x, y, z, group, camera, vector) {
  vector.set(x, y, z);
  if (group) group.localToWorld(vector);
  vector.project(camera);
  return vector;
}

function simplexLike(x, y, z) {
  const a = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
  const b = Math.sin(x * 4.898 + y * 7.23 + z * 12.731) * 23421.631;
  return (fract(a) + fract(b)) - 1.0;
}

function fract(value) {
  return value - Math.floor(value);
}

function smoothstepRange(edge0, edge1, value) {
  const x = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return x * x * (3 - 2 * x);
}
