(function() {
  const RTL = window.RTTapLab;

  class Effects {
    constructor(scene) {
      this.scene = scene;
      this.floatingTexts = [];
      this.shaking = false;

      // Audio context for SFX
      this.audioCtx = null;
      this.soundEnabled = true;
      try {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        this.soundEnabled = false;
      }
    }

    floatText(x, y, text, color, size) {
      const ft = this.scene.add.text(x, y, text, {
        fontFamily: RTL.FONT,
        fontSize: (size || 16) + 'px',
        color: color || '#ffffff',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2
      }).setOrigin(0.5).setDepth(100);

      this.scene.tweens.add({
        targets: ft,
        y: y - 60,
        alpha: 0,
        duration: 900,
        ease: 'Power2',
        onComplete: () => ft.destroy()
      });
    }

    screenShake(intensity) {
      if (this.shaking) return;
      this.shaking = true;
      const cam = this.scene.cameras.main;
      cam.shake(200, intensity || 0.005, true);
      this.scene.time.delayedCall(250, () => { this.shaking = false; });
    }

    burst(x, y, color, count) {
      const n = count || 8;
      const colorNum = typeof color === 'string' ? parseInt(color.replace('#', ''), 16) : (color || 0xffffff);

      for (let i = 0; i < n; i++) {
        const angle = (Math.PI * 2 * i) / n + Math.random() * 0.3;
        const speed = 80 + Math.random() * 60;
        const size = 3 + Math.random() * 4;

        const p = this.scene.add.graphics();
        p.fillStyle(colorNum, 0.9);
        p.fillCircle(0, 0, size);
        p.setPosition(x, y);
        p.setDepth(99);

        this.scene.tweens.add({
          targets: p,
          x: x + Math.cos(angle) * speed,
          y: y + Math.sin(angle) * speed + 30,
          alpha: 0,
          scaleX: 0.2,
          scaleY: 0.2,
          duration: 500 + Math.random() * 200,
          ease: 'Power2',
          onComplete: () => p.destroy()
        });
      }
    }

    // Web Audio SFX
    playTone(freq, duration, type, volume) {
      if (!this.soundEnabled || !this.audioCtx) return;
      try {
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.type = type || 'sine';
        osc.frequency.value = freq;
        gain.gain.value = volume || 0.15;
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration / 1000);
        osc.start();
        osc.stop(this.audioCtx.currentTime + duration / 1000);
      } catch (e) {}
    }

    sfxGood() {
      this.playTone(660, 130, 'sine', 0.12);
    }

    sfxPerfect() {
      this.playTone(660, 80, 'sine', 0.12);
      setTimeout(() => this.playTone(880, 120, 'sine', 0.12), 80);
    }

    sfxFail() {
      this.playTone(140, 280, 'sawtooth', 0.08);
    }

    sfxAction() {
      this.playTone(900, 60, 'square', 0.06);
    }

    sfxWin() {
      this.playTone(523, 100, 'sine', 0.1);
      setTimeout(() => this.playTone(659, 100, 'sine', 0.1), 100);
      setTimeout(() => this.playTone(784, 100, 'sine', 0.1), 200);
      setTimeout(() => this.playTone(1047, 200, 'sine', 0.12), 300);
    }

    sfxCoin() {
      this.playTone(1200, 80, 'sine', 0.08);
      setTimeout(() => this.playTone(1600, 100, 'sine', 0.08), 60);
    }

    sfxEvent() {
      this.playTone(440, 150, 'sawtooth', 0.1);
      setTimeout(() => this.playTone(440, 150, 'sawtooth', 0.1), 180);
    }

    toggleSound(enabled) {
      this.soundEnabled = enabled;
    }

    destroy() {
      // Nothing persistent to clean up
    }
  }

  RTL.Effects = Effects;
})();
