(function() {
  const RTL = window.RTTapLab;

  class ComboSystem {
    constructor() {
      this.combo = 0;
      this.multiplier = 1;
      this.lastActionTime = 0;
      this.decayRate = RTL.TIMING.comboDecay;
      this.maxMultiplier = RTL.TIMING.maxMultiplier;
      this.perMultiplier = RTL.TIMING.comboPerMultiplier;
    }

    reset() {
      this.combo = 0;
      this.multiplier = 1;
      this.lastActionTime = 0;
    }

    setDecayReduction(reduction) {
      this.decayRate = Math.max(0.2, RTL.TIMING.comboDecay - reduction);
    }

    hit() {
      this.combo++;
      this.lastActionTime = Date.now();
      this.multiplier = Math.min(this.maxMultiplier, 1 + Math.floor(this.combo / this.perMultiplier));
    }

    miss() {
      this.combo = 0;
      this.multiplier = 1;
    }

    update(delta) {
      if (this.combo <= 0) return;

      const dt = delta / 1000;
      const timeSinceLast = Date.now() - this.lastActionTime;

      // Start decaying after 1.5 seconds of inactivity
      if (timeSinceLast > 1500) {
        this.combo = Math.max(0, this.combo - this.decayRate * dt);
        this.multiplier = Math.min(this.maxMultiplier, 1 + Math.floor(this.combo / this.perMultiplier));
        if (this.combo <= 0) {
          this.combo = 0;
          this.multiplier = 1;
        }
      }
    }

    getMultiplier() {
      return this.multiplier;
    }

    getCombo() {
      return Math.floor(this.combo);
    }
  }

  RTL.ComboSystem = ComboSystem;
})();
