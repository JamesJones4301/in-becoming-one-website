const CONFIG = {
  tabs: {
    contact: "ContactRequests",
    newsletter: "Newsletter",
    prayer: "PrayerRequests",
    volunteer: "VolunteerRequests",
    donation: "DonationQuestions",
    partner: "PartnerRequests",
    booking: "BookingRequests"
  }
};

function setupInBecomingOneSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  createSheetWithHeaders_(spreadsheet, CONFIG.tabs.contact, [
    "Timestamp", "First Name", "Last Name", "Email", "Interest", "Message", "Source", "Status", "Notes"
  ]);

  createSheetWithHeaders_(spreadsheet, CONFIG.tabs.newsletter, [
    "Timestamp", "Name", "Email", "Source", "Status", "Notes"
  ]);

  createSheetWithHeaders_(spreadsheet, CONFIG.tabs.prayer, [
    "Timestamp", "First Name", "Last Name", "Email", "Prayer Request", "Follow Up Allowed", "Source", "Status", "Notes"
  ]);

  createSheetWithHeaders_(spreadsheet, CONFIG.tabs.volunteer, [
    "Timestamp", "First Name", "Last Name", "Email", "Phone", "Area Of Interest", "Availability", "Message", "Source", "Status", "Notes"
  ]);

  createSheetWithHeaders_(spreadsheet, CONFIG.tabs.donation, [
    "Timestamp", "First Name", "Last Name", "Email", "Message", "Source", "Status", "Notes"
  ]);

  createSheetWithHeaders_(spreadsheet, CONFIG.tabs.partner, [
    "Timestamp", "Organization", "First Name", "Last Name", "Email", "Partnership Type", "Message", "Source", "Status", "Notes"
  ]);

  createSheetWithHeaders_(spreadsheet, CONFIG.tabs.booking, [
    "Timestamp", "First Name", "Last Name", "Email", "Event Type", "Event Date", "Location", "Message", "Source", "Status", "Notes"
  ]);

  SpreadsheetApp.flush();
}

function doPost(e) {
  try {
    setupInBecomingOneSheet();

    const data = JSON.parse(e.postData.contents || "{}");
    const formType = clean_(data.formType || "contact");
    const interest = clean_(data.interest || "");

    if (formType === "newsletter") {
      saveNewsletter_(data);
    } else if (formType === "prayer" || interest === "Prayer Request") {
      savePrayer_(data);
    } else if (formType === "volunteer" || interest === "Volunteer") {
      saveVolunteer_(data);
    } else if (formType === "donation" || interest === "Donation Question") {
      saveDonation_(data);
    } else if (formType === "partner" || interest === "Partnership") {
      savePartner_(data);
    } else if (formType === "booking" || interest === "Contact & Book Us" || interest === "Speaking & Events") {
      saveBooking_(data);
      saveContact_(data);
    } else {
      saveContact_(data);
    }

    return jsonResponse_({ ok: true, message: "Submission received." });
  } catch (error) {
    return jsonResponse_({ ok: false, message: error.message });
  }
}

function doGet() {
  return jsonResponse_({ ok: true, message: "In Becoming One Apps Script is live." });
}

function saveContact_(data) {
  getSheet_(CONFIG.tabs.contact).appendRow([
    new Date(), clean_(data.firstName), clean_(data.lastName), clean_(data.email), clean_(data.interest), clean_(data.message), clean_(data.source || "Website"), "New", ""
  ]);
}

function saveNewsletter_(data) {
  getSheet_(CONFIG.tabs.newsletter).appendRow([
    new Date(), clean_(data.name), clean_(data.email), clean_(data.source || "Website"), "New", ""
  ]);
}

function savePrayer_(data) {
  getSheet_(CONFIG.tabs.prayer).appendRow([
    new Date(), clean_(data.firstName), clean_(data.lastName), clean_(data.email), clean_(data.message), clean_(data.followUpAllowed || "Not specified"), clean_(data.source || "Website"), "New", ""
  ]);
}

function saveVolunteer_(data) {
  getSheet_(CONFIG.tabs.volunteer).appendRow([
    new Date(), clean_(data.firstName), clean_(data.lastName), clean_(data.email), clean_(data.phone), clean_(data.interest), clean_(data.availability), clean_(data.message), clean_(data.source || "Website"), "New", ""
  ]);
}

function saveDonation_(data) {
  getSheet_(CONFIG.tabs.donation).appendRow([
    new Date(), clean_(data.firstName), clean_(data.lastName), clean_(data.email), clean_(data.message), clean_(data.source || "Website"), "New", ""
  ]);
}

function savePartner_(data) {
  getSheet_(CONFIG.tabs.partner).appendRow([
    new Date(), clean_(data.organization), clean_(data.firstName), clean_(data.lastName), clean_(data.email), clean_(data.interest), clean_(data.message), clean_(data.source || "Website"), "New", ""
  ]);
}

function saveBooking_(data) {
  getSheet_(CONFIG.tabs.booking).appendRow([
    new Date(), clean_(data.firstName), clean_(data.lastName), clean_(data.email), clean_(data.interest), clean_(data.eventDate), clean_(data.location), clean_(data.message), clean_(data.source || "Website"), "New", ""
  ]);
}

function createSheetWithHeaders_(spreadsheet, sheetName, headers) {
  let sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }

  const firstRow = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const hasHeaders = firstRow.some(function(cell) {
    return String(cell || "").trim() !== "";
  });

  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    sheet.autoResizeColumns(1, headers.length);
  }
}

function getSheet_(sheetName) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error("Missing sheet tab: " + sheetName);
  }

  return sheet;
}

function clean_(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

function jsonResponse_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
