(function() {
  const RTL = window.RTTapLab;

  class MeterSystem {
    constructor() {
      this.oxygen = 85;
      this.pressure = 50;
      this.secretion = 20;
      this.nebulizerActive = false;
      this.nebulizerEnd = 0;
    }

    reset(startMeters) {
      this.oxygen = startMeters ? startMeters.oxygen : 85;
      this.pressure = startMeters ? startMeters.pressure : 50;
      this.secretion = startMeters ? startMeters.secretion : 20;
      this.nebulizerActive = false;
      this.nebulizerEnd = 0;
    }

    update(delta, patient, difficultySystem, eventMults) {
      const dt = delta / 1000; // seconds
      const diffMults = difficultySystem.getDriftMultipliers();
      const patientMults = patient ? patient.driftMult : { oxygen: 1, pressure: 1, secretion: 1 };

      // Check nebulizer
      if (this.nebulizerActive && Date.now() >= this.nebulizerEnd) {
        this.nebulizerActive = false;
      }
      const nebFactor = this.nebulizerActive ? RTL.TIMING.nebulizerSlowFactor : 1;

      // Event multipliers
      const eMults = eventMults || { oxygenDriftMult: 1, pressureDriftMult: 1, secretionDriftMult: 1 };

      // Oxygen drifts down
      this.oxygen += RTL.METERS.oxygen.drift * dt * diffMults.oxygen * patientMults.oxygen * nebFactor * eMults.oxygenDriftMult;

      // Pressure drifts away from 50
      const pressureDir = this.pressure >= 50 ? 1 : -1;
      this.pressure += RTL.METERS.pressure.drift * pressureDir * dt * diffMults.pressure * patientMults.pressure * nebFactor * eMults.pressureDriftMult;

      // Secretion drifts up
      this.secretion += RTL.METERS.secretion.drift * dt * diffMults.secretion * patientMults.secretion * nebFactor * eMults.secretionDriftMult;

      // Clamp
      this.oxygen = Phaser.Math.Clamp(this.oxygen, 0, 100);
      this.pressure = Phaser.Math.Clamp(this.pressure, 0, 100);
      this.secretion = Phaser.Math.Clamp(this.secretion, 0, 100);
    }

    applyAction(actionKey, upgradeEffects) {
      const extras = upgradeEffects || {};

      switch (actionKey) {
        case 'o2Boost': {
          const bonus = extras.o2BoostExtra || 0;
          this.oxygen = Math.min(100, this.oxygen + RTL.ACTIONS.o2Boost.effect + bonus);
          break;
        }
        case 'suction': {
          const bonus = extras.suctionExtra || 0;
          this.secretion = Math.max(0, this.secretion + RTL.ACTIONS.suction.effect - bonus);
          break;
        }
        case 'pressure': {
          const bonus = extras.pressureExtra || 0;
          const totalEffect = RTL.ACTIONS.pressure.effect + bonus;
          if (this.pressure > 50) {
            this.pressure = Math.max(50, this.pressure - totalEffect);
          } else {
            this.pressure = Math.min(50, this.pressure + totalEffect);
          }
          break;
        }
        case 'nebulizer': {
          const extraDur = extras.nebDurationExtra || 0;
          this.nebulizerActive = true;
          this.nebulizerEnd = Date.now() + RTL.TIMING.nebulizerDuration + extraDur;
          break;
        }
      }
    }

    applyEventInstant(effect) {
      if (effect.pressureInstant) {
        this.pressure = Math.min(100, this.pressure + effect.pressureInstant);
      }
    }

    getStability() {
      const oxygenScore = this.oxygen * RTL.STABILITY.oxygenWeight;
      const pressureScore = (100 - Math.abs(this.pressure - 50) * 2) * RTL.STABILITY.pressureWeight;
      const secretionScore = (100 - this.secretion) * RTL.STABILITY.secretionWeight;
      return Math.max(0, Math.min(100, oxygenScore + pressureScore + secretionScore));
    }

    isCritical() {
      return this.oxygen < 20 || this.oxygen > 100 ||
             this.pressure < 10 || this.pressure > 90 ||
             this.secretion > 85;
    }

    isGameOver() {
      return this.oxygen <= 0 || this.pressure <= 0 || this.pressure >= 100 || this.secretion >= 100;
    }
  }

  RTL.MeterSystem = MeterSystem;
})();
