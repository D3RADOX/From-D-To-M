(function() {
  const RTL = window.RTTapLab;

  class PatientCard {
    constructor(scene, x, y, width) {
      this.scene = scene;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = 60;

      // Card background
      this.bg = scene.add.graphics();

      // Patient info
      this.nameText = scene.add.text(x + 12, y + 10, '', {
        fontFamily: RTL.FONT, fontSize: '16px', color: '#ffffff', fontStyle: 'bold'
      });

      this.typeText = scene.add.text(x + 12, y + 32, '', {
        fontFamily: RTL.FONT, fontSize: '12px', color: RTL.HEX.textDim
      });

      // Timer
      this.timerBg = scene.add.graphics();
      this.timerFill = scene.add.graphics();
      this.timerText = scene.add.text(x + width - 12, y + 20, '', {
        fontFamily: RTL.FONT, fontSize: '20px', color: '#ffffff', fontStyle: 'bold'
      }).setOrigin(1, 0.5);

      // Stability indicator
      this.stabilityText = scene.add.text(x + width - 12, y + 42, '', {
        fontFamily: RTL.FONT, fontSize: '11px', color: RTL.HEX.success
      }).setOrigin(1, 0);
    }

    setPatient(patient) {
      if (!patient) {
        this.nameText.setText('');
        this.typeText.setText('');
        this.timerText.setText('');
        this.stabilityText.setText('');
        return;
      }

      this.nameText.setText(patient.type.emoji + ' ' + patient.name);
      this.typeText.setText(patient.type.name + ' — ' + patient.type.description);
    }

    update(patientSystem, meterSystem) {
      const patient = patientSystem.getCurrentPatient();
      if (!patient) return;

      // Background
      this.bg.clear();
      this.bg.fillStyle(RTL.COLORS.panel, 0.8);
      this.bg.fillRoundedRect(this.x, this.y, this.width, this.height, 8);

      // Timer
      const timeRatio = patientSystem.getTimeRatio();
      const timeMs = patientSystem.getTimeRemaining();
      const timeSec = Math.ceil(timeMs / 1000);
      this.timerText.setText(timeSec + 's');

      // Timer color
      if (timeRatio < 0.25) {
        this.timerText.setColor(RTL.HEX.danger);
      } else if (timeRatio < 0.5) {
        this.timerText.setColor(RTL.HEX.combo);
      } else {
        this.timerText.setColor('#ffffff');
      }

      // Timer bar
      this.timerBg.clear();
      this.timerFill.clear();
      const barY = this.y + this.height - 5;
      this.timerBg.fillStyle(0x1e2640, 0.6);
      this.timerBg.fillRect(this.x, barY, this.width, 5);

      const timerColor = timeRatio < 0.25 ? RTL.COLORS.danger : timeRatio < 0.5 ? RTL.COLORS.combo : RTL.COLORS.success;
      this.timerFill.fillStyle(timerColor, 0.8);
      this.timerFill.fillRect(this.x, barY, this.width * timeRatio, 5);

      // Stability
      const stability = meterSystem.getStability();
      const stColor = stability >= 60 ? RTL.HEX.success : stability >= 40 ? RTL.HEX.combo : RTL.HEX.danger;
      this.stabilityText.setText('Stability: ' + Math.round(stability) + '%');
      this.stabilityText.setColor(stColor);
    }

    destroy() {
      this.bg.destroy();
      this.nameText.destroy();
      this.typeText.destroy();
      this.timerBg.destroy();
      this.timerFill.destroy();
      this.timerText.destroy();
      this.stabilityText.destroy();
    }
  }

  RTL.PatientCard = PatientCard;
})();
