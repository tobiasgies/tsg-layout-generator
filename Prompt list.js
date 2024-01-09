function promptDropdown() {
  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheetByName("Layout");
  var range = sheet.getRange("B2:B");
  var values = range.getValues();
  
  // Get non-empty cells in column B
  var options = [];
  for (var i = 0; i < values.length; i++) {
    if (values[i][0] != "") {
      options.push(values[i][0]);
    }
  }
  
  // Prompt user with dropdown list
  var selectedOption = Browser.inputBox("Select an option", Browser.Buttons.OK_CANCEL, options);
  
  // Get the number of the line of the selected option
  var selectedOptionIndex = options.indexOf(selectedOption);
  var selectedOptionRow = selectedOptionIndex + 2;
  Logger.log(selectedOptionRow);
}