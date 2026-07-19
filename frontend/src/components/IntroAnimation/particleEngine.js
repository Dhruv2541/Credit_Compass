// particleEngine.js

export class ParticleEngine {
  constructor(canvas, width, height, qualityTier, settings) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = width;
    this.height = height;
    this.qualityTier = qualityTier;
    this.settings = settings;

    this.particles = [];       // Static and dissolving base dots
    this.activeParticles = []; // Floating debris
    this.needleAdded = false;  // Flag to avoid double-adding needle particles
    this.time = 0;
    this.windX = -1.2 * (settings.windStrength || 1.0); // Drift leftwards
    this.needleRotation = 0;

    // Pre-calculate scaling parameters matching logoSampler.js
    const virtualWidth = 800;
    const virtualHeight = 400;
    const scaleX = width / virtualWidth;
    const scaleY = height / virtualHeight;
    this.logoScale = Math.min(scaleX, scaleY) * 0.9;
    this.logoCx = (virtualWidth / 2) * this.logoScale + (width - virtualWidth * this.logoScale) / 2;
    this.logoCy = (virtualHeight / 2 - 45) * this.logoScale + (height - virtualHeight * this.logoScale) / 2;
  }

  setDimensions(width, height) {
    this.width = width;
    this.height = height;

    // Recalculate scaling
    const virtualWidth = 800;
    const virtualHeight = 400;
    const scaleX = width / virtualWidth;
    const scaleY = height / virtualHeight;
    this.logoScale = Math.min(scaleX, scaleY) * 0.9;
    this.logoCx = (virtualWidth / 2) * this.logoScale + (width - virtualWidth * this.logoScale) / 2;
    this.logoCy = (virtualHeight / 2 - 45) * this.logoScale + (height - virtualHeight * this.logoScale) / 2;
  }

  initialize(baseParticles) {
    this.particles = baseParticles.map(p => ({
      ...p,
      isDissolved: false
    }));
    this.activeParticles = [];
    this.needleAdded = false;
    this.time = 0;
  }

  addNeedleParticles(needleParticles) {
    if (this.needleAdded) return;
    this.particles.push(...needleParticles);
    this.needleAdded = true;
  }

  update(progress, needleRotation, phase, deltaTime) {
    this.time += deltaTime;
    this.needleRotation = needleRotation;

    // Physics constants
    const enablePhysics = this.settings.enablePhysics;
    const enablePetals = this.settings.enablePetals;

    // Phase 2.5: A small fraction of particles dissolve early (1.2s - 1.6s)
    let currentProgress = progress;
    if (phase === 2.5) {
      // Small simulated progress to start detaching edge particles
      currentProgress = 0.05; 
    }

    // Process base particles dissolving
    if (phase >= 2.5) {
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        if (!p.isDissolved) {
          // If we are in Phase 2.5, only dissolve a random 1.5% of text/logo particles
          const shouldDissolvePhase2 = phase === 2.5 && Math.random() < 0.008;
          const shouldDissolvePhase3 = phase >= 3 && currentProgress >= p.noiseThreshold;

          if (shouldDissolvePhase2 || shouldDissolvePhase3) {
            p.isDissolved = true;

            if (enablePhysics) {
              // Spawn an active floating particle
              const isPetal = enablePetals && (p.type === 'logo-ring' || p.type === 'text') && Math.random() < 0.04;
              
              if (isPetal) {
                // Petal particle: larger, slower, drifts down, sways
                this.activeParticles.push({
                  x: p.x,
                  y: p.y,
                  vx: (this.windX * 0.4) + (Math.random() - 0.5) * 0.5,
                  vy: 0.3 + Math.random() * 0.5, // Drifts down
                  r: p.r,
                  g: p.g,
                  b: p.b,
                  alpha: 0.95,
                  size: 3.5 + Math.random() * 3.5,
                  life: 1.0,
                  decay: 0.003 + Math.random() * 0.005,
                  type: 'petal',
                  rotation: Math.random() * Math.PI * 2,
                  rotSpeed: (Math.random() - 0.5) * 0.04,
                  swaySpeed: 1.5 + Math.random() * 2.0,
                  swayOffset: Math.random() * Math.PI * 2
                });
              } else {
                // Dust particle: tiny, fast, drifts up/left
                this.activeParticles.push({
                  x: p.x,
                  y: p.y,
                  vx: this.windX + (Math.random() - 0.5) * 0.8,
                  vy: -0.3 - Math.random() * 0.6, // Drifts up
                  r: p.r,
                  g: p.g,
                  b: p.b,
                  alpha: 0.9,
                  size: p.size,
                  life: 1.0,
                  decay: 0.008 + Math.random() * 0.012,
                  type: 'dust'
                });
              }
            }
          }
        }
      }
    }

    // Update active particles
    if (enablePhysics) {
      const gravity = 0.02;
      for (let i = this.activeParticles.length - 1; i >= 0; i--) {
        const p = this.activeParticles[i];
        p.life -= p.decay;

        if (p.life <= 0 || p.x < 0 || p.y < 0 || p.y > this.height) {
          this.activeParticles.splice(i, 1);
          continue;
        }

        p.alpha = p.life;

        if (p.type === 'petal') {
          // Petal physics: rotation, swaying left and right
          p.rotation += p.rotSpeed;
          p.vx += (this.windX * 0.25 - p.vx) * 0.02;
          p.vy += gravity * 0.5; // Subtle downward force
          p.x += p.vx + Math.sin(this.time * 0.003 * p.swaySpeed + p.swayOffset) * 0.6;
          p.y += p.vy;
          p.size *= 0.995; // Shrink slowly
        } else {
          // Dust physics: upward drift with wind and tiny turbulence
          p.vx += (this.windX - p.vx) * 0.05;
          p.vy += -gravity * 0.3; // Upward force
          p.x += p.vx;
          p.y += p.vy + Math.sin(p.x * 0.03 + this.time * 0.005) * (this.settings.turbulence * 0.4);
          p.size *= 0.985; // Shrink faster
        }
      }
    }
  }

  draw(phase, introOpacity = 1.0) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // Draw ambient background glow (except in reduced motion)
    if (this.qualityTier !== 'REDUCED_MOTION') {
      const gradient = ctx.createRadialGradient(
        this.width / 2, this.height / 2, 0,
        this.width / 2, this.height / 2, Math.max(this.width, this.height) * 0.5
      );
      gradient.addColorStop(0, `rgba(16, 185, 129, ${0.045 * introOpacity})`); // Emerald center
      gradient.addColorStop(0.5, `rgba(6, 182, 212, ${0.015 * introOpacity})`);  // Cyan outer
      gradient.addColorStop(1, 'rgba(5, 8, 20, 0)');          // Transparent
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, this.width, this.height);
    }

    // Draw static/undissolved particles
    const timeFactor = this.time * 0.003;
    const enableGlow = this.settings.enableGlow;
    const isPhase2 = phase === 2.5;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (p.isDissolved) continue;

      let drawX = p.ox;
      let drawY = p.oy;

      // Phase 2: Subtle animated noise wobble
      if (isPhase2) {
        const offsetMultiplier = 0.6;
        drawX += Math.sin(timeFactor * 12.0 + p.oy * 0.1) * offsetMultiplier;
        drawY += Math.cos(timeFactor * 12.0 + p.ox * 0.1) * offsetMultiplier;
      }

      ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${(p.alpha !== undefined ? p.alpha : 1.0) * introOpacity})`;
      ctx.fillRect(drawX, drawY, p.size, p.size);
    }

    // Draw dynamic rotating compass needle (only in Phase 1 & 2 before it becomes particles)
    if (phase < 3 && !this.needleAdded) {
      ctx.globalAlpha = introOpacity;
      this.drawCompassNeedle(ctx, this.logoCx, this.logoCy, this.logoScale, this.needleRotation);
      ctx.globalAlpha = 1.0;
    }

    // Draw floating active particles
    const glowEnabledHigh = enableGlow && this.qualityTier === 'HIGH';

    for (let i = 0; i < this.activeParticles.length; i++) {
      const p = this.activeParticles[i];

      if (p.type === 'petal') {
        // Draw rotated diamond shape
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        
        ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.alpha})`;

        // Glow layer for high end
        if (glowEnabledHigh) {
          ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.alpha * 0.12})`;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 2.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.alpha})`;
        }

        // Diamond path
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.lineTo(p.size * 0.55, 0);
        ctx.lineTo(0, p.size);
        ctx.lineTo(-p.size * 0.55, 0);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
      } else {
        // Draw dust particle (tiny square)
        ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.alpha})`;

        if (glowEnabledHigh && Math.random() < 0.15) {
          // Soft bloom glow behind some dust particles
          ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.alpha * 0.15})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3.0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.alpha})`;
        }

        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
    }
  }

  drawCompassNeedle(ctx, cx, cy, scale, rotation) {
    const length = 28 * scale;
    const width = 5.5 * scale;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);

    // North half: Emerald green pointer
    ctx.fillStyle = '#10b981';
    ctx.shadowColor = 'rgba(16, 185, 129, 0.4)';
    ctx.shadowBlur = this.settings.enableGlow ? 8 : 0;
    ctx.beginPath();
    ctx.moveTo(0, -length);
    ctx.lineTo(width, 0);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(16, 185, 129, 0.8)';
    ctx.beginPath();
    ctx.moveTo(0, -length);
    ctx.lineTo(-width, 0);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();

    // South half: Cyan / White pointer
    ctx.shadowColor = 'rgba(6, 182, 212, 0.3)';
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.moveTo(0, length);
    ctx.lineTo(width, 0);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(6, 182, 212, 0.8)';
    ctx.beginPath();
    ctx.moveTo(0, length);
    ctx.lineTo(-width, 0);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();

    // Center pivot pin
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(0, 0, 2.5 * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  dispose() {
    this.particles = [];
    this.activeParticles = [];
  }
}
