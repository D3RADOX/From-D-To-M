(function() {
  const RTL = window.RTTapLab;

  class MenuScene extends Phaser.Scene {
    constructor() {
      super({ key: 'MenuScene' });
    }

    create() {
      const W = RTL.WIDTH;
      const H = RTL.HEIGHT;

      // Background
      this.add.rectangle(W / 2, H / 2, W, H, RTL.COLORS.bg);

      // Animated background particles
      this.bgParticles = [];
      for (let i = 0; i < 20; i++) {
        const p = this.add.graphics();
        const color = [RTL.COLORS.oxygen, RTL.COLORS.pressure, RTL.COLORS.secretion, RTL.COLORS.nebulizer][i % 4];
        p.fillStyle(color, 0.15);
        p.fillCircle(0, 0, 2 + Math.random() * 3);
        p.setPosition(Math.random() * W, Math.random() * H);
        p.setData('vy', -0.3 - Math.random() * 0.5);
        p.setData('vx', (Math.random() - 0.5) * 0.3);
        this.bgParticles.push(p);
      }

      // Title
      this.add.text(W / 2, 180, '🫁', {
        fontSize: '64px'
      }).setOrigin(0.5);

      this.add.text(W / 2, 260, 'RT TAP LAB', {
        fontFamily: RTL.FONT,
        fontSize: '36px',
        color: '#ffffff',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      this.add.text(W / 2, 300, 'Respiratory Therapy Arcade', {
        fontFamily: RTL.FONT,
        fontSize: '14px',
        color: RTL.HEX.textDim
      }).setOrigin(0.5);

      // High score
      const save = this.getSaveData();
      if (save.highScore > 0) {
        this.add.text(W / 2, 340, '🏆 Best: ' + save.highScore.toLocaleString(), {
          fontFamily: RTL.FONT,
          fontSize: '16px',
          color: RTL.HEX.gold,
          fontStyle: 'bold'
        }).setOrigin(0.5);
      }

      // Play button
      this.createButton(W / 2, 440, 'PLAY', RTL.COLORS.oxygen, () => {
        this.scene.start('GameScene');
      });

      // Shop button
      this.createButton(W / 2, 520, 'SHOP  🪙 ' + (save.coins || 0), RTL.COLORS.pressure, () => {
        this.scene.start('ShopScene');
      });

      // Settings button
      this.createButton(W / 2, 600, 'SETTINGS', 0x556677, () => {
        this.scene.start('SettingsScene');
      });

      // Tip
      this.add.text(W / 2, H - 60, '💡 ' + RTL.getRandomTip(), {
        fontFamily: RTL.FONT,
        fontSize: '11px',
        color: RTL.HEX.textDim,
        wordWrap: { width: W - 50 },
        align: 'center'
      }).setOrigin(0.5);
    }

    createButton(x, y, label, color, callback) {
      const W = 240;
      const H = 56;
      const bg = this.add.graphics();
      bg.fillStyle(RTL.COLORS.panel, 0.9);
      bg.fillRoundedRect(x - W / 2, y - H / 2, W, H, 14);
      bg.lineStyle(2, color, 0.8);
      bg.strokeRoundedRect(x - W / 2, y - H / 2, W, H, 14);

      const text = this.add.text(x, y, label, {
        fontFamily: RTL.FONT,
        fontSize: '18px',
        color: '#ffffff',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      const zone = this.add.zone(x, y, W, H).setInteractive();
      zone.on('pointerdown', () => {
        this.tweens.add({
          targets: [bg, text],
          scaleX: 0.93,
          scaleY: 0.93,
          duration: 80,
          yoyo: true,
          onComplete: callback
        });
      });
    }

    getSaveData() {
      try {
        return JSON.parse(localStorage.getItem(RTL.SAVE_KEY)) || {};
      } catch (e) {
        return {};
      }
    }

    update() {
      // Animate background particles
      const W = RTL.WIDTH;
      const H = RTL.HEIGHT;
      this.bgParticles.forEach(p => {
        p.y += p.getData('vy');
        p.x += p.getData('vx');
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      });
    }
  }

  RTL.MenuScene = MenuScene;
})();
