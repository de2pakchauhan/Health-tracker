/* ===========================================================
   Health Log v2
   File : js/core/router.js
   Purpose : Navigation Manager
=========================================================== */

import { Store } from "./state.js";

class RouterClass {

    constructor() {

        this.routes = new Map();

        this.currentPage = null;

    }

    register(name, page) {

        this.routes.set(name, page);

    }

    init() {

        window.addEventListener("popstate", (event) => {

            const page = event.state?.page || "home";

            this.go(page, false);

        });

    }

    go(pageName, pushHistory = true) {

        const page = this.routes.get(pageName);

        if (!page) {

            console.error(`Route '${pageName}' not found`);

            return;

        }

        if (this.currentPage?.destroy) {

            this.currentPage.destroy();

        }

        Store.setPage(pageName);

        this.currentPage = page;

        if (this.currentPage.render) {

            this.currentPage.render();

        }

        this.updateNavigation(pageName);

        if (pushHistory) {

            history.pushState(
                { page: pageName },
                "",
                "#" + pageName
            );

        }

    }

    updateNavigation(activePage) {

        document
            .querySelectorAll("[data-page]")
            .forEach(button => {

                button.classList.toggle(
                    "active",
                    button.dataset.page === activePage
                );

            });

    }

    current() {

        return this.currentPage;

    }

    listRoutes() {

        return [...this.routes.keys()];

    }

}

export const Router = new RouterClass();
