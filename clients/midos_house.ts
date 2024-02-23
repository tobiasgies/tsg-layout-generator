export class MidosHouse {
    private standardGoals: string[] = []
    private lastFetch: Date

    private readonly baseUrl: string;
    private readonly TEN_MINUTES = 10 * 60 * 1000;

    public constructor(baseUrl: string = "https://midos.house/api/v1/graphql") {
        this.baseUrl = baseUrl
    }

    /**
     * Returns whether a given custom goal name is a standard tournament goal managed by Midos House
     *
     * @param goal The goal name to be checked against a list of known standard tournament goals
     */
    public isStandardGoal(goal: string): boolean {
        this.updateStandardGoalsIfNeeded();
        return this.standardGoals.includes(goal);
    }

    /**
     * Fetches updated standard goal data from Midos House if local cached data is too old.
     *
     * If an error occurs while refreshing data and stale information exists, prefers serving stale data over bailing.
     * @private
     */
    private updateStandardGoalsIfNeeded() {
        if (!this.standardGoals.length
            || !this.lastFetch
            || (Date.now() - this.lastFetch.valueOf()) > this.TEN_MINUTES) {
            try {
                this.standardGoals = this.fetchStandardGoals();
                console.log(`Fetched updated standard goals from Midos House: ${this.standardGoals.join(', ')}`)
                this.lastFetch = new Date()
            } catch (e) {
                if (this.standardGoals.length > 0) {
                    console.warn(
                        "Fetching updated standard goals from Midos House failed, returning stale data. " +
                        `Last successful update at ${this.lastFetch}.`, e
                    )
                } else {
                    console.error(
                        "Fetching standard goal data from Midos House failed " +
                        "and no stale data available. Bailing out.", e
                    )
                    throw new Error(`Fetching standard goal data from Midos House failed: ${e.message}`)
                }
            }
        }
    }

    /**
     * Fetches latest information about managed standard goals from Midos House.
     *
     * Filters out managed goals that are not relatd to the standard ruleset.
     * @private
     */
    private fetchStandardGoals(): string[] {
        // Fetch schedule from midos.house GraphQL API
        const fetchUrl = encodeURI(`${this.baseUrl}?query={goalNames}`)
        const request = UrlFetchApp.fetch(fetchUrl);
        const response = JSON.parse(request.getContentText());
        return response.data.goalNames.filter(this.isStandardGoalName)
    }

    /**
     * Returns whether the given goal name is related to a standard tournament managed by Midos House.
     * @param goalName The goal name to check
     * @private
     */
    private isStandardGoalName(goalName: string): boolean {
        return !goalName.toLowerCase().includes("multiworld");
    }
}