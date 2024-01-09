function UpdateStats() {
  var spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.getRange('D1').activate();
  spreadsheet.setActiveSheet(spreadsheet.getSheetByName('Stats'), true);
  spreadsheet.getRange('E9').activate();
  spreadsheet.getActiveSheet().getFilter().sort(5, false);
  spreadsheet.setActiveSheet(spreadsheet.getSheetByName('Stats CoHost'), true);
  spreadsheet.getActiveSheet().getFilter().sort(5, false);
};


function DateState() {
 var spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.getRange('E36').activate();
  spreadsheet.setActiveSheet(spreadsheet.getSheetByName('Organisation Support'), true);
  spreadsheet.getRange('R1').activate();
  var criteria = SpreadsheetApp.newFilterCriteria()
  .setHiddenValues(['Match fait', 'Annulé', 'Refus'])
  .build();
  spreadsheet.getActiveSheet().getFilter().setColumnFilterCriteria(18, criteria);
  spreadsheet.getRange('E1').activate();
  spreadsheet.getActiveSheet().getFilter().sort(5, true);
  spreadsheet.setActiveSheet(spreadsheet.getSheetByName('Organisation Interne'), true);
  criteria = SpreadsheetApp.newFilterCriteria()
  .setHiddenValues(['Match fait', 'Annulé', 'Refus'])
  .build();
  spreadsheet.getActiveSheet().getFilter().setColumnFilterCriteria(22, criteria);
  spreadsheet.getRange('D1').activate();
  spreadsheet.getActiveSheet().getFilter().sort(4, true);
};

function StatsLeague() {
  var spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.getRange('I5').activate();
  spreadsheet.setActiveSheet(spreadsheet.getSheetByName('Stats League'), true);
  spreadsheet.getRange('E3').activate();
  spreadsheet.getActiveSheet().getFilter().sort(5, false);
};

