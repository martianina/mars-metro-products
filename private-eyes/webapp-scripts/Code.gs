function doGet(e) {  
  var output = HtmlService.createTemplateFromFile('Index');
  return output
       .evaluate()
       .setSandboxMode(HtmlService.SandboxMode.IFRAME)
       .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/* @Include JavaScript and CSS Files */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}


