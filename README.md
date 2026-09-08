# Elemental Tattva Profile

Combined GitHub-ready version of the quiz.

## Included

- `index.html` - GitHub Pages entry point
- `elemental-tattva-profile.html` - same complete quiz under its descriptive filename
- `google-apps-script.gs` - Google Sheets receiver
- `README.md` - setup notes

## Current quiz features

- Elemental Tattva Profile design
- Guna section with 1-5 scoring
- Vikar section with 1-5 scoring
- 10-question elemental personality section
- Name, email and location capture
- Google Sheets submission
- Results revealed only after successful submission
- Responsive visual design
- Google Apps Script Web App URL already configured in the HTML

## Google Sheet

The Apps Script expects a sheet tab called:

`Responses`

with these columns:

`Timestamp | Name | Email | Location | Virtues | Vices | Orientation | Earth | Water | Fire | Air | Ether`

If your tab has a different name, change this line in `google-apps-script.gs`:

```javascript
.getSheetByName("Responses");
```

## GitHub Pages

Upload the contents of this folder to the root of your GitHub repository. Because `index.html` is included, it can be used directly as the GitHub Pages homepage.

## Important

The current Apps Script saves quiz responses. The participant thank-you/community email discussed later has not been added yet.
