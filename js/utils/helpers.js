/* ===========================================================
   Health Log v2
   File : js/utils/helpers.js
   Purpose : Generic Helper Utilities
=========================================================== */

export class Helpers {

    /* ======================================================
       Deep Clone
    ====================================================== */

    static clone(value) {

        if (typeof structuredClone === "function") {

            return structuredClone(value);

        }

        return JSON.parse(JSON.stringify(value));

    }

    /* ======================================================
       Unique ID
    ====================================================== */

    static uid(prefix = "id") {

        return `${prefix}-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 8)}`;

    }

    /* ======================================================
       Random Integer
    ====================================================== */

    static random(min, max) {

        return Math.floor(

            Math.random() * (max - min + 1)

        ) + min;

    }

    /* ======================================================
       Clamp
    ====================================================== */

    static clamp(value, min, max) {

        return Math.min(

            Math.max(value, min),

            max

        );

    }

    /* ======================================================
       Debounce
    ====================================================== */

    static debounce(fn, delay = 300) {

        let timer;

        return (...args) => {

            clearTimeout(timer);

            timer = setTimeout(

                () => fn(...args),

                delay

            );

        };

    }

    /* ======================================================
       Throttle
    ====================================================== */

    static throttle(fn, delay = 250) {

        let waiting = false;

        return (...args) => {

            if (waiting) return;

            waiting = true;

            fn(...args);

            setTimeout(() => {

                waiting = false;

            }, delay);

        };

    }

    /* ======================================================
       Safe JSON Parse
    ====================================================== */

    static parseJSON(text, fallback = null) {

        try {

            return JSON.parse(text);

        }

        catch {

            return fallback;

        }

    }

    /* ======================================================
       Download JSON
    ====================================================== */

    static downloadJSON(data, filename = "data.json") {

        const blob = new Blob(

            [

                JSON.stringify(

                    data,

                    null,

                    2

                )

            ],

            {

                type: "application/json"

            }

        );

        this.downloadBlob(blob, filename);

    }

    /* ======================================================
       Download CSV
    ====================================================== */

    static downloadCSV(text, filename = "data.csv") {

        const blob = new Blob(

            [text],

            {

                type: "text/csv"

            }

        );

        this.downloadBlob(blob, filename);

    }

    /* ======================================================
       Download Blob
    ====================================================== */

    static downloadBlob(blob, filename) {

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download = filename;

        link.click();

        URL.revokeObjectURL(url);

    }

    /* ======================================================
       Group By
    ====================================================== */

    static groupBy(array, keyFn) {

        return array.reduce((groups, item) => {

            const key = keyFn(item);

            if (!groups[key]) {

                groups[key] = [];

            }

            groups[key].push(item);

            return groups;

        }, {});

    }

    /* ======================================================
       Sort By
    ====================================================== */

    static sortBy(array, keyFn, ascending = true) {

        return [...array].sort((a, b) => {

            const x = keyFn(a);

            const y = keyFn(b);

            if (x < y) return ascending ? -1 : 1;

            if (x > y) return ascending ? 1 : -1;

            return 0;

        });

    }

    /* ======================================================
       Sum
    ====================================================== */

    static sum(array, selector = x => x) {

        return array.reduce(

            (total, item) =>

                total + (Number(selector(item)) || 0),

            0

        );

    }

    /* ======================================================
       Average
    ====================================================== */

    static average(array, selector = x => x) {

        if (!array.length) {

            return 0;

        }

        return (

            this.sum(array, selector)

            / array.length

        );

    }

    /* ======================================================
       Remove Null/Undefined
    ====================================================== */

    static compact(array) {

        return array.filter(

            value =>

                value !== null &&

                value !== undefined

        );

    }

    /* ======================================================
       Distinct
    ====================================================== */

    static unique(array) {

        return [...new Set(array)];

    }

    /* ======================================================
       Sleep
    ====================================================== */

    static wait(ms) {

        return new Promise(resolve => {

            setTimeout(resolve, ms);

        });

    }

    /* ======================================================
       Empty Check
    ====================================================== */

    static isEmpty(value) {

        return (

            value === null ||

            value === undefined ||

            value === "" ||

            (Array.isArray(value) && value.length === 0)

        );

    }

    /* ======================================================
       Round
    ====================================================== */

    static round(value, decimals = 2) {

        if (!Number.isFinite(value)) {

            return 0;

        }

        const factor = Math.pow(10, decimals);

        return Math.round(value * factor) / factor;

    }

}
