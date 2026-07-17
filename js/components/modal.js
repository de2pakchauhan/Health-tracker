/* ===========================================================
   Health Log v2
   File : js/components/modal.js
   Purpose : Reusable Modal Component
=========================================================== */

export class Modal {

    static active = null;

    /* ======================================================
       Open Modal
    ====================================================== */

    static open({

        id = "modal",

        title = "",

        content = "",

        footer = "",

        size = "medium",

        closeOnBackdrop = true,

        closeOnEsc = true

    } = {}) {

        Modal.close();

        const html = `

<div class="modal-overlay"
     id="${id}-overlay">

    <div
        class="modal-window modal-${size}"
        id="${id}-window">

        <div class="modal-header">

            <div class="modal-title">

                ${title}

            </div>

            <button
                class="modal-close"
                data-modal-close>

                ✕

            </button>

        </div>

        <div class="modal-body">

            ${content}

        </div>

        ${
            footer
            ? `
            <div class="modal-footer">

                ${footer}

            </div>
            `
            : ""
        }

    </div>

</div>

`;

        document.body.insertAdjacentHTML(
            "beforeend",
            html
        );

        Modal.active = id;

        const overlay =
            document.getElementById(
                `${id}-overlay`
            );

        const closeButton =
            overlay.querySelector(
                "[data-modal-close]"
            );

        closeButton.addEventListener(
            "click",
            Modal.close
        );

        if (closeOnBackdrop) {

            overlay.addEventListener(
                "click",
                (event) => {

                    if (event.target === overlay) {

                        Modal.close();

                    }

                }
            );

        }

        if (closeOnEsc) {

            Modal.escapeHandler =
                (event) => {

                    if (event.key === "Escape") {

                        Modal.close();

                    }

                };

            document.addEventListener(
                "keydown",
                Modal.escapeHandler
            );

        }

    }

    /* ======================================================
       Close Modal
    ====================================================== */

    static close() {

        if (!Modal.active) return;

        const overlay =
            document.getElementById(
                `${Modal.active}-overlay`
            );

        if (overlay) {

            overlay.remove();

        }

        if (Modal.escapeHandler) {

            document.removeEventListener(
                "keydown",
                Modal.escapeHandler
            );

        }

        Modal.active = null;

    }

    /* ======================================================
       Replace Content
    ====================================================== */

    static setContent(html) {

        if (!Modal.active) return;

        const body = document.querySelector(

            `#${Modal.active}-window .modal-body`

        );

        if (body) {

            body.innerHTML = html;

        }

    }

    /* ======================================================
       Replace Footer
    ====================================================== */

    static setFooter(html) {

        if (!Modal.active) return;

        let footer = document.querySelector(

            `#${Modal.active}-window .modal-footer`

        );

        if (!footer) {

            const windowElement =
                document.getElementById(
                    `${Modal.active}-window`
                );

            footer =
                document.createElement("div");

            footer.className =
                "modal-footer";

            windowElement.appendChild(
                footer
            );

        }

        footer.innerHTML = html;

    }

    /* ======================================================
       Status
    ====================================================== */

    static isOpen() {

        return Modal.active !== null;

    }

}
