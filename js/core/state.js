/* ===========================================================
   Health Log v2
   File : js/core/state.js
   Purpose : Global Application State
=========================================================== */

export const State = {

    app: {

        initialized: false,

        loading: false,

        version: "2.0.0"

    },

    user: {

        signedIn: false,

        name: "",

        email: "",

        picture: ""

    },

    settings: {

        theme: "dark",

        targetWeight: 70,

        targetCalories: 1600,

        targetProtein: 110,

        distanceUnit: "km",

        weightUnit: "kg"

    },

    data: {

        days: []

    },

    ui: {

        page: "home",

        homeTab: "overview",

        chart: "weight",

        historyFilter: "all",

        nutritionRange: 30,

        search: ""

    },

    cache: {

        analytics: null,

        charts: {},

        monthlySummary: {}

    },

    sync: {

        status: "offline",

        lastSync: null,

        pendingUploads: 0

    }

};


/* ===========================================================
   Application
=========================================================== */

function setLoading(value){

    State.app.loading = value;

}

function setInitialized(value){

    State.app.initialized = value;

}


/* ===========================================================
   Data
=========================================================== */

function setDays(days){

    State.data.days = days;

}

function addDay(day){

    State.data.days.push(day);

}

function updateDay(index, day){

    State.data.days[index] = day;

}

function getDays(){

    return State.data.days;

}


/* ===========================================================
   UI
=========================================================== */

function setPage(page){

    State.ui.page = page;

}

function setHomeTab(tab){

    State.ui.homeTab = tab;

}

function setChart(chart){

    State.ui.chart = chart;

}

function setSearch(query){

    State.ui.search = query;

}


/* ===========================================================
   Sync
=========================================================== */

function setSyncStatus(status){

    State.sync.status = status;

}

function setLastSync(date){

    State.sync.lastSync = date;

}


/* ===========================================================
   Cache
=========================================================== */

function clearCache(){

    State.cache.analytics = null;

    State.cache.charts = {};

    State.cache.monthlySummary = {};

}


/* ===========================================================
   Export
=========================================================== */

export const Store = {

    setLoading,

    setInitialized,

    setDays,

    addDay,

    updateDay,

    getDays,

    setPage,

    setHomeTab,

    setChart,

    setSearch,

    setSyncStatus,

    setLastSync,

    clearCache

};
