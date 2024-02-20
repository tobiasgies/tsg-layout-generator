import {Player} from "./player";
import {Duration} from "tinyduration";

export class PlayerStats {
    readonly player: Player;
    readonly numberOfRaces: number;
    readonly bestTime: Duration;
    readonly bestTimeDate: Date;
    readonly numberOfWins: number;
    readonly numberOfSeconds: number;
    readonly numberOfThirds: number;
    readonly numberOfForfeits: number;

    constructor(player: Player, numberOfRaces: number, bestTime: Duration, bestTimeDate: Date, numberOfWins: number, numberOfSeconds: number, numberOfThirds: number, numberOfForfeits: number) {
        this.player = player;
        this.numberOfRaces = numberOfRaces;
        this.bestTime = bestTime;
        this.bestTimeDate = bestTimeDate;
        this.numberOfWins = numberOfWins;
        this.numberOfSeconds = numberOfSeconds;
        this.numberOfThirds = numberOfThirds;
        this.numberOfForfeits = numberOfForfeits;
    }

    public toString(): string {
        const bestTimeStr = `${this.bestTime.hours}:${this.bestTime.minutes}:${this.bestTime.seconds}`;
        return `PlayerStats {
            player: ${this.player.toString()},
            numberOfRaces: ${this.numberOfRaces},
            bestTime: ${bestTimeStr},
            bestTimeDate: ${(this.bestTimeDate.toISOString())},
            numberOfWins: ${this.numberOfWins},
            numberOfSeconds: ${this.numberOfSeconds},
            numberOfThirds: ${this.numberOfThirds},
            numberOfForfeits: ${this.numberOfForfeits}
        }`;
    }
}