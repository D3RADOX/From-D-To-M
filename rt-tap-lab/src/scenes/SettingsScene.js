(function() {
  const RTL = window.RTTapLab;

  class SettingsScene extends Phaser.Scene {
    constructor() {
      super({ key: 'SettingsScene' });
    }

    create() {
      const W = RTL.WIDTH;
      const H = RTL.HEIGHT;

      this.add.rectangle(W / 2, H / 2, W, H, RTL.COLORS.bg);

      // Header
      this.add.text(W / 2, 50, 'SETTINGS', {
        fontFamily: RTL.FONT, fontSize: '24px', color: '#ffffff', fontStyle: 'bold'
      }).setOrigin(0.5);

      // Sound toggle
      this.soundEnabled = true;
      const soundY = 140;

      this.add.graphics()
        .fillStyle(RTL.COLORS.panel, 0.9)
        .fillRoundedRect(24, soundY, W - 48, 56, 10);

      this.add.text(40, soundY + 28, '🔊  Sound Effects', {
        fontFamily: RTL.FONT, fontSize: '16px', color: '#ffffff'
      }).setOrigin(0, 0.5);

      this.soundToggleText = this.add.text(W - 40, soundY + 28, 'ON', {
        fontFamily: RTL.FONT, fontSize: '16px', color: RTL.HEX.success, fontStyle: 'bold'
      }).setOrigin(1, 0.5);

      const soundZone = this.add.zone(W / 2, soundY + 28, W - 48, 56).setInteractive();
      soundZone.on('pointerdown', () => {
        this.soundEnabled = !this.soundEnabled;
        this.soundToggleText.setText(this.soundEnabled ? 'ON' : 'OFF');
        this.soundToggleText.setColor(this.soundEnabled ? RTL.HEX.success : RTL.HEX.danger);
      });

      // Reset data
      const resetY = 220;

      this.add.graphics()
        .fillStyle(RTL.COLORS.panel, 0.9)
        .fillRoundedRect(24, resetY, W - 48, 56, 10);

      this.add.text(40, resetY + 28, '🗑️  Reset All Data', {
        fontFamily: RTL.FONT, fontSize: '16px', color: RTL.HEX.danger
      }).setOrigin(0, 0.5);

      const resetZone = this.add.zone(W / 2, resetY + 28, W - 48, 56).setInteractive();
      resetZone.on('pointerdown', () => {
        this.showConfirmDialog();
      });

      // Info section
      const infoY = 340;
      this.add.text(W / 2, infoY, 'RT TAP LAB', {
        fontFamily: RTL.FONT, fontSize: '18px', color: RTL.HEX.oxygen, fontStyle: 'bold'
      }).setOrigin(0.5);

      this.add.text(W / 2, infoY + 28, 'A Respiratory Therapy Arcade Game', {
        fontFamily: RTL.FONT, fontSize: '12px', color: RTL.HEX.textDim
      }).setOrigin(0.5);

      this.add.text(W / 2, infoY + 52, 'Manage patient airways through\nmeter management and quick actions', {
        fontFamily: RTL.FONT, fontSize: '11px', color: RTL.HEX.textDim, align: 'center'
      }).setOrigin(0.5);

      // Back button
      this.createBackButton(W / 2, H - 60);

      // Confirm dialog (hidden initially)
      this.confirmGroup = null;
    }

    showConfirmDialog() {
      if (this.confirmGroup) return;

      const W = RTL.WIDTH;
      const H = RTL.HEIGHT;

      // Overlay
      const overlay = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.7).setDepth(50);

      // Dialog box
      const dialogBg = this.add.graphics().setDepth(51);
      dialogBg.fillStyle(RTL.COLORS.panel, 1);
      dialogBg.fillRoundedRect(W / 2 - 140, H / 2 - 80, 280, 160, 14);
      dialogBg.lineStyle(2, RTL.COLORS.danger, 0.6);
      dialogBg.strokeRoundedRect(W / 2 - 140, H / 2 - 80, 280, 160, 14);

      const title = this.add.text(W / 2, H / 2 - 50, 'Reset All Data?', {
        fontFamily: RTL.FONT, fontSize: '18px', color: RTL.HEX.danger, fontStyle: 'bold'
      }).setOrigin(0.5).setDepth(52);

      const desc = this.add.text(W / 2, H / 2 - 20, 'Coins, upgrades, and high\nscores will be erased.', {
        fontFamily: RTL.FONT, fontSize: '12px', color: RTL.HEX.textDim, align: 'center'
      }).setOrigin(0.5).setDepth(52);

      // Confirm button
      const confirmBg = this.add.graphics().setDepth(52);
      confirmBg.fillStyle(0x8b0000, 0.9);
      confirmBg.fillRoundedRect(W / 2 - 120, H / 2 + 20, 110, 40, 8);

      const confirmText = this.add.text(W / 2 - 65, H / 2 + 40, 'RESET', {
        fontFamily: RTL.FONT, fontSize: '14px', color: '#ffffff', fontStyle: 'bold'
      }).setOrigin(0.5).setDepth(53);

      const confirmZone = this.add.zone(W / 2 - 65, H / 2 + 40, 110, 40).setInteractive().setDepth(54);
      confirmZone.on('pointerdown', () => {
        localStorage.removeItem(RTL.SAVE_KEY);
        this.destroyConfirm();
        this.scene.restart();
      });

      // Cancel button
      const cancelBg = this.add.graphics().setDepth(52);
      cancelBg.fillStyle(0x333333, 0.9);
      cancelBg.fillRoundedRect(W / 2 + 10, H / 2 + 20, 110, 40, 8);

      const cancelText = this.add.text(W / 2 + 65, H / 2 + 40, 'CANCEL', {
        fontFamily: RTL.FONT, fontSize: '14px', color: '#ffffff', fontStyle: 'bold'
      }).setOrigin(0.5).setDepth(53);

      const cancelZone = this.add.zone(W / 2 + 65, H / 2 + 40, 110, 40).setInteractive().setDepth(54);
      cancelZone.on('pointerdown', () => {
        this.destroyConfirm();
      });

      this.confirmGroup = [overlay, dialogBg, title, desc, confirmBg, confirmText, confirmZone, cancelBg, cancelText, cancelZone];
    }

    destroyConfirm() {
      if (this.confirmGroup) {
        this.confirmGroup.forEach(obj => obj.destroy());
        this.confirmGroup = null;
      }
    }

    createBackButton(x, y) {
      const bg = this.add.graphics();
      bg.fillStyle(RTL.COLORS.panel, 0.9);
      bg.fillRoundedRect(x - 80, y - 22, 160, 44, 12);
      bg.lineStyle(2, 0x556677, 0.6);
      bg.strokeRoundedRect(x - 80, y - 22, 160, 44, 12);

      this.add.text(x, y, '← BACK', {
        fontFamily: RTL.FONT, fontSize: '16px', color: '#ffffff', fontStyle: 'bold'
      }).setOrigin(0.5);

      const zone = this.add.zone(x, y, 160, 44).setInteractive();
      zone.on('pointerdown', () => {
        this.scene.start('MenuScene');
      });
    }
  }

  RTL.SettingsScene = SettingsScene;
})();
