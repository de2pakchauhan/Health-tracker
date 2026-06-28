// ==========================================
// Health Log V2
// Bootstrap
// ==========================================

const Bootstrap = {

    async init() {

        try {

            Loader.show();

            console.log(
                `${CONFIG.APP_NAME} ${CONFIG.VERSION}`
            );

            setLoading(true);

            // ----------------------------
            // Load Google Sheets
            // ----------------------------

            const [

                fitnessRows,

                strengthRows

            ] = await Promise.all([

                Api.loadFitness(),

                Api.loadStrength()

            ]);

            // ----------------------------
            // Parse
            // ----------------------------

            State.fitness =
                Parser.parseFitness(fitnessRows);

            State.strength =
                Parser.parseStrength(strengthRows);

            // ----------------------------
            // Latest Entry
            // ----------------------------

            setLatestFitness();

            // ----------------------------
            // Connection
            // ----------------------------

            setConnected(true);

            setLoading(false);

            Loader.hide();

            // ----------------------------
            // Calculate Stats
            // ----------------------------

            Analytics.calculate();

            // ----------------------------
            // Render
            // ----------------------------

            UI.renderDashboard();

            UI.renderCharts();

            UI.renderNutrition();

            UI.renderStrength();

            UI.renderHistory();

            console.log(
                "Health Log Ready"
            );

        }

        catch(error){

            console.error(error);

            setConnected(false);

            Loader.hide();

            alert(

                "Unable to connect to Google Sheets."

            );

        }

    }

};


// ==========================================
// Start App
// ==========================================

document.addEventListener(

    "DOMContentLoaded",

    Bootstrap.init

);
