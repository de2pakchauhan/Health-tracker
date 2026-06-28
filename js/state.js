// ==========================================
// Health Log V2
// Global Application State
// ==========================================

const State = {

    // -----------------------------
    // Raw Data
    // -----------------------------

    fitness: [],

    strength: [],

    nutrition: [],

    latest: null,

    // -----------------------------
    // UI
    // -----------------------------

    page: "dashboard",

    chartMetric: "weight",

    chartRange: "30",

    loading: true,

    connected: false,

    // -----------------------------
    // User
    // -----------------------------

    targetWeight: Storage.loadTarget(),

    // -----------------------------
    // Recovery
    // -----------------------------

    recoveryScore: null,

    // -----------------------------
    // Statistics
    // -----------------------------

    stats: {

        weightLost: 0,

        avgProtein: 0,

        avgCalories: 0,

        avgSteps: 0,

        avgMove: 0,

        avgHRV: 0,

        avgRHR: 0

    }

};


// ==========================================
// State Helpers
// ==========================================

function setLatestFitness() {

    if (!State.fitness.length) {

        State.latest = null;

        return;

    }

    State.latest =

        State.fitness[State.fitness.length - 1];

}


function setConnected(value) {

    State.connected = value;

}


function setLoading(value) {

    State.loading = value;

}
