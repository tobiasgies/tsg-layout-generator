function clearValue() {
  var sheetName = "Layout";
  var columnToCheck = "AX";
  var rowToCheck = 1;
  var triggerValue = "Mismatch";
  var rangeToClean1 = "R2:Y50";
  var rangeToClean2 = "AA2:AG50";
  var rangeToClean3 = "AU2:AZ50";
  
  var sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  var cell = sheet.getRange(columnToCheck + rowToCheck);
  if (cell.getValue() === triggerValue) {
    var range1 = sheet.getRange(rangeToClean1);
    var range2 = sheet.getRange(rangeToClean2);
    var range3  = sheet.getRange(rangeToClean3);

    range1.clearContent();
    range2.clearContent();
    range3.clearContent();
  }
}