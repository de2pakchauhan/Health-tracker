/* ===========================================================
   Health Log v2
   File : js/pages/history.js
   Purpose : History Explorer
=========================================================== */

import { Router } from "../core/router.js";
import { State } from "../core/state.js";

import { Search } from "../services/search.js";

import { Card } from "../components/card.js";
import { Accordion } from "../components/accordion.js";

class History {

    constructor(){

        this.container=null;

        this.searchText="";

        this.monthFilter="all";

    }

    /* ===================================================== */

    init(){

        this.container=
            document.getElementById("page-content");

        Router.register("history",this);

    }

    destroy(){}

    /* ===================================================== */

    render(){

        if(!this.container) return;

        this.container.innerHTML=this.template();

        this.bindEvents();

        this.renderTimeline();

    }

    /* ===================================================== */

    template(){

        return `

<section class="history-page">

<header class="page-header">

<h1>History</h1>

</header>

<div class="history-toolbar">

<input
id="history-search"
type="text"
placeholder="Search...">

<select id="history-month">

<option value="all">

All Months

</option>

${this.monthOptions()}

</select>

</div>

<div id="history-list"></div>

</section>

`;

    }

    /* ===================================================== */

    monthOptions(){

        const months=[

            ...new Set(

                State.data.days.map(day=>

                    day.date.substring(0,7)

                )

            )

        ];

        return months.map(month=>

            `<option value="${month}">${month}</option>`

        ).join("");

    }

    /* ===================================================== */

    renderTimeline(){

        const host=document.getElementById("history-list");

        let days=[...State.data.days];

        if(this.monthFilter!=="all"){

            days=days.filter(day=>

                day.date.startsWith(this.monthFilter)

            );

        }

        if(this.searchText.trim()){

            days=Search.search(

                days,

                this.searchText

            );

        }

        if(!days.length){

            host.innerHTML=

                Card.empty(

                    "No history found."

                );

            return;

        }

        host.innerHTML=

            days

            .slice()

            .reverse()

            .map(day=>

                Accordion.create({

                    id:day.date,

                    title:day.date,

                    subtitle:this.subtitle(day),

                    content:this.dayContent(day)

                })

            )

            .join("");

        Accordion.bind(host);

    }

    /* ===================================================== */

    subtitle(day){

        const parts=[];

        if(day.nutrition)

            parts.push("Nutrition");

        if(day.strength?.length)

            parts.push("Strength");

        if(day.runs?.length)

            parts.push("Run");

        if(day.notes)

            parts.push("Notes");

        return parts.join(" • ");

    }

    /* ===================================================== */

    dayContent(day){

        return `

${this.fitness(day)}

${this.nutrition(day)}
${this.strength(day)}
${this.runs(day)}
${this.notes(day)}

`;

    }

    /* ===================================================== */

    fitness(day){

        if(!day.fitness)

            return "";

        return Card.create({

            title:"Fitness",

            body:`

<table class="history-table">

<tr>

<td>Weight</td>

<td>${day.fitness.weight ?? "--"}</td>

</tr>

<tr>

<td>Steps</td>

<td>${day.fitness.steps ?? "--"}</td>

</tr>

<tr>

<td>Distance</td>

<td>${day.fitness.distance ?? "--"}</td>

</tr>

<tr>

<td>Sleep</td>

<td>${day.fitness.sleep ?? "--"}</td>

</tr>

<tr>

<td>RHR</td>

<td>${day.fitness.restingHeartRate ?? "--"}</td>

</tr>

<tr>

<td>HRV</td>

<td>${day.fitness.hrv ?? "--"}</td>

</tr>

</table>

`

        });

    }

    /* ===================================================== */

    nutrition(day){

        if(!day.nutrition)

            return "";

        return Card.create({

            title:"Nutrition",

            body:`

<table class="history-table">

<tr>

<td>Calories</td>

<td>${day.nutrition.calories ?? "--"}</td>

</tr>

<tr>

<td>Protein</td>

<td>${day.nutrition.protein ?? "--"}</td>

</tr>

<tr>

<td>Carbs</td>

<td>${day.nutrition.carbs ?? "--"}</td>

</tr>

<tr>

<td>Fat</td>

<td>${day.nutrition.fat ?? "--"}</td>

</tr>

</table>

`

        });

    }

    /* ===================================================== */

    strength(day){

        if(!day.strength?.length)

            return "";

        return Card.create({

            title:"Strength",

            body:`

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

${day.strength.map(ex=>`

<tr>

<td>${ex.name}</td>

<td>${ex.sets}</td>

<td>${ex.reps}</td>

<td>${ex.weight}</td>

</tr>

`).join("")}

</tbody>

</table>

`

        });

    }

    /* ===================================================== */

    runs(day){

        if(!day.runs?.length)

            return "";

        return Card.create({

            title:"Runs",

            body:`

<table class="history-table">

<thead>

<tr>

<th>Distance</th>

<th>Time</th>

<th>Pace</th>

</tr>

</thead>

<tbody>

${day.runs.map(run=>`

<tr>

<td>${run.distance}</td>

<td>${run.time}</td>

<td>${run.pace}</td>

</tr>

`).join("")}

</tbody>

</table>

`

        });

    }

    /* ===================================================== */

    notes(day){

        if(!day.notes)

            return "";

        return Card.create({

            title:"Notes",

            body:`

<p>

${day.notes}

</p>

`

        });

    }

    /* ===================================================== */

    bindEvents(){

        document

        .getElementById("history-search")

        .addEventListener("input",e=>{

            this.searchText=e.target.value;

            this.renderTimeline();

        });

        document

        .getElementById("history-month")

        .addEventListener("change",e=>{

            this.monthFilter=e.target.value;

            this.renderTimeline();

        });

    }

}

export const HistoryPage=
new History();
