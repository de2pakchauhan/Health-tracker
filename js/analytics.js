// ==========================================
// Health Log V2
// Analytics Engine
// ==========================================

const Analytics = {

    calculate() {

        if (!State.fitness.length) {

            return;

        }

        this.weight();

        this.calories();

        this.protein();

        this.steps();

        this.move();

        this.recovery();

        this.goal();

    },

    //------------------------------------------------

    weight() {

        const weights = State.fitness
            .filter(r => r.weight != null);

        if (!weights.length) return;

        const first = weights[0].weight;

        const latest = weights[weights.length - 1].weight;

        State.stats.currentWeight = latest;

        State.stats.startWeight = first;

        State.stats.weightLost = round(

            first - latest,

            2

        );

    },

    //------------------------------------------------

    calories() {

        const rows = State.fitness.filter(

            r => r.calories.min != null

        );

        if (!rows.length) return;

        State.stats.avgCalories = round(

            average(

                rows.map(r =>

                    (

                        r.calories.min +

                        r.calories.max

                    ) / 2

                )

            ),

            0

        );

    },

    //------------------------------------------------

    protein() {

        const rows = State.fitness.filter(

            r => r.protein.min != null

        );

        if (!rows.length) return;

        State.stats.avgProtein = round(

            average(

                rows.map(r =>

                    (

                        r.protein.min +

                        r.protein.max

                    ) / 2

                )

            ),

            0

        );

    },

    //------------------------------------------------

    steps() {

        const rows = State.fitness.filter(

            r => r.steps != null

        );

        if (!rows.length) return;

        State.stats.avgSteps = round(

            average(

                rows.map(

                    r => r.steps

                )

            ),

            0

        );

    },

    //------------------------------------------------

    move() {

        const rows = State.fitness.filter(

            r => r.move != null

        );

        if (!rows.length) return;

        State.stats.avgMove = round(

            average(

                rows.map(

                    r => r.move

                )

            ),

            0

        );

    },

    //------------------------------------------------

    recovery() {

        if (!State.latest) return;

        State.recoveryScore =

            Parser.recoveryScore(

                State.latest

            );

    },

    //------------------------------------------------

    goal() {

        if (

            !State.latest ||

            !State.latest.weight

        ) {

            State.stats.goalPercent = 0;

            return;

        }

        const total =

            State.stats.startWeight -

            State.targetWeight;

        const completed =

            State.stats.startWeight -

            State.latest.weight;

        State.stats.goalPercent =

            clamp(

                round(

                    completed /

                    total *

                    100

                ),

                0,

                100

            );

    }

};
