import {Player} from "./data/participants";
import {Duration, DurationUtils} from "./util/duration";
import {Entrant, Race} from "./clients/racetime_data";

export class FaceOffStats {
    readonly encounters: number;
    readonly player1Wins: number;
    readonly player1WinPercentage: number;
    readonly player1Stats: PlayerStats;
    readonly player2Wins: number;
    readonly player2WinPercentage: number;
    readonly player2Stats: PlayerStats;
    readonly draws: number;
    readonly drawPercentage: number;

    static readonly EMPTY_STATS: MutableFaceOffStats = {
        encounters: 0,
        player1Wins: 0,
        player2Wins: 0,
        draws: 0,
        player1Stats: {
            joined: 0,
            first: 0,
            second: 0,
            third: 0,
            forfeits: 0,
        },
        player2Stats: {
            joined: 0,
            first: 0,
            second: 0,
            third: 0,
            forfeits: 0,
        },
    }

    static readonly FORFEIT_STATUS = ["dnf", "dq"];
    static readonly RACE_COMPLETE_STATUS = ["done", ...this.FORFEIT_STATUS];

    constructor({encounters, player1Wins, player2Wins, draws, player1Stats, player2Stats}: MutableFaceOffStats,
                p1: Player, p2: Player) {
        this.encounters = encounters;
        this.player1Wins = player1Wins;
        this.player1WinPercentage = player1Wins / encounters * 100;
        this.player1Stats = new PlayerStats(player1Stats, p1);
        this.player2Wins = player2Wins;
        this.player2WinPercentage = player2Wins / encounters * 100;
        this.player2Stats = new PlayerStats(player2Stats, p2);
        this.draws = draws;
        this.drawPercentage = draws / encounters * 100;
    }

    public static fromRacetime(races: Race[], p1: Player, p2: Player, raceFilter: (race: Race) => boolean): FaceOffStats {
        let faceOffStats = races.reduce((acc, current) => {
            if (!raceFilter(current)) {
                return acc;
            }
            const p1Entrant = current.entrants.find((entrant) => entrant.user.id == p1.racetimeId);
            const p2Entrant = current.entrants.find((entrant) => entrant.user.id == p2.racetimeId);

            if (!!p1Entrant && !!p2Entrant) {
                FaceOffStats.updateFaceOffStats(acc, p1Entrant, p2Entrant);
            }
            if (!!p1Entrant) {
                FaceOffStats.updatePlayerStats(acc.player1Stats, p1Entrant);
            }
            if (!!p2Entrant) {
                FaceOffStats.updatePlayerStats(acc.player2Stats, p2Entrant);
            }
            return acc;
        }, this.EMPTY_STATS)

        return new FaceOffStats(faceOffStats, p1, p2)
    }

    private static updatePlayerStats(stats: MutablePlayerStats, entrant: Entrant) {
        if (entrant.status.value == "done") {
            stats.joined++;
            if (!stats.bestTime || DurationUtils.durationInSeconds(entrant.finish_time) < DurationUtils.durationInSeconds(stats.bestTime)) {
                stats.bestTime = DurationUtils.parseDuration(entrant.finish_time);
                stats.bestTimeAt = new Date(entrant.finished_at);
            }
            if (entrant.place == 1) {
                stats.first++;
            } else if (entrant.place == 2) {
                stats.second++;
            } else if (entrant.place == 3) {
                stats.third++;
            }
        } else if (this.FORFEIT_STATUS.includes(entrant.status.value)) {
            stats.joined++;
            stats.forfeits++;
        }
    }

    private static updateFaceOffStats(stats: MutableFaceOffStats, p1Entrant: Entrant, p2Entrant: Entrant) {
        if (this.RACE_COMPLETE_STATUS.includes(p1Entrant.status.value) && this.RACE_COMPLETE_STATUS.includes(p2Entrant.status.value)) {
            stats.encounters++;
            if (p1Entrant.place == p2Entrant.place) {
                stats.draws++;
            } else if (p1Entrant.place != null && p2Entrant.place == null) {
                stats.player1Wins++;
            } else if (p1Entrant.place == null && p2Entrant.place != null) {
                stats.player2Wins++;
            } else if (p1Entrant.place < p2Entrant.place) {
                stats.player1Wins++;
            } else {
                stats.player2Wins++;
            }
        }
    }
}

export class PlayerStats {
    readonly player: Player;
    readonly joined: number;
    readonly bestTime?: Duration;
    readonly bestTimeAt?: Date;
    readonly first: number;
    readonly second: number;
    readonly third: number;
    readonly forfeits: number;

    constructor({ joined, bestTime, bestTimeAt, first, second, third, forfeits }: MutablePlayerStats, player: Player) {
        this.player = player;
        this.joined = joined;
        this.bestTime = bestTime;
        this.bestTimeAt = bestTimeAt;
        this.first = first;
        this.second = second;
        this.third = third;
        this.forfeits = forfeits;
    }

    public toString(): string {
        const bestTimeStr = `${this.bestTime.hours}:${this.bestTime.minutes}:${this.bestTime.seconds}`;
        return `PlayerStats {
            player: ${this.player.toString()},
            numberOfRaces: ${this.joined},
            bestTime: ${bestTimeStr},
            bestTimeDate: ${(this.bestTimeAt.toISOString())},
            numberOfWins: ${this.first},
            numberOfSeconds: ${this.second},
            numberOfThirds: ${this.third},
            numberOfForfeits: ${this.forfeits}
        }`;
    }
}

type MutablePlayerStats = {
    bestTime?: Duration,
    bestTimeAt?: Date,
    joined: number,
    first: number,
    second: number,
    third: number,
    forfeits: number,
}

type MutableFaceOffStats = {
    encounters: number,
    player1Wins: number,
    player2Wins: number,
    draws: number,
    player1Stats: MutablePlayerStats,
    player2Stats: MutablePlayerStats
}