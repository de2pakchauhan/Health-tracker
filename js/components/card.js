/* ===========================================================
   Health Log v2
   File : js/components/card.js
   Purpose : Reusable Card Component
=========================================================== */

export class Card {

    /**
     * Standard Card
     */
    static create({

        title = "",

        subtitle = "",

        body = "",

        footer = "",

        className = ""

    } = {}) {

        return `

<div class="card ${className}">

    ${title || subtitle ? `
    <div class="card-header">

        ${title
            ? `<h3 class="card-title">${title}</h3>`
            : ""
        }

        ${subtitle
            ? `<div class="card-subtitle">${subtitle}</div>`
            : ""
        }

    </div>
    ` : ""}

    <div class="card-body">

        ${body}

    </div>

    ${footer ? `
    <div class="card-footer">

        ${footer}

    </div>
    ` : ""}

</div>

`;

    }

    /**
     * Simple Card
     */
    static simple(content = "", className = "") {

        return `

<div class="card ${className}">

    ${content}

</div>

`;

    }

    /**
     * Empty State Card
     */
    static empty(

        message = "No data available."

    ) {

        return `

<div class="card empty-card">

    <div class="empty-icon">

        📄

    </div>

    <div class="empty-message">

        ${message}

    </div>

</div>

`;

    }

    /**
     * Loading Card
     */
    static loading() {

        return `

<div class="card loading-card">

    <div class="loader"></div>

    <div class="loading-text">

        Loading...

    </div>

</div>

`;

    }

}
