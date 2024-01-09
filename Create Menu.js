function CreateLayoutMenu() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Layout')
      .addItem('Create Layout', 'AutoLayout')
      .addToUi();
}


