import SheetsOnOpen = GoogleAppsScript.Events.SheetsOnOpen;

function onOpen(e: SheetsOnOpen): void {
    e.source.addMenu("Restream", [
        { name: "Generate S8CC Layout", functionName: "selectCCS8Race" },
        { name: "Generate Co-Op S3 Layout", functionName: "selectCoOpS3Race" },
        { name: "Generate Triforce Blitz S3 Layout", functionName: "selectTFBS3Race" }
    ])
}


