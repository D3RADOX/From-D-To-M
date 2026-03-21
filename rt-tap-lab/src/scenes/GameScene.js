(function() {
  const RTL = window.RTTapLab;

  class GameScene extends Phaser.Scene {
    constructor() {
      super({ key: 'GameScene' });
    }

    create() {
      const W = RTL.WIDTH;
      const H = RTL.HEIGHT;

      // Background
      this.add.rectangle(W / 2, H / 2, W, H, RTL.COLORS.bg);

      // Initialize systems
      this.rewardSystem = new RTL.RewardSystem();
      this.rewardSystem.resetSession();
      this.difficultySystem = new RTL.DifficultySystem();
      this.meterSystem = new RTL.MeterSystem();
      this.comboSystem = new RTL.ComboSystem();
      this.taskSystem = new RTL.TaskSystem();
      this.patientSystem = new RTL.PatientSystem();
      this.eventSystem = new RTL.EventSystem();

      // Apply upgrade effects
      this.upgradeSystem = new RTL.UpgradeSystem(this.rewardSystem);
      this.upgradeEffects = this.upgradeSystem.getEffects();

      // Apply combo decay reduction from upgrades
      if (this.upgradeEffects.comboDecayReduction) {
        this.comboSystem.setDecayReduction(this.upgradeEffects.comboDecayReduction);
      }

      // Effects
      this.effects = new RTL.Effects(this);

      // Create UI
      this.hud = new RTL.HUD(this);

      // Patient card (below HUD)
      this.patientCard = new RTL.PatientCard(this, 8, 55, W - 16);

      // Meters (below patient card)
      const meterY = 125;
      const meterW = W - 24;
      const meterH = 28;
      const meterGap = 34;

      this.o2Bar = new RTL.MeterBar(this, 12, meterY, meterW, meterH, {
        label: 'O₂', color: RTL.COLORS.oxygen, hex: RTL.HEX.oxygen
      });
      this.pressureBar = new RTL.MeterBar(this, 12, meterY + meterGap, meterW, meterH, {
        label: 'Pressure', color: RTL.COLORS.pressure, hex: RTL.HEX.pressure
      });
      this.secretionBar = new RTL.MeterBar(this, 12, meterY + meterGap * 2, meterW, meterH, {
        label: 'Secretion', color: RTL.COLORS.secretion, hex: RTL.HEX.secretion
      });

      // Combo display (center area)
      this.comboDisplay = new RTL.ComboDisplay(this, W / 2, 280);

      // Task prompt area
      this.taskBg = this.add.graphics();
      this.taskText = this.add.text(W / 2, 340, '', {
        fontFamily: RTL.FONT, fontSize: '14px', color: '#ffffff', fontStyle: 'bold',
        align: 'center'
      }).setOrigin(0.5);

      // Event alert area
      this.eventBg = this.add.graphics();
      this.eventText = this.add.text(W / 2, 390, '', {
        fontFamily: RTL.FONT, fontSize: '13px', color: RTL.HEX.danger, fontStyle: 'bold'
      }).setOrigin(0.5);

      // Nebulizer status
      this.nebStatusText = this.add.text(W / 2, 420, '', {
        fontFamily: RTL.FONT, fontSize: '12px', color: RTL.HEX.nebulizer
      }).setOrigin(0.5);

      // Game area — visual feedback zone
      this.gameAreaBg = this.add.graphics();
      this.gameAreaBg.fillStyle(RTL.COLORS.panelLight, 0.3);
      this.gameAreaBg.fillRoundedRect(12, 450, W - 24, 300, 12);

      // Patient visual (simple breathing animation)
      this.patientEmoji = this.add.text(W / 2, 560, '🫁', {
        fontSize: '80px'
      }).setOrigin(0.5);

      // Stability display in game area
      this.stabilityLabel = this.add.text(W / 2, 640, '', {
        fontFamily: RTL.FONT, fontSize: '20px', color: '#ffffff', fontStyle: 'bold'
      }).setOrigin(0.5);

      this.stabilitySubtext = this.add.text(W / 2, 670, '', {
        fontFamily: RTL.FONT, fontSize: '12px', color: RTL.HEX.textDim
      }).setOrigin(0.5);

      // Action buttons (bottom of screen)
      this.actionButtons = new RTL.ActionButtons(this, H - 100, (actionKey) => {
        this.handleAction(actionKey);
      });

      // Game state
      this.gameOver = false;
      this.patientTransitionTimer = 0;

      // Start first patient
      this.spawnNewPatient();

      // Resume audio context on first interaction
      this.input.on('pointerdown', () => {
        if (this.effects.audioCtx && this.effects.audioCtx.state === 'suspended') {
          this.effects.audioCtx.resume();
        }
      }, this);
    }

    spawnNewPatient() {
      const patient = this.patientSystem.spawnPatient(this.upgradeEffects);
      this.meterSystem.reset(patient.startMeters);
      this.taskSystem.reset();
      this.eventSystem.reset();
      this.patientCard.setPatient(patient);
      this.patientTransitionTimer = 0;

      // Brief flash
      this.cameras.main.flash(200, 45, 224, 208, true);
    }

    handleAction(actionKey) {
      if (this.gameOver) return;

      // Check cooldown
      if (this.actionButtons.isOnCooldown(actionKey)) return;

      // Task check
      const result = this.taskSystem.checkAction(actionKey);
      if (!result.valid) return;

      // Apply meter effect
      this.meterSystem.applyAction(actionKey, this.upgradeEffects);

      // Combo
      this.comboSystem.hit();
      this.rewardSystem.updateMaxCombo(this.comboSystem.getCombo());

      // Score
      const pts = this.rewardSystem.scoreAction(this.comboSystem.getMultiplier(), result.isPerfect);

      // Visual feedback
      const actionConf = RTL.ACTIONS[actionKey];
      this.effects.sfxAction();

      if (result.isPerfect) {
        this.effects.sfxPerfect();
        this.effects.floatText(RTL.WIDTH / 2, 310, 'PERFECT! +' + pts, RTL.HEX.perfect, 20);
        this.effects.burst(RTL.WIDTH / 2, 310, RTL.COLORS.perfect, 12);
      } else if (result.matchesTask) {
        this.effects.sfxGood();
        this.effects.floatText(RTL.WIDTH / 2, 310, '+' + pts, actionConf.hex, 16);
      } else {
        this.effects.floatText(RTL.WIDTH / 2, 310, '+' + pts, '#aaaaaa', 14);
      }

      // Update HUD
      this.hud.setScore(this.rewardSystem.score);
    }

    update(time, delta) {
      if (this.gameOver) return;

      // Update systems
      const eventMults = this.eventSystem.getEventMults();
      this.meterSystem.update(delta, this.patientSystem.getCurrentPatient(), this.difficultySystem, eventMults);
      this.comboSystem.update(delta);
      this.taskSystem.update(delta, this.meterSystem);

      // Update patient
      const patientStatus = this.patientSystem.update(delta);

      if (patientStatus === 'expired') {
        this.handlePatientExpired();
        return;
      }

      // Update event system
      const activeEvent = this.eventSystem.update(delta, this.meterSystem, this.actionButtons);

      // Check game over
      if (this.meterSystem.isGameOver()) {
        this.handleGameOver();
        return;
      }

      // Update UI
      this.hud.update(this.rewardSystem);
      this.patientCard.update(this.patientSystem, this.meterSystem);

      this.o2Bar.setValue(this.meterSystem.oxygen);
      this.pressureBar.setValue(this.meterSystem.pressure);
      this.secretionBar.setValue(this.meterSystem.secretion);
      this.o2Bar.update();
      this.pressureBar.update();
      this.secretionBar.update();

      this.comboDisplay.update(this.comboSystem);

      // Task prompt
      const task = this.taskSystem.getCurrentTask();
      this.taskBg.clear();
      if (task) {
        const actionConf = RTL.ACTIONS[task.action];
        this.taskText.setText('➤ ' + actionConf.label + ' needed!');
        this.taskText.setColor(actionConf.hex);
        this.taskBg.fillStyle(RTL.COLORS.panel, 0.6);
        this.taskBg.fillRoundedRect(RTL.WIDTH / 2 - 120, 326, 240, 28, 8);
      } else {
        this.taskText.setText('');
      }

      // Event alert
      this.eventBg.clear();
      if (activeEvent) {
        this.eventText.setText(activeEvent.emoji + ' ' + activeEvent.name + ': ' + activeEvent.description);
        this.eventBg.fillStyle(activeEvent.color, 0.15);
        this.eventBg.fillRoundedRect(12, 376, RTL.WIDTH - 24, 26, 6);
      } else {
        this.eventText.setText('');
      }

      // Nebulizer status
      if (this.meterSystem.nebulizerActive) {
        const remaining = Math.ceil((this.meterSystem.nebulizerEnd - Date.now()) / 1000);
        this.nebStatusText.setText('💜 Nebulizer active — ' + remaining + 's');
      } else {
        this.nebStatusText.setText('');
      }

      // Action buttons
      this.actionButtons.update(task, this.taskSystem.isPerfectWindowActive());

      // Stability display
      const stability = this.meterSystem.getStability();
      this.stabilityLabel.setText('Stability: ' + Math.round(stability) + '%');
      if (stability >= 60) {
        this.stabilityLabel.setColor(RTL.HEX.success);
        this.stabilitySubtext.setText('Patient is stable ✓');
        this.stabilitySubtext.setColor(RTL.HEX.success);
      } else if (stability >= 40) {
        this.stabilityLabel.setColor(RTL.HEX.combo);
        this.stabilitySubtext.setText('Needs attention!');
        this.stabilitySubtext.setColor(RTL.HEX.combo);
      } else {
        this.stabilityLabel.setColor(RTL.HEX.danger);
        this.stabilitySubtext.setText('CRITICAL — Act now!');
        this.stabilitySubtext.setColor(RTL.HEX.danger);
      }

      // Breathing animation for patient emoji
      const breathScale = 1 + Math.sin(time / 800) * 0.08;
      this.patientEmoji.setScale(breathScale);

      // Critical screen tint
      if (this.meterSystem.isCritical()) {
        const pulse = 0.03 + Math.sin(time / 200) * 0.02;
        this.gameAreaBg.clear();
        this.gameAreaBg.fillStyle(RTL.COLORS.danger, pulse);
        this.gameAreaBg.fillRoundedRect(12, 450, RTL.WIDTH - 24, 300, 12);
      } else {
        this.gameAreaBg.clear();
        this.gameAreaBg.fillStyle(RTL.COLORS.panelLight, 0.3);
        this.gameAreaBg.fillRoundedRect(12, 450, RTL.WIDTH - 24, 300, 12);
      }
    }

    handlePatientExpired() {
      const stability = this.meterSystem.getStability();
      const saved = this.patientSystem.savePatient(stability);

      if (saved) {
        // Patient saved!
        this.difficultySystem.onPatientSaved();
        const bonus = this.rewardSystem.scorePatientSave(this.difficultySystem.getDifficultyLevel());
        this.effects.sfxWin();
        this.effects.floatText(RTL.WIDTH / 2, 500, 'PATIENT SAVED! +' + bonus, RTL.HEX.success, 22);
        this.effects.burst(RTL.WIDTH / 2, 560, RTL.COLORS.success, 16);
        this.hud.setScore(this.rewardSystem.score);

        // Spawn next patient after brief delay
        this.time.delayedCall(1500, () => {
          if (!this.gameOver) this.spawnNewPatient();
        });
      } else {
        // Patient lost
        this.rewardSystem.onPatientLost();
        this.effects.sfxFail();
        this.effects.screenShake(0.01);
        this.effects.floatText(RTL.WIDTH / 2, 500, 'PATIENT LOST!', RTL.HEX.danger, 22);
        this.comboSystem.miss();

        // Game over after losing a patient
        this.time.delayedCall(1000, () => {
          this.handleGameOver();
        });
      }
    }

    handleGameOver() {
      if (this.gameOver) return;
      this.gameOver = true;

      this.effects.sfxFail();
      this.effects.screenShake(0.015);

      this.rewardSystem.endSession();

      // Brief pause then show results
      this.time.delayedCall(1200, () => {
        this.scene.start('ResultScene', {
          stats: this.rewardSystem.getSessionStats()
        });
      });
    }

    shutdown() {
      // Clean up
      if (this.hud) this.hud.destroy();
      if (this.patientCard) this.patientCard.destroy();
      if (this.o2Bar) this.o2Bar.destroy();
      if (this.pressureBar) this.pressureBar.destroy();
      if (this.secretionBar) this.secretionBar.destroy();
      if (this.comboDisplay) this.comboDisplay.destroy();
      if (this.actionButtons) this.actionButtons.destroy();
      if (this.effects) this.effects.destroy();
    }
  }

  RTL.GameScene = GameScene;
})();
