(function() {
  const RTL = window.RTTapLab;

  class ShopScene extends Phaser.Scene {
    constructor() {
      super({ key: 'ShopScene' });
    }

    create() {
      const W = RTL.WIDTH;
      const H = RTL.HEIGHT;

      this.add.rectangle(W / 2, H / 2, W, H, RTL.COLORS.bg);

      // Header
      this.add.text(W / 2, 40, 'UPGRADE SHOP', {
        fontFamily: RTL.FONT, fontSize: '24px', color: '#ffffff', fontStyle: 'bold'
      }).setOrigin(0.5);

      // Coins display
      this.rewardSystem = new RTL.RewardSystem();
      this.upgradeSystem = new RTL.UpgradeSystem(this.rewardSystem);

      this.coinText = this.add.text(W / 2, 75, '🪙 ' + this.rewardSystem.coins, {
        fontFamily: RTL.FONT, fontSize: '20px', color: RTL.HEX.gold, fontStyle: 'bold'
      }).setOrigin(0.5);

      // Upgrade cards
      const upgrades = this.upgradeSystem.getAllUpgradeStates();
      const startY = 120;
      const cardH = 95;
      const gap = 8;

      this.upgradeCards = [];

      upgrades.forEach((upg, i) => {
        const y = startY + i * (cardH + gap);
        this.createUpgradeCard(12, y, W - 24, cardH, upg);
      });

      // Back button
      this.createBackButton(W / 2, H - 50);
    }

    createUpgradeCard(x, y, w, h, upg) {
      const bg = this.add.graphics();
      bg.fillStyle(RTL.COLORS.panel, 0.9);
      bg.fillRoundedRect(x, y, w, h, 10);

      // Icon & name
      this.add.text(x + 12, y + 12, upg.icon + ' ' + upg.name, {
        fontFamily: RTL.FONT, fontSize: '16px', color: upg.color, fontStyle: 'bold'
      });

      // Description
      this.add.text(x + 12, y + 36, upg.description, {
        fontFamily: RTL.FONT, fontSize: '11px', color: RTL.HEX.textDim
      });

      // Level indicator
      let levelStr = '';
      for (let l = 0; l < upg.maxLevel; l++) {
        levelStr += l < upg.currentLevel ? '●' : '○';
      }
      this.add.text(x + 12, y + 56, 'Lv ' + upg.currentLevel + '/' + upg.maxLevel + '  ' + levelStr, {
        fontFamily: RTL.FONT, fontSize: '12px', color: '#ffffff'
      });

      // Buy button
      if (!upg.isMaxed) {
        const btnX = x + w - 90;
        const btnY = y + h / 2;
        const btnW = 78;
        const btnH = 36;

        const btnBg = this.add.graphics();
        btnBg.fillStyle(upg.canBuy ? 0x2e7d32 : 0x333333, 0.9);
        btnBg.fillRoundedRect(btnX, btnY - btnH / 2, btnW, btnH, 8);

        const btnText = this.add.text(btnX + btnW / 2, btnY, '🪙 ' + upg.nextCost, {
          fontFamily: RTL.FONT, fontSize: '13px', color: upg.canBuy ? '#ffffff' : '#666666', fontStyle: 'bold'
        }).setOrigin(0.5);

        if (upg.canBuy) {
          const zone = this.add.zone(btnX + btnW / 2, btnY, btnW, btnH).setInteractive();
          zone.on('pointerdown', () => {
            if (this.upgradeSystem.purchase(upg.key)) {
              this.scene.restart(); // Refresh to show updated state
            }
          });
        }
      } else {
        this.add.text(x + w - 50, y + h / 2, 'MAX', {
          fontFamily: RTL.FONT, fontSize: '14px', color: RTL.HEX.gold, fontStyle: 'bold'
        }).setOrigin(0.5);
      }

      this.upgradeCards.push(bg);
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

  RTL.ShopScene = ShopScene;
})();
