import Slide = GoogleAppsScript.Slides.Slide;
import {Player} from "../data/participants";
import Presentation = GoogleAppsScript.Slides.Presentation;
import {FaceOffStats} from "../stats_calculator";
import {Duration} from "../util/duration";

export class ChallengeCupSeason8 {
    private readonly presentation: Presentation;

    private readonly TITLE_SLIDE_2PLAYERS = "g2abcd4d5f69_0_3"
    private readonly STATS_SLIDE_2PLAYERS = "g20587f416fd_0_38"
    private readonly RACE_SLIDE_2PLAYERS = "g2a4cdfc0918_0_0"
    private readonly TITLE_SLIDE_3PLAYERS = "g2b3dc24f00e_1_0"
    private readonly RACE_SLIDE_3PLAYERS = "g2b1b1a75d12_0_0"

    private readonly FINALS_REGEX = /^(?<remove>\s*Brackets\s+)((Quarter|Semi)-?)?Final/i

    private readonly DATE_FORMAT = {
        month: "long",
        day: "numeric",
        year: "numeric"
    }

    public constructor(presentation: Presentation) {
        this.presentation = presentation;
    }

    private replaceElementText(slide: Slide, elementId: string, newText: string) {
        const pageElement = slide.getPageElementById(elementId);
        const elementShape = pageElement.asShape();
        const elementText = elementShape.getText();
        elementText.setText(newText);
    }

    private filterRound(round: string) {
        let match = round.match(this.FINALS_REGEX)
        if (!match) {
            return round;
        }
        return round.replace(match.groups.remove, "")
    }

    private filterCountry(country: string) {
        // Return only country flag for this layout
        return country.split(" ", 2)[0];
    }

    public layoutTitleSlide(player1: Player, player2: Player, round: string) {
        const slide = this.presentation.getSlideById(this.TITLE_SLIDE_2PLAYERS);
        this.replaceElementText(slide, "g2a4cca0b470_1_2", this.filterRound(round));
        this.replaceElementText(slide, "g320779e2ba3_0_0", player1.name);
        this.replaceElementText(slide, "g2a4cca0b470_1_15", this.filterCountry(player1.country));
        this.replaceElementText(slide, "g2a4cca0b470_1_4", `#${player1.rank}`);
        this.replaceElementText(slide, "g2a4cca0b470_1_6", player1.pronouns?.toLowerCase() ?? "");
        this.replaceElementText(slide, "g320779e2ba3_0_1", player2.name);
        this.replaceElementText(slide, "g2a4cca0b470_1_17", this.filterCountry(player2.country));
        this.replaceElementText(slide, "g2a4cca0b470_1_3", `#${player2.rank}`);
        this.replaceElementText(slide, "g2a4cca0b470_1_5", player2.pronouns?.toLowerCase() ?? "");
    }

    public layoutStatsSlide(faceOffStats: FaceOffStats) {
        let player1Stats = faceOffStats.player1Stats;
        let player2Stats = faceOffStats.player2Stats;

        const slide = this.presentation.getSlideById(this.STATS_SLIDE_2PLAYERS);
        this.replaceElementText(slide, "g320779e2ba3_0_8", player1Stats.player.name);
        this.replaceElementText(slide, "g2a4cca0b470_1_23", this.filterCountry(player1Stats.player.country));
        this.replaceElementText(slide, "g20587f416fd_0_42", player1Stats.player.twitch);
        this.replaceElementText(slide, "g20587f416fd_0_59", `#${player1Stats.player.rank}`);
        this.replaceElementText(slide, "g2a4cca0b470_1_21", player1Stats.player.pronouns?.toLowerCase() ?? "");
        this.replaceElementText(slide, "g320779e2ba3_0_9", player2Stats.player.name);
        this.replaceElementText(slide, "g2a4cca0b470_1_24", this.filterCountry(player2Stats.player.country));
        this.replaceElementText(slide, "g20587f416fd_0_45", player2Stats.player.twitch);
        this.replaceElementText(slide, "g20587f416fd_0_58", `#${player2Stats.player.rank}`);
        this.replaceElementText(slide, "g2a4cca0b470_1_22", player2Stats.player.pronouns?.toLowerCase() ?? "");

        this.replaceElementText(slide, "g3207e63c0e4_0_15", player1Stats.joined.toString());
        this.replaceElementText(slide, "g3207e63c0e4_0_13", player2Stats.joined.toString());

        this.replaceElementText(slide, "g3207e63c0e4_0_7", faceOffStats.player1Wins.toString());
        this.replaceElementText(slide, "g3207e63c0e4_0_10", this.formatPercent(faceOffStats.player1WinPercentage));
        this.replaceElementText(slide, "g3207e63c0e4_0_8", faceOffStats.player2Wins.toString());
        this.replaceElementText(slide, "g3207e63c0e4_0_11", this.formatPercent(faceOffStats.player2WinPercentage));
        this.replaceElementText(slide, "g3207e63c0e4_0_9", faceOffStats.draws.toString());
        this.replaceElementText(slide, "g3207e63c0e4_0_12", this.formatPercent(faceOffStats.drawPercentage));
        this.replaceElementText(slide, "g3207e63c0e4_0_2", faceOffStats.encounters.toString());

        this.replaceElementText(slide, "g20587f416fd_0_46", player1Stats.first.toString());
        this.replaceElementText(slide, "g20587f416fd_0_47", player1Stats.second.toString());
        this.replaceElementText(slide, "g20587f416fd_0_48", player1Stats.third.toString());
        this.replaceElementText(slide, "g20587f416fd_0_49", player1Stats.forfeits.toString());

        this.replaceElementText(slide, "g20587f416fd_0_50", player2Stats.first.toString());
        this.replaceElementText(slide, "g20587f416fd_0_51", player2Stats.second.toString());
        this.replaceElementText(slide, "g20587f416fd_0_52", player2Stats.third.toString());
        this.replaceElementText(slide, "g20587f416fd_0_53", player2Stats.forfeits.toString());
    }

    public layoutRaceSlide(player1: Player, player2: Player, round: string) {
        const slide = this.presentation.getSlideById(this.RACE_SLIDE_2PLAYERS);
        this.replaceElementText(slide, "g2a4cdfc0918_0_3", player1.name);
        this.replaceElementText(slide, "g2a4cdfc0918_0_5", player1.twitch);
        this.replaceElementText(slide, "g2a4cdfc0918_0_11", `#${player1.rank}`);
        this.replaceElementText(slide, "g2a4cca0b470_1_19", this.filterCountry(player1.country));
        this.replaceElementText(slide, "g2a4cdfc0918_0_13", player1.pronouns?.toLowerCase() ?? "");

        // Country flag goes on the right side of country name for P2
        this.replaceElementText(slide, "g2a4cdfc0918_0_6", player2.name);
        this.replaceElementText(slide, "g2a4cdfc0918_0_8", player2.twitch);
        this.replaceElementText(slide, "g2a4cdfc0918_0_10", `#${player2.rank}`);
        this.replaceElementText(slide, "g2a4cca0b470_1_20", this.filterCountry(player2.country));
        this.replaceElementText(slide, "g2a4cdfc0918_0_12", player2.pronouns?.toLowerCase() ?? "");

        this.replaceElementText(slide, "g2a4cdfc0918_0_1", this.filterRound(round));
    }

    public getPresentationLink() {
        return `https://docs.google.com/presentation/d/${this.presentation.getId()}/edit#slide=id.${this.TITLE_SLIDE_2PLAYERS}`;
    }

    private formatPercent(percent: number) {
        return (Math.round(percent * 10) / 10).toFixed(1) + "%";
    }
}