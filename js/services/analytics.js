/* ===========================================================
   Health Log v2
   File : js/services/analytics.js
   Purpose : Analytics Engine
=========================================================== */

export class Analytics {

    /* ======================================================
       Generic
    ====================================================== */

    static latest(days = []) {

        return days.length
            ? days[days.length - 1]
            : null;

    }

    static first(days = []) {

        return days.length
            ? days[0]
            : null;

    }

    static count(days = []) {

        return days.length;

    }

    /* ======================================================
       Latest Metrics
    ====================================================== */

    static latestWeight(days = []) {

        const day = this.latest(days);

        return day?.fitness?.weight ?? null;

    }

    static latestCalories(days = []) {

        const day = this.latest(days);

        return day?.nutrition?.calories ?? 0;

    }

    static latestProtein(days = []) {

        const day = this.latest(days);

        return day?.nutrition?.protein ?? 0;

    }

    static latestSteps(days = []) {

        const day = this.latest(days);

        return day?.fitness?.steps ?? 0;

    }

    static latestDistance(days = []) {

        const day = this.latest(days);

        return day?.fitness?.distance ?? 0;

    }

    static latestSleep(days = []) {

        const day = this.latest(days);

        return day?.fitness?.sleep ?? 0;

    }

    static latestMove(days = []) {

        const day = this.latest(days);

        return day?.fitness?.move ?? 0;

    }

    static latestRHR(days = []) {

        const day = this.latest(days);

        return day?.fitness?.rhr ?? null;

    }

    static latestHRV(days = []) {

        const day = this.latest(days);

        return day?.fitness?.hrv ?? null;

    }

    /* ======================================================
       Average
    ====================================================== */

    static average(days = [], getter) {

        const values = days

            .map(getter)

            .filter(v => Number.isFinite(v));

        if (!values.length) return 0;

        return values.reduce(

            (a, b) => a + b,

            0

        ) / values.length;

    }

    /* ======================================================
       Trend
    ====================================================== */

    static trend(current, previous) {

        if (

            current == null ||

            previous == null

        ) {

            return null;

        }

        return current - previous;

    }

    /* ======================================================
       Best Weight
    ====================================================== */

    static lowestWeight(days = []) {

        const values = days

            .map(

                d => d.fitness?.weight

            )

            .filter(Number.isFinite);

        if (!values.length) return null;

        return Math.min(...values);

    }

    /* ======================================================
       Highest Protein
    ====================================================== */

    static highestProtein(days = []) {

        const values = days

            .map(

                d => d.nutrition?.protein

            )

            .filter(Number.isFinite);

        if (!values.length) return null;

        return Math.max(...values);

    }

    /* ======================================================
       Calories Average
    ====================================================== */

    static averageCalories(days = []) {

        return this.average(

            days,

            d => d.nutrition?.calories

        );

    }

    /* ======================================================
       Protein Average
    ====================================================== */

    static averageProtein(days = []) {

        return this.average(

            days,

            d => d.nutrition?.protein

        );

    }

    /* ======================================================
       Steps Average
    ====================================================== */

    static averageSteps(days = []) {

        return this.average(

            days,

            d => d.fitness?.steps

        );

    }

    /* ======================================================
       Distance Average
    ====================================================== */

    static averageDistance(days = []) {

        return this.average(

            days,

            d => d.fitness?.distance

        );

    }

    /* ======================================================
       Weight Lost
    ====================================================== */

    static weightLost(days = []) {

        if (days.length < 2)

            return 0;

        const first =

            this.first(days)

            ?.fitness?.weight;

        const latest =

            this.latest(days)

            ?.fitness?.weight;

        if (

            first == null ||

            latest == null

        ) {

            return 0;

        }

        return first - latest;

    }

    /* ======================================================
       Running
    ====================================================== */

    static totalRuns(days = []) {

        let count = 0;

        days.forEach(day => {

            count +=

                day.runs?.length || 0;

        });

        return count;

    }

    static longestRun(days = []) {

        let longest = 0;

        days.forEach(day => {

            (day.runs || []).forEach(run => {

                longest = Math.max(

                    longest,

                    run.distance || 0

                );

            });

        });

        return longest;

    }

    static bestRunPace(days = []) {

        let best = null;

        days.forEach(day => {

            (day.runs || []).forEach(run => {

                if (

                    run.pace == null

                ) return;

                if (

                    best == null ||

                    run.pace < best

                ) {

                    best = run.pace;

                }

            });

        });

        return best;

    }

    /* ======================================================
       Monthly Summary
    ====================================================== */

    static monthlySummary(days = []) {

        const map = {};

        days.forEach(day => {

            const month =

                day.date.substring(0, 7);

            if (!map[month]) {

                map[month] = {

                    entries: 0,

                    calories: 0,

                    protein: 0

                };

            }

            map[month].entries++;

            map[month].calories +=

                day.nutrition?.calories || 0;

            map[month].protein +=

                day.nutrition?.protein || 0;

        });

        return map;

    }

}
