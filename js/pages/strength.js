/* ===========================================================
   Health Log v2
   File : js/pages/strength.js
   Purpose : Strength Training Page
=========================================================== */

import { Router } from "../core/router.js";
import { State } from "../core/state.js";

import { Analytics } from "../services/analytics.js";
import { Search } from "../services/search.js";

import { Card } from "../components/card.js";
import { StatCard } from "../components/statCard.js";
import { Accordion } from "../components/accordion.js";

class Strength {

    constructor() {

        this.container = null;

        this.currentTab = "split";

    }

    /* ======================================================
       Initialize
    ====================================================== */

    init() {

        this.container =
            document.getElementById("page-content");

        Router.register("strength", this);

    }

    destroy() {}

    /* ======================================================
       Render
    ====================================================== */

    render() {

        if (!this.container) return;

        this.container.innerHTML = this.template();

        this.bindEvents();

    }

    template() {

        return `

<section class="strength-page">

<header class="page-header">

<h1>Strength Training</h1>

</header>

<div class="page-tabs">

<button class="page-tab active"
data-tab="split">
Current Split
</button>

<button class="page-tab"
data-tab="history">
History
</button>

<button class="page-tab"
data-tab="progress">
Progress
</button>

<button class="page-tab"
data-tab="prs">
PRs
</button>

</div>

<div class="strength-search">

<input
id="strength-search"
type="text"
placeholder="Search exercise">

</div>

<div id="strength-content">

${this.renderSplit()}

</div>

</section>

`;

    }

    /* ======================================================
       Current Split
    ====================================================== */

    renderSplit() {

        return `

<div class="stats-grid">

${StatCard.create({

title:"Workouts",

value:Analytics.count(State.data.days),

icon:"🏋️"

})}

${StatCard.create({

title:"Exercises",

value:"--",

icon:"💪"

})}

</div>

${Card.create({

title:"Workout Split",

body:`

<div class="split-grid">

<div class="split-card">

<h3>Push A</h3>

<p>Chest<br>Shoulders<br>Triceps</p>

</div>

<div class="split-card">

<h3>Pull A</h3>

<p>Back<br>Biceps</p>

</div>

<div class="split-card">

<h3>Legs</h3>

<p>Quads<br>Hamstrings<br>Calves</p>

</div>

<div class="split-card">

<h3>Push B</h3>

<p>Chest<br>Shoulders<br>Triceps</p>

</div>

<div class="split-card">

<h3>Pull B</h3>

<p>Back<br>Biceps</p>

</div>

</div>

`

})}

`;

    }

    /* ======================================================
       History
    ====================================================== */

    renderHistory() {

        const workouts =
            Search.strengthDays(
                State.data.days
            );

        if (!workouts.length) {

            return Card.empty(
                "No workouts available."
            );

        }

        return workouts.map(day =>

            Accordion.create({

                id: day.date,

                title: day.date,

                subtitle:
                    `${day.strength.length} Exercises`,

                content: this.exerciseTable(
                    day.strength
                )

            })

        ).join("");

    }

    /* ======================================================
       Exercise Table
    ====================================================== */

    exerciseTable(exercises = []) {

        if (!exercises.length) {

            return "No exercises.";

        }

        return `

<table class="exercise-table">

<thead>

<tr>

<th>Exercise</th>

<th>Sets</th>

<th>Reps</th>

<th>Weight</th>

</tr>

</thead>

<tbody>

${exercises.map(exercise => `

<tr>

<td>${exercise.name ?? "-"}</td>

<td>${exercise.sets ?? "-"}</td>

<td>${exercise.reps ?? "-"}</td>

<td>${exercise.weight ?? "-"} kg</td>

</tr>

`).join("")}

</tbody>

</table>

`;

    }

    /* ======================================================
       Progress
    ====================================================== */

    renderProgress() {

        return Card.create({

            title:"Exercise Progress",

            body:`

Progress charts will be
rendered here.

`

        });

    }

    /* ======================================================
       PRs
    ====================================================== */

    renderPRs() {

        return Card.create({

            title:"Personal Records",

            body:`

PRs generated from
Analytics service.

`

        });

    }

    /* ======================================================
       Refresh
    ====================================================== */

    refresh() {

        const body =
            document.getElementById(
                "strength-content"
            );

        switch(this.currentTab){

            case "split":

                body.innerHTML =
                    this.renderSplit();

                break;

            case "history":

                body.innerHTML =
                    this.renderHistory();

                Accordion.bind(body);

                break;

            case "progress":

                body.innerHTML =
                    this.renderProgress();

                break;

            case "prs":

                body.innerHTML =
                    this.renderPRs();

                break;

        }

    }

    /* ======================================================
       Search
    ====================================================== */

    search(query){

        const result =
            Search.search(
                State.data.days,
                query
            );

        console.log(
            "Strength Search",
            result
        );

    }

    /* ======================================================
       Events
    ====================================================== */

    bindEvents(){

        this.container
            .querySelectorAll(".page-tab")
            .forEach(button=>{

                button.onclick=()=>{

                    this.container
                        .querySelectorAll(".page-tab")
                        .forEach(btn=>
                            btn.classList.remove("active")
                        );

                    button.classList.add("active");

                    this.currentTab =
                        button.dataset.tab;

                    this.refresh();

                };

            });

        document
            .getElementById("strength-search")
            .addEventListener("input",e=>{

                this.search(
                    e.target.value
                );

            });

    }

}

export const StrengthPage = new Strength();
