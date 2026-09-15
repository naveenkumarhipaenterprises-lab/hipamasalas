/**
 * Google Apps Script for HIPA Masalas Website
 * 
 * Instructions:
 * 1. Open Google Sheets (https://sheets.new) and create a new spreadsheet named "HIPA Masalas - Enquiries".
 * 2. Rename the first sheet tab to "Enquiries".
 * 3. Add these header columns in Row 1:
 *    A: Timestamp | B: Full Name | C: Mobile Number | D: Email | E: City / Region | F: Business Type | G: Volume | H: Product | I: Message | J: Source
 * 4. Create a second sheet tab named "Newsletter".
 * 5. Add these header columns in Row 1 of "Newsletter":
 *    A: Timestamp | B: Email Address | C: Source
 * 6. In Google Sheets menu, click: Extensions -> Apps Script.
 * 7. Paste this entire code into the editor.
 * 8. Click "Deploy" -> "New deployment".
 * 9. Select type: "Web app".
 * 10. Execute as: "Me" | Who has access: "Anyone".
 * 11. Click "Deploy" and copy the Web App URL.
 * 12. Add this URL to your .env file as:
 *     GOOGLE_SHEETS_ENQUIRIES_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
 */

function doPost(e) {
  try {
    const sheetApp = SpreadsheetApp.getActiveSpreadsheet();
    const data = JSON.parse(e.postData.contents);

    if (data.type === 'newsletter') {
      let sheet = sheetApp.getSheetByName('Newsletter');
      if (!sheet) {
        sheet = sheetApp.insertSheet('Newsletter');
        sheet.appendRow(['Timestamp', 'Email Address', 'Source']);
      }
      sheet.appendRow([
        data.timestamp || new Date().toISOString(),
        data.emailAddress || '',
        data.source || 'website'
      ]);
      return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Newsletter subscribed' })).setMimeType(ContentService.MimeType.JSON);
    }

    // Default: Enquiry
    let sheet = sheetApp.getSheetByName('Enquiries');
    if (!sheet) {
      sheet = sheetApp.insertSheet('Enquiries');
      sheet.appendRow(['Timestamp', 'Full Name', 'Mobile Number', 'Email', 'City / Region', 'Business Type', 'Volume', 'Product', 'Message', 'Source']);
    }

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.fullName || '',
      data.mobileNumber || '',
      data.emailAddress || '',
      data.cityRegion || '',
      data.businessType || '',
      data.expectedMonthlyVolume || '',
      data.productInterest || '',
      data.message || '',
      data.source || 'website'
    ]);

    return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Enquiry recorded' })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}
