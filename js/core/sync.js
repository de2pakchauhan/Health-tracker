/* ===========================================================
   Health Log v3.1
   File : js/core/sync.js
   Purpose : Google Apps Script Sync with Auth
=========================================================== */

import { Config } from "./config.js";
import { Store } from "./state.js";
import { Storage } from "./storage.js";
import { Auth } from "../services/auth.js";

class SyncManager {

    constructor() {
        this.online = navigator.onLine;
        this.syncing = false;
    }

    async init() {
        window.addEventListener("online", () => {
            this.online = true;
            Store.setSyncStatus("online");
            if (Auth.isAuthenticated()) this.download();
        });
        window.addEventListener("offline", () => {
            this.online = false;
            Store.setSyncStatus("offline");
        });
        Store.setSyncStatus(this.online ? "online" : "offline");
        if (this.online && Auth.isAuthenticated()) {
            await this.download();
        }
    }

    async get(params = {}) {
        const token = Auth.getToken();
        if (!token) throw new Error("NOT_AUTHENTICATED");
        const qs = new URLSearchParams({ ...params, token }).toString();
        const res = await fetch(Config.API_URL + "?" + qs);
        if (res.status === 401 || res.status === 403) {
            Auth.handleUnauthorized();
            throw new Error("UNAUTHORIZED");
        }
        if (!res.ok) throw new Error("GET Error: " + res.status);
        return res.json();
    }

    async post(payload) {
        const token = Auth.getToken();
        if (!token) throw new Error("NOT_AUTHENTICATED");
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), Config.REQUEST_TIMEOUT);
        try {
            const res = await fetch(Config.API_URL, {
                method: "POST",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify({ ...payload, token }),
                signal: controller.signal,
            });
            clearTimeout(timer);
            if (res.status === 401 || res.status === 403) {
                Auth.handleUnauthorized();
                throw new Error("UNAUTHORIZED");
            }
            if (!res.ok) throw new Error("POST Error: " + res.status);
            return res.json();
        } catch (err) {
            clearTimeout(timer);
            throw err;
        }
    }

    async download() {
        if (!this.online || this.syncing || !Auth.isAuthenticated()) return;
        this.syncing = true;
        try {
            const [fit, str] = await Promise.all([
                this.get({ sheet: "fitness" }),
                this.get({ sheet: "strength" }),
            ]);
            if (fit.status === "ok") Store.setFitnessData(fit.data || []);
            if (str.status === "ok") Store.setStrengthData(str.data || []);
            Storage.saveCache();
            Store.setLastSync(new Date().toISOString());
        } catch (err) {
            console.error("Download failed:", err);
        } finally {
            this.syncing = false;
        }
    }

    async upsert(sheet, row) {
        await this.post({ sheet, action: "upsert", row });
        await this.download();
    }

    async syncNow() {
        return this.download();
    }
}

export const Sync = new SyncManager();
