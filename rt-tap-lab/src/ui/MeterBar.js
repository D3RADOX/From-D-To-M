(function() {
  const RTL = window.RTTapLab;

  class MeterBar {
    constructor(scene, x, y, width, height, config) {
      this.scene = scene;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.config = config; // { label, color, hex, targetZone }
      this.value = 50;
      this.displayValue = 50;

      // Background
      this.bg = scene.add.graphics();
      this.bg.fillStyle(0x1e2640, 0.8);
      this.bg.fillRoundedRect(x, y, width, height, 6);

      // Fill bar
      this.fill = scene.add.graphics();

      // Target zone indicator (for pressure)
      this.zoneGraphics = scene.add.graphics();

      // Label
      this.label = scene.add.text(x + 8, y + height / 2, config.label, {
        fontFamily: RTL.FONT,
        fontSize: '13px',
        color: config.hex,
        fontStyle: 'bold'
      }).setOrigin(0, 0.5);

      // Value text
      this.valueText = scene.add.text(x + width - 8, y + height / 2, '50', {
        fontFamily: RTL.FONT,
        fontSize: '13px',
        color: '#ffffff',
        fontStyle: 'bold'
      }).setOrigin(1, 0.5);

      // Warning glow
      this.glowGraphics = scene.add.graphics();
    }

    setValue(val) {
      this.value = Phaser.Math.Clamp(val, 0, 100);
    }

    update() {
      // Smooth interpolation
      this.displayValue += (this.value - this.displayValue) * 0.15;

      const barX = this.x + 50;
      const barW = this.width - 95;
      const barY = this.y + 4;
      const barH = this.height - 8;
      const fillW = (this.displayValue / 100) * barW;

      // Determine color based on danger zones
      let fillColor = this.config.color;
      let alpha = 0.9;

      if (this.config.label === 'O₂' && this.value < 30) {
        fillColor = RTL.COLORS.danger;
      } else if (this.config.label === 'Secretion' && this.value > 70) {
        fillColor = RTL.COLORS.danger;
      } else if (this.config.label === 'Pressure' && (this.value < 25 || this.value > 75)) {
        fillColor = RTL.COLORS.danger;
      }

      // Draw fill
      this.fill.clear();
      this.fill.fillStyle(fillColor, alpha);
      if (fillW > 2) {
        this.fill.fillRoundedRect(barX, barY, fillW, barH, 4);
      }

      // Draw target zone for pressure
      this.zoneGraphics.clear();
      if (this.config.label === 'Pressure') {
        const zoneStart = (35 / 100) * barW + barX;
        const zoneEnd = (65 / 100) * barW + barX;
        this.zoneGraphics.lineStyle(1, 0x69F0AE, 0.3);
        this.zoneGraphics.strokeRect(zoneStart, barY, zoneEnd - zoneStart, barH);
      }

      // Warning glow for critical values
      this.glowGraphics.clear();
      const isCritical = (this.config.label === 'O₂' && this.value < 25) ||
                         (this.config.label === 'Secretion' && this.value > 75) ||
                         (this.config.label === 'Pressure' && (this.value < 20 || this.value > 80));

      if (isCritical) {
        const pulse = 0.3 + Math.sin(Date.now() / 200) * 0.2;
        this.glowGraphics.fillStyle(RTL.COLORS.danger, pulse);
        this.glowGraphics.fillRoundedRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4, 8);
      }

      // Update value text
      this.valueText.setText(Math.round(this.displayValue));
    }

    destroy() {
      this.bg.destroy();
      this.fill.destroy();
      this.zoneGraphics.destroy();
      this.label.destroy();
      this.valueText.destroy();
      this.glowGraphics.destroy();
    }
  }

  RTL.MeterBar = MeterBar;
})();
