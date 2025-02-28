import Slide = GoogleAppsScript.Slides.Slide;
import {Player} from "../data/participants";
import Presentation = GoogleAppsScript.Slides.Presentation;
import {FaceOffStats} from "../stats_calculator";
import {Duration} from "../util/duration";

export class TriforceBlitzSeason3 {
    private readonly presentation: Presentation;

    private readonly TITLE_SLIDE_2PLAYERS = "g10aa2c5d08b_0_13"
    private readonly STATS_SLIDE_2PLAYERS = "g20587f4170f_0_36"
    private readonly RACE_SLIDE_2PLAYERS = "g20587f4170f_0_22"
    private readonly TITLE_SLIDE_3PLAYERS = "g2b3dc24f00e_1_0"
    private readonly RACE_SLIDE_3PLAYERS = "g2b1b1a75d12_0_0"

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
        if (!pageElement) {
            throw new Error(`Could not find text element ${elementId} in slide ${slide.getObjectId()}. This needs to be fixed in the generator code.`);
        }
        const elementShape = pageElement.asShape();
        const elementText = elementShape.getText();
        elementText.setText(newText);
    }

    private filterRound(round: string) {
        if (round.startsWith("Groups ") && round.endsWith("Tiebreaker")) {
            return round.substring(7);
        } else if (round.startsWith("Groups ")) {
            return "Group Stage"
        } else if (round.startsWith("Bracket ")) {
            return round.substring(8)
        } else {
            // Fallback
            return round
        }
    }

    public layoutTitleSlide(player1: Player, player2: Player, round: string) {
        const slide = this.presentation.getSlideById(this.TITLE_SLIDE_2PLAYERS);
        if (!slide) {
            throw new Error(`Could not find title slide (ID:${this.TITLE_SLIDE_2PLAYERS}). This needs to be fixed in the generator code.`);
        }
        this.replaceElementText(slide, "g2ef957c2cdc_0_0", this.filterRound(round));
        this.replaceElementText(slide, "g207c0db1c30_0_0", player1.name);
        this.replaceElementText(slide, "g2ef957c2cdc_0_1", `#${player1.rank}`);
        this.replaceElementText(slide, "g207c0db1c30_0_1", player2.name);
        this.replaceElementText(slide, "g2ef957c2cdc_0_2", `#${player2.rank}`);
    }
    public layoutStatsSlide(faceOffStats: FaceOffStats) {
        let player1Stats = faceOffStats.player1Stats;
        let player2Stats = faceOffStats.player2Stats;

        const slide = this.presentation.getSlideById(this.STATS_SLIDE_2PLAYERS);
        if (!slide) {
            throw new Error(`Could not find stats slide (ID:${this.STATS_SLIDE_2PLAYERS}). This needs to be fixed in the generator code.`);
        }
        this.replaceElementText(slide, "g20587f4170f_0_38", player1Stats.player.name);
        this.replaceElementText(slide, "g20587f4170f_0_40", player1Stats.player.twitch);
        this.replaceElementText(slide, "g20587f4170f_0_57", `#${player1Stats.player.rank}`);
        this.replaceElementText(slide, "g20f29317d6f_0_2", player1Stats.player.pronouns?.toLowerCase() ?? "");
        this.replaceElementText(slide, "g20587f4170f_0_41", player2Stats.player.name);
        this.replaceElementText(slide, "g20587f4170f_0_43", player2Stats.player.twitch);
        this.replaceElementText(slide, "g20587f4170f_0_56", `#${player2Stats.player.rank}`);
        this.replaceElementText(slide, "g20f29317d6f_0_3", player2Stats.player.pronouns?.toLowerCase() ?? "");

        this.replaceElementText(slide, "g20587f4170f_0_72", player1Stats.joined.toString());
        this.replaceElementText(slide, "g20587f4170f_0_70", player2Stats.joined.toString());

        this.replaceElementText(slide, "g20587f4170f_0_64", faceOffStats.player1Wins.toString());
        this.replaceElementText(slide, "g20587f4170f_0_67", this.formatPercent(faceOffStats.player1WinPercentage));
        this.replaceElementText(slide, "g20587f4170f_0_65", faceOffStats.player2Wins.toString());
        this.replaceElementText(slide, "g20587f4170f_0_68", this.formatPercent(faceOffStats.player2WinPercentage));
        this.replaceElementText(slide, "g20587f4170f_0_66", faceOffStats.draws.toString());
        this.replaceElementText(slide, "g20587f4170f_0_69", this.formatPercent(faceOffStats.drawPercentage));
        this.replaceElementText(slide, "g20587f4170f_0_59", faceOffStats.encounters.toString());

        this.replaceElementText(slide, "g20587f4170f_0_44", player1Stats.first.toString());
        this.replaceElementText(slide, "g20587f4170f_0_45", player1Stats.second.toString());
        this.replaceElementText(slide, "g20587f4170f_0_46", player1Stats.third.toString());
        this.replaceElementText(slide, "g20587f4170f_0_47", player1Stats.forfeits.toString());

        this.replaceElementText(slide, "g20587f4170f_0_48", player2Stats.first.toString());
        this.replaceElementText(slide, "g20587f4170f_0_49", player2Stats.second.toString());
        this.replaceElementText(slide, "g20587f4170f_0_50", player2Stats.third.toString());
        this.replaceElementText(slide, "g20587f4170f_0_51", player2Stats.forfeits.toString());

        this.replaceElementText(slide, "g20587f4170f_0_52", this.formatDuration(player1Stats.bestTime));
        this.replaceElementText(slide, "g20587f4170f_0_54", this.formatDate(player1Stats.bestTimeAt));

        this.replaceElementText(slide, "g20587f4170f_0_53", this.formatDuration(player2Stats.bestTime));
        this.replaceElementText(slide, "g20587f4170f_0_55", this.formatDate(player2Stats.bestTimeAt));
    }

    public layoutRaceSlide(player1: Player, player2: Player, round: string) {
        const slide = this.presentation.getSlideById(this.RACE_SLIDE_2PLAYERS);
        if (!slide) {
            throw new Error(`Could not find race slide (ID:${this.RACE_SLIDE_2PLAYERS}). This needs to be fixed in the generator code.`);
        }
        this.replaceElementText(slide, "g20587f4170f_0_24", player1.name);
        this.replaceElementText(slide, "g20587f4170f_0_25", player1.twitch);
        this.replaceElementText(slide, "g20587f4170f_0_31", `#${player1.rank}`);
        this.replaceElementText(slide, "g20587f4170f_0_26", player1.country);
        this.replaceElementText(slide, "g20f29317d6f_0_0", player1.pronouns?.toLowerCase() ?? "");

        // Country flag goes on the right side of country name for P2
        let reversedCountry = player2.country.split(" ", 2).reverse().join(" ");
        this.replaceElementText(slide, "g20587f4170f_0_27", player2.name);
        this.replaceElementText(slide, "g20587f4170f_0_28", player2.twitch);
        this.replaceElementText(slide, "g20587f4170f_0_30", `#${player2.rank}`);
        this.replaceElementText(slide, "g20587f4170f_0_29", reversedCountry);
        this.replaceElementText(slide, "g20f29317d6f_0_1", player2.pronouns?.toLowerCase() ?? "");

        this.replaceElementText(slide, "g20587f4170f_0_23", this.filterRound(round));
    }

    public getPresentationLink() {
        return `https://docs.google.com/presentation/d/${this.presentation.getId()}/edit#slide=id.${this.TITLE_SLIDE_2PLAYERS}`;
    }

    private formatDate(date?: Date) {
        if (!date) {
            return "";
        } else {
            // @ts-ignore
            return date.toLocaleDateString("en-US", this.DATE_FORMAT);
        }
    }

    private formatDuration(duration?: Duration) {
        if (!duration) {
            return "00:00:00";
        }
        else {
            let hours = duration.hours.toString().padStart(2, "0");
            let minutes = duration.minutes.toString().padStart(2, "0");
            let seconds = (Math.round(duration.seconds * 10) / 10).toFixed(1).padStart(4, "0");
            return `${hours}:${minutes}:${seconds}`;
        }
    }

    private formatPercent(percent: number) {
        return (Math.round(percent * 10) / 10).toFixed(1) + "%";
    }
}