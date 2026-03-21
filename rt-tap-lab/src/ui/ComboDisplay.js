(function() {
  const RTL = window.RTTapLab;

  class ComboDisplay {
    constructor(scene, x, y) {
      this.scene = scene;
      this.x = x;
      this.y = y;

      // Combo text
      this.comboText = scene.add.text(x, y, '', {
        fontFamily: RTL.FONT, fontSize: '14px', color: RTL.HEX.combo, fontStyle: 'bold'
      }).setOrigin(0.5);

      // Multiplier badge
      this.multText = scene.add.text(x, y + 20, '', {
        fontFamily: RTL.FONT, fontSize: '18px', color: RTL.HEX.gold, fontStyle: 'bold'
      }).setOrigin(0.5);

      // Glow ring
      this.glow = scene.add.graphics();

      this.lastCombo = 0;
      this.lastMult = 1;
    }

    update(comboSystem) {
      const combo = comboSystem.getCombo();
      const mult = comboSystem.getMultiplier();

      // Combo text
      if (combo > 0) {
        this.comboText.setText('COMBO ' + combo);
        this.comboText.setVisible(true);
      } else {
        this.comboText.setVisible(false);
      }

      // Multiplier badge
      if (mult > 1) {
        this.multText.setText('×' + mult);
        this.multText.setVisible(true);

        // Scale pop when multiplier increases
        if (mult > this.lastMult) {
          this.scene.tweens.add({
            targets: this.multText,
            scaleX: 1.5, scaleY: 1.5,
            duration: 150,
            yoyo: true,
            ease: 'Back.easeOut'
          });
        }
      } else {
        this.multText.setVisible(false);
      }

      // Glow ring at high combos
      this.glow.clear();
      if (combo >= 10) {
        const pulse = 0.15 + Math.sin(Date.now() / 200) * 0.1;
        this.glow.fillStyle(RTL.COLORS.combo, pulse);
        this.glow.fillCircle(this.x, this.y + 10, 35);
      }

      this.lastCombo = combo;
      this.lastMult = mult;
    }

    destroy() {
      this.comboText.destroy();
      this.multText.destroy();
      this.glow.destroy();
    }
  }

  RTL.ComboDisplay = ComboDisplay;
})();
