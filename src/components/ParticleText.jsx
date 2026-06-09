import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

const PARTICLE_COUNT = 14500;
const TARGET_CANVAS = 1024;

function drawPolygon(ctx, points) {
  ctx.beginPath();
  points.forEach(([x, y], index) => {
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.closePath();
  ctx.fill();
}

function roundedRectPath(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
}

function drawCalendarMark(ctx) {
  ctx.save();
  ctx.translate(116, 358);
  ctx.strokeStyle = '#fff';
  ctx.fillStyle = '#fff';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.lineWidth = 18;
  roundedRectPath(ctx, 0, 22, 150, 150, 26);
  ctx.stroke();

  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.moveTo(0, 70);
  ctx.lineTo(150, 70);
  ctx.stroke();

  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.moveTo(42, 0);
  ctx.lineTo(42, 42);
  ctx.moveTo(108, 0);
  ctx.lineTo(108, 42);
  ctx.stroke();

  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(38, 110);
  ctx.lineTo(112, 110);
  ctx.moveTo(38, 140);
  ctx.lineTo(86, 140);
  ctx.stroke();
  ctx.restore();
}

function drawGmailMark(ctx) {
  ctx.save();
  ctx.translate(758, 382);
  ctx.strokeStyle = '#fff';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.lineWidth = 17;
  roundedRectPath(ctx, 0, 0, 178, 126, 22);
  ctx.stroke();

  ctx.lineWidth = 22;
  ctx.beginPath();
  ctx.moveTo(14, 18);
  ctx.lineTo(89, 78);
  ctx.lineTo(164, 18);
  ctx.stroke();

  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.moveTo(14, 108);
  ctx.lineTo(14, 20);
  ctx.moveTo(164, 20);
  ctx.lineTo(164, 108);
  ctx.stroke();
  ctx.restore();
}

function particleTargets(count) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  canvas.width = TARGET_CANVAS;
  canvas.height = TARGET_CANVAS;

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, TARGET_CANVAS, TARGET_CANVAS);
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  drawPolygon(ctx, [
    [258, 392],
    [344, 150],
    [446, 330],
    [578, 330],
    [680, 150],
    [766, 392],
    [710, 610],
    [512, 724],
    [314, 610],
  ]);

  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = '#000';
  drawPolygon(ctx, [
    [328, 374],
    [370, 248],
    [418, 362],
  ]);
  drawPolygon(ctx, [
    [696, 374],
    [654, 248],
    [606, 362],
  ]);
  drawPolygon(ctx, [
    [402, 462],
    [476, 430],
    [438, 492],
  ]);
  drawPolygon(ctx, [
    [622, 462],
    [548, 430],
    [586, 492],
  ]);
  drawPolygon(ctx, [
    [440, 586],
    [512, 536],
    [584, 586],
    [512, 686],
  ]);
  ctx.beginPath();
  ctx.ellipse(512, 544, 28, 19, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#fff';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.moveTo(512, 560);
  ctx.lineTo(512, 654);
  ctx.moveTo(512, 626);
  ctx.quadraticCurveTo(472, 650, 432, 622);
  ctx.moveTo(512, 626);
  ctx.quadraticCurveTo(552, 650, 592, 622);
  ctx.stroke();

  drawCalendarMark(ctx);
  drawGmailMark(ctx);

  ctx.font = '900 156px Arial Black, Impact, sans-serif';
  ctx.fillText('OBU', TARGET_CANVAS * 0.5, TARGET_CANVAS * 0.86);

  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = '#000';
  for (let i = 0; i < 62; i += 1) {
    const x = Math.random() * TARGET_CANVAS;
    const y = Math.random() * TARGET_CANVAS;
    const w = 18 + Math.random() * 92;
    const h = 6 + Math.random() * 24;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((Math.random() - 0.5) * 0.8);
    ctx.fillRect(-w * 0.5, -h * 0.5, w, h);
    ctx.restore();
  }
  ctx.globalCompositeOperation = 'source-over';

  const image = ctx.getImageData(0, 0, TARGET_CANVAS, TARGET_CANVAS).data;
  const pixels = [];
  const step = 3;

  for (let y = 0; y < TARGET_CANVAS; y += step) {
    for (let x = 0; x < TARGET_CANVAS; x += step) {
      const alpha = image[(y * TARGET_CANVAS + x) * 4];
      if (alpha > 40 && Math.random() > 0.38) {
        pixels.push([x, y]);
      }
    }
  }

  const positions = new Float32Array(count * 3);
  const randoms = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const scale = 8.7 / TARGET_CANVAS;

  for (let i = 0; i < count; i += 1) {
    const source = pixels[Math.floor(Math.random() * pixels.length)];
    const i3 = i * 3;
    const drift = Math.random();
    positions[i3] = (source[0] - TARGET_CANVAS * 0.5) * scale + (Math.random() - 0.5) * 0.025;
    positions[i3 + 1] = -(source[1] - TARGET_CANVAS * 0.5) * scale + (Math.random() - 0.5) * 0.025;
    positions[i3 + 2] = (Math.random() - 0.5) * 0.36;

    randoms[i3] = (Math.random() - 0.5) * (9 + drift * 6);
    randoms[i3 + 1] = (Math.random() - 0.5) * (5.8 + drift * 5);
    randoms[i3 + 2] = (Math.random() - 0.5) * 4.5;
    seeds[i] = Math.random() * 1000;
  }

  return { positions, randoms, seeds };
}

const vertexShader = `
  uniform float uPixelRatio;
  uniform float uPointSize;
  uniform vec2 uMouse;
  uniform vec2 uResolution;

  attribute vec3 aTarget;
  attribute float aSeed;

  varying float vAlpha;

  float hash(float n) {
    return fract(sin(n) * 43758.5453123);
  }

  void main() {
    vec3 pos = aTarget;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vec4 projected = projectionMatrix * mvPosition;
    vec2 screen = projected.xy / projected.w;
    vec2 aspectMouse = vec2(uMouse.x, uMouse.y);
    vec2 delta = screen - aspectMouse;
    delta.x *= uResolution.x / max(uResolution.y, 1.0);
    float dist = length(delta);
    float push = smoothstep(0.34, 0.0, dist) * 0.34;
    pos.xy += normalize(delta + vec2(0.0001)) * push;

    mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = uPointSize * uPixelRatio / max(-mvPosition.z * 0.18, 0.75);
    vAlpha = 0.48 + hash(aSeed) * 0.52;
  }
`;

const fragmentShader = `
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv);
    float core = smoothstep(0.5, 0.08, d);
    float glow = smoothstep(0.5, 0.0, d) * 0.38;
    float alpha = (core + glow) * vAlpha;
    if (alpha < 0.02) discard;
    gl_FragColor = vec4(vec3(1.0), alpha);
  }
`;

export default function ParticleText() {
  const materialRef = useRef();
  const hoverTarget = useRef(new THREE.Vector2(9, 9));
  const { gl, viewport, size } = useThree();
  const fitScale = Math.min(1, viewport.width / 8.8, viewport.height / 5.8);

  const geometry = useMemo(() => {
    const { positions, randoms, seeds } = particleTargets(PARTICLE_COUNT);
    const bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    bufferGeometry.setAttribute('aTarget', new THREE.BufferAttribute(positions, 3));
    bufferGeometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 3));
    bufferGeometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    return bufferGeometry;
  }, []);

  const uniforms = useMemo(
    () => ({
      uMouse: { value: new THREE.Vector2(9, 9) },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uPixelRatio: { value: 1 },
      uPointSize: { value: 2.4 },
    }),
    [],
  );

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
      hoverTarget.current.set(9, 9);
    };

    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [gl]);

  useFrame(() => {
    const material = materialRef.current;
    if (!material) return;

    material.uniforms.uMouse.value.lerp(hoverTarget.current, 0.16);
    material.uniforms.uResolution.value.set(size.width, size.height);
    material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 1.75);
    material.uniforms.uPointSize.value = viewport.width < 6 ? 3.15 : 2.35;
  });

  return (
    <points geometry={geometry} frustumCulled={false} scale={fitScale}>
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
