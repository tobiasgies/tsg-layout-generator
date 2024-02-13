import Slide = GoogleAppsScript.Slides.Slide;
import {Player} from "../data/player";
import Presentation = GoogleAppsScript.Slides.Presentation;
import {PlayerStats} from "../data/player_stats";
import {FaceOffStats} from "../data/face_off_stats";

export class ChallengeCupSeason7 {
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
        const elementShape = pageElement.asShape();
        const elementText = elementShape.getText();
        elementText.setText(newText);
    }

    public layoutTitleSlide(player1: Player, player2: Player, group: string) {
        const slide = this.presentation.getSlideById(this.TITLE_SLIDE_2PLAYERS);
        this.replaceElementText(slide, "g2afd7ae3b2d_0_0", group);
        this.replaceElementText(slide, "g207c0db1c30_0_0", player1.name);
        this.replaceElementText(slide, "g2afd7ae3b2d_0_1", `#${player1.rank}`);
        this.replaceElementText(slide, "g207c0db1c30_0_1", player2.name);
        this.replaceElementText(slide, "g2afd7ae3b2d_0_2", `#${player2.rank}`);
    }
    public layoutStatsSlide(player1Stats: PlayerStats, player2Stats: PlayerStats, faceOffStats: FaceOffStats) {
        const slide = this.presentation.getSlideById(this.STATS_SLIDE_2PLAYERS);
        this.replaceElementText(slide, "g20587f4170f_0_38", player1Stats.player.name);
        this.replaceElementText(slide, "g20587f4170f_0_40", player1Stats.player.twitch);
        this.replaceElementText(slide, "g20587f4170f_0_57", player1Stats.player.rank.toString());
        this.replaceElementText(slide, "g20f29317d6f_0_2", player1Stats.player.pronouns.toLowerCase());
        this.replaceElementText(slide, "g20587f4170f_0_41", player2Stats.player.name);
        this.replaceElementText(slide, "g20587f4170f_0_43", player2Stats.player.twitch);
        this.replaceElementText(slide, "g20587f4170f_0_56", player2Stats.player.rank.toString());
        this.replaceElementText(slide, "g20f29317d6f_0_3", player2Stats.player.pronouns.toLowerCase());

        this.replaceElementText(slide, "g20587f4170f_0_72", player1Stats.numberOfRaces.toString());
        this.replaceElementText(slide, "g20587f4170f_0_70", player2Stats.numberOfRaces.toString());

        this.replaceElementText(slide, "g20587f4170f_0_64", faceOffStats.player1Wins.toString());
        this.replaceElementText(slide, "g20587f4170f_0_67",
            (Math.round(faceOffStats.player1WinPercentage * 10) / 10).toFixed(1));
        this.replaceElementText(slide, "g20587f4170f_0_65", faceOffStats.player2Wins.toString());
        this.replaceElementText(slide, "g20587f4170f_0_68",
            (Math.round(faceOffStats.player2WinPercentage * 10) / 10).toFixed(1));
        this.replaceElementText(slide, "g20587f4170f_0_66", faceOffStats.draws.toString());
        this.replaceElementText(slide, "g20587f4170f_0_69",
            (Math.round(faceOffStats.drawPercentage * 10) / 10).toFixed(1));
        this.replaceElementText(slide, "g20587f4170f_0_59", faceOffStats.encounters.toString());

        this.replaceElementText(slide, "g20587f4170f_0_44", player1Stats.numberOfWins.toString());
        this.replaceElementText(slide, "g20587f4170f_0_45", player1Stats.numberOfSeconds.toString());
        this.replaceElementText(slide, "g20587f4170f_0_46", player1Stats.numberOfThirds.toString());
        this.replaceElementText(slide, "g20587f4170f_0_47", player1Stats.numberOfForfeits.toString());

        this.replaceElementText(slide, "g20587f4170f_0_48", player2Stats.numberOfWins.toString());
        this.replaceElementText(slide, "g20587f4170f_0_49", player2Stats.numberOfSeconds.toString());
        this.replaceElementText(slide, "g20587f4170f_0_50", player2Stats.numberOfThirds.toString());
        this.replaceElementText(slide, "g20587f4170f_0_51", player2Stats.numberOfForfeits.toString());

        this.replaceElementText(slide, "g20587f4170f_0_52",
            `${player1Stats.bestTime.hours}:${player1Stats.bestTime.minutes}:${player1Stats.bestTime.seconds}`);
        this.replaceElementText(slide, "g20587f4170f_0_54",
            // @ts-ignore
            player1Stats.bestTimeDate.toLocaleDateString("en-US", this.DATE_FORMAT));

        this.replaceElementText(slide, "g20587f4170f_0_53",
            `${player2Stats.bestTime.hours}:${player2Stats.bestTime.minutes}:${player2Stats.bestTime.seconds}`);
        this.replaceElementText(slide, "g20587f4170f_0_55",
            // @ts-ignore
            player2Stats.bestTimeDate.toLocaleDateString("en-US", this.DATE_FORMAT));
    }


    public layoutRaceSlide(player1: Player, player2: Player, group: string) {
        const slide = this.presentation.getSlideById(this.RACE_SLIDE_2PLAYERS);
        this.replaceElementText(slide, "g20587f4170f_0_24", player1.name);
        this.replaceElementText(slide, "g20587f4170f_0_25", player1.twitch);
        this.replaceElementText(slide, "g20587f4170f_0_31", player1.rank.toString());
        this.replaceElementText(slide, "g20587f4170f_0_26", player1.country);
        this.replaceElementText(slide, "g20f29317d6f_0_0", player1.pronouns.toLowerCase());

        this.replaceElementText(slide, "g20587f4170f_0_27", player2.name);
        this.replaceElementText(slide, "g20587f4170f_0_28", player2.twitch);
        this.replaceElementText(slide, "g20587f4170f_0_30", player2.rank.toString());
        this.replaceElementText(slide, "g20587f4170f_0_29", player2.country);
        this.replaceElementText(slide, "g20f29317d6f_0_1", player2.pronouns.toLowerCase());

        this.replaceElementText(slide, "g20587f4170f_0_23", group);
    }
}