(function() {
  const RTL = window.RTTapLab;

  class HUD {
    constructor(scene) {
      this.scene = scene;
      const y = 8;

      // Score
      this.scoreLabel = scene.add.text(12, y, 'SCORE', {
        fontFamily: RTL.FONT, fontSize: '10px', color: RTL.HEX.textDim
      });
      this.scoreText = scene.add.text(12, y + 14, '0', {
        fontFamily: RTL.FONT, fontSize: '22px', color: '#ffffff', fontStyle: 'bold'
      });
      this.displayScore = 0;
      this.targetScore = 0;

      // Coins
      this.coinText = scene.add.text(RTL.WIDTH - 12, y + 6, '🪙 0', {
        fontFamily: RTL.FONT, fontSize: '14px', color: RTL.HEX.gold, fontStyle: 'bold'
      }).setOrigin(1, 0);

      // Patients saved
      this.patientText = scene.add.text(RTL.WIDTH - 12, y + 26, '🏥 0 saved', {
        fontFamily: RTL.FONT, fontSize: '12px', color: RTL.HEX.success
      }).setOrigin(1, 0);

      // Divider line
      this.divider = scene.add.graphics();
      this.divider.lineStyle(1, 0x1e2640, 0.8);
      this.divider.lineBetween(12, 48, RTL.WIDTH - 12, 48);
    }

    setScore(score) {
      this.targetScore = score;
    }

    update(rewardSystem) {
      // Animate score rolling up
      if (this.displayScore < this.targetScore) {
        const diff = this.targetScore - this.displayScore;
        this.displayScore += Math.max(1, Math.ceil(diff * 0.12));
        if (this.displayScore > this.targetScore) this.displayScore = this.targetScore;
      }
      this.scoreText.setText(this.displayScore.toLocaleString());

      this.coinText.setText('🪙 ' + rewardSystem.coins);
      this.patientText.setText('🏥 ' + rewardSystem.patientsSaved + ' saved');
    }

    destroy() {
      this.scoreLabel.destroy();
      this.scoreText.destroy();
      this.coinText.destroy();
      this.patientText.destroy();
      this.divider.destroy();
    }
  }

  RTL.HUD = HUD;
})();
