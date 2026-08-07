const fs = require("fs");
const path = require("path");
const glob = require("fs").readdirSync;

const REQUIRED_FIELDS = ["layout", "lang", "dir", "title", "excerpt", "description", "date", "permalink", "alternates"];
const REQUIRED_LANGS = ["en", "ru", "he"];
const ARTICLES_DIR = path.join(__dirname, "..", "content", "articles");

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fm = {};
  match[1].split("\n").forEach(line => {
    const m = line.match(/^([a-zA-Z]+):/);
    if (m) fm[m[1]] = true;
  });
  return fm;
}

function main() {
  let failed = false;

  for (const lang of REQUIRED_LANGS) {
    const dir = path.join(ARTICLES_DIR, lang);
    if (!fs.existsSync(dir)) {
      console.error(`Missing language folder: content/articles/${lang}`);
      failed = true;
      continue;
    }
    const files = fs.readdirSync(dir).filter(f => f.endsWith(".md"));
    if (!files.length) {
      console.error(`No articles found in content/articles/${lang}`);
      failed = true;
    }
    for (const file of files) {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const fm = parseFrontmatter(raw);
      if (!fm) {
        console.error(`${lang}/${file}: could not parse frontmatter`);
        failed = true;
        continue;
      }
      for (const field of REQUIRED_FIELDS) {
        if (!fm[field]) {
          console.error(`${lang}/${file}: missing required frontmatter field "${field}"`);
          failed = true;
        }
      }
    }
  }

  // Cross-check: every slug present in en/ should also exist in ru/ and he/
  const slugsByLang = {};
  for (const lang of REQUIRED_LANGS) {
    const dir = path.join(ARTICLES_DIR, lang);
    slugsByLang[lang] = fs.existsSync(dir)
      ? fs.readdirSync(dir).filter(f => f.endsWith(".md")).map(f => f.replace(/\.md$/, ""))
      : [];
  }
  const enSlugs = slugsByLang.en || [];
  for (const slug of enSlugs) {
    for (const lang of ["ru", "he"]) {
      if (!slugsByLang[lang].includes(slug)) {
        console.error(`Article "${slug}" exists in en/ but is missing from ${lang}/ — translation not complete`);
        failed = true;
      }
    }
  }

  if (failed) {
    console.error("\nFrontmatter validation failed. Fix the issues above before merging.");
    process.exit(1);
  }
  console.log(`Frontmatter validation passed for ${enSlugs.length} articles across ${REQUIRED_LANGS.length} languages.`);
}

main();
