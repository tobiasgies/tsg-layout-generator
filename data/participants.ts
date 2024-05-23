export class Player {
    readonly name: string;
    readonly twitch: string;
    readonly rank: number;
    readonly country: string;
    readonly racetimeId: string;
    public pronouns: string;

    constructor(name: string, twitch: string, rank: number, country: string, racetimeId: string, pronouns = null) {
        this.name = name;
        this.twitch = twitch;
        this.rank = rank;
        this.country = country;
        this.racetimeId = racetimeId;
        this.pronouns = pronouns;
    }

    public toString(): string {
        return `Player {
            name: ${this.name},
            twitch: ${this.twitch},
            rank: ${this.rank},
            country: ${this.country},
            racetimeId: ${this.racetimeId},
            pronouns: ${this.pronouns}
        }`;
    }
}

export class Team {
    readonly name: string;
    readonly players: Array<Player>

    constructor(name: string, players: Array<Player>) {
        this.name = name;
        this.players = players;
    }

    public toString(): string {
        return `Team {
            name: ${this.name},
            players: ${this.players}
        }`
    }
}