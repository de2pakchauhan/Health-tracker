/* ===========================================================
   Health Log v2
   File : js/components/progressBar.js
   Purpose : Reusable Progress Bar Component
=========================================================== */

export class ProgressBar {

    /**
     * Standard Progress Bar
     */
    static create({

        value = 0,

        target = 100,

        title = "",

        unit = "",

        color = "primary",

        showPercent = true,

        showNumbers = true,

        className = ""

    } = {}) {

        const safeTarget = target <= 0 ? 1 : target;

        const percent =
            Math.round((value / safeTarget) * 100);

        const width =
            Math.min(percent, 100);

        const extra =
            Math.max(percent - 100, 0);

        return `

<div class="progress-card ${className}">

    ${title ? `
    <div class="progress-header">

        <div class="progress-title">

            ${title}

        </div>

        ${
            showNumbers
            ? `
            <div class="progress-value">

                ${value}

                ${unit}

                /

                ${target}

                ${unit}

            </div>
            `
            : ""
        }

    </div>
    ` : ""}

    <div class="progress-track">

        <div
            class="progress-fill ${color}"
            style="width:${width}%">
        </div>

    </div>

    ${
        showPercent
        ? `
        <div class="progress-footer">

            <span>

                ${percent}%

            </span>

            ${
                extra > 0
                ? `
                <span class="progress-extra">

                    +${extra}%

                </span>
                `
                : ""
            }

        </div>
        `
        : ""
    }

</div>

`;

    }

    /**
     * Circular Progress
     * (Reserved for future dashboard)
     */

    static circle({

        value = 0,

        target = 100,

        size = 120,

        label = ""

    } = {}) {

        const radius = (size - 12) / 2;

        const circumference =
            2 * Math.PI * radius;

        const percent =
            Math.min(
                value / Math.max(target, 1),
                1
            );

        const offset =
            circumference * (1 - percent);

        return `

<div class="progress-circle">

<svg
    width="${size}"
    height="${size}">

<circle
    class="circle-track"
    cx="${size/2}"
    cy="${size/2}"
    r="${radius}">
</circle>

<circle
    class="circle-fill"
    cx="${size/2}"
    cy="${size/2}"
    r="${radius}"
    stroke-dasharray="${circumference}"
    stroke-dashoffset="${offset}">
</circle>

</svg>

<div class="circle-label">

${Math.round(percent*100)}%

</div>

<div class="circle-title">

${label}

</div>

</div>

`;

    }

    /**
     * Mini Progress
     */

    static mini({

        value = 0,

        target = 100,

        color = "primary"

    } = {}) {

        const width =
            Math.min(
                (value / Math.max(target,1)) * 100,
                100
            );

        return `

<div class="mini-progress">

<div
class="mini-progress-fill ${color}"
style="width:${width}%">
</div>

</div>

`;

    }

}
