const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  // Static assets copied as-is
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("calc.html");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("a9b824cadb14c5dda4814dccd65dabf8.txt");

  // ISO date -> e.g. "August 6, 2026" (used in Article schema / bylines)
  eleventyConfig.addFilter("readableDate", (dateObj, lang = "en") => {
    const locales = { en: "en-US", ru: "ru-RU", he: "he-IL" };
    return DateTime.fromJSDate(dateObj, { zone: "utc" })
      .setLocale(locales[lang] || "en-US")
      .toLocaleString(DateTime.DATE_FULL);
  });

  eleventyConfig.addFilter("isoDate", dateObj => DateTime.fromJSDate(dateObj, { zone: "utc" }).toISODate());

  // Articles collection, one entry per language x slug, read from content/articles/<lang>/*.md
  eleventyConfig.addCollection("articlesByLang", collectionApi => {
    const items = collectionApi.getFilteredByGlob("content/articles/**/*.md");
    const byLang = { en: [], ru: [], he: [] };
    items.forEach(item => {
      const lang = item.data.lang;
      if (byLang[lang]) byLang[lang].push(item);
    });
    Object.values(byLang).forEach(list => list.sort((a, b) => b.date - a.date));
    return byLang;
  });

  // JSON-LD helpers: built in real JS (not YAML+templating) so the output is always valid JSON.
  eleventyConfig.addShortcode("organizationSchema", function () {
    const data = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://emotions.help/#org",
          "name": "EFR — Emotional Factory Reset",
          "url": "https://emotions.help/",
          "founder": { "@type": "Person", "name": "Roman Mantelmakher", "sameAs": ["https://www.linkedin.com/in/roman-mantelmakher/"] }
        },
        {
          "@type": "Person",
          "@id": "https://emotions.help/#roman",
          "name": "Roman Mantelmakher",
          "url": "https://www.linkedin.com/in/roman-mantelmakher/",
          "sameAs": ["https://www.linkedin.com/in/roman-mantelmakher/"]
        }
      ]
    };
    return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
  });

  eleventyConfig.addShortcode("faqSchema", function (items) {
    const data = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": (items || []).map(i => ({
        "@type": "Question",
        "name": i.q,
        "acceptedAnswer": { "@type": "Answer", "text": i.a }
      }))
    };
    return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
  });

  eleventyConfig.addShortcode("articleSchema", function (opts) {
    const data = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": opts.title,
      "description": opts.description,
      "datePublished": opts.isoDate,
      "author": { "@type": "Person", "name": "Roman Mantelmakher", "url": "https://www.linkedin.com/in/roman-mantelmakher/" },
      "publisher": { "@type": "Organization", "name": "EFR", "url": "https://emotions.help/" },
      "mainEntityOfPage": { "@type": "WebPage", "@id": opts.url },
      "inLanguage": opts.lang
    };
    return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
