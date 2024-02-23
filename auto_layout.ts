import {Player} from "./data/player";
import {FaceOffStats} from "./stats_calculator";
import {ScheduledRace} from "./data/scheduled_race";
import {Racetime} from "./clients/racetime";
import {EnrichedRace, enrichRace} from "./clients/racetime_data";
import {MidosHouse} from "./clients/midos_house";
import {ChallengeCupSeason7} from "./slide_decks/ccs7";

const midos = new MidosHouse()

function filterCCS7Races(race: EnrichedRace): boolean {
    return (race.goal.custom == false && race.goal.name == "Standard Ruleset") ||
        (race.goal.custom == true && midos.isStandardGoal(race.goal.name))
}

function layoutCCS7(): void {
    const ui = SpreadsheetApp.getUi();

    const sheetsTabId = parseInt(PropertiesService.getScriptProperties().getProperty("CCS7_TAB_ID"));
    const tab = SpreadsheetApp.getActiveSpreadsheet().getSheets().find(it => it.getSheetId() == sheetsTabId)
    if (!tab) {
        ui.alert(`ERROR: Could not find Google Sheets tab that contains race data. Tab ID ${sheetsTabId} not found.`)
        return;
    }

    const presentationId = PropertiesService.getScriptProperties().getProperty("CCS7_PRESENTATION_ID");
    const presentation = SlidesApp.openById(presentationId);
    if (!presentation) {
        ui.alert(`ERROR: Could not find Google Slides presentation containing layout. Presentation ${presentationId} not found.`)
        return;
    }

    let rowNumber = ui.prompt("Enter the row number of the match").getResponseText();
    if (isNaN(parseInt(rowNumber))) {
        ui.alert("Invalid input, please enter a number");
        return;
    }

    let row = tab.getRange(`A${rowNumber}:AH${rowNumber}`).getValues()[0];
    if (!row[12]) {
        ui.alert("You seem to have selected an empty row - the race ID is not set.")
        return;
    }

    let scheduledRace = new ScheduledRace(
        row[12], row[0], row[1], row[2], row[3], row[4], row[5],
        row[6],row[7], row[8], row[9], row[10], row[11], row[13]
    )

    // Fetch runner stats from Racetime and calculate face-off stats
    try {
        const racetime = new Racetime()
        const user1 = racetime.fetchUser(scheduledRace.runner1RacetimeId);
        const user2 = racetime.fetchUser(scheduledRace.runner2RacetimeId);
        const player1 = new Player(scheduledRace.runner1Name, user1.twitch_name, scheduledRace.runner1QualifierRank, scheduledRace.runner1Country, user1.id, user1.pronouns);
        const player2 = new Player(scheduledRace.runner2Name, user2.twitch_name, scheduledRace.runner2QualifierRank, scheduledRace.runner2Country, user2.id, user2.pronouns);
        const races = [user1, user2].flatMap(racetime.fetchUserRaces).map(enrichRace);
        const racesDedup = [... new Set(races)];
        const stats = FaceOffStats.fromRacetime(racesDedup, player1, player2, filterCCS7Races);
        const ccs7 = new ChallengeCupSeason7(presentation);
        ccs7.layoutTitleSlide(player1, player2, scheduledRace.round);
        ccs7.layoutStatsSlide(stats);
        ccs7.layoutRaceSlide(player1, player2, scheduledRace.round);

        const link = ccs7.getPresentationLink();
        SpreadsheetApp.getUi().showModelessDialog(HtmlService.createHtmlOutput(
            '<script>window.open("' + link + '");google.script.host.close();</script>' +
            '<p>Attempting to open generated slides. If this does not work, please <a href="' + link +'">click here.</a></p>'
        ), 'Opening...');
    } catch (e) {
        ui.alert(`Sorry, but an error occured fetching data from racetime.gg: ${e.message}`)
        return;
    }

    // Layout slides
    // Send user to generated slide deck
}