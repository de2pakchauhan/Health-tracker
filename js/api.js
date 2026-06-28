// ==========================================
// Health Log V2
// Google Sheets API
// ==========================================

const Api = {

    async fetchSheet(sheet) {

        try {

            const url =
                `${CONFIG.SHEET_URL}?sheet=${encodeURIComponent(sheet)}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}`
                );
            }

            const json = await response.json();

            if (json.status !== "ok") {
                throw new Error(
                    json.message || "Unknown API error"
                );
            }

            return json.data || [];

        } catch (error) {

            console.error(
                "Fetch Error:",
                error
            );

            throw error;

        }

    },

    async loadFitness() {

        return await this.fetchSheet(
            "fitness"
        );

    },

    async loadStrength() {

        return await this.fetchSheet(
            "strength"
        );

    },

    async append(sheet, row) {

        try {

            const payload = {

                action: "append",

                sheet: sheet,

                row: row

            };

            await fetch(CONFIG.SHEET_URL, {

                method: "POST",

                mode: "no-cors",

                headers: {

                    "Content-Type": "text/plain"

                },

                body: JSON.stringify(payload)

            });

            return true;

        } catch (error) {

            console.error(
                "Append Error:",
                error
            );

            return false;

        }

    },

    async saveFitness(row) {

        return await this.append(
            "fitness",
            row
        );

    },

    async saveStrength(row) {

        return await this.append(
            "strength",
            row
        );

    }

};
