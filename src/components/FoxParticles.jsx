import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { sampleImageParticles } from './ParticleImageSampler.js';

const FOX_IMAGE = '/assets/fox.png';

const vertexShader = `
  attribute float aSize;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vAlpha;
  uniform float uOpacity;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = aSize * (10.0 / max(-mvPosition.z, 2.2));
    vColor = aColor;
    vAlpha = uOpacity * (0.72 + smoothstep(1.0, 2.8, aSize) * 0.28);
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv);
    float dotShape = smoothstep(0.5, 0.12, d);
    float glow = smoothstep(0.5, 0.0, d) * 0.36;
    float alpha = (dotShape + glow) * vAlpha;
    if (alpha < 0.025) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

export default function FoxParticles({ wakeProgressRef, dissolveRef }) {
  const pointsRef = useRef();
  const materialRef = useRef();
  const projectionVector = useRef(new THREE.Vector3());
  const mouse = useRef(new THREE.Vector2(9, 9));
  const mouseTarget = useRef(new THREE.Vector2(9, 9));
  const headLook = useRef(new THREE.Vector2(0, 0));
  const boopTime = useRef(999); // seconds since last nose boop; 999 = idle
  const { gl, viewport, camera } = useThree();
  const [particleData, setParticleData] = useState(null);

  useEffect(() => {
    const handleBoop = () => {
      boopTime.current = 0;
    };
    window.addEventListener("obu-fox-boop", handleBoop);
    return () => window.removeEventListener("obu-fox-boop", handleBoop);
  }, []);

  useEffect(() => {
    let mounted = true;
    sampleImageParticles(FOX_IMAGE, {
      maxParticles: 62000,
      threshold: 10,
      scale: 5.85,
      depth: 0.9,
      preserveColor: true,
      foxPalette: true,
      focusFoxOnly: true,
      removeEyePixels: true,
    }).then((data) => {
      if (!mounted) return;
      const baseSizes = data.sizes.slice();
      const dissolveOrder = new Float32Array(data.count);
      let maxRadius = 0.001;

      for (let i = 0; i < data.count; i += 1) {
        const i3 = i * 3;
        maxRadius = Math.max(maxRadius, Math.hypot(data.original[i3], data.original[i3 + 1]));
      }

      for (let i = 0; i < data.count; i += 1) {
        const i3 = i * 3;
        dissolveOrder[i] = Math.hypot(data.original[i3], data.original[i3 + 1]) / maxRadius;
      }

      setParticleData({ ...data, baseSizes, dissolveOrder });
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
    const bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.setAttribute('position', new THREE.BufferAttribute(particleData.positions, 3));
    bufferGeometry.setAttribute('aSize', new THREE.BufferAttribute(particleData.sizes, 1));
    bufferGeometry.setAttribute('aColor', new THREE.BufferAttribute(particleData.colors, 3));
    return bufferGeometry;
  }, [particleData]);

  const uniforms = useMemo(() => ({ uOpacity: { value: 1 } }), []);

  const fitScale = Math.min(1, viewport.width / 6.2, viewport.height / 5.1);

  useFrame(({ clock }, delta) => {
    if (!particleData || !geometry) return;

    const elapsed = clock.getElapsedTime();
    const dt = Math.min(delta, 0.033);
    const positions = geometry.attributes.position.array;
    const sizes = geometry.attributes.aSize.array;
    const { original, velocity, seeds, count, baseSizes, dissolveOrder } = particleData;
    const wake = wakeProgressRef?.current ?? 0;
    const dissolve = dissolveRef?.current ?? 0;
    mouse.current.lerp(mouseTarget.current, 0.14);

    // Head subtly turns toward the pointer — the fox is "aware" of you even
    // while asleep. mouseTarget parks at (9,9) off-canvas, so gate on range.
    const onCanvas =
      Math.abs(mouseTarget.current.x) <= 1.2 && Math.abs(mouseTarget.current.y) <= 1.2;
    headLook.current.x += ((onCanvas ? mouseTarget.current.x : 0) - headLook.current.x) * 0.045;
    headLook.current.y += ((onCanvas ? mouseTarget.current.y : 0) - headLook.current.y) * 0.045;

    // Nose-boop ripple: an expanding ring impulse from the nose.
    let boopWave = 0;
    let boopRadius = 0;
    const bt = boopTime.current;
    if (bt < 1.2) {
      boopTime.current += dt;
      boopWave = Math.sin(Math.min(bt / 1.2, 1) * Math.PI);
      boopRadius = 0.3 + bt * 3.4;
    }

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      const ox = original[i3];
      const oy = original[i3 + 1];
      const oz = original[i3 + 2];
      const seed = seeds[i];
      const breath = Math.sin(elapsed * 0.58 + seed) * (0.014 + wake * 0.016);
      const flowX = simplexLike(ox * 0.42, oy * 0.42, elapsed * 0.16 + seed) * (0.012 + wake * 0.018);
      const flowY = simplexLike(oy * 0.48 + 19.0, ox * 0.36, elapsed * 0.14 + seed) * (0.012 + wake * 0.018);
      const floatZ = Math.sin(elapsed * 0.45 + seed * 1.7) * (0.025 + wake * 0.03);

      let tx = ox + flowX + ox * breath * 0.012;
      let ty = oy + flowY + oy * breath * 0.012;
      let tz = oz + floatZ;
      const start = (1 - dissolveOrder[i]) * 0.62;
      const localDissolve = smoothstepRange(start, start + 0.42, dissolve);

      const ndc = worldToNdc(tx, ty, tz, camera, projectionVector.current);
      const dx = ndc.x - mouse.current.x;
      const dy = ndc.y - mouse.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy) + 0.0001;
      const force = Math.max(0, 0.24 - dist) / 0.24;

      if (force > 0) {
        const push = force * force;
        tx += (dx / dist) * push * 0.68;
        ty += (dy / dist) * push * 0.52;
        tz += push * 0.34;
      }

      if (boopWave > 0) {
        // Distance from the nose (≈ 0, -1.05 in fox space) vs the ring front
        const noseDx = ox;
        const noseDy = oy + 1.05;
        const noseDist = Math.sqrt(noseDx * noseDx + noseDy * noseDy) + 0.0001;
        const ringInfluence = Math.max(0, 1 - Math.abs(noseDist - boopRadius) / 0.55);
        if (ringInfluence > 0) {
          const kick = ringInfluence * ringInfluence * boopWave;
          tx += (noseDx / noseDist) * kick * 0.42;
          ty += (noseDy / noseDist) * kick * 0.34;
          tz += kick * 0.3;
        }
      }

      if (localDissolve > 0) {
        const radius = Math.hypot(ox, oy) + 0.001;
        const outwardX = ox / radius;
        const outwardY = oy / radius;
        const scatter = localDissolve * localDissolve;
        tx += outwardX * scatter * (1.2 + dissolveOrder[i] * 1.9);
        ty += outwardY * scatter * (0.95 + dissolveOrder[i] * 1.55);
        tz += scatter * (0.75 + random(seed) * 0.7);
      }

      sizes[i] = baseSizes[i] * (1 - localDissolve);

      velocity[i3] += (tx - positions[i3]) * 22 * dt;
      velocity[i3 + 1] += (ty - positions[i3 + 1]) * 22 * dt;
      velocity[i3 + 2] += (tz - positions[i3 + 2]) * 18 * dt;

      velocity[i3] *= 0.82;
      velocity[i3 + 1] *= 0.82;
      velocity[i3 + 2] *= 0.84;

      positions[i3] += velocity[i3];
      positions[i3 + 1] += velocity[i3 + 1];
      positions[i3 + 2] += velocity[i3 + 2];
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.aSize.needsUpdate = true;
    if (pointsRef.current) {
      pointsRef.current.scale.setScalar(fitScale);
      pointsRef.current.position.y = 0;
      pointsRef.current.position.z = 0.42;
      pointsRef.current.rotation.y =
        Math.sin(elapsed * 0.18) * 0.055 + headLook.current.x * 0.085;
      pointsRef.current.rotation.x =
        Math.sin(elapsed * 0.13) * 0.018 - headLook.current.y * 0.05;
    }
    if (materialRef.current) {
      materialRef.current.uniforms.uOpacity.value = 1 - dissolve * 0.78;
    }
  });

  if (!geometry) return null;

  return (
    <points ref={pointsRef} geometry={geometry} scale={fitScale} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function worldToNdc(x, y, z, camera, vector) {
  vector.set(x, y, z);
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

function random(value) {
  const raw = Math.sin(value) * 43758.5453123;
  return raw - Math.floor(raw);
}
