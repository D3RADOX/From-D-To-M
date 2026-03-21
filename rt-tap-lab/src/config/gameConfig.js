(function() {
  const RTL = window.RTTapLab;

  // Game dimensions
  RTL.WIDTH = 390;
  RTL.HEIGHT = 844;

  // Colors
  RTL.COLORS = {
    bg: 0x0a0e1a,
    panel: 0x141928,
    panelLight: 0x1e2640,
    text: 0xffffff,
    textDim: 0x8899aa,
    oxygen: 0x4FC3F7,
    pressure: 0xFFD54F,
    secretion: 0x81C784,
    nebulizer: 0xCE93D8,
    danger: 0xFF5252,
    success: 0x69F0AE,
    combo: 0xFFAB40,
    gold: 0xFFD700,
    perfect: 0xE040FB
  };

  // Hex string versions for Phaser text
  RTL.HEX = {
    oxygen: '#4FC3F7',
    pressure: '#FFD54F',
    secretion: '#81C784',
    nebulizer: '#CE93D8',
    danger: '#FF5252',
    success: '#69F0AE',
    combo: '#FFAB40',
    gold: '#FFD700',
    perfect: '#E040FB',
    text: '#ffffff',
    textDim: '#8899aa'
  };

  // Meter constants
  RTL.METERS = {
    oxygen: { min: 0, max: 100, start: 85, drift: -2, label: 'O₂' },
    pressure: { min: 0, max: 100, start: 50, drift: 1.5, label: 'Pressure' },
    secretion: { min: 0, max: 100, start: 20, drift: 1.5, label: 'Secretion' }
  };

  // Action constants
  RTL.ACTIONS = {
    o2Boost:   { label: 'O₂ Boost',   color: 0x4FC3F7, hex: '#4FC3F7', cooldown: 2000, effect: 15,  meter: 'oxygen',    icon: '💨' },
    suction:   { label: 'Suction',     color: 0x81C784, hex: '#81C784', cooldown: 3000, effect: -20, meter: 'secretion', icon: '🫁' },
    pressure:  { label: 'Pressure',    color: 0xFFD54F, hex: '#FFD54F', cooldown: 2500, effect: 10,  meter: 'pressure',  icon: '🎯' },
    nebulizer: { label: 'Nebulizer',   color: 0xCE93D8, hex: '#CE93D8', cooldown: 8000, effect: 5000, meter: 'all',      icon: '💜' }
  };

  // Timing
  RTL.TIMING = {
    patientDuration: 45000,
    antiSpam: 80,
    perfectWindow: 300,
    comboDecay: 2,
    maxMultiplier: 10,
    comboPerMultiplier: 10,
    nebulizerDuration: 5000,
    nebulizerSlowFactor: 0.5,
    eventMinInterval: 20000,
    eventMaxInterval: 40000
  };

  // Scoring
  RTL.SCORING = {
    baseAction: 100,
    perfectBonus: 50,
    patientSaveBase: 500,
    stabilityThreshold: 60
  };

  // Difficulty scaling
  RTL.DIFFICULTY = {
    o2Scale: 0.08,
    pressureScale: 0.06,
    secretionScale: 0.08
  };

  // Stability formula weights
  RTL.STABILITY = {
    oxygenWeight: 0.4,
    pressureWeight: 0.3,
    secretionWeight: 0.3
  };

  // Save key
  RTL.SAVE_KEY = 'rtTapLabSaveV1';

  // Font
  RTL.FONT = 'Arial, Helvetica, sans-serif';

  // Phaser config (scenes added after scene files load)
  RTL.phaserConfig = {
    type: Phaser.CANVAS,
    width: RTL.WIDTH,
    height: RTL.HEIGHT,
    parent: 'game-container',
    backgroundColor: '#0a0e1a',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [] // populated by main.js
  };
})();
