/* ===========================================================
   Health Log v2
   File : js/components/accordion.js
   Purpose : Reusable Accordion Component
=========================================================== */

export class Accordion {

    static states = new Map();

    /* ======================================================
       Create Accordion
    ====================================================== */

    static create({

        id,

        title = "",

        subtitle = "",

        content = "",

        expanded = false,

        className = ""

    } = {}) {

        if (!id) {

            throw new Error("Accordion id is required.");

        }

        if (!Accordion.states.has(id)) {

            Accordion.states.set(id, expanded);

        }

        const open = Accordion.states.get(id);

        return `

<div class="accordion ${className}"
     data-accordion="${id}">

    <button
        class="accordion-header"
        data-accordion-toggle="${id}">

        <div class="accordion-left">

            <div class="accordion-title">

                ${title}

            </div>

            ${
                subtitle
                ? `
                <div class="accordion-subtitle">

                    ${subtitle}

                </div>
                `
                : ""
            }

        </div>

        <div class="accordion-icon">

            ${open ? "−" : "+"}

        </div>

    </button>

    <div
        class="accordion-content ${open ? "open" : ""}"
        data-accordion-content="${id}">

        ${content}

    </div>

</div>

`;

    }

    /* ======================================================
       Bind Events
    ====================================================== */

    static bind(container = document) {

        container

            .querySelectorAll("[data-accordion-toggle]")

            .forEach(button => {

                if (button.dataset.bound) return;

                button.dataset.bound = "true";

                button.addEventListener("click", () => {

                    const id =
                        button.dataset.accordionToggle;

                    Accordion.toggle(id);

                });

            });

    }

    /* ======================================================
       Toggle
    ====================================================== */

    static toggle(id) {

        const content = document.querySelector(

            `[data-accordion-content="${id}"]`

        );

        const icon = document.querySelector(

            `[data-accordion-toggle="${id}"] .accordion-icon`

        );

        if (!content) return;

        const open =
            content.classList.toggle("open");

        Accordion.states.set(id, open);

        if (icon) {

            icon.textContent =
                open ? "−" : "+";

        }

    }

    /* ======================================================
       Expand
    ====================================================== */

    static open(id) {

        const content = document.querySelector(

            `[data-accordion-content="${id}"]`

        );

        const icon = document.querySelector(

            `[data-accordion-toggle="${id}"] .accordion-icon`

        );

        if (!content) return;

        content.classList.add("open");

        Accordion.states.set(id, true);

        if (icon) {

            icon.textContent = "−";

        }

    }

    /* ======================================================
       Collapse
    ====================================================== */

    static close(id) {

        const content = document.querySelector(

            `[data-accordion-content="${id}"]`

        );

        const icon = document.querySelector(

            `[data-accordion-toggle="${id}"] .accordion-icon`

        );

        if (!content) return;

        content.classList.remove("open");

        Accordion.states.set(id, false);

        if (icon) {

            icon.textContent = "+";

        }

    }

    /* ======================================================
       Helpers
    ====================================================== */

    static isOpen(id) {

        return Accordion.states.get(id) || false;

    }

    static closeAll(container = document) {

        container

            .querySelectorAll(".accordion-content.open")

            .forEach(content => {

                content.classList.remove("open");

            });

        container

            .querySelectorAll(".accordion-icon")

            .forEach(icon => {

                icon.textContent = "+";

            });

        Accordion.states.clear();

    }

}
