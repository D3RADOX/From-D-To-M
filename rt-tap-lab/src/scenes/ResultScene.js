(function() {
  const RTL = window.RTTapLab;

  class ResultScene extends Phaser.Scene {
    constructor() {
      super({ key: 'ResultScene' });
    }

    init(data) {
      this.stats = data.stats || {
        score: 0, coins: 0, patientsSaved: 0, patientsLost: 0,
        actionsPerformed: 0, perfectActions: 0, maxCombo: 0, highScore: 0
      };
    }

    create() {
      const W = RTL.WIDTH;
      const H = RTL.HEIGHT;

      this.add.rectangle(W / 2, H / 2, W, H, RTL.COLORS.bg);

      const stats = this.stats;
      const isNewHigh = stats.score >= stats.highScore && stats.score > 0;

      // Title
      this.add.text(W / 2, 60, 'RUN COMPLETE', {
        fontFamily: RTL.FONT, fontSize: '28px', color: '#ffffff', fontStyle: 'bold'
      }).setOrigin(0.5);

      // Score (big)
      const scoreText = this.add.text(W / 2, 130, stats.score.toLocaleString(), {
        fontFamily: RTL.FONT, fontSize: '48px', color: RTL.HEX.gold, fontStyle: 'bold'
      }).setOrigin(0.5);

      if (isNewHigh) {
        this.add.text(W / 2, 170, '🏆 NEW HIGH SCORE!', {
          fontFamily: RTL.FONT, fontSize: '16px', color: RTL.HEX.perfect, fontStyle: 'bold'
        }).setOrigin(0.5);

        // Celebration particles
        for (let i = 0; i < 3; i++) {
          this.time.delayedCall(i * 300, () => {
            this.burstParticles(W / 2 + (Math.random() - 0.5) * 200, 130);
          });
        }
      }

      // Stats grid
      const startY = 220;
      const lineH = 44;
      const statsList = [
        { label: 'Patients Saved', value: stats.patientsSaved, icon: '🏥', color: RTL.HEX.success },
        { label: 'Patients Lost', value: stats.patientsLost, icon: '💀', color: RTL.HEX.danger },
        { label: 'Actions Taken', value: stats.actionsPerformed, icon: '🎯', color: RTL.HEX.oxygen },
        { label: 'Perfect Actions', value: stats.perfectActions, icon: '⭐', color: RTL.HEX.perfect },
        { label: 'Max Combo', value: stats.maxCombo, icon: '🔥', color: RTL.HEX.combo },
        { label: 'Coins Earned', value: stats.coins, icon: '🪙', color: RTL.HEX.gold }
      ];

      statsList.forEach((stat, i) => {
        const y = startY + i * lineH;

        const bg = this.add.graphics();
        bg.fillStyle(RTL.COLORS.panel, 0.6);
        bg.fillRoundedRect(24, y, W - 48, 36, 8);

        this.add.text(36, y + 18, stat.icon + '  ' + stat.label, {
          fontFamily: RTL.FONT, fontSize: '13px', color: RTL.HEX.textDim
        }).setOrigin(0, 0.5);

        this.add.text(W - 36, y + 18, '' + stat.value, {
          fontFamily: RTL.FONT, fontSize: '16px', color: stat.color, fontStyle: 'bold'
        }).setOrigin(1, 0.5);
      });

      // Tip
      this.add.text(W / 2, startY + statsList.length * lineH + 30, '💡 ' + RTL.getRandomTip(), {
        fontFamily: RTL.FONT, fontSize: '11px', color: RTL.HEX.textDim,
        wordWrap: { width: W - 60 }, align: 'center'
      }).setOrigin(0.5);

      // Play again button
      const btnY = H - 120;
      this.createButton(W / 2, btnY, 'PLAY AGAIN', RTL.COLORS.oxygen, () => {
        this.scene.start('GameScene');
      });

      // Menu button
      this.createButton(W / 2, btnY + 64, 'MENU', 0x556677, () => {
        this.scene.start('MenuScene');
      });
    }

    createButton(x, y, label, color, callback) {
      const bw = 220;
      const bh = 50;
      const bg = this.add.graphics();
      bg.fillStyle(RTL.COLORS.panel, 0.9);
      bg.fillRoundedRect(x - bw / 2, y - bh / 2, bw, bh, 12);
      bg.lineStyle(2, color, 0.7);
      bg.strokeRoundedRect(x - bw / 2, y - bh / 2, bw, bh, 12);

      this.add.text(x, y, label, {
        fontFamily: RTL.FONT, fontSize: '17px', color: '#ffffff', fontStyle: 'bold'
      }).setOrigin(0.5);

      const zone = this.add.zone(x, y, bw, bh).setInteractive();
      zone.on('pointerdown', () => {
        this.tweens.add({
          targets: bg,
          scaleX: 0.95, scaleY: 0.95,
          duration: 80, yoyo: true,
          onComplete: callback
        });
      });
    }

    burstParticles(x, y) {
      const colors = [RTL.COLORS.gold, RTL.COLORS.perfect, RTL.COLORS.oxygen, RTL.COLORS.success];
      for (let i = 0; i < 10; i++) {
        const p = this.add.graphics();
        const c = colors[i % colors.length];
        p.fillStyle(c, 0.8);
        p.fillCircle(0, 0, 2 + Math.random() * 3);
        p.setPosition(x, y);

        const angle = Math.random() * Math.PI * 2;
        const dist = 50 + Math.random() * 80;

        this.tweens.add({
          targets: p,
          x: x + Math.cos(angle) * dist,
          y: y + Math.sin(angle) * dist,
          alpha: 0,
          duration: 600 + Math.random() * 400,
          ease: 'Power2',
          onComplete: () => p.destroy()
        });
      }
    }
  }

  RTL.ResultScene = ResultScene;
})();
