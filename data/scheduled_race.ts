export class ScheduledRace {
    readonly raceId: string;
    readonly title: string;
    readonly startTime: Date;
    readonly runner1Id: string;
    readonly runner1RacetimeId: string;
    readonly runner1Name: string;
    readonly runner1QualifierRank: number;
    readonly runner1Country: string;
    readonly runner2Id: string;
    readonly runner2RacetimeId: string;
    readonly runner2Name: string;
    readonly runner2QualifierRank: number;
    readonly runner2Country: string;
    readonly round: string;

    public constructor(raceId: string,
                       title: string,
                       startTime: Date,
                       runner1Id: string,
                       runner1RacetimeId: string,
                       runner1Name: string,
                       runner1QualifierRank: number,
                       runner1Country: string,
                       runner2Id: string,
                       runner2RacetimeId: string,
                       runner2Name: string,
                       runner2QualifierRank: number,
                       runner2Country: string,
                       round: string) {
        this.raceId = raceId;
        this.title = title;
        this.startTime = startTime;
        this.runner1Id = runner1Id;
        this.runner1RacetimeId = runner1RacetimeId;
        this.runner1Name = runner1Name;
        this.runner1QualifierRank = runner1QualifierRank;
        this.runner1Country = runner1Country;
        this.runner2Id = runner2Id;
        this.runner2RacetimeId = runner2RacetimeId;
        this.runner2Name = runner2Name;
        this.runner2QualifierRank = runner2QualifierRank;
        this.runner2Country = runner2Country;
        this.round = round;
    }

    public toString(): string {
        return `ScheduledRace {
            raceId: ${this.raceId},
            title: ${this.title},
            startTime: ${this.startTime.toISOString()},
            runner1Id: ${this.runner1Id},
            runner1RacetimeId: ${this.runner1RacetimeId},
            runner1Name: ${this.runner1Name},
            runner1QualifierRank: ${this.runner1QualifierRank},
            runner1Country: ${this.runner1Country},
            runner2Id: ${this.runner2Id},
            runner2RacetimeId: ${this.runner2RacetimeId},
            runner2Name: ${this.runner2Name},
            runner2QualifierRank: ${this.runner2QualifierRank},
            runner2Country: ${this.runner2Country},
            round: ${this.round}
        }`;
    }
}