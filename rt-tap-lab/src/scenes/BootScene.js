(function() {
  const RTL = window.RTTapLab;

  class BootScene extends Phaser.Scene {
    constructor() {
      super({ key: 'BootScene' });
    }

    create() {
      const W = RTL.WIDTH;
      const H = RTL.HEIGHT;

      // Loading text
      const loadText = this.add.text(W / 2, H / 2 - 40, 'RT TAP LAB', {
        fontFamily: RTL.FONT,
        fontSize: '32px',
        color: RTL.HEX.oxygen,
        fontStyle: 'bold'
      }).setOrigin(0.5);

      const subText = this.add.text(W / 2, H / 2 + 10, 'Initializing...', {
        fontFamily: RTL.FONT,
        fontSize: '14px',
        color: RTL.HEX.textDim
      }).setOrigin(0.5);

      // Generate procedural textures
      this.generateTextures();

      // Brief delay for visual feedback, then go to menu
      this.time.delayedCall(800, () => {
        this.scene.start('MenuScene');
      });
    }

    generateTextures() {
      // Generate a simple circle texture for particles
      const particleGfx = this.add.graphics();
      particleGfx.fillStyle(0xffffff, 1);
      particleGfx.fillCircle(8, 8, 8);
      particleGfx.generateTexture('particle', 16, 16);
      particleGfx.destroy();

      // Generate button textures for menu
      const btnGfx = this.add.graphics();
      btnGfx.fillStyle(0x4FC3F7, 1);
      btnGfx.fillRoundedRect(0, 0, 200, 50, 12);
      btnGfx.generateTexture('btn-blue', 200, 50);
      btnGfx.clear();

      btnGfx.fillStyle(0xFFD54F, 1);
      btnGfx.fillRoundedRect(0, 0, 200, 50, 12);
      btnGfx.generateTexture('btn-yellow', 200, 50);
      btnGfx.clear();

      btnGfx.fillStyle(0x1e2640, 1);
      btnGfx.fillRoundedRect(0, 0, 200, 50, 12);
      btnGfx.generateTexture('btn-dark', 200, 50);
      btnGfx.destroy();
    }
  }

  RTL.BootScene = BootScene;
})();
