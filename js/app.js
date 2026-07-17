/* ===========================================================
   Health Log v2
   File : js/app.js
   Purpose : Application Bootstrap
=========================================================== */

import { Router } from "./core/router.js";
import { State } from "./core/state.js";
import { Storage } from "./core/storage.js";

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
            AddEntryPage

        ];

    }

    /* ======================================================
       Start Application
    ====================================================== */

    start() {

        this.loadState();

        this.initializePages();

        this.initializeSidebar();

        this.initializeTheme();

        Router.start();

    }

    /* ======================================================
       Load Saved Data
    ====================================================== */

    loadState() {

        const savedData = Storage.load();

        if (savedData) {

            State.setData(savedData);

        }

    }

    /* ======================================================
       Initialize Pages
    ====================================================== */

    initializePages() {

        this.pages.forEach(page => {

            if (typeof page.init === "function") {

                page.init();

            }

        });

    }

    /* ======================================================
       Sidebar
    ====================================================== */

    initializeSidebar() {

        const sidebar =

            document.getElementById("sidebar");

        const toggle =

            document.getElementById("menu-toggle");

        if (!sidebar || !toggle) return;

        toggle.addEventListener("click", () => {

            sidebar.classList.toggle("open");

        });

        document

            .querySelectorAll("[data-route]")

            .forEach(button => {

                button.addEventListener("click", () => {

                    sidebar.classList.remove("open");

                });

            });

    }

    /* ======================================================
       Theme
    ====================================================== */

    initializeTheme() {

        document.documentElement.setAttribute(

            "data-theme",

            State.settings.theme || "light"

        );

    }

}

const app = new App();

app.start();
