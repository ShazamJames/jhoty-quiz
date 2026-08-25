# Jhoty — Guna, Vikar & Elemental Personality Quiz

Single-file static quiz. No build step, no dependencies. `index.html` is the whole site.

## Publish with GitHub Pages

1. Create a new repo, e.g. `jhoty-quiz` (public — private repos need GitHub Pro for Pages).
2. Upload the contents of this folder to the repo root (`index.html`, `.nojekyll`, this README).
   - Web: repo → **Add file → Upload files** → drag them in → Commit.
   - CLI:
     ```bash
     git init && git add . && git commit -m "Add Jhoty quiz"
     git branch -M main
     git remote add origin https://github.com/ShazamJames/jhoty-quiz.git
     git push -u origin main
     ```
3. Repo → **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main`, folder `/ (root)` → Save.
4. Live in ~1 minute at `https://shazamjames.github.io/jhoty-quiz/`.

## Custom domain (e.g. quiz.jhoty.com)

Add a file named `CNAME` at the repo root containing just `quiz.jhoty.com`, then at your DNS host add a
CNAME record: `quiz` → `shazamjames.github.io`. Settings → Pages → Custom domain → enter it → check
**Enforce HTTPS** once the cert is issued.

## Embedding in the existing jhoty.com WordPress site instead

Pages is only one option. If the quiz should live inside the current site, either
paste `index.html`'s `<style>`, markup, and `<script>` into a Custom HTML block, or host it here and
embed with `<iframe src="https://shazamjames.github.io/jhoty-quiz/" style="width:100%;height:1400px;border:0"></iframe>`.

## Collecting emails

`WEBHOOK_URL` near the top of the `<script>` block is empty, so email + results are currently not sent
anywhere — the reveal just renders locally. Set it to a Zapier/Make/n8n catch-hook URL to receive:

```json
{ "timestamp": "...", "email": "...", "virtues": 0, "vices": 0, "orientation": "...", "element_counts": {} }
```

GitHub Pages is static, so the endpoint must be external.

## Notes

- The hero background image loads from `jhoty.com/wp-content/uploads/...`. Keep it there or drop a local
  copy in the repo and update the `url(...)` in the CSS.
- `.nojekyll` stops GitHub from running Jekyll over the files — harmless here, but avoids surprises.
