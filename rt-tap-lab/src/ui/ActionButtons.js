(function() {
  const RTL = window.RTTapLab;

  class ActionButton {
    constructor(scene, x, y, width, height, actionKey, onPress) {
      this.scene = scene;
      this.actionKey = actionKey;
      this.config = RTL.ACTIONS[actionKey];
      this.cooldownEnd = 0;
      this.onPress = onPress;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;

      // Button background
      this.bg = scene.add.graphics();
      this.drawButton(1.0);

      // Icon
      this.iconText = scene.add.text(x + width / 2, y + height / 2 - 10, this.config.icon, {
        fontFamily: RTL.FONT,
        fontSize: '24px'
      }).setOrigin(0.5);

      // Label
      this.labelText = scene.add.text(x + width / 2, y + height / 2 + 14, this.config.label, {
        fontFamily: RTL.FONT,
        fontSize: '11px',
        color: this.config.hex,
        fontStyle: 'bold'
      }).setOrigin(0.5);

      // Cooldown overlay
      this.cooldownGraphics = scene.add.graphics();

      // Hit zone
      this.hitZone = scene.add.zone(x + width / 2, y + height / 2, width, height)
        .setInteractive()
        .on('pointerdown', () => this.handlePress());

      // Perfect ring
      this.perfectRing = scene.add.graphics();
    }

    drawButton(alpha) {
      this.bg.clear();
      this.bg.fillStyle(RTL.COLORS.panel, 0.9);
      this.bg.fillRoundedRect(this.x, this.y, this.width, this.height, 12);
      this.bg.lineStyle(2, this.config.color, alpha);
      this.bg.strokeRoundedRect(this.x, this.y, this.width, this.height, 12);
    }

    handlePress() {
      if (this.isOnCooldown()) return;
      this.cooldownEnd = Date.now() + this.config.cooldown;

      // Press animation
      this.scene.tweens.add({
        targets: [this.bg, this.iconText, this.labelText],
        scaleX: 0.92, scaleY: 0.92,
        duration: 60,
        yoyo: true
      });

      if (this.onPress) this.onPress(this.actionKey);
    }

    isOnCooldown() {
      return Date.now() < this.cooldownEnd;
    }

    resetCooldown() {
      this.cooldownEnd = 0;
    }

    getCooldownRatio() {
      if (!this.isOnCooldown()) return 0;
      const remaining = this.cooldownEnd - Date.now();
      return remaining / this.config.cooldown;
    }

    update(isPerfectTarget) {
      // Cooldown overlay
      this.cooldownGraphics.clear();
      if (this.isOnCooldown()) {
        const ratio = this.getCooldownRatio();
        this.cooldownGraphics.fillStyle(0x000000, 0.5);
        this.cooldownGraphics.fillRoundedRect(this.x, this.y, this.width, this.height * ratio, 12);
        this.drawButton(0.3);
      } else {
        this.drawButton(1.0);
      }

      // Perfect ring indicator
      this.perfectRing.clear();
      if (isPerfectTarget && !this.isOnCooldown()) {
        const pulse = 0.5 + Math.sin(Date.now() / 150) * 0.3;
        this.perfectRing.lineStyle(3, RTL.COLORS.perfect, pulse);
        this.perfectRing.strokeRoundedRect(this.x - 3, this.y - 3, this.width + 6, this.height + 6, 14);
      }
    }

    destroy() {
      this.bg.destroy();
      this.iconText.destroy();
      this.labelText.destroy();
      this.cooldownGraphics.destroy();
      this.hitZone.destroy();
      this.perfectRing.destroy();
    }
  }

  class ActionButtons {
    constructor(scene, y, onAction) {
      this.buttons = {};
      const actions = ['o2Boost', 'suction', 'pressure', 'nebulizer'];
      const padding = 8;
      const totalW = RTL.WIDTH - padding * 2;
      const btnW = (totalW - padding * 3) / 4;
      const btnH = 72;

      actions.forEach((key, i) => {
        const x = padding + i * (btnW + padding);
        this.buttons[key] = new ActionButton(scene, x, y, btnW, btnH, key, onAction);
      });
    }

    update(currentTask, isPerfectWindow) {
      for (const [key, btn] of Object.entries(this.buttons)) {
        const isPerfectTarget = isPerfectWindow && currentTask && currentTask.action === key;
        btn.update(isPerfectTarget);
      }
    }

    resetAllCooldowns() {
      for (const btn of Object.values(this.buttons)) {
        btn.resetCooldown();
      }
    }

    isOnCooldown(actionKey) {
      return this.buttons[actionKey] && this.buttons[actionKey].isOnCooldown();
    }

    destroy() {
      for (const btn of Object.values(this.buttons)) {
        btn.destroy();
      }
    }
  }

  RTL.ActionButtons = ActionButtons;
})();
