# Protected Build

This is a hardened build of your site: minified, JS heavily obfuscated, and split into separate files.

## Structure
- `index.html` — minified markup, with your original anti-copy script (right-click/select/devtools-shortcut blocking) kept inline.
- `assets/css/style.min.css` — all CSS combined and minified.
- `assets/js/part1.min.js` … `part6.min.js` — your JS split into 6 separate files, each obfuscated (renamed identifiers, encoded strings, flattened control flow, self-defending against pretty-printers).

## Deploy to GitHub
1. Create a new repo (or use an existing one).
2. Upload everything in this folder, keeping the `assets/` structure intact.
3. For GitHub Pages: Settings → Pages → set source to the branch/folder containing `index.html`.

## Honest limits — please read
- This is **obfuscation, not encryption**. A browser has to receive runnable HTML/CSS/JS to render your page, so there's no way to truly encrypt it client-side without also shipping the key — anyone determined enough (view-source, network tab, or just reading the rendered DOM) can still get at the content. What this build does is raise the effort required for casual copying/scraping, not eliminate it entirely.
- The right-click/copy/devtools blocking only stops casual users — it doesn't work in all browsers and is trivially bypassed by disabling JS.
- I tested that every file is syntactically valid JS/CSS and that the page assembles correctly, but I don't have a way to fully render it in a browser in this environment — **please test it live (e.g. on GitHub Pages) before treating it as your only copy**, and keep your original unminified file as a backup for future edits, since the obfuscated code isn't realistically editable by hand.
