import {ComparableDuration} from "./data/comparable_duration";
import {EnrichedEntrant, EnrichedRace, User} from "./clients/racetime_data";

export class FaceOffStats {
    readonly encounters: number;
    readonly player1Wins: number;
    readonly player1WinPercentage: number;
    readonly player2Wins: number;
    readonly player2WinPercentage: number;
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

    constructor({encounters, player1Wins, player2Wins, draws}: MutableFaceOffStats) {
        this.encounters = encounters;
        this.player1Wins = player1Wins;
        this.player1WinPercentage = player1Wins / encounters;
        this.player2Wins = player2Wins;
        this.player2WinPercentage = player2Wins / encounters;
        this.draws = draws;
        this.drawPercentage = draws / encounters;
    }

    static fromRacetime(races: EnrichedRace[], p1: User, p2: User, raceFilter: (race: EnrichedRace) => boolean): FaceOffStats {
        let faceOffStats = races.reduce((acc, current) => {
            if (!raceFilter(current)) {
                return acc;
            }
            const p1Entrant = current.entrants.find((entrant) => entrant.user.id == p1.id);
            const p2Entrant = current.entrants.find((entrant) => entrant.user.id == p2.id);

            if (!!p1Entrant && !!p2Entrant) {
                this.updateFaceOffStats(acc, p1Entrant, p2Entrant);
            }
            if (!!p1Entrant) {
                this.updatePlayerStats(acc.player1Stats, p1Entrant);
            }
            if (!!p2Entrant) {
                this.updatePlayerStats(acc.player2Stats, p2Entrant);
            }
            return acc;
        }, this.EMPTY_STATS)

        return new FaceOffStats(faceOffStats)
    }

    private static updatePlayerStats(stats: MutablePlayerStats, entrant: EnrichedEntrant) {
        if (entrant.status.value == "done") {
            stats.joined++;
            if (!stats.bestTime || entrant.finish_time < stats.bestTime) {
                stats.bestTime = entrant.finish_time;
                stats.bestTimeAt = entrant.finished_at;
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

    private static updateFaceOffStats(stats: MutableFaceOffStats, p1Entrant: EnrichedEntrant, p2Entrant: EnrichedEntrant) {
        if (this.RACE_COMPLETE_STATUS.includes(p1Entrant.status.value) && this.RACE_COMPLETE_STATUS.includes(p2Entrant.status.value)) {
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

type MutablePlayerStats = {
    bestTime?: ComparableDuration,
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

/*
    const p1Races = racetime.fetchUserRaces(p1).map(enrichRace)
    const p2Races = racetime.fetchUserRaces(p2).map(enrichRace)
    const races = [... new Set(p1Races.concat(p2Races))]
 */