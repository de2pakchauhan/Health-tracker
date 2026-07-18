/* ===========================================================
   Health Log v2
   File : js/core/storage.js
   Purpose : Local Storage Manager
=========================================================== */

import { Config } from "./config.js";
import { State } from "./state.js";

class StorageManager {

    async init() {

        this.loadSettings();
        this.loadCache();

        return true;

    }

    /* ======================================================
       SETTINGS
    ====================================================== */

    loadSettings() {

        try {

            const raw = localStorage.getItem(
                Config.SETTINGS_KEY
            );

            if (!raw) return;

            const settings = JSON.parse(raw);

            State.setSettings(settings);

        }

        catch (err) {

            console.error("Unable to load settings", err);

        }

    }

    saveSettings() {

        try {

            localStorage.setItem(

                Config.SETTINGS_KEY,

                JSON.stringify(State.settings)

            );

        }

        catch (err) {

            console.error("Unable to save settings", err);

        }

    }

    /* ======================================================
       HEALTH CACHE
    ====================================================== */

    loadCache() {

        try {

            const raw = localStorage.getItem(

                Config.CACHE_KEY

            );

            if (!raw) return;

            const days = JSON.parse(raw);

            if (Array.isArray(days)) {

                State.setDays(days);

            }

        }

        catch (err) {

            console.error("Unable to load cache", err);

        }

    }

    saveCache() {

        try {

            localStorage.setItem(

                Config.CACHE_KEY,

                JSON.stringify(

                    State.getDays()

                )

            );

        }

        catch (err) {

            console.error("Unable to save cache", err);

        }

    }

    /* ======================================================
       LAST SYNC
    ====================================================== */

    loadLastSync() {

        return localStorage.getItem(

            Config.LAST_SYNC_KEY

        );

    }

    saveLastSync(date) {

        localStorage.setItem(

            Config.LAST_SYNC_KEY,

            date

        );

        State.setLastSync(date);

    }

    /* ======================================================
       GENERIC STORAGE
    ====================================================== */

    save(key, value) {

        localStorage.setItem(

            Config.STORAGE_PREFIX + "-" + key,

            JSON.stringify(value)

        );

    }

    load(key, defaultValue = null) {

        try {

            const raw = localStorage.getItem(

                Config.STORAGE_PREFIX + "-" + key

            );

            if (!raw) return defaultValue;

            return JSON.parse(raw);

        }

        catch {

            return defaultValue;

        }

    }

    remove(key) {

        localStorage.removeItem(

            Config.STORAGE_PREFIX + "-" + key

        );

    }

    clearAppStorage() {

        Object.keys(localStorage)

            .filter(key =>

                key.startsWith(

                    Config.STORAGE_PREFIX

                )

            )

            .forEach(key =>

                localStorage.removeItem(key)

            );

    }

    /* ======================================================
       AUTO SAVE
    ====================================================== */

    autoSave() {

        this.saveCache();

        this.saveSettings();

    }

}

export const Storage = new StorageManager();
