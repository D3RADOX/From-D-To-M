(function() {
  const RTL = window.RTTapLab;

  class EventSystem {
    constructor() {
      this.activeEvent = null;
      this.eventEndTime = 0;
      this.nextEventTime = 0;
      this.eventMults = { oxygenDriftMult: 1, pressureDriftMult: 1, secretionDriftMult: 1 };
    }

    reset() {
      this.activeEvent = null;
      this.eventEndTime = 0;
      this.scheduleNext();
      this.eventMults = { oxygenDriftMult: 1, pressureDriftMult: 1, secretionDriftMult: 1 };
    }

    scheduleNext() {
      const min = RTL.TIMING.eventMinInterval;
      const max = RTL.TIMING.eventMaxInterval;
      this.nextEventTime = Date.now() + min + Math.random() * (max - min);
    }

    update(delta, meterSystem, actionButtons) {
      const now = Date.now();

      // Check if active event expired
      if (this.activeEvent && now >= this.eventEndTime) {
        this.activeEvent = null;
        this.eventMults = { oxygenDriftMult: 1, pressureDriftMult: 1, secretionDriftMult: 1 };
      }

      // Check if it's time for a new event
      if (!this.activeEvent && now >= this.nextEventTime) {
        this.triggerEvent(meterSystem, actionButtons);
      }

      return this.activeEvent;
    }

    triggerEvent(meterSystem, actionButtons) {
      const event = RTL.EVENTS[Math.floor(Math.random() * RTL.EVENTS.length)];
      this.activeEvent = { ...event };
      this.eventEndTime = Date.now() + event.duration;

      // Apply instant effects
      if (event.effect.pressureInstant) {
        meterSystem.applyEventInstant(event.effect);
      }

      // Apply cooldown reset
      if (event.effect.resetCooldowns && actionButtons) {
        actionButtons.resetAllCooldowns();
      }

      // Set drift multipliers
      this.eventMults = {
        oxygenDriftMult: event.effect.oxygenDriftMult || 1,
        pressureDriftMult: event.effect.pressureDriftMult || 1,
        secretionDriftMult: event.effect.secretionDriftMult || 1
      };

      this.scheduleNext();
      return this.activeEvent;
    }

    getEventMults() {
      return this.eventMults;
    }

    getActiveEvent() {
      return this.activeEvent;
    }

    getTimeRemaining() {
      if (!this.activeEvent) return 0;
      return Math.max(0, this.eventEndTime - Date.now());
    }
  }

  RTL.EventSystem = EventSystem;
})();
