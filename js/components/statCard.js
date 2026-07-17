/* ===========================================================
   Health Log v2
   File : js/components/statCard.js
   Purpose : Statistic Card Component
=========================================================== */

export class StatCard {

    /**
     * Standard Statistic Card
     */
    static create({

        title = "",

        value = "--",

        unit = "",

        subtitle = "",

        icon = "",

        color = "",

        trend = "",

        className = ""

    } = {}) {

        const trendClass =
            trend > 0
                ? "positive"
                : trend < 0
                ? "negative"
                : "neutral";

        const trendText =
            trend === ""
                ? ""
                : trend > 0
                ? `▲ ${trend}`
                : trend < 0
                ? `▼ ${Math.abs(trend)}`
                : "0";

        return `

<div class="stat-card ${className}">

    <div class="stat-header">

        <div class="stat-title">

            ${icon ? `<span class="stat-icon">${icon}</span>` : ""}

            ${title}

        </div>

        ${trendText
            ? `<div class="stat-trend ${trendClass}">
                    ${trendText}
               </div>`
            : ""
        }

    </div>

    <div class="stat-body">

        <div class="stat-value"
             ${color ? `style="color:${color}"` : ""}>

            ${value}

            ${unit
                ? `<span class="stat-unit">${unit}</span>`
                : ""
            }

        </div>

        ${subtitle
            ? `<div class="stat-subtitle">${subtitle}</div>`
            : ""
        }

    </div>

</div>

`;

    }

    /**
     * Compact Version
     */
    static compact({

        title = "",

        value = "--",

        unit = ""

    } = {}) {

        return `

<div class="stat-card compact">

    <div class="compact-title">

        ${title}

    </div>

    <div class="compact-value">

        ${value}

        ${unit
            ? `<span class="stat-unit">${unit}</span>`
            : ""
        }

    </div>

</div>

`;

    }

    /**
     * Skeleton Loader
     */
    static loading() {

        return `

<div class="stat-card loading">

    <div class="skeleton skeleton-title"></div>

    <div class="skeleton skeleton-value"></div>

    <div class="skeleton skeleton-subtitle"></div>

</div>

`;

    }

}
