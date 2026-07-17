/* ===========================================================
   Health Log v2
   File : js/core/storage.js
   Purpose : Local Storage Manager
=========================================================== */

import { Config } from "./config.js";
import { State, Store } from "./state.js";

class StorageManager {

    async init() {

        this.loadSettings();
        this.loadCache();

        return true;

    }

    /* ======================================================
       Settings
    ====================================================== */

    loadSettings() {

        try {

            const raw = localStorage.getItem(
                Config.SETTINGS_KEY
            );

            if (!raw) return;

            const settings = JSON.parse(raw);

            Object.assign(State.settings, settings);

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
       Cached Health Data
    ====================================================== */

    loadCache() {

        try {

            const raw = localStorage.getItem(
                Config.CACHE_KEY
            );

            if (!raw) return;

            const data = JSON.parse(raw);

            if (Array.isArray(data)) {

                Store.setDays(data);

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
                JSON.stringify(State.data.days)
            );

        }

        catch (err) {

            console.error("Unable to save cache", err);

        }

    }

    /* ======================================================
       Last Sync
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

    }

    /* ======================================================
       Generic Helpers
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
                key.startsWith(Config.STORAGE_PREFIX)
            )

            .forEach(key =>
                localStorage.removeItem(key)
            );

    }

    /* ======================================================
       Auto Save
    ====================================================== */

    autoSave() {

        this.saveCache();

        this.saveSettings();

    }

}

export const Storage = new StorageManager();
