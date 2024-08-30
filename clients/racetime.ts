import {Race, User, UserRacesResponse} from "./racetime_data";

/**
 * Racetime API client
 */
export class Racetime {
    private readonly baseUrl: string;
    private static readonly RACES_PER_PAGE = 10;

    public constructor(baseUrl: string = "https://racetime.gg") {
        this.baseUrl = baseUrl;
    }

    /**
     * Fetch Racetime user data for a given identifier.
     * @param identifier Can be either the user's ID or (for people who support racetime.gg financially) their username
     */
    public fetchUser(identifier: string): User {
        let response = UrlFetchApp.fetch(`${this.baseUrl}/user/${identifier}/data`);

        if (response.getResponseCode() != 200) {
            throw new Error(`Could not fetch data for user '${identifier}', status ${response.getResponseCode()}.`);
        }

        return JSON.parse(response.getContentText());
    }

    /**
     * Fetch all races for a given racetime user.
     *
     * In the background, this makes multiple API calls because user race data is paginated.
     * @param user The user to fetch all races for.
     */
    public fetchUserRaces(user: User): Race[] {
        if (!!user.stats && user.stats.joined == 0) {
            return [];
        }
        else if (!!user.stats) {
            const numberOfPages = Math.ceil(user.stats.joined / Racetime.RACES_PER_PAGE)
            const pageUrls = this.racePageUrls(user, 1, numberOfPages);
            return this.fetchAndConcatRacePages(pageUrls);
        } else {
            const firstPageUrl = this.racePageUrl(user, 1)
            const firstPageResponse = UrlFetchApp.fetch(firstPageUrl);
            if (firstPageResponse.getResponseCode() != 200) {
                throw new Error(`Could not fetch races for user '${user.full_name}'. Failed to read first page.`);
            }
            const firstPageJson: UserRacesResponse = JSON.parse(firstPageResponse.getContentText())
            if (firstPageJson.count == 0) {
                return [];
            } else if (firstPageJson.num_pages == 1) {
                return firstPageJson.races;
            } else {
                const pageUrls = this.racePageUrls(user, 2, firstPageJson.num_pages);
                return firstPageJson.races.concat(this.fetchAndConcatRacePages(pageUrls))
            }
        }
    }

    /**
     * Fetches all races from the given paginated URLs and concatenates them into a single array.
     * @param pageUrls List of paginated URLs that contain a user's races.
     * @private
     */
    private fetchAndConcatRacePages(pageUrls: string[]): Race[] {
        const responses = UrlFetchApp.fetchAll(pageUrls);
        return responses.flatMap(response => {
            if (response.getResponseCode() != 200) {
                throw new Error(`Could not fetch user races. Failed to read at least one page.`);
            }
            const json: UserRacesResponse = JSON.parse(response.getContentText());
            return json.races;
        })
    }

    /**
     * Generates a single URL for a page from the user's races list.
     * @param user The user whose races we're looking for
     * @param page Page number of the page we want to load
     * @private
     */
    private racePageUrl(user: User, page: number): string {
        // This previously used user.url instead of user.id, but the new SEO URLs break this
        return `${this.baseUrl}/user/${user.id}/races/data?show_entrants=true&page=${page}`;
    }

    /**
     * Generates URLs for all pages between fromPage and toPage (inclusive) from the user's races list.
     * @param user The user whose races we're looking for
     * @param fromPage First page to generate a URL for
     * @param toPage Last page to generate a URL for
     * @private
     */
    private racePageUrls(user: User, fromPage: number, toPage: number): string[] {
        return Array(toPage - fromPage + 1).fill(null)
            .map((_, idx) => fromPage + idx)
            .map((page) => this.racePageUrl(user, page))
    }
}