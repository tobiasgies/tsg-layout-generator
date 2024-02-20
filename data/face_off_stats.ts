export class FaceOffStats {
    readonly encounters: number;
    readonly player1Wins: number;
    readonly player1WinPercentage: number;
    readonly player2Wins: number;
    readonly player2WinPercentage: number;
    readonly draws: number;
    readonly drawPercentage: number;

    constructor(encounters: number, player1Wins: number, player1WinPercentage: number, player2Wins: number, player2WinPercentage: number, draws: number, drawPercentage: number) {
        this.encounters = encounters;
        this.player1Wins = player1Wins;
        this.player1WinPercentage = player1WinPercentage;
        this.player2Wins = player2Wins;
        this.player2WinPercentage = player2WinPercentage;
        this.draws = draws;
        this.drawPercentage = drawPercentage;
    }

    public toString(): string {
        return `FaceOffStats {
            encounters: ${this.encounters},
            player1Wins: ${this.player1Wins},
            player1WinPercentage: ${this.player1WinPercentage.toFixed(2)}%,
            player2Wins: ${this.player2Wins},
            player2WinPercentage: ${this.player2WinPercentage.toFixed(2)}%,
            draws: ${this.draws},
            drawPercentage: ${this.drawPercentage.toFixed(2)}%
        }`;
    }
}