import SheetsOnOpen = GoogleAppsScript.Events.SheetsOnOpen;

function onOpen(e: SheetsOnOpen): void {
    e.source.addMenu("Restream", [
        { name: "Generate S7CC Layout", functionName: "layoutCCS7" }
    ])
}


