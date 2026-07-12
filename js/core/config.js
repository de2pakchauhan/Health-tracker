/* ==========================================================
   Health Log v2
   File : js/core/config.js
   Purpose : Global Configuration
========================================================== */

export const Config = Object.freeze({

    APP_NAME: "Health Log",

    VERSION: "2.0.0",

    BUILD_DATE: "2026-07",

    DEBUG: true,

    // ----------------------------
    // Google Apps Script
    // ----------------------------

    API_URL: "",          // <-- Paste Apps Script Web App URL

    REQUEST_TIMEOUT: 30000,

    // ----------------------------
    // Storage
    // ----------------------------

    STORAGE_PREFIX: "healthlog",

    CACHE_KEY: "healthlog-cache",

    SETTINGS_KEY: "healthlog-settings",

    LAST_SYNC_KEY: "healthlog-last-sync",

    // ----------------------------
    // Pagination
    // ----------------------------

    PAGE_SIZE: {

        HISTORY: 30,

        NUTRITION: 30,

        STRENGTH: 30,

        RUNS: 20

    },

    // ----------------------------
    // Units
    // ----------------------------

    UNITS: {

        WEIGHT: "kg",

        DISTANCE: "km",

        ENERGY: "kcal",

        PROTEIN: "g",

        WATER: "ml"

    },

    // ----------------------------
    // Default Goals
    // ----------------------------

    GOALS: {

        TARGET_WEIGHT: 70,

        CALORIES: 1600,

        PROTEIN: 110,

        STEPS: 10000,

        MOVE: 700,

        WATER: 3000,

        SLEEP: 8

    },

    // ----------------------------
    // Routes
    // ----------------------------

    ROUTES: {

        HOME: "home",

        NUTRITION: "nutrition",

        STRENGTH: "strength",

        CHARTS: "charts",

        HISTORY: "history",

        ADD: "add"

    },

    // ----------------------------
    // Home Tabs
    // ----------------------------

    HOME_TABS: [

        "overview",

        "weekly",

        "achievements",

        "runs",

        "projection"

    ],

    // ----------------------------
    // Nutrition Tabs
    // ----------------------------

    NUTRITION_TABS: [

        "today",

        "7days",

        "30days",

        "90days",

        "monthly"

    ],

    // ----------------------------
    // Charts
    // ----------------------------

    CHARTS: [

        "weight",

        "calories",

        "protein",

        "steps",

        "move",

        "burn",

        "sleep",

        "rhr",

        "hrv"

    ]

});



/* ==========================================================
   Colors
========================================================== */

export const Colors = Object.freeze({

    PRIMARY: "#818CF8",

    BLUE: "#60A5FA",

    GREEN: "#34D399",

    RED: "#F87171",

    ORANGE: "#FB923C",

    PURPLE: "#A78BFA",

    YELLOW: "#FBBF24",

    TEAL: "#2DD4BF"

});



/* ==========================================================
   Status
========================================================== */

export const Status = Object.freeze({

    OFFLINE: "offline",

    CONNECTING: "connecting",

    ONLINE: "online",

    ERROR: "error"

});
