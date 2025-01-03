import {Player, Team} from "./data/participants";
import {FaceOffStats} from "./stats_calculator";
import {AbstractRace, SinglePlayerRace, TeamRace} from "./data/races";
import {Racetime} from "./clients/racetime";
import {MidosHouse} from "./clients/midos_house";
import {ChallengeCupSeason8} from "./slide_decks/ccs8";
import {Race} from "./clients/racetime_data";
import Sheet = GoogleAppsScript.Spreadsheet.Sheet;
import {CoOpSeason3} from "./slide_decks/coops3";
import {TriforceBlitzSeason3} from "./slide_decks/tfbs3";

type RaceLoader<T extends AbstractRace> = {
    (tab: Sheet): T[]
}

const PROP_CCS8_TAB = "CCS8_TAB_ID";
const PROP_CCS8_PRES = "CCS8_PRESENTATION_ID";
const PROP_COOPS3_TAB = "COOPS3_TAB_ID";
const PROP_COOPS3_PRES = "COOPS3_PRESENTATION_ID";
const PROP_TFBS3_TAB = "TFBS3_TAB_ID";
const PROP_TFBS3_PRES = "TFBS3_PRESENTATION_ID";

const midos = new MidosHouse()

/**
 * Display a select dialog to start generating a restream layout for CCS8 races. Triggered from menu interaction.
 */
function selectCCS8Race() {
    const tab = getSheetsTabByProperty(PROP_CCS8_TAB);
    selectRace(tab, getScheduledSinglePlayerRace, "layoutCCS8")
}

/**
 * Display a select dialog to start generating a restream layout for Co-Op S3 races. Triggered from menu interaction.
 */
function selectCoOpS3Race() {
    const tab = getSheetsTabByProperty(PROP_COOPS3_TAB);
    selectRace(tab, getCoOpScheduledRaces, "layoutCoOpS3")
}

/**
 * Display a select dialog to start generating a restream layout for TFB S3 races. Triggered from menu interaction.
 */
function selectTFBS3Race() {
    const tab = getSheetsTabByProperty(PROP_TFBS3_TAB);
    selectRace(tab, getScheduledSinglePlayerRace, "layoutTFBS3")
}

function selectRace<T extends AbstractRace>(tab: Sheet, raceLoader: RaceLoader<T>, layoutFunction: string) {
    try {
        const scheduledRaces = raceLoader(tab)
        let template = HtmlService.createTemplateFromFile("select_race.tpl")
        template.races = scheduledRaces
        template.layoutFunction = layoutFunction
        SpreadsheetApp.getUi().showModelessDialog(template.evaluate(), "Select Race")
    } catch (e) {
        SpreadsheetApp.getUi().alert(`An error has occurred: ${e.message}`)
        console.error(e)
    }

}

function getSheetsTabByProperty(propertyName: string) {
    const sheetsTabId = parseInt(PropertiesService.getScriptProperties().getProperty(propertyName));
    let tab = SpreadsheetApp.getActiveSpreadsheet().getSheets().find(it => it.getSheetId() == sheetsTabId)
    if (!tab) {
        throw new Error(`Could not find Google Sheets tab that contains race data. Tab ID ${sheetsTabId} not found.`)
    }
    return tab;
}

function getPresentationByProperty(propertyName: string) {
    const presentationId = PropertiesService.getScriptProperties().getProperty(propertyName);
    const presentation = SlidesApp.openById(presentationId);
    if (!presentation) {
        throw new Error(`Could not find Google Slides presentation containing layout. Presentation ${presentationId} not found.`)
    }
    return presentation;
}

function getScheduledSinglePlayerRace(tab: Sheet) {
    return tab.getRange(`A2:N300`).getValues()
        .filter(row => !!row[12])
        .map(row => new SinglePlayerRace(
            row[12], row[0], row[1], row[2], row[3], row[4], row[5],
            row[6], row[7], row[8], row[9], row[10], row[11], row[13]
        ));
}

function getCoOpScheduledRaces(tab: Sheet) {
    return tab.getRange(`A2:X300`).getValues()
        .filter(row => !!row[22])
        .map(row => new TeamRace(
            row[22], row[0], row[1],
            new Team(row[3], [
                new Player(row[6], null, null, row[7], row[5]),
                new Player(row[10], null, null, row[11], row[9])
            ]),
            new Team(row[13], [
                new Player(row[16], null, null, row[17], row[15]),
                new Player(row[20], null, null, row[21], row[19])
            ]),
            row[23]
        ));
}

function filterCCS8Races(race: Race): boolean {
    return (race.goal.custom == false && race.goal.name == "Standard Ruleset") ||
        (race.goal.custom == true && midos.isStandardGoal(race.goal.name))
}

function filterTFBS3Races(race: Race): boolean {
    return (race.goal.custom == false && race.goal.name == "Triforce Blitz")
}

/**
 * Generate CCS8 layout for given race ID and return URL of presentation. Triggered from client-side javascript.
 * @param raceId The race ID to generate a layout for
 * @return The generated Google Slides' URL
 */
function layoutCCS8(raceId: String): string {
    const tab = getSheetsTabByProperty(PROP_CCS8_TAB);
    const presentation = getPresentationByProperty(PROP_CCS8_PRES);
    const scheduledRace = getScheduledSinglePlayerRace(tab).find(race => race.raceId == raceId)
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
    const stats = FaceOffStats.fromRacetime(racesDedup, player1, player2, filterCCS8Races);
    const slides = new ChallengeCupSeason8(presentation);
    slides.layoutTitleSlide(player1, player2, scheduledRace.round);
    slides.layoutStatsSlide(stats);
    slides.layoutRaceSlide(player1, player2, scheduledRace.round);

    return slides.getPresentationLink();
}

/**
 * Generate TFB S3 layout for given race ID and return URL of presentation. Triggered from client-side javascript.
 * @param raceId The race ID to generate a layout for
 * @return The generated Google Slides' URL
 */
function layoutTFBS3(raceId: String): string {
    const tab = getSheetsTabByProperty(PROP_TFBS3_TAB);
    const presentation = getPresentationByProperty(PROP_TFBS3_PRES);
    const scheduledRace = getScheduledSinglePlayerRace(tab).find(race => race.raceId == raceId)
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
    const stats = FaceOffStats.fromRacetime(racesDedup, player1, player2, filterTFBS3Races);
    const slides = new TriforceBlitzSeason3(presentation);
    slides.layoutTitleSlide(player1, player2, scheduledRace.round);
    slides.layoutStatsSlide(stats);
    slides.layoutRaceSlide(player1, player2, scheduledRace.round);

    return slides.getPresentationLink();
}

/**
 * Generate Co-Op S3 layout for given race ID and return URL of presentation. Triggered from client-side javascript.
 * @param raceId The race ID to generate a layout for
 * @return The generated Google Slides' URL
 */
function layoutCoOpS3(raceId: String): string {
    const tab = getSheetsTabByProperty(PROP_COOPS3_TAB);
    const presentation = getPresentationByProperty(PROP_COOPS3_PRES);
    const scheduledRace = getCoOpScheduledRaces(tab).find(race => race.raceId == raceId)
    if (!scheduledRace) {
        throw new Error(`Could not find race with Race ID ${raceId}.`)
    }

    // Fetch runner pronouns from Racetime
    const racetime = new Racetime();
    for (const player of scheduledRace.team1.players) {
        player.pronouns = racetime.fetchUser(player.racetimeId).pronouns
    }
    for (const player of scheduledRace.team2.players) {
        player.pronouns = racetime.fetchUser(player.racetimeId).pronouns
    }
    const slides = new CoOpSeason3(presentation);
    slides.layoutTitleSlide(scheduledRace.team1, scheduledRace.team2, scheduledRace.round);
    slides.layoutRaceSlide(scheduledRace.team1, scheduledRace.team2, scheduledRace.round);

    return slides.getPresentationLink();
}
