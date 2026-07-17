/* ===========================================================
   Health Log v2
   File : js/core/sync.js
   Purpose : Google Apps Script Synchronization
=========================================================== */

import { Config } from "./config.js";
import { State, Store } from "./state.js";
import { Storage } from "./storage.js";

class SyncManager {

    constructor() {

        this.online = navigator.onLine;
        this.syncing = false;

    }

    /* ======================================================
       Initialize
    ====================================================== */

    async init() {

        window.addEventListener("online", () => {

            this.online = true;

            Store.setSyncStatus("online");

            this.download();

        });

        window.addEventListener("offline", () => {

            this.online = false;

            Store.setSyncStatus("offline");

        });

        Store.setSyncStatus(
            this.online ? "online" : "offline"
        );

        if (this.online) {

            await this.download();

        }

    }

    /* ======================================================
       HTTP Request
    ====================================================== */

    async request(payload) {

        const controller = new AbortController();

        const timeout = setTimeout(() => {

            controller.abort();

        }, Config.REQUEST_TIMEOUT);

        try {

            const response = await fetch(Config.API_URL, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(payload),

                signal: controller.signal

            });

            clearTimeout(timeout);

            if (!response.ok) {

                throw new Error(
                    "Network Error : " + response.status
                );

            }

            return await response.json();

        }

        catch (err) {

            clearTimeout(timeout);

            console.error(err);

            throw err;

        }

    }

    /* ======================================================
       Download Complete Database
    ====================================================== */

    async download() {

        if (!this.online) return;

        if (this.syncing) return;

        this.syncing = true;

        try {

            const result = await this.request({

                action: "load"

            });

            if (Array.isArray(result.days)) {

                Store.setDays(result.days);

                Storage.saveCache();

            }

            Store.setLastSync(
                new Date().toISOString()
            );

            Storage.saveLastSync(
                new Date().toISOString()
            );

        }

        catch (err) {

            console.error("Download failed", err);

        }

        finally {

            this.syncing = false;

        }

    }

    /* ======================================================
       Add Record
    ====================================================== */

    async add(day) {

        const result = await this.request({

            action: "add",

            data: day

        });

        await this.download();

        return result;

    }

    /* ======================================================
       Update Record
    ====================================================== */

    async update(day) {

        const result = await this.request({

            action: "update",

            data: day

        });

        await this.download();

        return result;

    }

    /* ======================================================
       Delete Record
    ====================================================== */

    async delete(date) {

        const result = await this.request({

            action: "delete",

            date

        });

        await this.download();

        return result;

    }

    /* ======================================================
       Manual Sync
    ====================================================== */

    async syncNow() {

        return this.download();

    }

}

export const Sync = new SyncManager();
