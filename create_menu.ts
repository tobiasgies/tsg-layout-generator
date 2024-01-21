import SheetsOnOpen = GoogleAppsScript.Events.SheetsOnOpen;

function onOpen(e: SheetsOnOpen): void {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('Restream')
        .addItem('Generate S7CC Layout', 'AutoLayout')
        .addItem('Generate Generic Layout', 'AutoLayout') // TODO separate function targeting generic layout
        .addToUi();
}


