/* ===========================================================
   Health Log v2
   File : js/utils/dates.js
   Purpose : Date Utility Functions
=========================================================== */

export class Dates {

    /* ======================================================
       Today
    ====================================================== */

    static today() {

        return new Date()

            .toISOString()

            .split("T")[0];

    }

    /* ======================================================
       Parse
    ====================================================== */

    static parse(date) {

        return new Date(date);

    }

    /* ======================================================
       ISO Format
    ====================================================== */

    static iso(date) {

        return new Date(date)

            .toISOString()

            .split("T")[0];

    }

    /* ======================================================
       Display Format
    ====================================================== */

    static display(date) {

        if (!date) return "";

        return new Intl.DateTimeFormat(

            undefined,

            {

                day: "2-digit",

                month: "short",

                year: "numeric"

            }

        ).format(this.parse(date));

    }

    /* ======================================================
       Short Format
    ====================================================== */

    static short(date) {

        if (!date) return "";

        return new Intl.DateTimeFormat(

            undefined,

            {

                day: "2-digit",

                month: "short"

            }

        ).format(this.parse(date));

    }

    /* ======================================================
       Month Name
    ====================================================== */

    static monthName(date) {

        return new Intl.DateTimeFormat(

            undefined,

            {

                month: "long",

                year: "numeric"

            }

        ).format(this.parse(date));

    }

    /* ======================================================
       Weekday
    ====================================================== */

    static weekday(date) {

        return new Intl.DateTimeFormat(

            undefined,

            {

                weekday: "long"

            }

        ).format(this.parse(date));

    }

    /* ======================================================
       Difference
    ====================================================== */

    static diffDays(date1, date2) {

        const oneDay =

            24 * 60 * 60 * 1000;

        const diff =

            this.parse(date2) -

            this.parse(date1);

        return Math.round(

            diff / oneDay

        );

    }

    /* ======================================================
       Add Days
    ====================================================== */

    static addDays(date, days) {

        const d = this.parse(date);

        d.setDate(

            d.getDate() + days

        );

        return this.iso(d);

    }

    /* ======================================================
       Month Key
    ====================================================== */

    static monthKey(date) {

        return date.substring(0, 7);

    }

    /* ======================================================
       Year
    ====================================================== */

    static year(date) {

        return Number(

            date.substring(0, 4)

        );

    }

    /* ======================================================
       Month
    ====================================================== */

    static month(date) {

        return Number(

            date.substring(5, 7)

        );

    }

    /* ======================================================
       Is Today
    ====================================================== */

    static isToday(date) {

        return date === this.today();

    }

    /* ======================================================
       Compare
    ====================================================== */

    static compare(a, b) {

        return a.localeCompare(b);

    }

    /* ======================================================
       Sort Ascending
    ====================================================== */

    static sortAscending(days) {

        return [...days].sort(

            (a, b) =>

                this.compare(

                    a.date,

                    b.date

                )

        );

    }

    /* ======================================================
       Sort Descending
    ====================================================== */

    static sortDescending(days) {

        return [...days].sort(

            (a, b) =>

                this.compare(

                    b.date,

                    a.date

                )

        );

    }

    /* ======================================================
       Last N Days
    ====================================================== */

    static lastDays(days, count) {

        return [...days].slice(-count);

    }

    /* ======================================================
       Current Month
    ====================================================== */

    static currentMonth() {

        return this.today()

            .substring(0, 7);

    }

    /* ======================================================
       Current Year
    ====================================================== */

    static currentYear() {

        return Number(

            this.today()

                .substring(0, 4)

        );

    }

    /* ======================================================
       Month Groups
    ====================================================== */

    static groupByMonth(days = []) {

        const groups = {};

        days.forEach(day => {

            const key =

                this.monthKey(

                    day.date

                );

            if (!groups[key]) {

                groups[key] = [];

            }

            groups[key].push(day);

        });

        return groups;

    }

}
