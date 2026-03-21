(function() {
  const RTL = window.RTTapLab;

  class DifficultySystem {
    constructor() {
      this.patientCount = 0;
    }

    reset() {
      this.patientCount = 0;
    }

    onPatientSaved() {
      this.patientCount++;
    }

    getO2DriftMult() {
      return 1 + RTL.DIFFICULTY.o2Scale * this.patientCount;
    }

    getPressureDriftMult() {
      return 1 + RTL.DIFFICULTY.pressureScale * this.patientCount;
    }

    getSecretionDriftMult() {
      return 1 + RTL.DIFFICULTY.secretionScale * this.patientCount;
    }

    getDriftMultipliers() {
      return {
        oxygen: this.getO2DriftMult(),
        pressure: this.getPressureDriftMult(),
        secretion: this.getSecretionDriftMult()
      };
    }

    getDifficultyLevel() {
      return this.patientCount;
    }
  }

  RTL.DifficultySystem = DifficultySystem;
})();
