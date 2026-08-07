# EFR site — Eleventy rebuild

## What changed vs the old single-file site

- Homepage now builds to three separate, fully server-rendered pages: `/`, `/ru/`, `/he/`
  (instead of one JS-only page that swaps text client-side).
- Each LinkedIn post is its own indexable page under `/articles/<lang>/<slug>/`.
- `sitemap.xml`, `robots.txt`, hreflang tags, Open Graph tags, and JSON-LD
  (Organization/Person, FAQPage, Article) are generated automatically.
- `calc.html` is unchanged — same file, same logic, just better `<title>`/description.
- A GitHub Action validates content and re-builds on every push, then pings
  IndexNow (Bing + Yandex) so new/changed pages get crawled quickly. Google
  doesn't support IndexNow — submit the sitemap once manually in Search Console
  (see step 5).

**Important — this was built without internet access in the sandbox**, so
`npm install` was never actually run here. The very first real build will
happen on GitHub/Netlify. Treat this as a high-confidence draft, not a
guaranteed-working build — if something fails, send me the Netlify build log
and I'll fix it.

## Step 1 — Create the GitHub repository

On github.com (mobile browser is fine): **New repository** → name it
(e.g. `efr-site`) → **Create repository**. Leave it empty (no README/license).

## Step 2 — Get this project's files into the repo

Uploading a folder tree from a phone browser is unreliable (mobile file
pickers usually don't preserve subfolders). The method below is slower but
guaranteed to work from any phone:

1. Unzip the archive I gave you (any file manager app, or the Files app,
   can unzip).
2. In GitHub, tap **Add file → Create new file**.
3. In the filename box, type the **full path including folders** —
   GitHub creates the folders automatically. Example: typing
   `content/articles/en/what-is-efr.md` creates `content/`, `articles/`,
   and `en/` for you.
4. Paste that file's content into the box below, then **Commit changes**.
5. Repeat for every file. There are about 25 files — tedious but mechanical,
   start with `.eleventy.js`, `package.json`, `netlify.toml`, `robots.txt`,
   then `_includes/*`, `_data/*`, `content/articles/**/*.md`,
   `.github/workflows/build-and-notify.yml`, `scripts/*.js`, `calc.html`,
   `sitemap.njk`, `index.njk`, `index.11tydata.js`, `.gitignore`, the
   IndexNow key `.txt` file.

If you ever get occasional access to a laptop (library, friend, work), the
much faster path is: unzip → drag the whole folder into GitHub's
**Add file → Upload files** page in one go.

## Step 3 — Point Netlify at the GitHub repo instead of the old manual deploy

In Netlify: **Site → Site configuration → Build & deploy → Link repository**
(or create a new site "Import from Git" if the old one is a manual/drag-drop
site that can't be relinked). Pick the `efr-site` repo, branch `main`.
Build command and publish directory are already set in `netlify.toml`
(`npm run build` → `_site`), Netlify should detect them automatically.

Re-attach your existing custom domain (`emotions.help`) to this new
Netlify site under **Domain management** if it created a fresh site rather
than reusing the old one.

## Step 4 — Watch the first build

Netlify's **Deploys** tab shows the build log. If it fails, copy the error
text and send it to me — most likely culprits are typos in the Nunjucks
templates I couldn't test locally.

## Step 5 — Submit the sitemap to Google (one-time, manual)

Google doesn't support the IndexNow auto-ping. Once the site is live:
Google Search Console → your property → **Sitemaps** → submit
`https://emotions.help/sitemap.xml`.

## Adding a new article from now on

1. Write the post as usual.
2. Ask me to turn it into 3 files (`content/articles/en/<slug>.md`,
   `ru/<slug>.md`, `he/<slug>.md`) with the right frontmatter.
3. Create those 3 files in GitHub (Step 2 method) — push to `main` — Netlify
   rebuilds and the GitHub Action pings IndexNow automatically.
