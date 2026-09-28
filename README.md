# Illuminating Dharamsal Quiz

This update adds full personalised results to the participant email.

Changes:
- Newsletter checkbox removed.
- One checkbox only: "Send full results & community access to my email".
- New required community question underneath Location.
- Community answer saved with each quiz response.
- All quiz emails are deduplicated into the `Subscribers` sheet.
- Results email includes Guna, Vikar, Virtue-Vice Orientation, primary Tattva,
  a five-element visual bar breakdown, and the community invitation.
- HTML email has one WhatsApp CTA button only.

Apps Script deployment:
1. Open the response Google Sheet.
2. Extensions > Apps Script.
3. Replace the current script with `google-apps-script.gs`.
4. Confirm the response tab is called `Responses`, or change `RESPONSE_TAB`.
5. Save.
6. Deploy > Manage deployments > Edit > New version > Deploy.
7. Authorise Mail permissions if prompted.
8. Test by completing the live quiz. Do not click Run on `doPost`.

Response columns:
Timestamp | Name | Email | Location | Virtues | Vices | Orientation |
Earth | Water | Fire | Air | Ether | Primary Element | Community Reason | Source

If your current header row stops at Ether, add:
Primary Element | Community Reason | Source

Note: keeping an email address for delivering quiz results/community access is not automatically
the same as marketing-newsletter consent. If you later use these addresses for newsletters,
use an appropriate marketing consent/opt-out process for your audience and jurisdiction.
