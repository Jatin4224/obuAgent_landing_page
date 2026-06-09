import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

const CANVAS_SIZE = 1100;
const PARTICLE_COUNT = 14500;

function ellipse(ctx, x, y, rx, ry, color, rotation = 0) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rotation, 0, Math.PI * 2);
  ctx.fill();
}

function polygon(ctx, points, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  points.forEach(([x, y], index) => {
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fill();
}

function drawSoftGlow(ctx, x, y, radius, inner, outer) {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, inner);
  gradient.addColorStop(1, outer);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawRaccoonCanvas(ctx) {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  drawSoftGlow(ctx, 550, 500, 390, 'rgba(120, 96, 255, 0.52)', 'rgba(120, 96, 255, 0)');
  drawSoftGlow(ctx, 550, 560, 260, 'rgba(235, 230, 255, 0.2)', 'rgba(235, 230, 255, 0)');

  ellipse(ctx, 346, 318, 132, 152, 'rgb(125, 110, 255)', -0.55);
  ellipse(ctx, 754, 318, 132, 152, 'rgb(125, 110, 255)', 0.55);
  ellipse(ctx, 352, 332, 70, 90, 'rgb(232, 228, 255)', -0.55);
  ellipse(ctx, 748, 332, 70, 90, 'rgb(232, 228, 255)', 0.55);

  ellipse(ctx, 550, 520, 292, 328, 'rgb(138, 122, 255)');
  ellipse(ctx, 550, 574, 214, 228, 'rgb(244, 242, 255)');

  polygon(ctx, [
    [278, 444],
    [412, 328],
    [552, 412],
    [510, 538],
    [340, 560],
  ], 'rgb(31, 27, 82)');
  polygon(ctx, [
    [822, 444],
    [688, 328],
    [548, 412],
    [590, 538],
    [760, 560],
  ], 'rgb(31, 27, 82)');

  ellipse(ctx, 430, 482, 86, 50, 'rgb(16, 14, 42)', -0.18);
  ellipse(ctx, 670, 482, 86, 50, 'rgb(16, 14, 42)', 0.18);

  drawSoftGlow(ctx, 438, 480, 74, 'rgba(255, 255, 255, 1)', 'rgba(136, 116, 255, 0)');
  drawSoftGlow(ctx, 662, 480, 74, 'rgba(255, 255, 255, 1)', 'rgba(136, 116, 255, 0)');
  ellipse(ctx, 438, 480, 22, 28, 'rgb(255, 255, 255)');
  ellipse(ctx, 662, 480, 22, 28, 'rgb(255, 255, 255)');

  ellipse(ctx, 550, 620, 90, 72, 'rgb(255, 255, 255)');
  ellipse(ctx, 550, 588, 42, 26, 'rgb(18, 16, 42)');
  ellipse(ctx, 550, 648, 12, 34, 'rgb(42, 34, 84)');
  ellipse(ctx, 452, 626, 66, 38, 'rgb(198, 188, 255)', -0.18);
  ellipse(ctx, 648, 626, 66, 38, 'rgb(198, 188, 255)', 0.18);

  ctx.globalCompositeOperation = 'destination-out';
  ellipse(ctx, 550, 767, 180, 90, '#000');
  ellipse(ctx, 334, 378, 72, 104, '#000', -0.45);
  ellipse(ctx, 766, 378, 72, 104, '#000', 0.45);
  ctx.globalCompositeOperation = 'source-over';
}

function createParticleData() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  drawRaccoonCanvas(ctx);

  const image = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE).data;
  const samples = [];
  const step = 3;

  for (let y = 0; y < CANVAS_SIZE; y += step) {
    for (let x = 0; x < CANVAS_SIZE; x += step) {
      const index = (y * CANVAS_SIZE + x) * 4;
      const r = image[index];
      const g = image[index + 1];
      const b = image[index + 2];
      const brightness = r + g + b;
      if (brightness > 44 && Math.random() > 0.36) {
        samples.push({ x, y, r, g, b, brightness });
      }
    }
  }

  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const targets = new Float32Array(PARTICLE_COUNT * 3);
  const randoms = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const sizes = new Float32Array(PARTICLE_COUNT);
  const seeds = new Float32Array(PARTICLE_COUNT);
  const scale = 7.2 / CANVAS_SIZE;

  for (let i = 0; i < PARTICLE_COUNT; i += 1) {
    const sample = samples[Math.floor(Math.random() * samples.length)];
    const i3 = i * 3;
    const targetX = (sample.x - CANVAS_SIZE * 0.5) * scale;
    const targetY = -(sample.y - CANVAS_SIZE * 0.5) * scale + 0.12;
    const bright = Math.min(sample.brightness / 765, 1);
    const lift = sample.b > 170 ? 0.22 : 0.08;

    targets[i3] = targetX + (Math.random() - 0.5) * 0.018;
    targets[i3 + 1] = targetY + (Math.random() - 0.5) * 0.018;
    targets[i3 + 2] = (Math.random() - 0.5) * 0.92;

    positions[i3] = (Math.random() - 0.5) * 13;
    positions[i3 + 1] = (Math.random() - 0.5) * 8;
    positions[i3 + 2] = (Math.random() - 0.5) * 7;

    randoms[i3] = (Math.random() - 0.5) * 13;
    randoms[i3 + 1] = (Math.random() - 0.5) * 8;
    randoms[i3 + 2] = (Math.random() - 0.5) * 7;

    colors[i3] = Math.min(1, sample.r / 255 + lift * 0.42);
    colors[i3 + 1] = Math.min(1, sample.g / 255 + lift * 0.26);
    colors[i3 + 2] = Math.min(1, sample.b / 255 + lift);
    sizes[i] = 1.45 + Math.random() * 2.7 + bright * 1.5;
    seeds[i] = Math.random() * 1000;
  }

  return { positions, targets, randoms, colors, sizes, seeds };
}

const vertexShader = `
  attribute vec3 aColor;
  attribute float aSize;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = aSize * (9.0 / max(-mvPosition.z, 2.5));
    vColor = aColor;
    vAlpha = 0.72 + smoothstep(0.55, 1.0, max(max(aColor.r, aColor.g), aColor.b)) * 0.28;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv);
    float core = smoothstep(0.48, 0.08, d);
    float glow = smoothstep(0.5, 0.0, d) * 0.44;
    float alpha = (core + glow) * vAlpha;
    if (alpha < 0.02) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

export default function RaccoonParticles() {
  const pointsRef = useRef();
  const hoverTarget = useRef(new THREE.Vector2(8, 8));
  const mouse = useRef(new THREE.Vector2(8, 8));
  const { gl, viewport } = useThree();
  const fitScale = Math.min(1.08, viewport.width / 7.8, viewport.height / 6.1);
  const data = useMemo(createParticleData, []);

  const geometry = useMemo(() => {
    const bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.setAttribute('position', new THREE.BufferAttribute(data.positions, 3));
    bufferGeometry.setAttribute('aColor', new THREE.BufferAttribute(data.colors, 3));
    bufferGeometry.setAttribute('aSize', new THREE.BufferAttribute(data.sizes, 1));
    return bufferGeometry;
  }, [data]);

  useEffect(() => {
    const canvas = gl.domElement;

    const handlePointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      hoverTarget.current.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -(((event.clientY - rect.top) / rect.height) * 2 - 1),
      );
    };

    const handlePointerLeave = () => {
      hoverTarget.current.set(8, 8);
    };

    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [gl]);

  useFrame(({ clock }, delta) => {
    const elapsed = clock.getElapsedTime();
    const positions = geometry.attributes.position.array;
    const maxDelta = Math.min(delta, 0.033);
    const assemble = THREE.MathUtils.smoothstep(Math.min(elapsed / 2.9, 1), 0, 1);
    mouse.current.lerp(hoverTarget.current, 0.12);

    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const i3 = i * 3;
      const seed = data.seeds[i];
      const targetX = data.targets[i3];
      const targetY = data.targets[i3 + 1];
      const targetZ = data.targets[i3 + 2];
      const breathe = 0.045 + Math.sin(elapsed * 0.52 + seed) * 0.018;
      const noiseX = Math.sin(elapsed * 0.8 + seed + targetY * 1.7) * breathe;
      const noiseY = Math.cos(elapsed * 0.64 + seed * 1.31 + targetX * 1.2) * breathe;
      const drift = Math.max(0, Math.sin(elapsed * 0.34 + seed * 0.09)) ** 11;

      let desiredX = THREE.MathUtils.lerp(data.randoms[i3], targetX + noiseX, assemble);
      let desiredY = THREE.MathUtils.lerp(data.randoms[i3 + 1], targetY + noiseY, assemble);
      let desiredZ = THREE.MathUtils.lerp(data.randoms[i3 + 2], targetZ, assemble);

      desiredX += Math.sin(seed + elapsed * 0.42) * drift * 0.28;
      desiredY += Math.cos(seed * 1.7 + elapsed * 0.36) * drift * 0.2;
      desiredZ += Math.sin(seed * 0.4 + elapsed * 0.5) * drift * 0.28;

      const screenX = desiredX / 4.2;
      const screenY = desiredY / 3.1;
      const dx = screenX - mouse.current.x;
      const dy = screenY - mouse.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;
      const repel = Math.max(0, 0.29 - dist) / 0.29;
      desiredX += (dx / dist) * repel * repel * 0.58;
      desiredY += (dy / dist) * repel * repel * 0.46;
      desiredZ += repel * 0.45;

      const follow = 1 - Math.exp(-maxDelta * (2.5 + assemble * 5.2));
      positions[i3] += (desiredX - positions[i3]) * follow;
      positions[i3 + 1] += (desiredY - positions[i3 + 1]) * follow;
      positions[i3 + 2] += (desiredZ - positions[i3 + 2]) * follow;
    }

    geometry.attributes.position.needsUpdate = true;
    if (pointsRef.current) {
      pointsRef.current.rotation.z = Math.sin(elapsed * 0.18) * 0.012;
      pointsRef.current.rotation.y = Math.sin(elapsed * 0.22) * 0.045;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} scale={fitScale} frustumCulled={false}>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
