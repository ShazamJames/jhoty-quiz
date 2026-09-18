# Illuminating Dharamsal Quiz: GitHub package

Includes a welcome page, the requested exact Vikar question changes, the existing quiz/scoring, results-page community invitation, participant results email and a separate opted-in subscriber list.

## REQUIRED CONFIGURATION BEFORE GOING LIVE

1. In `index.html` and `elemental-tattva-profile.html`, replace the empty `WHATSAPP_GROUP_URL = ""` with your actual WhatsApp group invite URL. The button is hidden until configured.
2. In `google-apps-script.gs`, set `RESPONSE_TAB` to the **exact existing response tab name**. It is set to `Responses` as a placeholder; your actual tab may have been renamed. Do not create a new tab instead of using your existing one.
3. In the same Apps Script, set `WHATSAPP_GROUP_URL` to your actual WhatsApp invite link. Until set, the email says the link is coming soon.
4. Optional: set `ADMIN_NOTIFICATION_EMAIL` to receive a separate notification in your own inbox. It is blank by default. Participant results are sent to the email entered in the form.
5. Paste the new `.gs` into the **existing bound Apps Script project** for your Google Sheet, then **Deploy > Manage deployments > Edit > New version > Deploy**. Keep the same existing web-app URL, and authorize MailApp permissions when prompted. Simply uploading to GitHub does NOT update Apps Script.
6. Test with your own email: confirm a row in the existing responses tab, a results email, the WhatsApp link and a subscriber row when the optional newsletter checkbox is selected. Check Apps Script Executions for delivery errors. The frontend confirms saving, not email delivery.

## Subscriber list

A `Subscribers` tab is automatically created in the same Google spreadsheet, with columns Email, Name, Location, Source, First subscribed, Last subscribed, Newsletter consent. It adds only people who opt in to newsletters, deduplicated by email. To consolidate e-book leads, add a matching opt-in process that writes to this same tab (or later sync both sources to a mailing platform). This package does NOT yet connect the e-book form or a newsletter platform.

## Consent

The required checkbox is for sending quiz results. The newsletter checkbox is separate and optional. Do not send marketing newsletters to participants who have not opted in. The WhatsApp group is invitation-only: no automatic group joining.

## Notes

- Existing quiz Web App URL remains embedded in the HTML.
- Existing response columns remain in their original order. New fields (element title, newsletter opt-in, source) are appended at the end.
- The requested community text is preserved verbatim, including `soace` and `loose`.
- WhatsApp URL and exact response tab name were not provided, so these need to be configured.
- The email script has not been deployed or tested against your Google account.
