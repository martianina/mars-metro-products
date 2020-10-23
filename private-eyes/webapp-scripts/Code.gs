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
  




  function afterFormSubmit(e) {
  
  const info = e.namedValues;
  const pdfFile = createPDF(info);
  const entryRow = e.range.getRow();
  const ws = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Work Product");
  ws.getRange(entryRow, 1).setValue(pdfFile.getUrl());
  
  sendEmail(e.namedValues['Email Address'][0],pdfFile);
  
}

function sendEmail(email,pdfFile){
  
  GmailApp.sendEmail(email, "Your New Private Eyes Policy is Attached!", "Congratulations!\nYour Customized Private Eyes Privacy Policy is attached to this email as a PDF.\n   \nFor detailed video instructions, visit your Private Eyes Portal.\n   \nThanks again for using Private Eyes!\n   \nNina Kilbride\nFounder, Mars Metro\nwww.marsmetro.com",{
    attachments: [pdfFile],
    name: 'Private Eyes Privacy Policy'
  });
  
}

function createPDF(info){
  
  const pdfFolder = DriveApp.getFolderById("1CBa-e0hDXR_k4MZ2zjWBtoyE2-21InbC");
  const tempFolder = DriveApp.getFolderById("1dnYbRQ73CwvBQq-stc5pvUOY7hV3UXLo");
  const templateDoc = DriveApp.getFileById("11YX9gwHjaXpp9sCu3-EfroRId9vrnSSG4M_HxdZaK2E");
  
  const newTempFile = templateDoc.makeCopy(tempFolder);
  
  const openDoc = DocumentApp.openById(newTempFile.getId());
  const body = openDoc.getBody();
  body.replaceText("{companyName1}", info['Legal Company Name'][0]+ ", " + info['List all other names under which you do business, separated by commas.'][0]);
  body.replaceText("{companyName}", info['Legal Company Name'][0]);
  body.replaceText("{dataType}", info['What kinds of personal information do you collect directly from users?'][0]);
  body.replaceText("{partners}", info['Do you share user data with your business partners?'][0]);
  body.replaceText("{affiliates}", info['Do you share user data with your business affiliates?'][0]);                                    
  body.replaceText("{trackingTechnologies}", info['Do you utilize tracking technologies?'][0]);                                    
  body.replaceText("{privacyEmail}", info['What is the contact email address for user data privacy issues?'][0]);  
 
  var cookieManager = info['Does your website utilize a "cookie manager" tool?'][0];
 
       if (info['Does your website utilize a "cookie manager" tool?'][0] == "Yes") {
         body.replaceText("{cookieManager}", "We utilize a cookie management tool on our website where users may view and alter their cookie preferences.");
       }
       
       else if (info['Does your website utilize a "cookie manager" tool?'][0] == "No") {
          body.replaceText("{cookieManager}", " ");
       }
       
  var under16 = info['Does your website or app allow use by individuals under the age of 16?'][0];
  
       if (info['Does your website or app allow use by individuals under the age of 16?'][0] == "Yes") {
         body.replaceText("{under16}", "We understand the critical importance of protecting children's privacy. If we allow users under 16 to make accounts or use the Services, we will obtain parental consent prior to the collection of their personal information. If you are a parent of a user under 16, we may ask your child to provide a parent's email address so that we may directly notify you of our privacy practices and obtain your consent. If you do not respond to this email, we will delete the user’s data. We may allow children to use the website, app, or Service, or receive a one-time communication from us. When we do that, we will collect the child's first name, email address, and sometimes their state of residence, as well as a parent's email address to provide you an opportunity for you to opt your child out. We will use the collected information for the purpose collected, and delete the information from our records once it is no longer required. We do not send text messages or other non-email messages (like chat) to children. We do not allow users under 16 to use social media sharing or login functions or use, or allow our partners or affilates to use, automatically collected information, such as IP addresses, cookie identifiers, and other device identifiers, other than for purposes of supporting our internal operations, such as to provide children with access to features and activities on the Services, to customize content and improve our Services, or serve contextual advertising or limit the number of times you or your child sees a particular advertisement. We never allow interest-based advertising on portions of our Services that are directed to children or where we know that the user is a child or a teen under 16. If you are a parent of a user under 16, at any time you can request that we delete the personal information we have collected about your child from our records, and that we stop collecting information about your child.");  
       }
  
        else if (info['Does your website or app allow use by individuals under the age of 16?'][0] == "No") {
          body.replaceText("{under16}", "Our Services are not intended for use by children. We do not knowingly collect personally identifiable information from users under age 16 (“Child” or “Children”). If you become aware that a Child has provided us with Personal Data, please contact us. If we discover that we have collected Personal Data from Children without verification of parental consent, we will take steps to delete that information.");       
       }
  
 var under13 = info['Does your website or app allow use by individuals under the age of 13?'][0];
  
       if (info['Does your website or app allow use by individuals under the age of 13?'][0] == "Yes") {
      body.replaceText("{under13}", "Some of the Services are directed to children under 13, while other Services or portions of them are intended for use by adults and teens age 13 and older."); 
       }
  
       else if (info['Does your website or app allow use by individuals under the age of 13?'][0] == "No") {
          body.replaceText("{under13}", " ");       
       }
  
  
 var thirdPartyLinks = info['Do you use a third-party payments provider?'][0];
  
         if (info['Do you use a third-party payments provider?'][0] == "Yes") {
         body.replaceText("{thirdPartyLinks}", "We attach the privacy policies of the following payment processors we use to do business."+ " "+ info['Locate and paste the URLs, separated by commas, of the privacy policies of your payments provider(s)'][0]);  
       }
  
        else if (info['Do you use a third-party payments provider?'][0] == "No") {
          body.replaceText("{thirdPartyLinks}", " ");       
       }
  

  

  var date = new Date();
  var month = date.getMonth()+1;
  var year = date.getFullYear();
  
  body.replaceText("{policyDate}", month+ '/' +year);  //adds date to end
 


                                             
  openDoc.saveAndClose();
  
  const blobPDF = newTempFile.getAs(MimeType.PDF);
  const pdfFile = pdfFolder.createFile(blobPDF).setName(info['Legal Company Name'][0]+ " " + "Privacy Policy" + " " + new Date());
  newTempFile.setName(info['Legal Company Name'][0]+ " " + "Privacy Policy Editable Version");
  newTempFile.addEditor(info['Email Address'][0]);
   
  
  return pdfFile;
  
}


