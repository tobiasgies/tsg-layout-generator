import SheetsOnOpen = GoogleAppsScript.Events.SheetsOnOpen;

function onOpen(e: SheetsOnOpen): void {
    e.source.addMenu("Restream", [
        { name: "Generate S7CC Layout", functionName: "AutoLayout" },
        { name: "Generate Generic Layout", functionName: "AutoLayout" } // TODO separate function targeting generic layout
    ])
}


