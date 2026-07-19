// IntroAnimation.jsx
import React, { useEffect, useRef, useState } from 'react';
import { getQualityTier, getTierSettings, TIER } from './qualityManager';
import { sampleLogoAndText, generateNeedleParticles } from './logoSampler';
import { ParticleEngine } from './particleEngine';

export const IntroAnimation = ({ onComplete }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const skipButtonRef = useRef(null);

  const [showSkip, setShowSkip] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Animation loop references
  const animFrameIdRef = useRef(null);
  const engineRef = useRef(null);
  const startTimeRef = useRef(null);
  const lastTimeRef = useRef(null);

  // Initialize and run animation
  useEffect(() => {
    // 1. Block interaction and scrolling
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Prevent scrolling via keys (Space, PageUp/Down, End, Home, Arrow keys)
    const preventScrollKeys = (e) => {
      const keys = [' ', 'Spacebar', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'End', 'Home'];
      if (keys.includes(e.key) && e.target !== skipButtonRef.current) {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', preventScrollKeys, { passive: false });

    // Catch all clicks and keyboard events outside the skip button
    const handleGlobalInteraction = (e) => {
      // Allow interaction only with the skip button
      if (skipButtonRef.current && skipButtonRef.current.contains(e.target)) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener('click', handleGlobalInteraction, { capture: true });
    window.addEventListener('mousedown', handleGlobalInteraction, { capture: true });
    window.addEventListener('mouseup', handleGlobalInteraction, { capture: true });
    window.addEventListener('keydown', handleGlobalInteraction, { capture: true });

    // 2. Setup canvas & quality tier
    const canvas = canvasRef.current;
    if (!canvas) return;

    const tier = getQualityTier();
    const settings = getTierSettings(tier);

    // Dynamic resize handler
    const resizeCanvas = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }

      if (engineRef.current) {
        engineRef.current.setDimensions(rect.width, rect.height);
      }
    };

    // Make sure fonts are loaded before sampling so text layout is correct
    let isSubscribed = true;
    document.fonts.ready.then(() => {
      if (!isSubscribed) return;

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      const rect = canvas.getBoundingClientRect();
      const engine = new ParticleEngine(canvas, rect.width, rect.height, tier, settings);
      engineRef.current = engine;

      // Sample base particles (text + circle)
      const baseParticles = sampleLogoAndText(rect.width, rect.height, settings);
      engine.initialize(baseParticles);
      
      setIsReady(true);
      
      // Start the animation loop
      startTimeRef.current = performance.now();
      lastTimeRef.current = performance.now();
      
      const loop = (now) => {
        if (!startTimeRef.current || !lastTimeRef.current) {
          startTimeRef.current = now;
          lastTimeRef.current = now;
        }

        const elapsed = (now - startTimeRef.current) / 1000; // in seconds
        const deltaTime = now - lastTimeRef.current;
        lastTimeRef.current = now;

        // Phase Timing Calculations
        // Phase 1: 0.0s - 0.8s
        // Phase 2: 0.8s - 1.5s
        // Phase 3: 1.5s - 3.5s
        // Phase 4: 3.5s - 4.5s
        let phase = 1;
        let progress = 0;
        let needleRotation = 0;
        let introOpacity = 0;
        let overlayOpacity = 1;

        if (elapsed < 0.8) {
          phase = 1;
          introOpacity = Math.min(1, elapsed / 0.5); // Fast clean reveal in 0.5s
          
          // Needle sweep ease: swings out slightly to -0.4rad, bounces, and settles to 0rad
          const t = elapsed / 0.8;
          needleRotation = -0.45 * Math.sin(t * Math.PI * 0.75) * (1.0 - t);
        } else if (elapsed < 1.2) {
          // Phase 2: Static and clearly visible settled state
          phase = 2;
          introOpacity = 1.0;
          needleRotation = 0;
          
          // Show skip button after exactly 1.0 second
          if (elapsed >= 1.0 && !showSkip) {
            setShowSkip(true);
          }
        } else if (elapsed < 1.6) {
          // Phase 2.5: Subtle wobble and early separation starts
          phase = 2.5;
          introOpacity = 1.0;
          needleRotation = 0;
          
          if (elapsed >= 1.0 && !showSkip) {
            setShowSkip(true);
          }
        } else if (elapsed < 3.6) {
          phase = 3;
          introOpacity = 1.0;
          needleRotation = 0;
          progress = (elapsed - 1.6) / 2.0; // Dissolve progress 0 -> 1 over 2.0s

          // Add the needle particles to the system right at the start of Phase 3
          if (tier !== TIER.REDUCED_MOTION) {
            const rect = canvas.getBoundingClientRect();
            engine.addNeedleParticles(generateNeedleParticles(rect.width, rect.height, 0, settings));
          }
        } else if (elapsed < 4.6) {
          phase = 4;
          progress = 1.0;
          introOpacity = 0.0;
          
          // Overlay background fade-out over 1.0s
          overlayOpacity = Math.max(0, 1.0 - (elapsed - 3.6) / 1.0);
        } else {
          // Completed naturally!
          handleSkipOrComplete();
          return;
        }

        // Apply global alpha fade to container wrapper for seamless exit transition
        if (containerRef.current) {
          containerRef.current.style.opacity = overlayOpacity;
        }

        // Trigger updates in Particle Engine
        if (tier === TIER.REDUCED_MOTION) {
          // Reduced motion: Draw static outline but fade out
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const rect = canvas.getBoundingClientRect();
            ctx.clearRect(0, 0, rect.width, rect.height);
            
            // Fade logic for reduced motion
            let motionAlpha = 0;
            if (elapsed < 0.8) {
              motionAlpha = elapsed / 0.8;
            } else if (elapsed < 3.0) {
              motionAlpha = 1.0;
            } else if (elapsed < 4.5) {
              motionAlpha = Math.max(0, 1.0 - (elapsed - 3.0) / 1.5);
            }

            ctx.globalAlpha = motionAlpha;
            // Draw static logo sampler directly to canvas
            const baseParticles = sampleLogoAndText(rect.width, rect.height, { sampleStep: 2 });
            baseParticles.forEach(p => {
              ctx.fillStyle = p.color;
              ctx.fillRect(p.x, p.y, p.size, p.size);
            });
            // Draw needle static
            engine.drawCompassNeedle(ctx, engine.logoCx, engine.logoCy, engine.logoScale, 0);
            ctx.globalAlpha = 1.0;
          }
        } else {
          engine.update(progress, needleRotation, phase, deltaTime);
          engine.draw(phase, introOpacity);
        }

        animFrameIdRef.current = requestAnimationFrame(loop);
      };

      animFrameIdRef.current = requestAnimationFrame(loop);
    });

    // Cleanup & skip handler
    const handleSkipOrComplete = () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      
      // Cleanup Engine
      if (engineRef.current) {
        engineRef.current.dispose();
        engineRef.current = null;
      }

      // Restore scroll and styling
      document.body.style.overflow = originalOverflow;
      
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('keydown', preventScrollKeys);
      window.removeEventListener('click', handleGlobalInteraction, { capture: true });
      window.removeEventListener('mousedown', handleGlobalInteraction, { capture: true });
      window.removeEventListener('mouseup', handleGlobalInteraction, { capture: true });
      window.removeEventListener('keydown', handleGlobalInteraction, { capture: true });

      onComplete();
    };

    // Save transition function on window/ref so skip button can invoke it
    skipButtonRef.current.onclick = (e) => {
      e.stopPropagation();
      // Fast cross-fade overlay
      if (containerRef.current) {
        containerRef.current.style.transition = 'opacity 0.4s ease-out';
        containerRef.current.style.opacity = '0';
        setTimeout(handleSkipOrComplete, 400);
      } else {
        handleSkipOrComplete();
      }
    };

    return () => {
      isSubscribed = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      if (engineRef.current) {
        engineRef.current.dispose();
      }
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('keydown', preventScrollKeys);
      window.removeEventListener('click', handleGlobalInteraction, { capture: true });
      window.removeEventListener('mousedown', handleGlobalInteraction, { capture: true });
      window.removeEventListener('mouseup', handleGlobalInteraction, { capture: true });
      window.removeEventListener('keydown', handleGlobalInteraction, { capture: true });
    };
  }, [onComplete, showSkip]);

  // Handle focus for Skip Button accessibility
  useEffect(() => {
    if (showSkip && skipButtonRef.current) {
      // Focus skip button once it appears so keyboard users can hit Space/Enter immediately
      skipButtonRef.current.focus();
    }
  }, [showSkip]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: '#050814', // --color-bgDark matching index.css
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto',
        transition: 'opacity 0.1s linear',
        userSelect: 'none',
      }}
    >
      {/* Skip Button */}
      <button
        ref={skipButtonRef}
        type="button"
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 1000000,
          padding: '8px 16px',
          backgroundColor: 'rgba(18, 24, 38, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          color: 'rgba(255, 255, 255, 0.7)',
          fontFamily: '"Inter", sans-serif',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          borderRadius: '10px',
          cursor: 'pointer',
          opacity: showSkip ? 1 : 0,
          pointerEvents: showSkip ? 'auto' : 'none',
          transition: 'opacity 0.5s ease, border-color 0.2s, color 0.2s, background-color 0.2s',
          outline: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(8px)',
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = 'rgba(16, 185, 129, 0.4)';
          e.target.style.color = '#10b981'; // Accent Emerald
          e.target.style.backgroundColor = 'rgba(16, 185, 129, 0.08)';
        }}
        onMouseLeave={(e) => {
          e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          e.target.style.color = 'rgba(255, 255, 255, 0.7)';
          e.target.style.backgroundColor = 'rgba(18, 24, 38, 0.85)';
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#10b981';
          e.target.style.color = '#10b981';
          e.target.style.boxShadow = '0 0 0 2px rgba(16, 185, 129, 0.4)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          e.target.style.color = 'rgba(255, 255, 255, 0.7)';
          e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
        }}
      >
        Skip Intro
      </button>

      {/* Main Canvas Overlay */}
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          opacity: isReady ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />
    </div>
  );
};

export default IntroAnimation;
