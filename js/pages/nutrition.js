/* ===========================================================
   Health Log v2
   File : js/pages/nutrition.js
   Purpose : Nutrition Page
=========================================================== */

import { Router } from "../core/router.js";
import { State } from "../core/state.js";

import { Analytics } from "../services/analytics.js";
import { Search } from "../services/search.js";

import { Card } from "../components/card.js";
import { StatCard } from "../components/statCard.js";
import { ProgressBar } from "../components/progressBar.js";

class Nutrition {

    constructor() {

        this.container = null;

        this.currentTab = "today";

    }

    init() {

        this.container =
            document.getElementById("page-content");

        Router.register("nutrition", this);

    }

    destroy() {}

    render() {

        if (!this.container) return;

        this.container.innerHTML = this.template();

        this.bindEvents();

    }

    template() {

        return `

<section class="nutrition-page">

<header class="page-header">

<h1>Nutrition</h1>

</header>

<div class="page-tabs">

<button class="page-tab active"
data-tab="today">
Today
</button>

<button class="page-tab"
data-tab="7days">
7 Days
</button>

<button class="page-tab"
data-tab="30days">
30 Days
</button>

<button class="page-tab"
data-tab="90days">
90 Days
</button>

<button class="page-tab"
data-tab="monthly">
Monthly
</button>

</div>

<div class="nutrition-search">

<input

id="nutrition-search"

type="text"

placeholder="Search food, notes..."

>

</div>

<div id="nutrition-content">

${this.renderToday()}

</div>

</section>

`;

    }

    renderToday() {

        const days = State.data.days;

        const calories =
            Analytics.latestCalories(days);

        const protein =
            Analytics.latestProtein(days);

        return `

<div class="stats-grid">

${StatCard.create({

title:"Calories",

value:calories,

unit:"kcal",

icon:"🔥"

})}

${StatCard.create({

title:"Protein",

value:protein,

unit:"g",

icon:"🥚"

})}

</div>

${ProgressBar.create({

title:"Calories",

value:calories,

target:State.settings.targetCalories,

unit:" kcal",

color:"orange"

})}

${ProgressBar.create({

title:"Protein",

value:protein,

target:State.settings.targetProtein,

unit:" g",

color:"green"

})}

${Card.create({

title:"Today's Meals",

body:`

<div id="meal-list">

Meals will appear here.

</div>

`

})}

`;

    }

    renderRange(days) {

        return Card.create({

title:`Last ${days} Days`,

body:`

Summary will be rendered
by analytics.

`

});

    }

    renderMonthly() {

        return Card.create({

title:"Monthly Summary",

body:`

Monthly nutrition
summary here.

`

});

    }

    bindEvents() {

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

                    this.currentTab=

                        button.dataset.tab;

                    this.refresh();

                };

            });

        const search=

            document.getElementById(

                "nutrition-search"

            );

        search.addEventListener(

            "input",

            ()=>{

                this.search(

                    search.value

                );

            }

        );

    }

    refresh(){

        const content=

            document.getElementById(

                "nutrition-content"

            );

        switch(this.currentTab){

            case"today":

                content.innerHTML=

                    this.renderToday();

                break;

            case"7days":

                content.innerHTML=

                    this.renderRange(7);

                break;

            case"30days":

                content.innerHTML=

                    this.renderRange(30);

                break;

            case"90days":

                content.innerHTML=

                    this.renderRange(90);

                break;

            case"monthly":

                content.innerHTML=

                    this.renderMonthly();

                break;

        }

    }

    search(query){

        const result=

            Search.search(

                State.data.days,

                query

            );

        console.log(

            "Nutrition Search",

            result

        );

    }

}

export const NutritionPage=

new Nutrition();
