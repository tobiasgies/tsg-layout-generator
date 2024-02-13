// Replace "presentationId" with the actual ID of the Google Slides presentation
import Slide = GoogleAppsScript.Slides.Slide;
import {Player} from "./data/player";
import {PlayerStats} from "./data/player_stats";
import {FaceOffStats} from "./stats_calculator";

var presentationId = "CHANGEME";

// Replace "tabName" with the name of the tab that contains the cell
var tabName = "Layout";

function autoLayout(): void {
    var ui = SpreadsheetApp.getUi();
    var number = ui.prompt("Enter the row number of the match").getResponseText();
    if (isNaN(parseInt(number))) {
        ui.alert("Invalid input, please enter a number");
        return;
    }

    var sheet = SpreadsheetApp.getActiveSheet();
    var namePlayer1 = sheet.getRange("E" + number).getValue();
    var countryPlayer1 = sheet.getRange("Q" + number).getValue();
    var rankPlayer1 = sheet.getRange("S" + number).getValue();
    var streamPlayer1 = sheet.getRange("R" + number).getValue();
    var idP1 = sheet.getRange("W" + number).getValue();

    var player1 = new Player(namePlayer1, streamPlayer1, rankPlayer1, countryPlayer1, idP1);

    var countryPlayer2 = sheet.getRange("T" + number).getValue();
    var rankPlayer2 = sheet.getRange("V" + number).getValue();
    var streamPlayer2 = sheet.getRange("U" + number).getValue();
    var namePlayer2 = sheet.getRange("G" + number).getValue();
    var idP2 = sheet.getRange("X" + number).getValue();

    var player2 = new Player(namePlayer2, streamPlayer2, rankPlayer2, countryPlayer2, idP2);

    var group = sheet.getRange("C" + number).getValue();

    var idcc = sheet.getRange("A" + number).getValue();
    sheet.getRange("BD" + number).setValue(idcc);

    var stat = getRacetimeData(player1.racetimeId, player2.racetimeId);

    // We use the Spreadsheet to format the data as we need it.
    // So take the stats data from racetime and put it into the spreadsheet so it can do its formatting magic.
    sheet.getRange("Y" + number).setValue(stat.p1.ranked1);
    sheet.getRange("Z" + number).setValue(stat.p1.ranked2);
    sheet.getRange("AA" + number).setValue(stat.p1.ranked3);
    sheet.getRange("AB" + number).setValue(stat.p1.forfeited);
    sheet.getRange("AC" + number).setValue(stat.p2.ranked1);
    sheet.getRange("AD" + number).setValue(stat.p2.ranked2);
    sheet.getRange("AE" + number).setValue(stat.p2.ranked3);
    sheet.getRange("AF" + number).setValue(stat.p2.forfeited);
    sheet.getRange("AH" + number).setValue(stat.p1.win);
    sheet.getRange("AI" + number).setValue(stat.p2.win);
    sheet.getRange("AJ" + number).setValue(stat.p1.draw);
    sheet.getRange("AK" + number).setValue(stat.p1.nb_races);
    sheet.getRange("AL" + number).setValue(stat.p2.nb_races);
    sheet.getRange("AM" + number).setValue(stat.p1.bestTime);
    sheet.getRange("AN" + number).setValue(stat.p2.bestTime);
    sheet.getRange("BB" + number).setValue(stat.p1.bestTimeDate);
    sheet.getRange("BC" + number).setValue(stat.p2.bestTimeDate);
    sheet.getRange("BF" + number).setValue(stat.p1.pronouns);
    sheet.getRange("BG" + number).setValue(stat.p2.pronouns);


    // Construct player stats objects with formatted data from spreadsheet.
    var p1pronouns = sheet.getRange("BF" + number).getValue();
    player1.pronouns = p1pronouns;

    var p1r1 = sheet.getRange("AT" + number).getValue();
    var p1r2 = sheet.getRange("AU" + number).getValue();
    var p1r3 = sheet.getRange("AV" + number).getValue();
    var p1ff = sheet.getRange("AW" + number).getValue();
    var nbracep1 = sheet.getRange("AK" + number).getValue();
    var besttimep1 = sheet.getRange("AO" + number).getValue();
    var datebesttimep1 = sheet.getRange("BB" + number).getDisplayValues();

    var player1Stats = new PlayerStats(player1, nbracep1, besttimep1, datebesttimep1, p1r1, p1r2, p1r3, p1ff);

    var p2pronouns = sheet.getRange("BG" + number).getValue();
    player2.pronouns = p2pronouns;

    var p2r1 = sheet.getRange("AX" + number).getValue();
    var p2r2 = sheet.getRange("AY" + number).getValue();
    var p2r3 = sheet.getRange("AZ" + number).getValue();
    var p2ff = sheet.getRange("BA" + number).getValue();
    var nbracep2 = sheet.getRange("AL" + number).getValue();
    var besttimep2 = sheet.getRange("AP" + number).getValue();
    var datebesttimep2 = sheet.getRange("BC" + number).getDisplayValues();

    var player2Stats = new PlayerStats(player2, nbracep2, besttimep2, datebesttimep2, p2r1, p2r2, p2r3, p2ff);

    var encounters = sheet.getRange("AG" + number).getValue();
    var p1win = sheet.getRange("AH" + number).getValue();
    var p2win = sheet.getRange("AI" + number).getValue();
    var draw = sheet.getRange("AJ" + number).getValue();

    var faceOffStats = new FaceOffStats({
        encounters: encounters,
        player1Wins: p1win,
        player2Wins: p2win,
        draws: draw
    });

    ui.alert("Stats are now generated, updating slides!");

    var all_slide = SlidesApp.openById(presentationId);

    var start = all_slide.getSlides()[1];
    layoutTitleSlide(start, player1, player2);

    var stats = all_slide.getSlides()[2];
    LayoutStatsSlide(stats, player1Stats, player2Stats, faceOffStats);

    var match = all_slide.getSlides()[3];
    layoutRaceSlide(match, player1, player2, group);

    var link = "https://docs.google.com/presentation/d/" + presentationId + "/edit#slide=id.g10aa2c5d08b_0_13";
    SpreadsheetApp.getUi().showModelessDialog(HtmlService.createHtmlOutput('<script>window.open("' + link + '");google.script.host.close();</script>'), 'Opening...');
}

