# In Becoming One Inc. Website

Faith-based 501(c)(3), Veteran-Owned nonprofit website for In Becoming One Inc.

## Phase 1 Stack

- GitHub stores the website code.
- Vercel hosts the website.
- Vercel API route protects the Google Apps Script URL.
- Google Apps Script receives form submissions.
- Google Sheets stores submissions in organized tabs.
- Zeffy, Cash App, and Venmo links can be connected later.

## Files In This Repository

```text
index.html
assets/logo.svg
api/submit.js
package.json
google-apps-script.js
README.md
```

## Step 1: Create the Google Sheet

Create a blank Google Sheet named:

```text
In Becoming One Website Submissions
```

## Step 2: Add Google Apps Script

1. Open the Google Sheet.
2. Click Extensions.
3. Click Apps Script.
4. Delete the starter code.
5. Copy all code from `google-apps-script.js` in this repository.
6. Paste it into Apps Script.
7. Save.

## Step 3: Create Sheet Tabs Automatically

1. In Apps Script, choose the function `setupInBecomingOneSheet`.
2. Click Run.
3. Approve the permission request.
4. Return to Google Sheets.
5. The script creates these tabs:

```text
ContactRequests
Newsletter
PrayerRequests
VolunteerRequests
DonationQuestions
PartnerRequests
BookingRequests
```

## Step 4: Deploy Apps Script As Web App

1. In Apps Script, click Deploy.
2. Click New deployment.
3. Choose Web app.
4. Description: `In Becoming One Website Backend`.
5. Execute as: `Me`.
6. Who has access: `Anyone`.
7. Click Deploy.
8. Copy the Web App URL.

## Step 5: Connect GitHub To Vercel

1. Go to Vercel.
2. Sign in with GitHub.
3. Click Add New Project.
4. Select this repository.
5. Framework preset: Other.
6. Build command: leave blank.
7. Output directory: leave blank.
8. Add Environment Variable:

```text
GOOGLE_APPS_SCRIPT_URL
```

9. Paste the Apps Script Web App URL as the value.
10. Click Deploy.

## Step 6: Test

1. Open the Vercel website URL.
2. Submit the Contact & Book Us form.
3. Check Google Sheets.
4. The submission should appear in `ContactRequests`.
5. If the interest is Contact & Book Us or Speaking & Events, it also appears in `BookingRequests`.

## Donation Links

The website has placeholders for:

- Zeffy
- Cash App
- Venmo

Replace `href="#"` in `index.html` when each official link is ready.

## Notes

Do not expose the Google Apps Script Web App URL directly in `index.html`. Keep it in Vercel as the environment variable `GOOGLE_APPS_SCRIPT_URL`.
