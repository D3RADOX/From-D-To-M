(function() {
  const RTL = window.RTTapLab;

  class PatientSystem {
    constructor() {
      this.currentPatient = null;
      this.patientCount = 0;
      this.timeRemaining = 0;
      this.transitioning = false;
    }

    reset() {
      this.currentPatient = null;
      this.patientCount = 0;
      this.timeRemaining = 0;
      this.transitioning = false;
    }

    spawnPatient(upgradeEffects) {
      this.currentPatient = RTL.generatePatient(this.patientCount);
      const extraTime = (upgradeEffects && upgradeEffects.extraTime) || 0;
      this.timeRemaining = RTL.TIMING.patientDuration + extraTime;
      this.transitioning = false;
      return this.currentPatient;
    }

    update(delta) {
      if (!this.currentPatient || this.transitioning) return 'waiting';

      this.timeRemaining -= delta;

      if (this.timeRemaining <= 0) {
        this.timeRemaining = 0;
        return 'expired';
      }

      return 'active';
    }

    savePatient(stability) {
      if (!this.currentPatient) return false;

      if (stability >= RTL.SCORING.stabilityThreshold) {
        this.currentPatient.saved = true;
        this.patientCount++;
        this.transitioning = true;
        return true;
      }
      return false;
    }

    getTimeRemaining() {
      return Math.max(0, this.timeRemaining);
    }

    getTimeRatio() {
      const total = RTL.TIMING.patientDuration;
      return Math.max(0, this.timeRemaining / total);
    }

    getCurrentPatient() {
      return this.currentPatient;
    }

    getPatientCount() {
      return this.patientCount;
    }
  }

  RTL.PatientSystem = PatientSystem;
})();
