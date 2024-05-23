import Slide = GoogleAppsScript.Slides.Slide;
import Presentation = GoogleAppsScript.Slides.Presentation;
import {Player, Team} from "../data/participants";

export class CoOpSeason3 {
    private readonly presentation: Presentation;

    private readonly TITLE_SLIDE_4PLAYERS = "g29ca38acb16_0_0"
    private readonly RACE_SLIDE_4PLAYERS = "g2db76eaf1a8_0_18"

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
        if (round.startsWith("Groups ") && round.endsWith("Tiebreaker")) {
            return round.substring(7);
        } else if (round.startsWith("Groups ")) {
            return "Group Stage"
        } else if (round.startsWith("Brackets ")) {
            return round.substring(9)
        } else {
            // Fallback
            return round
        }
    }

    public layoutTitleSlide(team1: Team, team2: Team, round: string) {
        const slide = this.presentation.getSlideById(this.TITLE_SLIDE_4PLAYERS);
        const title = this.titleText(team1, team2, round)
        this.replaceElementText(slide, "g29ca38acb16_0_5", title);
    }

    private titleText(team1: Team, team2: Team, round: string) {
        return `Co-Op Tournament Season 3\n${this.filterRound(round)}: ${team1.name} vs ${team2.name}`;
    }

    private flag(country: string) {
        let split = country.split(" ")
        if (split.length >= 2) {
            return split[0]
        } else {
            return country
        }
    }

    public layoutRaceSlide(team1: Team, team2: Team, round: string) {
        const slide = this.presentation.getSlideById(this.RACE_SLIDE_4PLAYERS);
        this.replaceElementText(slide, "g2db76eaf1a8_0_19", this.titleText(team1, team2, round));

        // TODO add flags to names
        this.replaceElementText(slide, "g2db76eaf1a8_0_28", team1.name);
        this.replaceElementText(slide, "g2db76eaf1a8_0_21", this.flag(team1.players[0].country) + " " + team1.players[0].name);
        this.replaceElementText(slide, "g2db76eaf1a8_0_30", team1.players[0].pronouns?.toLowerCase() ?? "");
        this.replaceElementText(slide, "g2db76eaf1a8_0_20", this.flag(team1.players[1].country) + " " + team1.players[1].name);
        this.replaceElementText(slide, "g2db76eaf1a8_0_31", team1.players[1].pronouns?.toLowerCase() ?? "");

        // TODO add flags to names
        this.replaceElementText(slide, "g2db76eaf1a8_0_29", team2.name);
        this.replaceElementText(slide, "g2db76eaf1a8_0_23", team2.players[0].name + " " + this.flag(team2.players[0].country));
        this.replaceElementText(slide, "g2db76eaf1a8_0_32", team2.players[0].pronouns?.toLowerCase() ?? "");
        this.replaceElementText(slide, "g2db76eaf1a8_0_22", team2.players[1].name + " " + this.flag(team2.players[1].country));
        this.replaceElementText(slide, "g2db76eaf1a8_0_33", team2.players[1].pronouns?.toLowerCase() ?? "");
    }

    public getPresentationLink() {
        return `https://docs.google.com/presentation/d/${this.presentation.getId()}/edit#slide=id.${this.TITLE_SLIDE_4PLAYERS}`;
    }
}