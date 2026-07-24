import React, { useEffect, useRef } from 'react';

export const SmokyBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Initial background fill
    ctx.fillStyle = '#080C14';
    ctx.fillRect(0, 0, width, height);

    // Particles representing swirling smoke eddies
    const numParticles = 30;
    const particles = [];

    // Deep blue and dark indigo color palette with low opacities
    const colors = [
      'rgba(11, 29, 58, 0.15)',   // Muted deep blue
      'rgba(22, 50, 97, 0.12)',   // Deep indigo
      'rgba(13, 40, 85, 0.16)',   // Muted navy
      'rgba(30, 58, 138, 0.08)',  // Dark blue
      'rgba(6, 182, 212, 0.02)',  // Hint of cyan
    ];

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: Math.random() * 200 + 150, // Radius between 150px and 350px
        color: colors[i % colors.length],
        baseRadius: Math.random() * 150 + 150,
        pulseSpeed: 0.0003 + Math.random() * 0.0004,
        pulseRange: Math.random() * 40 + 20
      });
    }

    const resizeHandler = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      ctx.fillStyle = '#080C14';
      ctx.fillRect(0, 0, width, height);
    };

    window.addEventListener('resize', resizeHandler);

    const animate = (time) => {
      // 1. Semi-transparent black/navy background fill creates motion blur trails (smoky mist effect)
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(8, 12, 20, 0.04)'; // #080C14 is rgb(8, 12, 20)
      ctx.fillRect(0, 0, width, height);

      // 2. Draw & update particles with fluid swirling math
      ctx.globalCompositeOperation = 'screen';

      particles.forEach((p, idx) => {
        // Slow swirling force calculation based on trigonometric grid fields (creates smoke eddies)
        const angle = Math.sin(p.x * 0.002 + time * 0.0001) * Math.cos(p.y * 0.002 + time * 0.0001) * Math.PI * 2;
        p.vx += Math.cos(angle) * 0.03;
        p.vy += Math.sin(angle) * 0.03;

        // Apply velocities
        p.x += p.vx;
        p.y += p.vy;

        // Friction to prevent infinite acceleration
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Wrap around boundaries
        const pad = p.radius;
        if (p.x < -pad) p.x = width + pad;
        if (p.x > width + pad) p.x = -pad;
        if (p.y < -pad) p.y = height + pad;
        if (p.y > height + pad) p.y = -pad;

        // Pulsing radius
        p.radius = p.baseRadius + Math.sin(time * p.pulseSpeed) * p.pulseRange;

        // Draw soft radial gradient
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, p.color);
        grad.addColorStop(0.5, p.color.replace(/[\d.]+\)$/, '0.03)')); // Fade out mid-way
        grad.addColorStop(1, 'rgba(11, 15, 23, 0)'); // fully transparent at edge

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden select-none">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default SmokyBackground;
