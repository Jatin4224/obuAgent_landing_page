export async function sampleImageParticles(src, options = {}) {
  const {
    maxParticles = 26000,
    threshold = 28,
    scale = 7.2,
    depth = 1.15,
    preserveColor = true,
    foxPalette = false,
    focusFoxOnly = false,
    removeEyePixels = false,
    adaptiveDensity = false,
    contourBoost = false,
  } = options;

  const image = await loadImage(src);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  canvas.width = image.naturalWidth || image.width;
  canvas.height = image.naturalHeight || image.height;
  ctx.drawImage(image, 0, 0);

  const { width, height } = canvas;
  const pixels = ctx.getImageData(0, 0, width, height).data;
  const brightPixels = [];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4;
      const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
      const nx = x / width;
      const ny = y / height;
      const leftEye = ellipseDistance(nx, ny, 0.41, 0.585, 0.048, 0.06);
      const rightEye = ellipseDistance(nx, ny, 0.59, 0.585, 0.048, 0.06);
      if (focusFoxOnly && (nx < 0.22 || nx > 0.78)) continue;
      if (removeEyePixels && (leftEye < 1 || rightEye < 1)) continue;
      if (brightness > threshold) {
        brightPixels.push({
          x,
          y,
          r: pixels[i],
          g: pixels[i + 1],
          b: pixels[i + 2],
          brightness,
          edge: contourBoost ? estimateEdgeStrength(pixels, width, height, x, y, brightness) : 0,
        });
      }
    }
  }

  const samplePixels = adaptiveDensity ? buildWeightedPixels(brightPixels, width, height) : brightPixels;
  const count = Math.min(maxParticles, samplePixels.length);
  const positions = new Float32Array(count * 3);
  const original = new Float32Array(count * 3);
  const velocity = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const sizes = new Float32Array(count);
  const stride = samplePixels.length / count;
  const aspect = width / height;

  for (let i = 0; i < count; i += 1) {
    const pixel = samplePixels[Math.floor(i * stride)];
    const i3 = i * 3;
    const jitter = adaptiveDensity ? pixel.jitter ?? 0 : 0;
    const jitterX = (seededNoise(pixel.x * 17.17 + pixel.y * 3.91 + jitter * 23.7) - 0.5) * jitter;
    const jitterY = (seededNoise(pixel.x * 5.13 + pixel.y * 19.19 + jitter * 11.3) - 0.5) * jitter;
    const nx = ((pixel.x + jitterX) / width - 0.5) * scale * aspect;
    const ny = -((pixel.y + jitterY) / height - 0.5) * scale;
    const nz = (seededNoise(pixel.x * 12.9898 + pixel.y * 78.233 + jitter * 8.1) - 0.5) * depth * 1.55;
    const luminance = pixel.brightness / 255;

    original[i3] = nx;
    original[i3 + 1] = ny;
    original[i3 + 2] = nz;

    positions[i3] = nx;
    positions[i3 + 1] = ny;
    positions[i3 + 2] = nz;

    velocity[i3] = 0;
    velocity[i3 + 1] = 0;
    velocity[i3 + 2] = 0;
    if (foxPalette) {
      const centerX = Math.abs(pixel.x / width - 0.5);
      const centerY = pixel.y / height;
      const faceWarmth = clamp01((0.58 - centerX) * 1.75) * clamp01((centerY - 0.18) * 2.4);
      const purpleShadow = clamp01(1 - luminance) * 0.55 + (1 - faceWarmth) * 0.22;
      const whiteHot = smoothstep(0.62, 1, luminance);

      const orange = [1.0, 0.42, 0.12];
      const violet = [0.48, 0.38, 1.0];
      const white = [1.0, 0.94, 0.84];

      colors[i3] = clamp01(orange[0] * faceWarmth + violet[0] * purpleShadow + white[0] * whiteHot * 0.85);
      colors[i3 + 1] = clamp01(orange[1] * faceWarmth + violet[1] * purpleShadow + white[1] * whiteHot * 0.85);
      colors[i3 + 2] = clamp01(orange[2] * faceWarmth + violet[2] * purpleShadow + white[2] * whiteHot * 0.85);
    } else {
      colors[i3] = preserveColor ? Math.min(1, pixel.r / 255 + luminance * 0.14) : 1;
      colors[i3 + 1] = preserveColor ? Math.min(1, pixel.g / 255 + luminance * 0.12) : 1;
      colors[i3 + 2] = preserveColor ? Math.min(1, pixel.b / 255 + luminance * 0.18) : 1;
    }
    seeds[i] = seededNoise(pixel.x * 2.31 + pixel.y * 5.91) * 1000;
    const edgeLift = adaptiveDensity ? pixel.edge * 0.35 : 0;
    sizes[i] = 0.66 + luminance * 1.18 + edgeLift;
  }

  return { count, positions, original, velocity, colors, seeds, sizes };
}

function buildWeightedPixels(pixels, width, height) {
  const weighted = [];

  pixels.forEach((pixel) => {
    const importance = particleImportance(pixel, width, height);
    const copies = Math.min(10, Math.max(1, Math.floor(importance)));
    const fractional = importance - copies;
    const extra = seededNoise(pixel.x * 4.71 + pixel.y * 9.31) < fractional ? 1 : 0;
    const total = copies + extra;

    for (let i = 0; i < total; i += 1) {
      weighted.push({
        ...pixel,
        jitter: i === 0 ? 0 : 0.28 + pixel.edge * 0.42,
      });
    }
  });

  return weighted;
}

function particleImportance(pixel, width, height) {
  const nx = pixel.x / width;
  const ny = pixel.y / height;
  const luminance = pixel.brightness / 255;
  const face = ellipseFalloff(nx, ny, 0.35, 0.37, 0.18, 0.24);
  const leftEye = ellipseFalloff(nx, ny, 0.31, 0.38, 0.04, 0.055);
  const rightEye = ellipseFalloff(nx, ny, 0.39, 0.38, 0.04, 0.055);
  const eyes = Math.max(leftEye, rightEye);
  const nose = ellipseFalloff(nx, ny, 0.35, 0.45, 0.045, 0.045);
  const cheeks = ellipseFalloff(nx, ny, 0.35, 0.46, 0.16, 0.08);
  const ears = Math.max(
    ellipseFalloff(nx, ny, 0.25, 0.22, 0.11, 0.16),
    ellipseFalloff(nx, ny, 0.46, 0.2, 0.11, 0.16),
  );
  const tail = ellipseFalloff(nx, ny, 0.72, 0.52, 0.25, 0.26);
  const legs = smoothstep(0.58, 0.88, ny) * (ellipseFalloff(nx, ny, 0.35, 0.74, 0.2, 0.22) + 0.35);

  return (
    0.45 +
    luminance * 1.4 +
    pixel.edge * 2.5 +
    face * 0.85 +
    eyes * 5.2 +
    nose * 2.8 +
    cheeks * 0.9 +
    ears * 1.35 +
    tail * (1.25 + pixel.edge * 1.8) +
    legs * 0.85
  );
}

function estimateEdgeStrength(pixels, width, height, x, y, brightness) {
  const radius = 2;
  const center = brightness / 255;
  let contrast = 0;

  for (let oy = -radius; oy <= radius; oy += radius) {
    for (let ox = -radius; ox <= radius; ox += radius) {
      const sx = clampInt(x + ox, 0, width - 1);
      const sy = clampInt(y + oy, 0, height - 1);
      const i = (sy * width + sx) * 4;
      const sample = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / (255 * 3);
      contrast = Math.max(contrast, Math.abs(center - sample));
    }
  }

  return clamp01(contrast * 1.8);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function seededNoise(value) {
  const raw = Math.sin(value) * 43758.5453123;
  return raw - Math.floor(raw);
}

function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

function smoothstep(edge0, edge1, value) {
  const x = clamp01((value - edge0) / (edge1 - edge0));
  return x * x * (3 - 2 * x);
}

function ellipseFalloff(x, y, cx, cy, rx, ry) {
  return clamp01(1 - ellipseDistance(x, y, cx, cy, rx, ry));
}

function ellipseDistance(x, y, cx, cy, rx, ry) {
  const dx = (x - cx) / rx;
  const dy = (y - cy) / ry;
  return dx * dx + dy * dy;
}

function clampInt(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
