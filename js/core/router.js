/* ===========================================================
   Health Log v2
   File : js/core/router.js
   Purpose : Application Router
=========================================================== */

class AppRouter {

    constructor() {

        this.routes = new Map();

        this.currentRoute = null;

        this.currentPage = null;

        this.defaultRoute = "dashboard";

    }

    /* ======================================================
       Register Page
    ====================================================== */

    register(name, page) {

        this.routes.set(name, page);

    }

    /* ======================================================
       Start Router
    ====================================================== */

    start() {

        window.addEventListener(

            "hashchange",

            () => this.resolve()

        );

        window.addEventListener(

            "load",

            () => this.resolve()

        );

        this.resolve();

    }

    /* ======================================================
       Resolve Route
    ====================================================== */

    resolve() {

        let route =

            window.location.hash

                .replace("#", "")

                .trim();

        if (!route) {

            route = this.defaultRoute;

        }

        if (!this.routes.has(route)) {

            route = this.defaultRoute;

        }

        this.navigate(route, false);

    }

    /* ======================================================
       Navigate
    ====================================================== */

    navigate(route, updateHash = true) {

        const page = this.routes.get(route);

        if (!page) {

            return;

        }

        if (this.currentPage?.destroy) {

            this.currentPage.destroy();

        }

        this.currentRoute = route;

        this.currentPage = page;

        if (updateHash) {

            if (

                window.location.hash !==

                "#" + route

            ) {

                window.location.hash = route;

            }

        }

        this.highlightNavigation();

        page.render();

    }

    /* ======================================================
       Active Navigation
    ====================================================== */

    highlightNavigation() {

        document

            .querySelectorAll(

                "[data-route]"

            )

            .forEach(button => {

                button.classList.toggle(

                    "active",

                    button.dataset.route ===

                    this.currentRoute

                );

            });

    }

    /* ======================================================
       Current Route
    ====================================================== */

    getCurrentRoute() {

        return this.currentRoute;

    }

    /* ======================================================
       Registered Routes
    ====================================================== */

    getRoutes() {

        return [

            ...this.routes.keys()

        ];

    }

    /* ======================================================
       Exists
    ====================================================== */

    has(route) {

        return this.routes.has(route);

    }

}

export const Router = new AppRouter();
