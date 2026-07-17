/* ===========================================================
   Health Log v2
   File : js/services/search.js
   Purpose : Search & Filter Engine
=========================================================== */

export class Search {

    /* ======================================================
       Full Search
    ====================================================== */

    static search(days = [], query = "") {

        if (!query) {

            return [...days];

        }

        const keyword = query
            .toLowerCase()
            .trim();

        return days.filter(day =>
            this.matchesDay(day, keyword)
        );

    }

    /* ======================================================
       Search One Day
    ====================================================== */

    static matchesDay(day, keyword) {

        if (!day) return false;

        if (
            this.contains(day.date, keyword) ||
            this.contains(day.notes, keyword)
        ) {

            return true;

        }

        if (
            this.searchNutrition(
                day.nutrition,
                keyword
            )
        ) {

            return true;

        }

        if (
            this.searchStrength(
                day.strength,
                keyword
            )
        ) {

            return true;

        }

        if (
            this.searchRuns(
                day.runs,
                keyword
            )
        ) {

            return true;

        }

        return false;

    }

    /* ======================================================
       Nutrition
    ====================================================== */

    static searchNutrition(
        nutrition = {},
        keyword
    ) {

        return Object.values(nutrition)

            .some(value =>

                this.contains(value, keyword)

            );

    }

    /* ======================================================
       Strength
    ====================================================== */

    static searchStrength(
        workouts = [],
        keyword
    ) {

        return workouts.some(workout =>

            Object.values(workout)

                .some(value =>

                    this.contains(
                        value,
                        keyword
                    )

                )

        );

    }

    /* ======================================================
       Runs
    ====================================================== */

    static searchRuns(
        runs = [],
        keyword
    ) {

        return runs.some(run =>

            Object.values(run)

                .some(value =>

                    this.contains(
                        value,
                        keyword
                    )

                )

        );

    }

    /* ======================================================
       Date Range
    ====================================================== */

    static between(

        days = [],

        from,

        to

    ) {

        return days.filter(day =>

            day.date >= from &&
            day.date <= to

        );

    }

    /* ======================================================
       Month
    ====================================================== */

    static month(

        days = [],

        month

    ) {

        return days.filter(day =>

            day.date.startsWith(month)

        );

    }

    /* ======================================================
       Year
    ====================================================== */

    static year(

        days = [],

        year

    ) {

        return days.filter(day =>

            day.date.startsWith(
                String(year)
            )

        );

    }

    /* ======================================================
       Running Days
    ====================================================== */

    static runningDays(days = []) {

        return days.filter(day =>

            day.runs &&
            day.runs.length > 0

        );

    }

    /* ======================================================
       Strength Days
    ====================================================== */

    static strengthDays(days = []) {

        return days.filter(day =>

            day.strength &&
            day.strength.length > 0

        );

    }

    /* ======================================================
       Notes
    ====================================================== */

    static notes(days = []) {

        return days.filter(day =>

            day.notes &&
            day.notes.trim() !== ""

        );

    }

    /* ======================================================
       Helper
    ====================================================== */

    static contains(

        value,

        keyword

    ) {

        if (

            value === null ||

            value === undefined

        ) {

            return false;

        }

        return String(value)

            .toLowerCase()

            .includes(keyword);

    }

}
