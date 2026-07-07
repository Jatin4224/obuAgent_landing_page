import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const EYE_PARTICLES = 520;
const PUPIL_PARTICLES = 140;

const vertexShader = `
  attribute float aSize;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vAlpha;
  uniform float uOpacity;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = aSize * (14.0 / max(-mvPosition.z, 2.0));
    vColor = aColor;
    vAlpha = 0.95 * uOpacity;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv);
    float core = smoothstep(0.5, 0.1, d);
    float glow = smoothstep(0.5, 0.0, d) * 0.5;
    float alpha = (core + glow) * vAlpha;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

export default function EyeParticles({ wakeProgressRef, dissolveRef }) {
  const eyeRef = useRef();
  const pupilRef = useRef();
  const eyeMaterialRef = useRef();
  const pupilMaterialRef = useRef();
  const pupilLookRef = useRef({ x: 0, y: 0 });

  const { viewport, pointer } = useThree();

  const eyeData = useMemo(() => createEyeData(), []);
  const pupilData = useMemo(() => createPupilData(), []);

  const eyeGeometry = useMemo(() => createGeometry(eyeData), [eyeData]);
  const pupilGeometry = useMemo(() => createGeometry(pupilData), [pupilData]);

  const fitScale = Math.min(1, viewport.width / 6.2, viewport.height / 5.1);

  const eyeUniforms = useMemo(() => ({ uOpacity: { value: 1 } }), []);
  const pupilUniforms = useMemo(() => ({ uOpacity: { value: 1 } }), []);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const progress = wakeProgressRef?.current ?? 0;
    const p = smoothstep(progress);
    const dissolve = dissolveRef?.current ?? 0;

    const targetLookX = THREE.MathUtils.clamp(pointer.x * 0.085, -0.085, 0.085);
    const targetLookY = THREE.MathUtils.clamp(pointer.y * 0.06, -0.06, 0.06);

    /* FIX: Increased tracking interpolation weights from 0.08 to 0.22 
       to make the look-at animation significantly faster and snappier.
    */
    pupilLookRef.current.x = THREE.MathUtils.lerp(
      pupilLookRef.current.x,
      targetLookX,
      0.22,
    );

    pupilLookRef.current.y = THREE.MathUtils.lerp(
      pupilLookRef.current.y,
      targetLookY,
      0.22,
    );

    updateParticlePositions(eyeGeometry, eyeData, p, elapsed, false);

    updateParticlePositions(
      pupilGeometry,
      pupilData,
      p,
      elapsed,
      true,
      pupilLookRef.current,
    );

    if (eyeRef.current) {
      eyeRef.current.scale.setScalar(fitScale);
      eyeRef.current.position.set(0, 0, 0.48);
    }

    if (pupilRef.current) {
      pupilRef.current.scale.setScalar(fitScale);
      pupilRef.current.position.set(0, 0, 0.56);
    }

    const opacity = Math.max(0, 1 - dissolve * 1.25);

    if (eyeMaterialRef.current) {
      eyeMaterialRef.current.uniforms.uOpacity.value = opacity;
    }

    if (pupilMaterialRef.current) {
      pupilMaterialRef.current.uniforms.uOpacity.value = opacity;
    }
  });

  return (
    <>
      <points ref={eyeRef} geometry={eyeGeometry} frustumCulled={false}>
        <shaderMaterial
          ref={(materialRef) => {
            eyeMaterialRef.current = materialRef;
          }}
          uniforms={eyeUniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <points ref={pupilRef} geometry={pupilGeometry} frustumCulled={false}>
        <shaderMaterial
          ref={(materialRef) => {
            pupilMaterialRef.current = materialRef;
          }}
          uniforms={pupilUniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </points>
    </>
  );
}

function createGeometry(data) {
  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(data.positions, 3),
  );

  geometry.setAttribute("aSize", new THREE.BufferAttribute(data.sizes, 1));
  geometry.setAttribute("aColor", new THREE.BufferAttribute(data.colors, 3));

  return geometry;
}

function updateParticlePositions(
  geometry,
  data,
  progress,
  elapsed,
  isPupil,
  mouseOffset = { x: 0, y: 0 },
) {
  const positions = geometry.attributes.position.array;

  for (let i = 0; i < data.count; i += 1) {
    const i3 = i * 3;
    const seed = data.seeds[i];

    const shimmer = isPupil
      ? Math.sin(elapsed * 1.4 + seed) * 0.0015
      : Math.sin(elapsed * 1.2 + seed) * (0.003 + progress * 0.005);

    const lookX = isPupil ? mouseOffset.x * progress : 0;
    const lookY = isPupil ? mouseOffset.y * progress : 0;

    positions[i3] =
      THREE.MathUtils.lerp(data.closed[i3], data.open[i3], progress) +
      shimmer +
      lookX;

    positions[i3 + 1] =
      THREE.MathUtils.lerp(data.closed[i3 + 1], data.open[i3 + 1], progress) +
      shimmer * 0.5 +
      lookY;

    positions[i3 + 2] =
      THREE.MathUtils.lerp(data.closed[i3 + 2], data.open[i3 + 2], progress) +
      progress * 0.05;

    data.sizes[i] =
      data.baseSizes[i] +
      progress * (isPupil ? 0.2 : 0.8) +
      Math.sin(elapsed * 2.0 + seed) * (isPupil ? 0.04 : 0.12);
  }

  geometry.attributes.position.needsUpdate = true;
  geometry.attributes.aSize.needsUpdate = true;
}

function createEyeData() {
  const count = EYE_PARTICLES * 2;
  const closed = new Float32Array(count * 3);
  const open = new Float32Array(count * 3);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const baseSizes = new Float32Array(count);
  const seeds = new Float32Array(count);

  const centers = [
    [-0.6, -0.5],
    [0.6, -0.5],
  ];

  centers.forEach(([cx, cy], side) => {
    for (let i = 0; i < EYE_PARTICLES; i += 1) {
      const index = side * EYE_PARTICLES + i;
      const i3 = index * 3;
      const t = i / (EYE_PARTICLES - 1);
      const jitter = random(index * 12.13) - 0.5;

      const closedAngle = Math.PI * (0.05 + t * 0.9);

      closed[i3] = cx + Math.cos(closedAngle) * 0.26 + jitter * 0.01;
      closed[i3 + 1] =
        cy - 0.01 + Math.sin(closedAngle) * 0.04 + Math.abs(jitter) * 0.01;
      closed[i3 + 2] = 0.45 + jitter * 0.02;

      const radiusDist = Math.sqrt(random(index * 4.71));
      const angle = random(index * 7.89) * Math.PI * 2;

      const eyeRadiusX = 0.25;
      const eyeRadiusY = 0.28;

      open[i3] =
        cx + Math.cos(angle) * eyeRadiusX * radiusDist + jitter * 0.008;
      open[i3 + 1] =
        cy + Math.sin(angle) * eyeRadiusY * radiusDist + jitter * 0.008;
      open[i3 + 2] = 0.52 + jitter * 0.03;

      const colorShift = random(index * 3.45);

      colors[i3] = 0.85 + colorShift * 0.15;
      colors[i3 + 1] = 0.88 + colorShift * 0.12;
      colors[i3 + 2] = 1.2 + colorShift * 0.3;

      sizes[index] = 1.4;
      baseSizes[index] = 1.4;

      positions[i3] = closed[i3];
      positions[i3 + 1] = closed[i3 + 1];
      positions[i3 + 2] = closed[i3 + 2];

      seeds[index] = random(index * 19.83) * 1000;
    }
  });

  return { count, closed, open, positions, colors, sizes, baseSizes, seeds };
}

function createPupilData() {
  const count = PUPIL_PARTICLES * 2;
  const closed = new Float32Array(count * 3);
  const open = new Float32Array(count * 3);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const baseSizes = new Float32Array(count);
  const seeds = new Float32Array(count);

  const centers = [
    [-0.6, -0.5],
    [0.6, -0.5],
  ];

  centers.forEach(([cx, cy], side) => {
    for (let i = 0; i < PUPIL_PARTICLES; i += 1) {
      const index = side * PUPIL_PARTICLES + i;
      const i3 = index * 3;
      const t = i / (PUPIL_PARTICLES - 1);
      const jitter = random(index * 14.71) - 0.5;

      const closedAngle = Math.PI * (0.15 + t * 0.7);

      closed[i3] = cx + Math.cos(closedAngle) * 0.14 + jitter * 0.004;
      closed[i3 + 1] = cy + Math.sin(closedAngle) * 0.02;
      closed[i3 + 2] = 0.58;

      const angle = random(index * 8.11) * Math.PI * 2;
      const radius = Math.sqrt(random(index * 3.22)) * 0.085;

      open[i3] = cx + Math.cos(angle) * radius;
      open[i3 + 1] = cy + Math.sin(angle) * radius;
      open[i3 + 2] = 0.62;

      colors[i3] = 0.01;
      colors[i3 + 1] = 0.01;
      colors[i3 + 2] = 0.015;

      sizes[index] = 2.4;
      baseSizes[index] = 2.4;

      positions[i3] = closed[i3];
      positions[i3 + 1] = closed[i3 + 1];
      positions[i3 + 2] = closed[i3 + 2];

      seeds[index] = random(index * 21.11) * 1000;
    }
  });

  return { count, closed, open, positions, colors, sizes, baseSizes, seeds };
}

function random(value) {
  const raw = Math.sin(value) * 43758.5453123;
  return raw - Math.floor(raw);
}

function smoothstep(value) {
  const x = Math.min(1, Math.max(0, value));
  return x * x * (3 - 2 * x);
}
