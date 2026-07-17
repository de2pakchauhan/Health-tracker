/* ===========================================================
   Health Log v2
   File : js/pages/add.js
   Purpose : Add / Edit Daily Entry
=========================================================== */

import { Router } from "../core/router.js";
import { State } from "../core/state.js";
import { Storage } from "../core/storage.js";

import { Card } from "../components/card.js";
import { Modal } from "../components/modal.js";

import { Helpers } from "../utils/helpers.js";

class AddPage {

    constructor() {

        this.container = null;

        this.currentDate = this.today();

        this.draft = {};

    }

    /* ======================================================
       Initialize
    ====================================================== */

    init() {

        this.container =
            document.getElementById("page-content");

        Router.register("add", this);

    }

    destroy(){}

    /* ======================================================
       Render
    ====================================================== */

    render(){

        if(!this.container) return;

        this.loadDraft();

        this.container.innerHTML =
            this.template();

        this.bindEvents();

    }

    /* ======================================================
       Template
    ====================================================== */

    template(){

        return `

<section class="add-page">

<header class="page-header">

<h1>Add Daily Entry</h1>

</header>

${Card.create({

title:"General",

body:`

<label>Date</label>

<input
id="entry-date"
type="date"
value="${this.currentDate}">

<label>Weight (kg)</label>

<input
id="weight"
type="number"
step="0.1">

<label>Steps</label>

<input
id="steps"
type="number">

<label>Sleep (hrs)</label>

<input
id="sleep"
type="number"
step="0.1">

<label>Resting HR</label>

<input
id="rhr"
type="number">

<label>HRV</label>

<input
id="hrv"
type="number">

`

})}

${Card.create({

title:"Nutrition",

body:`

<label>Calories</label>

<input
id="calories"
type="number">

<label>Protein (g)</label>

<input
id="protein"
type="number">

<label>Carbs (g)</label>

<input
id="carbs"
type="number">

<label>Fat (g)</label>

<input
id="fat"
type="number">

`

})}

${Card.create({

title:"Strength",

body:`

<textarea

id="strength"

rows="8"

placeholder="Exercise, Sets, Reps, Weight"

></textarea>

`

})}

${Card.create({

title:"Running",

body:`

<label>Distance (km)</label>

<input
id="distance"
type="number"
step="0.01">

<label>Duration (minutes)</label>

<input
id="duration"
type="number">

`

})}

${Card.create({

title:"Notes",

body:`

<textarea

id="notes"

rows="5"

placeholder="Daily Notes"

></textarea>

`

})}

<div class="page-actions">

<button id="save-entry">

Save Entry

</button>

<button id="save-draft">

Save Draft

</button>

<button id="clear-form">

Clear

</button>

</div>

</section>

`;

    }

    /* ======================================================
       Collect Form
    ====================================================== */

    collect(){

        return {

            date:
                this.value("entry-date"),

            fitness:{

                weight:
                    Number(this.value("weight"))||0,

                steps:
                    Number(this.value("steps"))||0,

                sleep:
                    Number(this.value("sleep"))||0,

                restingHeartRate:
                    Number(this.value("rhr"))||0,

                hrv:
                    Number(this.value("hrv"))||0

            },

            nutrition:{

                calories:
                    Number(this.value("calories"))||0,

                protein:
                    Number(this.value("protein"))||0,

                carbs:
                    Number(this.value("carbs"))||0,

                fat:
                    Number(this.value("fat"))||0

            },

            strength:

                this.parseStrength(

                    this.value("strength")

                ),

            runs:[{

                distance:
                    Number(this.value("distance"))||0,

                duration:
                    Number(this.value("duration"))||0

            }],

            notes:

                this.value("notes")

        };

    }

    /* ======================================================
       Parse Strength
    ====================================================== */

    parseStrength(text){

        if(!text.trim()) return [];

        return text

            .split("\n")

            .map(line=>{

                const parts=line.split(",");

                return{

                    name:parts[0]?.trim(),

                    sets:Number(parts[1])||0,

                    reps:Number(parts[2])||0,

                    weight:Number(parts[3])||0

                };

            });

    }

    /* ======================================================
       Save Entry
    ====================================================== */

    save(){

        const entry =
            this.collect();

        State.data.days.push(entry);

        Storage.save(State.data);

        localStorage.removeItem(

            "healthlog-draft"

        );

        Modal.alert(

            "Entry Saved"

        );

    }

    /* ======================================================
       Draft
    ====================================================== */

    saveDraft(){

        localStorage.setItem(

            "healthlog-draft",

            JSON.stringify(

                this.collect()

            )

        );

        Modal.alert(

            "Draft Saved"

        );

    }

    loadDraft(){

        const data=

            localStorage.getItem(

                "healthlog-draft"

            );

        if(!data) return;

        this.draft=

            Helpers.parseJSON(

                data,

                {}

            );

    }

    /* ======================================================
       Helpers
    ====================================================== */

    value(id){

        return document

            .getElementById(id)

            .value;

    }

    today(){

        return new Date()

            .toISOString()

            .substring(0,10);

    }

    clear(){

        this.render();

    }

    /* ======================================================
       Events
    ====================================================== */

    bindEvents(){

        document

            .getElementById("save-entry")

            .onclick=

            ()=>this.save();

        document

            .getElementById("save-draft")

            .onclick=

            ()=>this.saveDraft();

        document

            .getElementById("clear-form")

            .onclick=

            ()=>this.clear();

    }

}

export const AddEntryPage =
new AddPage();
