// qualityManager.js

export const TIER = {
  REDUCED_MOTION: 'REDUCED_MOTION',
  LOW: 'LOW',
  MID: 'MID',
  HIGH: 'HIGH'
};

export function getQualityTier() {
  // 1. Accessibility: Check for prefers-reduced-motion
  if (typeof window !== 'undefined') {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      return TIER.REDUCED_MOTION;
    }
  }

  // Fallback default is MID if window objects aren't available
  if (typeof navigator === 'undefined' || typeof window === 'undefined') {
    return TIER.MID;
  }

  try {
    const cores = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory || 4; // in GB, supported in Chrome/Blink
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const screenArea = window.innerWidth * window.innerHeight;

    // Check WebGL availability as a proxy for GPU capability
    let hasWebGL = false;
    try {
      const canvas = document.createElement('canvas');
      hasWebGL = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch {
      hasWebGL = false;
    }

    // Determine tier based on hardware stats
    if (!hasWebGL || cores < 4 || memory < 4 || (isMobile && screenArea < 400000)) {
      return TIER.LOW;
    }

    if (cores >= 8 && memory >= 8 && !isMobile) {
      return TIER.HIGH;
    }

    return TIER.MID;
  } catch (err) {
    console.warn('Error determining quality tier, defaulting to MID:', err);
    return TIER.MID;
  }
}

export function getTierSettings(tier) {
  switch (tier) {
    case TIER.REDUCED_MOTION:
      return {
        sampleStep: 9999, // Skip sampling entirely
        particleCountMultiplier: 0,
        enablePhysics: false,
        enableGlow: false,
        enablePetals: false,
        windStrength: 0,
        turbulence: 0
      };

    case TIER.LOW:
      return {
        sampleStep: 4, // Sample every 4th pixel (fewer particles)
        particleCountMultiplier: 0.3,
        enablePhysics: true,
        enableGlow: false,
        enablePetals: false,
        windStrength: 0.5,
        turbulence: 0.1,
        maxParticles: 800
      };

    case TIER.MID:
      return {
        sampleStep: 3, // Sample every 3rd pixel
        particleCountMultiplier: 0.6,
        enablePhysics: true,
        enableGlow: true,
        enablePetals: true,
        windStrength: 0.7,
        turbulence: 0.3,
        maxParticles: 2000
      };

    case TIER.HIGH:
    default:
      return {
        sampleStep: 2, // Sample every 2nd pixel (dense, crisp text dissolution)
        particleCountMultiplier: 1.0,
        enablePhysics: true,
        enableGlow: true,
        enablePetals: true,
        windStrength: 1.0,
        turbulence: 0.6,
        maxParticles: 4500
      };
  }
}
