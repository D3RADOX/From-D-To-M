(function() {
  const RTL = window.RTTapLab;

  class UpgradeSystem {
    constructor(rewardSystem) {
      this.rewardSystem = rewardSystem;
      this.levels = { ...rewardSystem.upgradeLevels };
    }

    getLevel(upgradeKey) {
      return this.levels[upgradeKey] || 0;
    }

    getNextCost(upgradeKey) {
      const level = this.getLevel(upgradeKey);
      const upgrade = RTL.UPGRADES[upgradeKey];
      if (!upgrade || level >= upgrade.levels.length) return null;
      return upgrade.levels[level].cost;
    }

    canPurchase(upgradeKey) {
      const cost = this.getNextCost(upgradeKey);
      if (cost === null) return false;
      return this.rewardSystem.coins >= cost;
    }

    isMaxed(upgradeKey) {
      const upgrade = RTL.UPGRADES[upgradeKey];
      if (!upgrade) return true;
      return this.getLevel(upgradeKey) >= upgrade.levels.length;
    }

    purchase(upgradeKey) {
      if (!this.canPurchase(upgradeKey)) return false;
      const cost = this.getNextCost(upgradeKey);
      if (this.rewardSystem.spendCoins(cost)) {
        this.levels[upgradeKey] = (this.levels[upgradeKey] || 0) + 1;
        this.rewardSystem.upgradeLevels = { ...this.levels };
        this.rewardSystem.save();
        return true;
      }
      return false;
    }

    getEffects() {
      const effects = {};

      for (const [key, level] of Object.entries(this.levels)) {
        if (level <= 0) continue;
        const upgrade = RTL.UPGRADES[key];
        if (!upgrade) continue;
        const levelData = upgrade.levels[level - 1];
        if (!levelData) continue;
        Object.assign(effects, levelData.effect);
      }

      return effects;
    }

    getAllUpgradeStates() {
      const states = [];
      for (const [key, upgrade] of Object.entries(RTL.UPGRADES)) {
        states.push({
          key: key,
          name: upgrade.name,
          description: upgrade.description,
          icon: upgrade.icon,
          color: upgrade.color,
          currentLevel: this.getLevel(key),
          maxLevel: upgrade.levels.length,
          nextCost: this.getNextCost(key),
          canBuy: this.canPurchase(key),
          isMaxed: this.isMaxed(key)
        });
      }
      return states;
    }
  }

  RTL.UpgradeSystem = UpgradeSystem;
})();
