/* ===========================================================
   Health Log v2
   File : js/core/state.js
   Purpose : Central Reactive State Store
=========================================================== */

import { Helpers } from "../utils/helpers.js";

class StateStore {

    constructor() {

        this.data = {

            days: []
            strength: []

        };

        this.settings = {

            targetCalories: 2200,
            targetProtein: 130,
            theme: "light"

        };

        this.sync = {

            status: "idle",
            lastSync: null

        };

        this.listeners = new Set();

    }

    /* ======================================================
       Subscribe
    ====================================================== */

    subscribe(callback) {

        this.listeners.add(callback);

        return () => this.listeners.delete(callback);

    }

    /* ======================================================
       Notify
    ====================================================== */

    notify() {

        const state = this.getState();

        for (const listener of this.listeners) {

            listener(state);

        }

    }

    /* ======================================================
       Read State
    ====================================================== */

    getState() {

        return {

            data: Helpers.clone(this.data),

            settings: Helpers.clone(this.settings),

            sync: Helpers.clone(this.sync)

        };

    }

    /* ======================================================
       Replace Data
    ====================================================== */

    setData(data) {

        this.data = Helpers.clone(data);

        this.notify();

    }

    /* ======================================================
       Compatibility
    ====================================================== */

    setDays(days) {

        this.data.days = Helpers.clone(days);

        this.notify();

    }

    getDays() {

        return Helpers.clone(this.data.days);

    }

    /* ======================================================
       Replace Settings
    ====================================================== */

    setSettings(settings) {

        this.settings = {

            ...this.settings,

            ...settings

        };

        this.notify();

    }

    /* ======================================================
       Sync Status
    ====================================================== */

    setSyncStatus(status) {

        this.sync.status = status;

        this.notify();

    }

    setLastSync(date = new Date()) {

        this.sync.lastSync = date;

        this.notify();

    }

    /* ======================================================
       Add Day
    ====================================================== */

    addDay(day) {

        this.data.days.push(

            Helpers.clone(day)

        );

        this.notify();

    }

    /* ======================================================
       Update Day
    ====================================================== */

    updateDay(date, updater) {

        const day = this.data.days.find(

            d => d.date === date

        );

        if (!day) return false;

        updater(day);

        this.notify();

        return true;

    }

    /* ======================================================
       Remove Day
    ====================================================== */

    removeDay(date) {

        this.data.days = this.data.days.filter(

            d => d.date !== date

        );

        this.notify();

    }

    /* ======================================================
       Reset
    ====================================================== */

    reset() {

        this.data = {

            days: []
            strength: []

        };

        this.sync = {

            status: "idle",
            lastSync: null

        };

        this.notify();

    }

}

export const State = new StateStore();

/* ===========================================================
   Backward Compatibility
=========================================================== */

export const Store = State;
