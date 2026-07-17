/* ===========================================================
   Health Log v2
   File : js/pages/dashboard.js
   Purpose : Dashboard
=========================================================== */

import { Router } from "../core/router.js";
import { State } from "../core/state.js";

import { Analytics } from "../services/analytics.js";

import { Card } from "../components/card.js";
import { StatCard } from "../components/statCard.js";
import { ProgressBar } from "../components/progressBar.js";

class Dashboard {

    constructor() {

        this.container = null;

        this.unsubscribe = null;

    }

    /* ======================================================
       Initialize
    ====================================================== */

    init() {

        this.container =

            document.getElementById(

                "page-content"

            );

        Router.register(

            "dashboard",

            this

        );

        this.unsubscribe =

            State.subscribe(() => {

                if (

                    Router.getCurrentRoute() ===

                    "dashboard"

                ) {

                    this.render();

                }

            });

    }

    destroy() {

        /* Reserved for future cleanup */

    }

    /* ======================================================
       Render
    ====================================================== */

    render() {

        if (!this.container) return;

        const state =

            State.getState();

        const days =

            state.data.days;

        const latest =

            days.at(-1) || {};

        const fitness =

            latest.fitness || {};

        const nutrition =

            latest.nutrition || {};

        this.container.innerHTML = `

<section class="dashboard-page">

<header class="page-header">

<h1>Dashboard</h1>

</header>

<div class="stats-grid">

${StatCard.create({

title:"Weight",

value:fitness.weight ?? "--",

unit:"kg",

icon:"⚖️"

})}

${StatCard.create({

title:"Calories",

value:nutrition.calories ?? "--",

unit:"kcal",

icon:"🔥"

})}

${StatCard.create({

title:"Protein",

value:nutrition.protein ?? "--",

unit:"g",

icon:"🥚"

})}

${StatCard.create({

title:"Steps",

value:fitness.steps ?? "--",

unit:"",

icon:"👣"

})}

</div>

${ProgressBar.create({

title:"Calories",

value:nutrition.calories ?? 0,

target:state.settings.targetCalories,

unit:" kcal",

color:"orange"

})}

${ProgressBar.create({

title:"Protein",

value:nutrition.protein ?? 0,

target:state.settings.targetProtein,

unit:" g",

color:"green"

})}

<div class="dashboard-grid">

${Card.create({

title:"Today's Summary",

body:`

<table class="history-table">

<tr>

<td>Sleep</td>

<td>${fitness.sleep ?? "--"} hrs</td>

</tr>

<tr>

<td>Distance</td>

<td>${fitness.distance ?? "--"} km</td>

</tr>

<tr>

<td>Resting HR</td>

<td>${fitness.restingHeartRate ?? "--"} bpm</td>

</tr>

<tr>

<td>HRV</td>

<td>${fitness.hrv ?? "--"} ms</td>

</tr>

</table>

`

})}

${Card.create({

title:"Overall Statistics",

body:`

<table class="history-table">

<tr>

<td>Total Days</td>

<td>${days.length}</td>

</tr>

<tr>

<td>Total Workouts</td>

<td>${Analytics.count(days)}</td>

</tr>

<tr>

<td>Average Calories</td>

<td>${Analytics.averageCalories?.(days) ?? "--"}</td>

</tr>

<tr>

<td>Average Protein</td>

<td>${Analytics.averageProtein?.(days) ?? "--"}</td>

</tr>

</table>

`

})}

</div>

</section>

`;

    }

}

export const DashboardPage =

new Dashboard();
