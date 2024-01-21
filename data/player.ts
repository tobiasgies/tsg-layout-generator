export class Player {
    readonly name: string;
    readonly twitch: string;
    readonly rank: number;
    readonly country: string;
    readonly racetimeId: string;
    readonly pronouns: string;

    constructor(name: string, twitch: string, rank: number, country: string, racetimeId: string, pronouns = null) {
        this.name = name;
        this.twitch = twitch;
        this.rank = rank;
        this.country = country;
        this.racetimeId = racetimeId;
        this.pronouns = pronouns;
    }
}