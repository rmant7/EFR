// Pings IndexNow (api.indexnow.org — relayed to Bing and Yandex) with every URL
// currently in the built sitemap.xml. Google does not support IndexNow; new
// pages still need to be submitted once manually via Google Search Console.
const fs = require("fs");
const https = require("https");

const KEY = "a9b824cadb14c5dda4814dccd65dabf8";
const HOST = "emotions.help";
const SITEMAP_PATH = "_site/sitemap.xml";

function extractUrls(xml) {
  const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)];
  return matches.map(m => m[1]);
}

function main() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error(`No sitemap found at ${SITEMAP_PATH} — did the build run first?`);
    process.exit(1);
  }
  const xml = fs.readFileSync(SITEMAP_PATH, "utf8");
  const urlList = extractUrls(xml);
  if (!urlList.length) {
    console.log("No URLs found in sitemap, nothing to submit.");
    return;
  }

  const payload = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList
  });

  const req = https.request(
    {
      hostname: "api.indexnow.org",
      path: "/indexnow",
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8", "Content-Length": Buffer.byteLength(payload) }
    },
    res => {
      console.log(`IndexNow responded with status ${res.statusCode} for ${urlList.length} URLs`);
      res.on("data", () => {});
    }
  );
  req.on("error", err => console.error("IndexNow request failed:", err.message));
  req.write(payload);
  req.end();
}

main();
