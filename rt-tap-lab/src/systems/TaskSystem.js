(function() {
  const RTL = window.RTTapLab;

  class TaskSystem {
    constructor() {
      this.currentTask = null;
      this.taskTimer = 0;
      this.perfectWindowStart = 0;
      this.perfectWindowActive = false;
      this.lastInputTime = 0;
    }

    reset() {
      this.currentTask = null;
      this.taskTimer = 0;
      this.perfectWindowStart = 0;
      this.perfectWindowActive = false;
      this.lastInputTime = 0;
    }

    update(delta, meterSystem) {
      // Generate tasks based on meter urgency
      if (!this.currentTask) {
        this.currentTask = this.generateTask(meterSystem);
        if (this.currentTask) {
          this.taskTimer = 0;
          this.perfectWindowActive = false;
        }
      }

      if (this.currentTask) {
        this.taskTimer += delta;

        // Perfect window activates after a short delay
        if (!this.perfectWindowActive && this.taskTimer >= 500 && this.taskTimer <= 500 + RTL.TIMING.perfectWindow) {
          this.perfectWindowActive = true;
          this.perfectWindowStart = Date.now();
        } else if (this.taskTimer > 500 + RTL.TIMING.perfectWindow) {
          this.perfectWindowActive = false;
        }

        // Task expires after 6 seconds — generate new one
        if (this.taskTimer > 6000) {
          this.currentTask = null;
        }
      }
    }

    generateTask(meterSystem) {
      // Priority: most urgent meter gets a task
      const urgencies = [];

      if (meterSystem.oxygen < 60) {
        urgencies.push({ action: 'o2Boost', urgency: 60 - meterSystem.oxygen });
      }
      if (meterSystem.secretion > 40) {
        urgencies.push({ action: 'suction', urgency: meterSystem.secretion - 40 });
      }
      if (Math.abs(meterSystem.pressure - 50) > 15) {
        urgencies.push({ action: 'pressure', urgency: Math.abs(meterSystem.pressure - 50) - 15 });
      }

      // If nothing urgent, random task
      if (urgencies.length === 0) {
        const actions = ['o2Boost', 'suction', 'pressure'];
        return { action: actions[Math.floor(Math.random() * actions.length)], prompted: false };
      }

      // Most urgent
      urgencies.sort((a, b) => b.urgency - a.urgency);
      return { action: urgencies[0].action, prompted: true };
    }

    checkAction(actionKey) {
      const now = Date.now();

      // Anti-spam check
      if (now - this.lastInputTime < RTL.TIMING.antiSpam) {
        return { valid: false, reason: 'spam' };
      }
      this.lastInputTime = now;

      const isPerfect = this.perfectWindowActive &&
                        this.currentTask &&
                        this.currentTask.action === actionKey;

      const matchesTask = this.currentTask && this.currentTask.action === actionKey;

      if (matchesTask) {
        this.currentTask = null; // consume task
      }

      return {
        valid: true,
        matchesTask: matchesTask,
        isPerfect: isPerfect
      };
    }

    getCurrentTask() {
      return this.currentTask;
    }

    isPerfectWindowActive() {
      return this.perfectWindowActive;
    }
  }

  RTL.TaskSystem = TaskSystem;
})();
