/* ===========================================================
   Health Log v3.1
   File : js/app.js
   Purpose : Application Bootstrap
=========================================================== */

import { Router } from "./core/router.js";
import { State } from "./core/state.js";
import { Storage } from "./core/storage.js";
import { Sync } from "./core/sync.js";
import { Auth } from "./services/auth.js";

import { DashboardPage } from "./pages/dashboard.js";
import { NutritionPage } from "./pages/nutrition.js";
import { StrengthPage } from "./pages/strength.js";
import { ChartsPage } from "./pages/charts.js";
import { HistoryPage } from "./pages/history.js";
import { AddEntryPage } from "./pages/add.js";

class App {

    constructor() {
        this.pages = [
            DashboardPage,
            NutritionPage,
            StrengthPage,
            ChartsPage,
            HistoryPage,
            AddEntryPage,
        ];
    }

    start() {
        this.loadState();
        this.initAuth();
        this.initPages();
        this.initSidebar();
        this.initTheme();
        Router.start();
    }

    loadState() {
        const saved = Storage.load();
        if (saved) State.setData(saved);
    }

    initAuth() {
        Auth.init();

        const btnSignIn  = document.getElementById("btn-signin");
        const btnSignOut = document.getElementById("btn-signout");

        if (btnSignIn)  btnSignIn.addEventListener("click",  () => Auth.signIn());
        if (btnSignOut) btnSignOut.addEventListener("click", () => Auth.signOut());

        Auth.onChange((isAuth) => {
            this.updateAuthUI(isAuth);
            if (isAuth) Sync.download();
        });

        this.updateAuthUI(Auth.isAuthenticated());

        if (Auth.isAuthenticated()) Sync.init();
    }

    updateAuthUI(isAuth) {
        const banner   = document.getElementById("auth-banner");
        const signIn   = document.getElementById("btn-signin");
        const signOut  = document.getElementById("btn-signout");

        if (banner)  banner.style.display  = isAuth ? "none" : "flex";
        if (signIn)  signIn.style.display  = isAuth ? "none" : "inline-flex";
        if (signOut) signOut.style.display = isAuth ? "inline-flex" : "none";
    }

    initPages() {
        this.pages.forEach(page => {
            if (typeof page.init === "function") page.init();
        });
    }

    initSidebar() {
        const sidebar = document.getElementById("sidebar");
        const toggle  = document.getElementById("menu-toggle");
        if (!sidebar || !toggle) return;
        toggle.addEventListener("click", () => sidebar.classList.toggle("open"));
        document.querySelectorAll("[data-route]").forEach(btn => {
            btn.addEventListener("click", () => sidebar.classList.remove("open"));
        });
    }

    initTheme() {
        document.documentElement.setAttribute(
            "data-theme",
            State.settings?.theme || "light"
        );
    }
}

const app = new App();
app.start();
