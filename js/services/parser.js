/* ===========================================================
   Health Log v2
   File : js/services/parser.js
   Purpose : Data Parser
=========================================================== */

export class Parser {

    /* ======================================================
       Parse Complete Dataset
    ====================================================== */

    static parseDays(rows = []) {

        if (!Array.isArray(rows)) {

            return [];

        }

        return rows

            .map(row => this.parseDay(row))

            .filter(Boolean)

            .sort((a, b) =>

                a.date.localeCompare(b.date)

            );

    }

    /* ======================================================
       Parse Single Day
    ====================================================== */

    static parseDay(row = {}) {

        return {

            date: row.date || "",

            fitness: {

                weight: this.number(row.weight),

                bodyFat: this.number(row.bodyFat),

                caloriesBurned: this.number(row.caloriesBurned),

                exerciseCalories: this.number(row.exerciseCalories),

                move: this.number(row.move),

                exerciseMinutes: this.number(row.exerciseMinutes),

                standHours: this.number(row.standHours),

                steps: this.number(row.steps),

                distance: this.number(row.distance),

                sleep: this.number(row.sleep),

                restingHeartRate: this.number(row.restingHeartRate),

                averageHeartRate: this.number(row.averageHeartRate),

                hrv: this.number(row.hrv),

                vo2Max: this.number(row.vo2Max)

            },

            nutrition: {

                calories: this.number(row.calories),

                protein: this.number(row.protein),

                carbs: this.number(row.carbs),

                fat: this.number(row.fat),

                fibre: this.number(row.fibre),

                sugar: this.number(row.sugar),

                water: this.number(row.water)

            },

            strength: this.array(row.strength),

            runs: this.array(row.runs),

            notes: row.notes || ""

        };

    }

    /* ======================================================
       Export Day
    ====================================================== */

    static exportDay(day = {}) {

        return {

            date: day.date,

            weight: day.fitness?.weight,

            bodyFat: day.fitness?.bodyFat,

            caloriesBurned: day.fitness?.caloriesBurned,

            exerciseCalories: day.fitness?.exerciseCalories,

            move: day.fitness?.move,

            exerciseMinutes: day.fitness?.exerciseMinutes,

            standHours: day.fitness?.standHours,

            steps: day.fitness?.steps,

            distance: day.fitness?.distance,

            sleep: day.fitness?.sleep,

            restingHeartRate: day.fitness?.restingHeartRate,

            averageHeartRate: day.fitness?.averageHeartRate,

            hrv: day.fitness?.hrv,

            vo2Max: day.fitness?.vo2Max,

            calories: day.nutrition?.calories,

            protein: day.nutrition?.protein,

            carbs: day.nutrition?.carbs,

            fat: day.nutrition?.fat,

            fibre: day.nutrition?.fibre,

            sugar: day.nutrition?.sugar,

            water: day.nutrition?.water,

            strength: day.strength,

            runs: day.runs,

            notes: day.notes

        };

    }

    /* ======================================================
       Helpers
    ====================================================== */

    static number(value) {

        if (

            value === null ||

            value === undefined ||

            value === ""

        ) {

            return null;

        }

        const num = Number(value);

        return Number.isFinite(num)

            ? num

            : null;

    }

    static array(value) {

        if (!value) return [];

        if (Array.isArray(value)) {

            return value;

        }

        try {

            return JSON.parse(value);

        }

        catch {

            return [];

        }

    }

}
