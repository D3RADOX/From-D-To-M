(function() {
  const RTL = window.RTTapLab;

  RTL.UPGRADES = {
    o2Efficiency: {
      name: 'O₂ Efficiency',
      description: 'O₂ Boost gives more oxygen',
      icon: '💨',
      color: '#4FC3F7',
      levels: [
        { cost: 50,  effect: { o2BoostExtra: 2 } },
        { cost: 120, effect: { o2BoostExtra: 4 } },
        { cost: 250, effect: { o2BoostExtra: 7 } },
        { cost: 500, effect: { o2BoostExtra: 10 } },
        { cost: 1000, effect: { o2BoostExtra: 15 } }
      ]
    },
    suctionPower: {
      name: 'Suction Power',
      description: 'Suction removes more secretion',
      icon: '🫁',
      color: '#81C784',
      levels: [
        { cost: 50,  effect: { suctionExtra: 3 } },
        { cost: 120, effect: { suctionExtra: 6 } },
        { cost: 250, effect: { suctionExtra: 10 } },
        { cost: 500, effect: { suctionExtra: 15 } },
        { cost: 1000, effect: { suctionExtra: 22 } }
      ]
    },
    pressureControl: {
      name: 'Pressure Control',
      description: 'Pressure adjust is more precise',
      icon: '🎯',
      color: '#FFD54F',
      levels: [
        { cost: 50,  effect: { pressureExtra: 2 } },
        { cost: 120, effect: { pressureExtra: 4 } },
        { cost: 250, effect: { pressureExtra: 7 } },
        { cost: 500, effect: { pressureExtra: 10 } },
        { cost: 1000, effect: { pressureExtra: 14 } }
      ]
    },
    nebDuration: {
      name: 'Neb Duration',
      description: 'Nebulizer effect lasts longer',
      icon: '💜',
      color: '#CE93D8',
      levels: [
        { cost: 60,  effect: { nebDurationExtra: 1000 } },
        { cost: 150, effect: { nebDurationExtra: 2000 } },
        { cost: 300, effect: { nebDurationExtra: 3500 } },
        { cost: 600, effect: { nebDurationExtra: 5000 } },
        { cost: 1200, effect: { nebDurationExtra: 7000 } }
      ]
    },
    comboShield: {
      name: 'Combo Shield',
      description: 'Slower combo decay rate',
      icon: '🛡️',
      color: '#FFAB40',
      levels: [
        { cost: 80,  effect: { comboDecayReduction: 0.2 } },
        { cost: 180, effect: { comboDecayReduction: 0.4 } },
        { cost: 350, effect: { comboDecayReduction: 0.6 } },
        { cost: 700, effect: { comboDecayReduction: 0.8 } },
        { cost: 1400, effect: { comboDecayReduction: 1.0 } }
      ]
    },
    patientTime: {
      name: 'Extra Time',
      description: 'More time per patient',
      icon: '⏱️',
      color: '#69F0AE',
      levels: [
        { cost: 70,  effect: { extraTime: 3000 } },
        { cost: 160, effect: { extraTime: 6000 } },
        { cost: 320, effect: { extraTime: 10000 } },
        { cost: 640, effect: { extraTime: 15000 } },
        { cost: 1300, effect: { extraTime: 20000 } }
      ]
    }
  };
})();
