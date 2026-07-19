// logoSampler.js

// A lightweight, fast 2D Simplex Noise implementation for organic noise thresholds
// (Derived from classic Simplex noise algorithms)
const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;

function createSimplexNoise() {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) {
    p[i] = Math.floor(Math.random() * 256);
  }
  const perm = new Uint8Array(512);
  const permMod12 = new Uint8Array(512);
  for (let i = 0; i < 512; i++) {
    perm[i] = p[i & 255];
    permMod12[i] = perm[i] % 12;
  }

  const grad3 = [
    [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
    [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
    [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
  ];

  return function noise2D(xin, yin) {
    let n0, n1, n2;
    const s = (xin + yin) * F2;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const t = (i + j) * G2;
    const X0 = i - t;
    const Y0 = j - t;
    const x0 = xin - X0;
    const y0 = yin - Y0;

    let i1, j1;
    if (x0 > y0) {
      i1 = 1;
      j1 = 0;
    } else {
      i1 = 0;
      j1 = 1;
    }

    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1.0 + 2.0 * G2;
    const y2 = y0 - 1.0 + 2.0 * G2;

    const ii = i & 255;
    const jj = j & 255;

    const gi0 = permMod12[ii + perm[jj]];
    const gi1 = permMod12[ii + i1 + perm[jj + j1]];
    const gi2 = permMod12[ii + 1 + perm[jj + 1]];

    const t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 < 0) n0 = 0.0;
    else {
      const g = grad3[gi0];
      n0 = Math.pow(t0, 4) * (g[0] * x0 + g[1] * y0);
    }

    const t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 < 0) n1 = 0.0;
    else {
      const g = grad3[gi1];
      n1 = Math.pow(t1, 4) * (g[0] * x1 + g[1] * y1);
    }

    const t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 < 0) n2 = 0.0;
    else {
      const g = grad3[gi2];
      n2 = Math.pow(t2, 4) * (g[0] * x2 + g[1] * y2);
    }

    return 70.0 * (n0 + n1 + n2); // Scale to [-1, 1]
  };
}

const noise2D = createSimplexNoise();

/**
 * Samples static components of the logo/text and returns them as particles.
 */
export function sampleLogoAndText(width, height, settings) {
  const offscreen = document.createElement('canvas');
  // Use a fixed virtual coordinate system for sampling, then scale to fit
  const virtualWidth = 800;
  const virtualHeight = 400;
  offscreen.width = virtualWidth;
  offscreen.height = virtualHeight;
  const ctx = offscreen.getContext('2d');

  if (!ctx) return [];

  // Draw compass circle (emerald accent)
  const cx = virtualWidth / 2;
  const cy = virtualHeight / 2 - 45;
  const radius = 38;

  ctx.clearRect(0, 0, virtualWidth, virtualHeight);

  // Emerald outline for the circle
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.95)'; // Accent emerald
  ctx.lineWidth = 3.5;
  ctx.shadowColor = 'rgba(16, 185, 129, 0.4)';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0; // Reset shadow

  // Subtle compass tick marks inside the circle
  ctx.fillStyle = 'rgba(16, 185, 129, 0.5)';
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    const startR = radius - 7;
    const endR = radius - 2;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * startR, cy + Math.sin(angle) * startR);
    ctx.lineTo(cx + Math.cos(angle) * endR, cy + Math.sin(angle) * endR);
    ctx.stroke();
  }

  // Draw Main Text "Credit Compass"
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Credit Compass', virtualWidth / 2, virtualHeight / 2 + 35);

  // Draw Subtitle "Navigate your financial health and investments"
  ctx.fillStyle = '#94a3b8'; // slate-400
  ctx.font = '500 13px "Inter", sans-serif';
  ctx.fillText('Navigate your financial health and investments', virtualWidth / 2, virtualHeight / 2 + 70);

  // Scan and sample pixel data
  const imageData = ctx.getImageData(0, 0, virtualWidth, virtualHeight);
  const data = imageData.data;
  const particles = [];
  const step = settings.sampleStep;

  // Center alignment offset to scale and place the virtual canvas onto physical screen
  const scaleX = width / virtualWidth;
  const scaleY = height / virtualHeight;
  // Preserve aspect ratio using fit
  const scale = Math.min(scaleX, scaleY) * 0.9;
  const offsetX = (width - virtualWidth * scale) / 2;
  const offsetY = (height - virtualHeight * scale) / 2;

  for (let y = 0; y < virtualHeight; y += step) {
    for (let x = 0; x < virtualWidth; x += step) {
      const index = (y * virtualWidth + x) * 4;
      const alpha = data[index + 3];

      if (alpha > 80) {
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];

        // Physical screen coordinates
        const px = x * scale + offsetX;
        const py = y * scale + offsetY;

        // Generate organic noise value for dissolve sequence
        // Scaling coordinates inside noise to create medium-sized noise blobs
        const nx = x * 0.015;
        const ny = y * 0.015;
        // Map noise from [-1, 1] to [0, 1]
        const rawNoise = (noise2D(nx, ny) + 1.0) / 2.0;

        // Create a horizontal wave bias: things on the right dissolve later than the left,
        // but with strong organic noise variance
        // x/virtualWidth goes from 0 to 1
        const xProgressBias = x / virtualWidth;
        const noiseThreshold = xProgressBias * 0.65 + rawNoise * 0.35;

        // Classify particle type
        let type = 'text';
        if (y < virtualHeight / 2 - 5) {
          type = 'logo-ring';
        } else if (y > virtualHeight / 2 + 50) {
          type = 'subtitle';
        }

        particles.push({
          x: px,
          y: py,
          ox: px,
          oy: py,
          color: `rgba(${r}, ${g}, ${b}, ${alpha / 255})`,
          r,
          g,
          b,
          alpha: alpha / 255,
          size: Math.random() * 1.5 + 1.0,
          noiseThreshold,
          isDissolved: false,
          type
        });
      }
    }
  }

  return particles;
}

/**
 * Mathematically generates particles forming the Compass Needle at a specific center and rotation.
 */
export function generateNeedleParticles(width, height, rotation, settings) {
  const virtualWidth = 800;
  const virtualHeight = 400;
  const cx = virtualWidth / 2;
  const cy = virtualHeight / 2 - 45;
  const needleLength = 28;
  const needleWidth = 5.5;

  const scaleX = width / virtualWidth;
  const scaleY = height / virtualHeight;
  const scale = Math.min(scaleX, scaleY) * 0.9;
  const offsetX = (width - virtualWidth * scale) / 2;
  const offsetY = (height - virtualHeight * scale) / 2;

  const physicalCx = cx * scale + offsetX;
  const physicalCy = cy * scale + offsetY;
  const physicalLength = needleLength * scale;
  const physicalWidth = needleWidth * scale;

  const particles = [];
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);

  // We can represent the needle as two triangles (North and South)
  // Let's generate points inside the diamond needle
  // We'll iterate through a dense grid and filter points inside the polygon
  const step = Math.max(1.5, settings.sampleStep / 2); // Sample slightly denser for crisp needle

  const maxBound = physicalLength;
  for (let dy = -maxBound; dy <= maxBound; dy += step) {
    for (let dx = -maxBound; dx <= maxBound; dx += step) {
      // Rotate back to needle-space to check bounds
      const rx = dx * cos + dy * sin;
      const ry = -dx * sin + dy * cos;

      // Check if point is inside diamond shape
      // Diamond equation: |rx| / width + |ry| / length <= 1
      const isInsideNorth = ry <= 0 && (Math.abs(rx) / physicalWidth) + (Math.abs(ry) / physicalLength) <= 1;
      const isInsideSouth = ry > 0 && (Math.abs(rx) / physicalWidth) + (Math.abs(ry) / physicalLength) <= 1;

      if (isInsideNorth || isInsideSouth) {
        const px = physicalCx + dx;
        const py = physicalCy + dy;

        // Assign colors: North is emerald green (accentEmerald), South is cyan (accentCyan)
        const isNorth = ry <= 0;
        const r = isNorth ? 16 : 6;
        const g = isNorth ? 185 : 182;
        const b = isNorth ? 129 : 212;

        const nx = (cx + dx / scale) * 0.015;
        const ny = (cy + dy / scale) * 0.015;
        const rawNoise = (noise2D(nx, ny) + 1.0) / 2.0;

        // Needle dissolves slightly faster and from tip to tail
        const noiseThreshold = 0.1 + (Math.abs(ry) / physicalLength) * 0.45 + rawNoise * 0.35;

        particles.push({
          x: px,
          y: py,
          ox: px,
          oy: py,
          color: `rgba(${r}, ${g}, ${b}, 0.95)`,
          r,
          g,
          b,
          alpha: 0.95,
          size: Math.random() * 1.5 + 1.0,
          noiseThreshold,
          isDissolved: false,
          type: 'logo-needle'
        });
      }
    }
  }

  return particles;
}
