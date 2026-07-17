/* ===========================================================
   Health Log v2
   File : js/core/state.js
   Purpose : Central Reactive State Store
=========================================================== */

import { Helpers } from "../utils/helpers.js";

class Store {

    constructor() {

        this.data = {

            days: []

        };

        this.settings = {

            targetCalories: 2200,
            targetProtein: 130,
            theme: "light"

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

        for (const listener of this.listeners) {

            listener(this.getState());

        }

    }

    /* ======================================================
       Read State
    ====================================================== */

    getState() {

        return {

            data: Helpers.clone(this.data),

            settings: Helpers.clone(this.settings)

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

        };

        this.notify();

    }

}

export const State = new Store();
