EFR SITE UPDATE — что внутри и что делать руками
===================================================

ВАЖНОЕ ОГРАНИЧЕНИЕ:
У меня нет доступа к твоим реальным Eleventy-шаблонам (.njk/.liquid),
партиалам header/footer/nav и CSS-классам. Всё, что внутри этого архива —
готовый контент + метаданные + JSON-LD, но БЕЗ твоей реальной вёрстки.

ЧТО ВНУТРИ:

1. for-breakup.html      — EN версия, полный <head> + контент + FAQPage JSON-LD
2. ru-for-breakup.html   — RU версия, оригинальный текст (не перевод)
3. he-for-breakup.html   — HE версия, оригинальный текст, dir="rtl"
4. sitemap.xml           — обновлённый sitemap с добавленными URL:
                           /for-breakup/, /ru/for-breakup/, /he/for-breakup/
                           (также добавил /for-divorce/ + ru/he — если эта
                           страница ещё не в проде, убери эти три строки
                           или поправь lastmod)

ЧТО НУЖНО СДЕЛАТЬ РУКАМИ:

1. Открой свой существующий for-founders.html (или for-executives.html)
   как эталон структуры — header, nav, footer, CSS-классы, Eleventy
   include-теги.

2. Скопируй в него:
   - meta-теги из <head> нового файла (title, description, canonical,
     hreflang, og:*, twitter:*)
   - JSON-LD <script type="application/ld+json"> целиком
   - контент внутри <main> — просто перенеси H1/H2/H3/p блоки, сохраняя
     свою обёртку (div-классы, секции), которая есть в for-founders

3. Создай файлы по пути, соответствующему твоей структуре проекта, например:
   src/for-breakup.html (или .njk)
   src/ru/for-breakup.html
   src/he/for-breakup.html

4. Замени sitemap.xml в проекте на приложенный (или добавь туда только
   новые 3 url-блока, если твой sitemap генерируется автоматически
   Eleventy-плагином — тогда просто пересобери сайт, он подхватит новые
   страницы сам).

5. git add, commit, push — Netlify пересоберёт сайт.

6. После деплоя: зайди в Google Search Console → Sitemaps → Resubmit,
   чтобы Google быстрее подхватил новые URL.

7. Проверь на телефоне: https://emotions.help/for-breakup/ и RU/HE версии —
   должны открываться, иврит должен быть RTL.

ПРО ЦЕНЫ: цены нигде на страницах не указаны, как договорились —
только "payment is made at the end of the session, based on what you
experienced". Это по всем трём языкам.

ПРО FAQ JSON-LD: разметка вставлена как отдельный <script> в <head> —
если у тебя уже есть общий JSON-LD (Organization/Person) на сайте,
это ДОПОЛНИТЕЛЬНЫЙ блок, не замена, они у Google складываются.
