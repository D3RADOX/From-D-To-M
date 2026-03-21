(function() {
  const RTL = window.RTTapLab;

  RTL.phaserConfig.scene = [
    RTL.BootScene,
    RTL.MenuScene,
    RTL.GameScene,
    RTL.ShopScene,
    RTL.ResultScene,
    RTL.SettingsScene
  ];

  RTL.game = new Phaser.Game(RTL.phaserConfig);
})();
