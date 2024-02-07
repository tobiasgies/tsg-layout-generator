import Slide = GoogleAppsScript.Slides.Slide;

export class ChallengeCupSeason7 {
    private readonly presentationId: string;
    private readonly TITLE_SLIDE_2PLAYERS = "g10aa2c5d08b_0_13"
    private readonly STATS_SLIDE_2PLAYERS = "g20587f4170f_0_36"
    private readonly RACE_SLIDE_2PLAYERS = "g20587f4170f_0_22"
    private readonly TITLE_SLIDE_3PLAYERS = "g2b3dc24f00e_1_0"
    private readonly RACE_SLIDE_3PLAYERS = "g2b1b1a75d12_0_0"

    public constructor(presentationId: string) {
        this.presentationId = presentationId;
    }

    private replaceElementText(slide: Slide, elementId: string, newText: string) {
        const pageElement = slide.getPageElementById(elementId);
        const elementShape = pageElement.asShape();
        const elementText = elementShape.getText();
        elementText.setText(newText);
    }
}