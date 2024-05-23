import SheetsOnOpen = GoogleAppsScript.Events.SheetsOnOpen;

function onOpen(e: SheetsOnOpen): void {
    e.source.addMenu("Restream", [
        { name: "Generate S7CC Layout", functionName: "selectCCS7Race" },
        { name: "Generate Co-Op S3 Layout", functionName: "selectCoOpS3Race" }
    ])
}


