import {Player} from "./data/player";
import {FaceOffStats} from "./stats_calculator";
import {ScheduledRace} from "./data/scheduled_race";
import {Racetime} from "./clients/racetime";
import {MidosHouse} from "./clients/midos_house";
import {ChallengeCupSeason7} from "./slide_decks/ccs7";
import {Race} from "./clients/racetime_data";
import Sheet = GoogleAppsScript.Spreadsheet.Sheet;

const midos = new MidosHouse()

/**
 * Display a select dialog to start generating a restream layout for CCS7 races. Triggered from menu interaction.
 */
function selectCCS7Race() {
    try {
        const tab = getCCS7Tab()
        const scheduledRaces = getCCS7ScheduledRaces(tab)
        let template = HtmlService.createTemplateFromFile("select_race.tpl")
        template.races = scheduledRaces
        SpreadsheetApp.getUi().showModelessDialog(template.evaluate(), "Select Race")
    } catch (e) {
        SpreadsheetApp.getUi().alert(`An error has occurred: ${e.message}`)
        console.error(e)
    }

}

function getCCS7Tab() {
    const sheetsTabId = parseInt(PropertiesService.getScriptProperties().getProperty("CCS7_TAB_ID"));
    let tab = SpreadsheetApp.getActiveSpreadsheet().getSheets().find(it => it.getSheetId() == sheetsTabId)
    if (!tab) {
        throw new Error(`Could not find Google Sheets tab that contains race data. Tab ID ${sheetsTabId} not found.`)
    }
    return tab;
}

function getCCS7ScheduledRaces(tab: Sheet) {
    return tab.getRange(`A2:N300`).getValues()
        .filter(row => !!row[12])
        .map(row => new ScheduledRace(
            row[12], row[0], row[1], row[2], row[3], row[4], row[5],
            row[6],row[7], row[8], row[9], row[10], row[11], row[13]
        ));
}

function getCCS7Presentation() {
    const presentationId = PropertiesService.getScriptProperties().getProperty("CCS7_PRESENTATION_ID");
    const presentation = SlidesApp.openById(presentationId);
    if (!presentation) {
        throw new Error(`Could not find Google Slides presentation containing layout. Presentation ${presentationId} not found.`)
    }
    return presentation;
}

function filterCCS7Races(race: Race): boolean {
    return (race.goal.custom == false && race.goal.name == "Standard Ruleset") ||
        (race.goal.custom == true && midos.isStandardGoal(race.goal.name))
}

/**
 * Generate CCS7 layout for given race ID and return URL of presentation. Triggered from client-side javascript.
 * @param raceId The race ID to generate a layout for
 * @return The generated Google Slides' URL
 */
function layoutCCS7(raceId: String): string {
    const tab = getCCS7Tab();
    const presentation = getCCS7Presentation();
    const scheduledRace = getCCS7ScheduledRaces(tab).find(race => race.raceId == raceId)
    if (!scheduledRace) {
        throw new Error(`Could not find race with Race ID ${raceId}.`)
    }

    // Fetch runner stats from Racetime and calculate face-off stats
    const racetime = new Racetime();
    const user1 = racetime.fetchUser(scheduledRace.runner1RacetimeId);
    const user2 = racetime.fetchUser(scheduledRace.runner2RacetimeId);
    const player1 = new Player(scheduledRace.runner1Name, user1.twitch_name, scheduledRace.runner1QualifierRank, scheduledRace.runner1Country, user1.id, user1.pronouns);
    const player2 = new Player(scheduledRace.runner2Name, user2.twitch_name, scheduledRace.runner2QualifierRank, scheduledRace.runner2Country, user2.id, user2.pronouns);
    const races: Race[] = [user1, user2].flatMap(racetime.fetchUserRaces.bind(racetime));
    const racesDedup = [... new Set(races)];
    const stats = FaceOffStats.fromRacetime(racesDedup, player1, player2, filterCCS7Races);
    const ccs7 = new ChallengeCupSeason7(presentation);
    ccs7.layoutTitleSlide(player1, player2, scheduledRace.round);
    ccs7.layoutStatsSlide(stats);
    ccs7.layoutRaceSlide(player1, player2, scheduledRace.round);

    return ccs7.getPresentationLink();
}
