module.exports = {
  eleventyComputed: {
    permalink: data => data.site.homeUrl[data.lang],
    title: data => data.i18n[data.lang].meta.homeTitle,
    description: data => data.i18n[data.lang].meta.homeDescription,
    dir: data => data.site.dirMap[data.lang],
    ogLocale: data => data.site.ogLocaleMap[data.lang],
    alternates: () => ({ en: "/", ru: "/ru/", he: "/he/" })
  }
};
