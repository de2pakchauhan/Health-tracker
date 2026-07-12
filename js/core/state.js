/* ============================================================
   Health Log v2
   Global Application State

   Every page reads from here.

   No page should keep its own copy of data.

============================================================ */

export const State = {

    version: "2.0.0",

    initialized: false,

    loading: false,

    syncing: false,

    user: {

        signedIn: false,

        name: "",

        email: "",

        image: ""

    },

    settings: {

        weightUnit: "kg",

        distanceUnit: "km",

        energyUnit: "kcal",

        dateFormat: "dd-MMM-yyyy",

        theme: "dark",

        targetWeight: 70,

        targetCalories: 1600,

        targetProtein: 110,

        firstDayOfWeek: 1

    },

    fitness: [],

    nutrition: [],

    strength: [],

    runs: [],

    achievements: [],

    history: [],

    charts: {},

    analytics: {},

    search: {

        query: "",

        results: []

    },

    filters: {

        history: "all",

        nutrition: "30",

        charts: "90",

        strength: "all"

    },

    sync: {

        lastSync: null,

        status: "offline",

        pendingUploads: 0

    }

};


/* ============================================================
   State Helpers
============================================================ */

export function setLoading(value){

    State.loading = value;

}

export function setSyncing(value){

    State.syncing = value;

}

export function isLoaded(){

    return State.initialized;

}

export function markInitialized(){

    State.initialized = true;

}


/* ============================================================
   User
============================================================ */

export function setUser(user){

    State.user = {

        ...State.user,

        ...user

    };

}


/* ============================================================
   Fitness
============================================================ */

export function setFitness(data){

    State.fitness = [...data];

}

export function addFitness(entry){

    State.fitness.push(entry);

}


/* ============================================================
   Nutrition
============================================================ */

export function setNutrition(data){

    State.nutrition = [...data];

}

export function addNutrition(entry){

    State.nutrition.push(entry);

}


/* ============================================================
   Strength
============================================================ */

export function setStrength(data){

    State.strength = [...data];

}

export function addStrength(entry){

    State.strength.push(entry);

}


/* ============================================================
   Runs
============================================================ */

export function setRuns(data){

    State.runs = [...data];

}

export function addRun(run){

    State.runs.push(run);

}


/* ============================================================
   History
============================================================ */

export function setHistory(history){

    State.history = [...history];

}


/* ============================================================
   Analytics
============================================================ */

export function setAnalytics(analytics){

    State.analytics = analytics;

}


/* ============================================================
   Search
============================================================ */

export function setSearchQuery(query){

    State.search.query = query;

}

export function setSearchResults(results){

    State.search.results = results;

}


/* ============================================================
   Charts
============================================================ */

export function updateChart(name,data){

    State.charts[name]=data;

}


/* ============================================================
   Settings
============================================================ */

export function updateSettings(values){

    State.settings = {

        ...State.settings,

        ...values

    };

}


/* ============================================================
   Reset
============================================================ */

export function clearState(){

    State.fitness=[];

    State.nutrition=[];

    State.strength=[];

    State.runs=[];

    State.history=[];

    State.analytics={};

    State.charts={};

}


/* ============================================================
   Snapshot

   Useful for debugging
============================================================ */

export function getSnapshot(){

    return structuredClone(State);

}
