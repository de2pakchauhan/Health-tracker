/* ===========================================================
   Health Log v2
   File : js/utils/format.js
   Purpose : Formatting Utilities
=========================================================== */

export class Format {

    /* ======================================================
       Number
    ====================================================== */

    static number(value, decimals = 0) {

        if (value === null || value === undefined || isNaN(value)) {

            return "--";

        }

        return Number(value).toLocaleString(undefined, {

            minimumFractionDigits: decimals,

            maximumFractionDigits: decimals

        });

    }

    /* ======================================================
       Weight
    ====================================================== */

    static weight(value) {

        if (value == null) return "--";

        return `${this.number(value,1)} kg`;

    }

    /* ======================================================
       Distance
    ====================================================== */

    static distance(value) {

        if (value == null) return "--";

        return `${this.number(value,2)} km`;

    }

    /* ======================================================
       Calories
    ====================================================== */

    static calories(value) {

        if (value == null) return "--";

        return `${this.number(value)} kcal`;

    }

    /* ======================================================
       Protein
    ====================================================== */

    static protein(value) {

        if (value == null) return "--";

        return `${this.number(value)} g`;

    }

    /* ======================================================
       Carbohydrates
    ====================================================== */

    static carbs(value) {

        if (value == null) return "--";

        return `${this.number(value)} g`;

    }

    /* ======================================================
       Fat
    ====================================================== */

    static fat(value) {

        if (value == null) return "--";

        return `${this.number(value)} g`;

    }

    /* ======================================================
       Fibre
    ====================================================== */

    static fibre(value) {

        if (value == null) return "--";

        return `${this.number(value)} g`;

    }

    /* ======================================================
       Water
    ====================================================== */

    static water(value) {

        if (value == null) return "--";

        return `${this.number(value)} ml`;

    }

    /* ======================================================
       Percentage
    ====================================================== */

    static percent(value, decimals = 1) {

        if (value == null) return "--";

        return `${this.number(value, decimals)}%`;

    }

    /* ======================================================
       Heart Rate
    ====================================================== */

    static heartRate(value) {

        if (value == null) return "--";

        return `${this.number(value)} bpm`;

    }

    /* ======================================================
       HRV
    ====================================================== */

    static hrv(value) {

        if (value == null) return "--";

        return `${this.number(value)} ms`;

    }

    /* ======================================================
       VO2 Max
    ====================================================== */

    static vo2(value) {

        if (value == null) return "--";

        return this.number(value,1);

    }

    /* ======================================================
       Steps
    ====================================================== */

    static steps(value) {

        if (value == null) return "--";

        return this.number(value);

    }

    /* ======================================================
       Minutes
    ====================================================== */

    static minutes(value) {

        if (value == null) return "--";

        return `${this.number(value)} min`;

    }

    /* ======================================================
       Duration (Minutes → HH:MM)
    ====================================================== */

    static duration(minutes) {

        if (minutes == null) return "--";

        const h = Math.floor(minutes / 60);

        const m = minutes % 60;

        if (h === 0) {

            return `${m} min`;

        }

        return `${h}h ${m}m`;

    }

    /* ======================================================
       Running Pace
       Input: minutes per km
    ====================================================== */

    static pace(value) {

        if (value == null) return "--";

        const min = Math.floor(value);

        const sec = Math.round(

            (value - min) * 60

        );

        return `${min}:${String(sec).padStart(2,"0")} /km`;

    }

    /* ======================================================
       Currency
    ====================================================== */

    static currency(value, symbol = "₹") {

        if (value == null) return "--";

        return symbol + this.number(value,2);

    }

    /* ======================================================
       Signed Number
    ====================================================== */

    static signed(value, decimals = 1) {

        if (value == null) return "--";

        const num = Number(value);

        return `${num >= 0 ? "+" : ""}${this.number(num, decimals)}`;

    }

    /* ======================================================
       Boolean
    ====================================================== */

    static yesNo(value) {

        return value ? "Yes" : "No";

    }

    /* ======================================================
       Text
    ====================================================== */

    static text(value, fallback = "--") {

        if (

            value === null ||

            value === undefined ||

            value === ""

        ) {

            return fallback;

        }

        return String(value);

    }

}
