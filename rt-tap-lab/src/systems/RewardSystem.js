(function() {
  const RTL = window.RTTapLab;

  class RewardSystem {
    constructor() {
      this.score = 0;
      this.coins = 0;
      this.sessionCoins = 0;
      this.patientsSaved = 0;
      this.patientsLost = 0;
      this.actionsPerformed = 0;
      this.perfectActions = 0;
      this.maxCombo = 0;
      this.loadSave();
    }

    loadSave() {
      try {
        const data = JSON.parse(localStorage.getItem(RTL.SAVE_KEY));
        if (data) {
          this.coins = data.coins || 0;
          this.highScore = data.highScore || 0;
          this.totalPatientsSaved = data.totalPatientsSaved || 0;
          this.upgradeLevels = data.upgradeLevels || {};
        } else {
          this.coins = 0;
          this.highScore = 0;
          this.totalPatientsSaved = 0;
          this.upgradeLevels = {};
        }
      } catch (e) {
        this.coins = 0;
        this.highScore = 0;
        this.totalPatientsSaved = 0;
        this.upgradeLevels = {};
      }
    }

    save() {
      const data = {
        coins: this.coins,
        highScore: this.highScore,
        totalPatientsSaved: this.totalPatientsSaved,
        upgradeLevels: this.upgradeLevels
      };
      localStorage.setItem(RTL.SAVE_KEY, JSON.stringify(data));
    }

    resetSession() {
      this.score = 0;
      this.sessionCoins = 0;
      this.patientsSaved = 0;
      this.patientsLost = 0;
      this.actionsPerformed = 0;
      this.perfectActions = 0;
      this.maxCombo = 0;
    }

    scoreAction(comboMultiplier, isPerfect) {
      this.actionsPerformed++;
      let pts = RTL.SCORING.baseAction * comboMultiplier;
      if (isPerfect) {
        pts += RTL.SCORING.perfectBonus * comboMultiplier;
        this.perfectActions++;
      }
      this.score += Math.floor(pts);
      return Math.floor(pts);
    }

    scorePatientSave(difficultyLevel) {
      this.patientsSaved++;
      this.totalPatientsSaved++;
      const bonus = Math.floor(RTL.SCORING.patientSaveBase * (1 + difficultyLevel * 0.1));
      this.score += bonus;
      return bonus;
    }

    onPatientLost() {
      this.patientsLost++;
    }

    updateMaxCombo(combo) {
      if (combo > this.maxCombo) this.maxCombo = combo;
    }

    endSession() {
      this.sessionCoins = Math.floor(this.score / 100);
      this.coins += this.sessionCoins;
      if (this.score > this.highScore) this.highScore = this.score;
      this.save();
    }

    getSessionStats() {
      return {
        score: this.score,
        coins: this.sessionCoins,
        patientsSaved: this.patientsSaved,
        patientsLost: this.patientsLost,
        actionsPerformed: this.actionsPerformed,
        perfectActions: this.perfectActions,
        maxCombo: this.maxCombo,
        highScore: this.highScore
      };
    }

    spendCoins(amount) {
      if (this.coins >= amount) {
        this.coins -= amount;
        this.save();
        return true;
      }
      return false;
    }
  }

  RTL.RewardSystem = RewardSystem;
})();
