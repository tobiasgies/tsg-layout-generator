import {Player} from "./player";

export class PlayerStats {
    readonly player: Player;
    readonly numberOfRaces: number;
    readonly bestTime: string; // TODO convert to duration type
    readonly bestTimeDate: Date;
    readonly numberOfWins: number;
    readonly numberOfSeconds: number;
    readonly numberOfThirds: number;
    readonly numberOfForfeits: number;

    constructor(player: Player, numberOfRaces: number, bestTime: string, bestTimeDate: Date, numberOfWins: number, numberOfSeconds: number, numberOfThirds: number, numberOfForfeits: number) {
        this.player = player;
        this.numberOfRaces = numberOfRaces;
        this.bestTime = bestTime;
        this.bestTimeDate = bestTimeDate;
        this.numberOfWins = numberOfWins;
        this.numberOfSeconds = numberOfSeconds;
        this.numberOfThirds = numberOfThirds;
        this.numberOfForfeits = numberOfForfeits;
    }
}