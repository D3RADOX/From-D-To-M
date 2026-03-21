(function() {
  const RTL = window.RTTapLab;

  const FIRST_NAMES = [
    'Alice', 'Bob', 'Clara', 'David', 'Elena', 'Frank', 'Grace', 'Henry',
    'Iris', 'Jack', 'Karen', 'Leo', 'Mia', 'Nate', 'Olivia', 'Pete',
    'Quinn', 'Rosa', 'Sam', 'Tina', 'Uma', 'Vince', 'Wendy', 'Xavier'
  ];

  RTL.PATIENT_TYPES = {
    copd: {
      name: 'COPD',
      emoji: '🫁',
      description: 'Chronic airflow limitation',
      startMeters: { oxygen: 70, pressure: 55, secretion: 35 },
      driftMult: { oxygen: 1.2, pressure: 0.9, secretion: 1.3 },
      color: 0x4FC3F7
    },
    asthma: {
      name: 'Asthma',
      emoji: '🌬️',
      description: 'Bronchospasm & inflammation',
      startMeters: { oxygen: 80, pressure: 65, secretion: 25 },
      driftMult: { oxygen: 1.0, pressure: 1.4, secretion: 1.0 },
      color: 0xFFD54F
    },
    pneumonia: {
      name: 'Pneumonia',
      emoji: '🦠',
      description: 'Infection & fluid buildup',
      startMeters: { oxygen: 65, pressure: 50, secretion: 45 },
      driftMult: { oxygen: 1.3, pressure: 1.0, secretion: 1.5 },
      color: 0x81C784
    }
  };

  RTL.generatePatient = function(patientCount) {
    const types = Object.keys(RTL.PATIENT_TYPES);
    const typeKey = types[Math.floor(Math.random() * types.length)];
    const type = RTL.PATIENT_TYPES[typeKey];
    const name = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];

    return {
      name: name,
      typeKey: typeKey,
      type: type,
      startMeters: { ...type.startMeters },
      driftMult: { ...type.driftMult },
      timeRemaining: RTL.TIMING.patientDuration,
      saved: false,
      number: patientCount + 1
    };
  };
})();
