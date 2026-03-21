(function() {
  const RTL = window.RTTapLab;

  RTL.EVENTS = [
    {
      id: 'desaturation',
      name: 'Desaturation Alarm',
      emoji: '🚨',
      description: 'O₂ dropping fast!',
      duration: 8000,
      effect: { oxygenDriftMult: 2.5 },
      color: 0xFF5252
    },
    {
      id: 'bronchospasm',
      name: 'Bronchospasm',
      emoji: '😤',
      description: 'Pressure going wild!',
      duration: 7000,
      effect: { pressureDriftMult: 2.0 },
      color: 0xFFD54F
    },
    {
      id: 'mucusPlug',
      name: 'Mucus Plug',
      emoji: '🟢',
      description: 'Secretions surging!',
      duration: 6000,
      effect: { secretionDriftMult: 2.5 },
      color: 0x81C784
    },
    {
      id: 'pressureSpike',
      name: 'Pressure Spike',
      emoji: '📈',
      description: 'Pressure spiking high!',
      duration: 5000,
      effect: { pressureInstant: 25 },
      color: 0xFFAB40
    },
    {
      id: 'powerSurge',
      name: 'Power Surge',
      emoji: '⚡',
      description: 'All cooldowns reset!',
      duration: 0,
      effect: { resetCooldowns: true },
      color: 0xE040FB
    },
    {
      id: 'emergencyCode',
      name: 'Emergency Code',
      emoji: '🏥',
      description: 'All meters dropping!',
      duration: 10000,
      effect: { oxygenDriftMult: 1.8, pressureDriftMult: 1.5, secretionDriftMult: 1.8 },
      color: 0xFF1744
    }
  ];
})();
