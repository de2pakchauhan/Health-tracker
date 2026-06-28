// ==========================================
// Health Log V2
// Data Parser
// ==========================================

const Parser = {

    parseFitness(rows = []) {

        return rows
            .map(this.parseFitnessRow)
            .filter(r => r.date);

    },

    parseStrength(rows = []) {

        const sessions = {};

        rows.forEach(r => {

            const date = this.formatDate(r.date);

            const workout = String(r.workout || "");

            const key = `${date}|${workout}`;

            if (!sessions[key]) {

                sessions[key] = {

                    date,

                    workout,

                    exercises: {}

                };

            }

            const exercise = String(r.exercise || "");

            if (!sessions[key].exercises[exercise]) {

                sessions[key].exercises[exercise] = [];

            }

            sessions[key].exercises[exercise].push({

                reps: r.reps
                    ? String(r.reps)
                    : "",

                weight:
                    r.weight &&
                    r.weight !== "BW"
                        ? String(r.weight)
                        : null

            });

        });

        return Object.values(sessions).map(session => ({

            date: session.date,

            workout: session.workout,

            exercises: Object.entries(
                session.exercises
            ).map(([name, sets]) => ({

                name,

                sets

            }))

        }));

    },

    parseFitnessRow(row) {

        return {

            date:
                this.formatDate(row.date),

            weight:
                this.toFloat(row.weight),

            rhr:
                this.toInt(row.rhr),

            sleep:
                this.parseSleep(row.sleep),

            calories: {

                min:
                    this.toInt(row.calmin),

                max:
                    this.toInt(row.calmax)

            },

            protein: {

                min:
                    this.toInt(row.protmin),

                max:
                    this.toInt(row.protmax)

            },

            move:
                this.toInt(row.move),

            burn:
                this.toInt(row.totalburn),

            cardio:
                row.cardio
                    ? String(row.cardio)
                    : null,

            steps:
                this.toInt(row.steps),

            distance:
                this.toFloat(row.distance),

            hrv:
                this.toInt(row.hrv),

            notes:
                row.notes || null,

            run5k:
                row["5k"] || null,

            run10k:
                row["10k"] || null

        };

    },

    parseSleep(value) {

        if (!value) return null;

        return String(value).trim();

    },

    formatDate(value) {

        if (!value) return "";

        const text = String(value);

        if (/^\d{2}-[A-Za-z]{3}/.test(text))
            return text;

        if (/^\d{4}-\d{2}-\d{2}/.test(text)) {

            const d = new Date(text);

            const months = [

                "Jan","Feb","Mar","Apr",

                "May","Jun","Jul","Aug",

                "Sep","Oct","Nov","Dec"

            ];

            return `${String(
                d.getUTCDate()
            ).padStart(2,"0")}-${months[d.getUTCMonth()]}`;

        }

        return text;

    },

    sleepHours(value) {

        if (!value) return null;

        const parts =
            String(value).split(":");

        if (parts.length < 2)
            return Number(value);

        return (

            Number(parts[0]) +

            Number(parts[1]) / 60

        );

    },

    recoveryScore(entry) {

        if (!entry)
            return null;

        let score = 100;

        const sleep =
            this.sleepHours(entry.sleep);

        if (sleep != null) {

            if (sleep < 5)
                score -= 30;

            else if (sleep < 6)
                score -= 15;

            else if (sleep >= 7)
                score += 5;

        }

        if (entry.rhr) {

            if (entry.rhr > 55)
                score -= 20;

            else if (entry.rhr > 50)
                score -= 10;

            else if (entry.rhr < 45)
                score += 5;

        }

        if (entry.hrv) {

            if (entry.hrv < 40)
                score -= 15;

            else if (entry.hrv > 70)
                score += 10;

        }

        return clamp(score, 0, 100);

    },

    toInt(value) {

        return value
            ? parseInt(value)
            : null;

    },

    toFloat(value) {

        return value
            ? parseFloat(value)
            : null;

    }

};
