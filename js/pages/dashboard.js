/* ===========================================================
   Health Log v2
   File : js/pages/dashboard.js
   Purpose : Home Dashboard
=========================================================== */

import { Router } from "../core/router.js";
import { State } from "../core/state.js";

class Dashboard {

    constructor() {

        this.container = null;

    }

    /* ======================================================
       Initialize
    ====================================================== */

    init() {

        this.container = document.getElementById("page-content");

        Router.register("home", this);

    }

    /* ======================================================
       Render
    ====================================================== */

    render() {

        if (!this.container) return;

        this.container.innerHTML = this.template();

        this.bindEvents();

    }

    /* ======================================================
       Destroy
    ====================================================== */

    destroy() {

        // reserved for future cleanup

    }

    /* ======================================================
       Template
    ====================================================== */

    template() {

        return `

<section class="dashboard">

    <header class="page-header">

        <h1>Health Log</h1>

        <p class="subtitle">
            Overview of your health and fitness
        </p>

    </header>

    <div class="dashboard-tabs">

        <button class="dashboard-tab active"
                data-dashboard-tab="overview">
            Overview
        </button>

        <button class="dashboard-tab"
                data-dashboard-tab="weekly">
            Weekly
        </button>

        <button class="dashboard-tab"
                data-dashboard-tab="achievements">
            Achievements
        </button>

        <button class="dashboard-tab"
                data-dashboard-tab="runs">
            Runs
        </button>

        <button class="dashboard-tab"
                data-dashboard-tab="projection">
            Projection
        </button>

    </div>

    <div id="dashboard-view">

        ${this.renderOverview()}

    </div>

</section>

`;

    }

    /* ======================================================
       Overview
    ====================================================== */

    renderOverview() {

        const totalDays = State.data.days.length;

        return `

<div class="dashboard-grid">

    <div class="card stat-card">

        <div class="stat-title">
            Days Logged
        </div>

        <div class="stat-value">
            ${totalDays}
        </div>

    </div>

    <div class="card stat-card">

        <div class="stat-title">
            Current Weight
        </div>

        <div class="stat-value">
            --
        </div>

    </div>

    <div class="card stat-card">

        <div class="stat-title">
            Calories Today
        </div>

        <div class="stat-value">
            --
        </div>

    </div>

    <div class="card stat-card">

        <div class="stat-title">
            Protein Today
        </div>

        <div class="stat-value">
            --
        </div>

    </div>

</div>

`;

    }

    /* ======================================================
       Weekly
    ====================================================== */

    renderWeekly() {

        return `

<div class="card">

    Weekly Summary

</div>

`;

    }

    /* ======================================================
       Achievements
    ====================================================== */

    renderAchievements() {

        return `

<div class="card">

    Achievements

</div>

`;

    }

    /* ======================================================
       Runs
    ====================================================== */

    renderRuns() {

        return `

<div class="card">

    Running Statistics

</div>

`;

    }

    /* ======================================================
       Projection
    ====================================================== */

    renderProjection() {

        return `

<div class="card">

    Weight Projection

</div>

`;

    }

    /* ======================================================
       Events
    ====================================================== */

    bindEvents() {

        const buttons =
            this.container.querySelectorAll(
                "[data-dashboard-tab]"
            );

        buttons.forEach(button => {

            button.addEventListener("click", () => {

                buttons.forEach(btn =>
                    btn.classList.remove("active")
                );

                button.classList.add("active");

                const tab =
                    button.dataset.dashboardTab;

                this.switchTab(tab);

            });

        });

    }

    /* ======================================================
       Switch Dashboard Tab
    ====================================================== */

    switchTab(tab) {

        const view =
            document.getElementById(
                "dashboard-view"
            );

        if (!view) return;

        switch (tab) {

            case "overview":

                view.innerHTML =
                    this.renderOverview();

                break;

            case "weekly":

                view.innerHTML =
                    this.renderWeekly();

                break;

            case "achievements":

                view.innerHTML =
                    this.renderAchievements();

                break;

            case "runs":

                view.innerHTML =
                    this.renderRuns();

                break;

            case "projection":

                view.innerHTML =
                    this.renderProjection();

                break;

        }

    }

}

export const DashboardPage = new Dashboard();
