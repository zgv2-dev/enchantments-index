#!/usr/bin/env node
/*
 * Build crawlable locale pages from the single-page app.
 * Run after changing ENCHANTMENTS, UI, TRANSLATIONS, CONTENT_I18N, or fallback copy.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = path.resolve(import.meta.dirname, "..");
const SITE = "https://enchantments.mc.zgv2.dev";
const ISSUES_URL = "https://github.com/zgv2-dev/enchantments-index/issues/new";
const SOURCE = path.join(ROOT, "index.html");
const TODAY = new Date().toISOString().slice(0, 10);

function extractExpression(source, marker) {
  const at = source.indexOf(marker);
  if (at < 0) throw new Error(`Missing marker: ${marker}`);
  let start = at + marker.length;
  while (/\s/.test(source[start])) start += 1;
  const open = source[start];
  const close = open === "{" ? "}" : open === "[" ? "]" : null;
  if (!close) throw new Error(`Expected object/array after ${marker}`);
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let i = start; i < source.length; i += 1) {
    const ch = source[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      continue;
    }
    if (ch === open) depth += 1;
    else if (ch === close) {
      depth -= 1;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  throw new Error(`Unclosed expression after ${marker}`);
}

function evaluate(source, expression) {
  return vm.runInNewContext(`(${expression})`, Object.create(null), { timeout: 1000 });
}

function readAssignment(source, marker) {
  return evaluate(source, extractExpression(source, marker));
}

const source = fs.readFileSync(SOURCE, "utf8");
const UI = readAssignment(source, "const UI = ");
const UI_JA = readAssignment(source, "UI.ja = ");
UI.ja = { ...(UI.ja || {}), ...UI_JA };
const TRANSLATIONS = readAssignment(source, "const TRANSLATIONS = ");
const JA_NAMES = readAssignment(source, "const JA_NAMES = ");
for (const [id, name] of Object.entries(JA_NAMES)) {
  if (!TRANSLATIONS[id]) TRANSLATIONS[id] = {};
  TRANSLATIONS[id].ja = name;
}
const CONTENT_I18N = readAssignment(source, "const CONTENT_I18N = ");
const ENCHANTMENTS = readAssignment(source, "const ENCHANTMENTS = ");
const CATEGORIES = readAssignment(source, "const CATEGORIES = ");
const LANGUAGES = readAssignment(source, "const LANGUAGES = ");

const ROMAN = ["", "I", "II", "III", "IV", "V"];
const LOCALES = [
  { id: "en", path: "/", html: "en", og: "en_US", label: "English" },
  { id: "de", path: "/de/", html: "de", og: "de_DE", label: "Deutsch" },
  { id: "fr", path: "/fr/", html: "fr", og: "fr_FR", label: "Français" },
  { id: "it", path: "/it/", html: "it", og: "it_IT", label: "Italiano" },
  { id: "es", path: "/es/", html: "es", og: "es_ES", label: "Español" },
  { id: "uk", path: "/uk/", html: "uk", og: "uk_UA", label: "Українська" },
  { id: "zhCn", path: "/zh-hans/", html: "zh-Hans", og: "zh_CN", label: "简体中文" },
  { id: "zhTw", path: "/zh-hant/", html: "zh-Hant", og: "zh_TW", label: "繁體中文" },
  { id: "ja", path: "/ja/", html: "ja", og: "ja_JP", label: "日本語" }
];

const FALLBACK_INTRO = {
  en: "All 43 Minecraft Java 26.3 enchantments, with maximum levels, categories, compatible items, and summaries. Enable JavaScript for search, filters, official translations, and the anvil order optimizer.",
  de: "Alle 43 Verzauberungen aus Minecraft Java 26.3 mit maximalen Stufen, Kategorien, passenden Gegenständen und Zusammenfassungen. Aktiviere JavaScript für Suche, Filter, offizielle Übersetzungen und den Amboss-Planer.",
  fr: "Les 43 enchantements de Minecraft Java 26.3, avec niveaux maximaux, catégories, objets compatibles et résumés. Activez JavaScript pour la recherche, les filtres, les traductions officielles et le planificateur d'enclume.",
  it: "Tutti i 43 incantesimi di Minecraft Java 26.3, con livelli massimi, categorie, oggetti compatibili e riepiloghi. Attiva JavaScript per ricerca, filtri, traduzioni ufficiali e pianificatore dell'incudine.",
  es: "Los 43 encantamientos de Minecraft Java 26.3, con niveles máximos, categorías, objetos compatibles y resúmenes. Activa JavaScript para la búsqueda, los filtros, las traducciones oficiales y el planificador de yunque.",
  uk: "Усі 43 зачарування Minecraft Java 26.3 з максимальними рівнями, категоріями, сумісними предметами та описами. Увімкніть JavaScript для пошуку, фільтрів, офіційних перекладів і планувальника ковадла.",
  zhCn: "Minecraft Java 26.3 的全部 43 种附魔，包含最高等级、分类、适用物品和摘要。启用 JavaScript 以使用搜索、筛选、官方翻译和铁砧顺序规划器。",
  zhTw: "Minecraft Java 26.3 的全部 43 種附魔，包含最高等級、分類、適用物品和摘要。啟用 JavaScript 以使用搜尋、篩選、官方翻譯和鐵砧順序規劃器。",
  ja: "Minecraft Java 26.3 の全43エンチャントを、最大レベル、カテゴリ、対応アイテム、概要付きで掲載。JavaScript を有効にすると、検索、フィルター、公式訳、金床の順序プランナーを利用できます。"
};

const esc = value => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");
const attr = value => esc(value);

function pageUrl(locale) {
  return SITE + locale.path;
}

function displayName(enchantment, language) {
  if (language === "en") return enchantment.name;
  return TRANSLATIONS[enchantment.id]?.[language] || enchantment.name;
}

function localizedSummary(enchantment, language) {
  return CONTENT_I18N[language]?.[enchantment.summary] || enchantment.summary;
}

function categoryLabel(enchantment, language) {
  return UI[language]?.categories?.[enchantment.category] || enchantment.category;
}

function replaceMetaName(html, name, content) {
  const re = new RegExp(`(<meta name="${name}" content=")[^"]*(")`);
  if (!re.test(html)) throw new Error(`Missing meta name=${name}`);
  return html.replace(re, `$1${attr(content)}$2`);
}

function replaceMetaProperty(html, property, content) {
  const re = new RegExp(`(<meta property="${property}" content=")[^"]*(")`);
  if (!re.test(html)) throw new Error(`Missing meta property=${property}`);
  return html.replace(re, `$1${attr(content)}$2`);
}

function buildHreflang() {
  return [
    ...LOCALES.map(locale => `<link rel="alternate" hreflang="${locale.html}" href="${pageUrl(locale)}">`),
    `<link rel="alternate" hreflang="x-default" href="${SITE}/">`
  ].join("\n");
}

function buildOgAlternates(locale) {
  return LOCALES.filter(item => item.id !== locale.id)
    .map(item => `<meta property="og:locale:alternate" content="${item.og}">`)
    .join("\n");
}

function buildJsonLd(locale, htmlLang, title, description) {
  const url = pageUrl(locale);
  const items = [...ENCHANTMENTS]
    .sort((a, b) => displayName(a, locale.id).localeCompare(displayName(b, locale.id), htmlLang, { sensitivity: "base" }))
    .map((enchantment, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: displayName(enchantment, locale.id),
      description: localizedSummary(enchantment, locale.id),
      url: `${url}#${enchantment.id}`
    }));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${url}#website`,
        url,
        name: title,
        alternateName: "Minecraft Enchantment Index",
        description,
        inLanguage: htmlLang,
        publisher: { "@type": "Organization", name: "ZGV2" },
        mainEntity: { "@id": `${url}#app` }
      },
      {
        "@type": "WebApplication",
        "@id": `${url}#app`,
        name: title,
        url,
        description,
        applicationCategory: "GameApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        isAccessibleForFree: true,
        inLanguage: htmlLang,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        creator: { "@type": "Organization", name: "ZGV2" },
        isPartOf: { "@id": `${url}#website` }
      },
      {
        "@type": "ItemList",
        "@id": `${url}#enchantments`,
        name: `${title} — Minecraft Java 26.3`,
        numberOfItems: items.length,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: items
      }
    ]
  };
}

function buildFallback(locale) {
  const ui = UI[locale.id];
  const sorted = [...ENCHANTMENTS].sort((a, b) =>
    displayName(a, locale.id).localeCompare(displayName(b, locale.id), locale.html, { sensitivity: "base" })
  );
  const items = sorted.map(enchantment => {
    const max = `${ui.maxLevel} ${ROMAN[enchantment.maxLevel]}`;
    return `<li><strong>${esc(displayName(enchantment, locale.id))}</strong> <span>${esc(max)} · ${esc(categoryLabel(enchantment, locale.id))}</span><p>${esc(localizedSummary(enchantment, locale.id))}</p></li>`;
  }).join("\n      ");
  const languages = LANGUAGES.map(language => {
    const target = LOCALES.find(item => item.id === language.id);
    if (!target) return "";
    const current = language.id === locale.id ? ' aria-current="page"' : "";
    return `<a hreflang="${target.html}" href="${target.path}"${current}>${esc(language.label)}</a>`;
  }).filter(Boolean).join(" · ");
  return `<section class="seo-fallback" aria-labelledby="seo-fallback-title">
    <p class="seo-kicker">${esc(ui.eyebrow)}</p>
    <h2 class="seo-fallback-title" id="seo-fallback-title">${esc(ui.title)}</h2>
    <p>${esc(FALLBACK_INTRO[locale.id] || FALLBACK_INTRO.en)}</p>
    <p class="seo-langs"><strong>${esc(ui.language)}:</strong> ${languages}</p>
    <p>Shapeshift: <a href="https://shapeshift.mc.zgv2.dev/">Minecraft shape generator</a>.</p>
    <p><a href="${ISSUES_URL}">${esc(ui.reportIssue)}</a></p>
    <ul>
      ${items}
    </ul>
    <p class="seo-credit">@ 2026 Enchantments index by ZGV2</p>
  </section>`;
}

function buildPage(locale) {
  const ui = UI[locale.id];
  if (!ui) throw new Error(`Missing UI for ${locale.id}`);
  const url = pageUrl(locale);
  let html = source;
  html = html.replace(/<html\b[^>]*>/, `<html lang="${locale.html}" data-locale="${locale.id}">`);
  if (/<base\b[^>]*>/i.test(html)) {
    html = html.replace(/<base\b[^>]*>/i, '<base href="/">');
  } else {
    html = html.replace(/(<meta name="viewport"[^>]*>)/, '$1\n<base href="/">');
  }
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(ui.pageTitle)}</title>`);
  html = replaceMetaName(html, "description", ui.metaDescription);
  html = replaceMetaName(html, "application-name", ui.title);
  html = replaceMetaName(html, "apple-mobile-web-app-title", ui.title);
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
  html = html.replace(/\n?<link rel="alternate" hreflang="[^"]+" href="[^"]*">/g, "");
  html = html.replace(/(<link rel="canonical" href="[^"]*">)/, `$1\n${buildHreflang()}`);
  html = replaceMetaProperty(html, "og:url", url);
  html = replaceMetaProperty(html, "og:site_name", ui.title);
  html = replaceMetaProperty(html, "og:title", ui.title);
  html = replaceMetaProperty(html, "og:description", ui.metaDescription);
  html = replaceMetaProperty(html, "og:locale", locale.og);
  html = html.replace(/\n?<meta property="og:locale:alternate" content="[^"]*">/g, "");
  html = html.replace(/(<meta property="og:locale" content="[^"]*">)/, `$1\n${buildOgAlternates(locale)}`);
  html = replaceMetaProperty(html, "og:image:alt", `${ui.title} — Minecraft Java 26.3`);
  html = replaceMetaName(html, "twitter:title", ui.title);
  html = replaceMetaName(html, "twitter:description", ui.metaDescription);
  html = replaceMetaName(html, "twitter:image:alt", `${ui.title} — Minecraft Java 26.3`);
  const ld = buildJsonLd(locale, locale.html, ui.title, ui.metaDescription);
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${JSON.stringify(ld).replaceAll("<", "\\u003c")}</script>`);
  html = html.replace(/<section class="seo-fallback"[\s\S]*?<\/section>/, buildFallback(locale));
  return html;
}

const pages = LOCALES.map(locale => ({ locale, html: buildPage(locale) }));
for (const { locale, html } of pages) {
  const outDir = locale.path === "/" ? ROOT : path.join(ROOT, locale.path.replace(/^\/|\/$/g, ""));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.html"), html);
  console.log(`wrote ${path.relative(ROOT, path.join(outDir, "index.html"))}`);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${LOCALES.map(locale => `  <url>
    <loc>${pageUrl(locale)}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${locale.id === "en" ? "1.0" : "0.8"}</priority>
${LOCALES.map(item => `    <xhtml:link rel="alternate" hreflang="${item.html}" href="${pageUrl(item)}"/>`).join("\n")}
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/"/>
  </url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap);
console.log("wrote sitemap.xml");
