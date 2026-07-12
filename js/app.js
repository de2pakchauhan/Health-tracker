/* ===========================================================
   Health Log v2
   File : js/app.js
   Purpose : Application Bootstrap
   =========================================================== */

import { Config } from "./core/config.js";
import { State } from "./core/state.js";
import { Router } from "./core/router.js";
import { Storage } from "./core/storage.js";
import { Sync } from "./core/sync.js";

import { DashboardPage } from "./pages/dashboard.js";
import { NutritionPage } from "./pages/nutrition.js";
import { StrengthPage } from "./pages/strength.js";
import { ChartsPage } from "./pages/charts.js";
import { HistoryPage } from "./pages/history.js";
import { AddPage } from "./pages/add.js";

const App = {

    async init() {

        console.log(
            `%c${Config.APP_NAME} v${Config.VERSION}`,
            "color:#818CF8;font-weight:bold;font-size:14px;"
        );

        try {

            State.setLoading(true);

            await Storage.init();

            await Sync.init();

            Router.init();

            DashboardPage.init();
            NutritionPage.init();
            StrengthPage.init();
            ChartsPage.init();
            HistoryPage.init();
            AddPage.init();

            Router.go("home");

            State.setLoading(false);

            console.log("Application Ready");

        }
        catch (error) {

            console.error(error);

            State.setLoading(false);

            alert("Unable to start application.");

        }

    }

};

window.HealthLog = App;

document.addEventListener("DOMContentLoaded", () => {

    App.init();

});
