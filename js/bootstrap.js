// ==========================================
// Health Log V2
// Bootstrap
// Bundle 1
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
            // Load Data
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
            // Latest Record
            // ----------------------------

            setLatestFitness();

            // ----------------------------
            // Calculate Analytics
            // ----------------------------

            Analytics.calculate();

            // ----------------------------
            // Connected
            // ----------------------------

            setConnected(true);

            setLoading(false);

            Loader.hide();

            // ----------------------------
            // Render Dashboard
            // ----------------------------

            UI.init();

            UI.renderDashboard();

            console.log("Health Log Ready");

        }
        catch (error) {

            console.error(error);

            setConnected(false);

            setLoading(false);

            Loader.hide();

            alert(
                "Unable to connect to Google Sheets."
            );

        }

    }

};

// ==========================================
// Start
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => Bootstrap.init()
);
