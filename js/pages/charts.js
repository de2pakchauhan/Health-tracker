/* ===========================================================
   Health Log v2
   File : js/pages/charts.js
   Purpose : Charts Dashboard
=========================================================== */

import { Router } from "../core/router.js";
import { State } from "../core/state.js";

import { Card } from "../components/card.js";

class Charts {

    constructor() {

        this.container = null;

        this.currentChart = "weight";

    }

    /* ======================================================
       Initialize
    ====================================================== */

    init() {

        this.container =
            document.getElementById("page-content");

        Router.register("charts", this);

    }

    destroy() {}

    /* ======================================================
       Render
    ====================================================== */

    render() {

        if (!this.container) return;

        this.container.innerHTML =
            this.template();

        this.bindEvents();

        this.renderChart();

    }

    /* ======================================================
       Template
    ====================================================== */

    template() {

        return `

<section class="charts-page">

<header class="page-header">

<h1>Charts</h1>

</header>

<div class="page-tabs">

<button class="page-tab active"
data-chart="weight">

Weight

</button>

<button class="page-tab"
data-chart="calories">

Calories

</button>

<button class="page-tab"
data-chart="protein">

Protein

</button>

<button class="page-tab"
data-chart="steps">

Steps

</button>

<button class="page-tab"
data-chart="distance">

Distance

</button>

<button class="page-tab"
data-chart="sleep">

Sleep

</button>

<button class="page-tab"
data-chart="rhr">

RHR

</button>

<button class="page-tab"
data-chart="hrv">

HRV

</button>

<button class="page-tab"
data-chart="runs">

Runs

</button>

</div>

${Card.create({

title:"Analytics",

body:`

<div id="chart-host"
class="chart-host">

</div>

`

})}

</section>

`;

    }

    /* ======================================================
       Prepare Data
    ====================================================== */

    prepareChart(type){

        const days =
            State.data.days;

        switch(type){

            case "weight":

                return{

                    title:"Weight",

                    labels:days.map(d=>d.date),

                    values:days.map(

                        d=>d.fitness?.weight

                    )

                };

            case "calories":

                return{

                    title:"Calories",

                    labels:days.map(d=>d.date),

                    values:days.map(

                        d=>d.nutrition?.calories

                    )

                };

            case "protein":

                return{

                    title:"Protein",

                    labels:days.map(d=>d.date),

                    values:days.map(

                        d=>d.nutrition?.protein

                    )

                };

            case "steps":

                return{

                    title:"Steps",

                    labels:days.map(d=>d.date),

                    values:days.map(

                        d=>d.fitness?.steps

                    )

                };

            case "distance":

                return{

                    title:"Distance",

                    labels:days.map(d=>d.date),

                    values:days.map(

                        d=>d.fitness?.distance

                    )

                };

            case "sleep":

                return{

                    title:"Sleep",

                    labels:days.map(d=>d.date),

                    values:days.map(

                        d=>d.fitness?.sleep

                    )

                };

            case "rhr":

                return{

                    title:"Resting Heart Rate",

                    labels:days.map(d=>d.date),

                    values:days.map(

                        d=>d.fitness?.restingHeartRate

                    )

                };

            case "hrv":

                return{

                    title:"HRV",

                    labels:days.map(d=>d.date),

                    values:days.map(

                        d=>d.fitness?.hrv

                    )

                };

            case "runs":

                return{

                    title:"Running Distance",

                    labels:days.map(d=>d.date),

                    values:days.map(

                        d=>

                        (d.runs||[])

                        .reduce(

                            (t,r)=>

                            t+(r.distance||0),

                            0

                        )

                    )

                };

            default:

                return{

                    title:"",

                    labels:[],

                    values:[]

                };

        }

    }

    /* ======================================================
       Render Chart
    ====================================================== */

    renderChart(){

        const host =
            document.getElementById(
                "chart-host"
            );

        if(!host) return;

        const data =
            this.prepareChart(
                this.currentChart
            );

        /*
            Future Adapter

            ChartAdapter.render(
                host,
                data
            );
        */

        host.innerHTML = `

<div class="chart-placeholder">

<h2>

${data.title}

</h2>

<p>

${data.values.length}

data points

</p>

<pre>

${JSON.stringify(data,null,2)}

</pre>

</div>

`;

    }

    /* ======================================================
       Events
    ====================================================== */

    bindEvents(){

        this.container

        .querySelectorAll("[data-chart]")

        .forEach(button=>{

            button.onclick=()=>{

                this.container

                .querySelectorAll("[data-chart]")

                .forEach(btn=>

                    btn.classList.remove(

                        "active"

                    )

                );

                button.classList.add(

                    "active"

                );

                this.currentChart=

                    button.dataset.chart;

                this.renderChart();

            };

        });

    }

}

export const ChartsPage =
new Charts();
