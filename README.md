# The Enchantment Codex

A static, searchable Minecraft enchantment codex with nine crawlable locale routes, a light green field-lab interface, a forest-green night mode, and blocky in-game-inspired details.

## Run it

Serve the folder so the root-relative asset paths and locale routes resolve:

```sh
python3 -m http.server 8000
```

Then visit <http://localhost:8000> or <http://localhost:8000/de/>.

## Features

- All 43 vanilla **Java Edition 26.3** enchantments, including Lunge
- Instant search by enchantment name
- Shareable per-enchantment links, e.g. `#mending`, including direct links into the mobile detail drawer
- A fully clickable **From the same workshop** feature card for [Shapeshift](https://shapeshift.mc.zgv2.dev/), the Minecraft shape generator by ZGV2
- Filter by category or max level
- Sort alphabetically or by max level
- Compatible items, conflicts, added-in versions, and treasure/curse notes
- Full-site localization for English, Ukrainian, Simplified Chinese, Traditional Chinese, German, French, Italian, Spanish, and Japanese (official names; wiki-sourced descriptions)
- Footer link to report bugs or translation issues on GitHub
- Header language selector navigates between crawlable locale URLs; search and sorting follow the selected language
- Nine locale routes: `/`, `/de/`, `/fr/`, `/it/`, `/es/`, `/uk/`, `/zh-hans/`, `/zh-hant/`, and `/ja/`
- Unique per-enchantment book icons from Even Better Enchants, shown in cards, details, and the optimizer
- Built-in anvil order optimizer adapted from [iamcal/enchant-order](https://github.com/iamcal/enchant-order)
- Order optimizer limits item choices to the active Armor/Weapons/Tools/Ranged/Trident/Fishing filter
- Persistent day/night theme toggle
- Responsive layout: persistent detail panel on desktop, modal drawer on smaller screens
- Keyboard shortcuts: `/` focuses search, `Esc` clears/closes

## Notes

- Audited against Java Edition 26.3 (released September 15, 2026). The experimental Cleaving enchantment is not included because it is not part of 26.3.
- Official names were extracted from the `en_us`, `uk_ua`, `zh_cn`, `zh_tw`, `de_de`, `fr_fr`, `it_it`, `es_es`, and `ja_jp` language files for Minecraft Java 26.3.
- Added-in values use the Java release version rather than pre-release snapshot names.
- Enchantment names, item names, and the enchanting table name use the official Java 26.3 in-game translations in all nine locales. Category labels, source groupings, and notes are editorial. Enchantment summaries and effects are adapted from the localized [Minecraft Wiki](https://minecraft.wiki/) editions, whose text is available under CC BY-NC-SA 3.0; they are community translations, not official game copy.
- This is an unofficial fan project and is not affiliated with Mojang or Microsoft. Report bugs or translation issues at <https://github.com/zgv2-dev/enchantments-index/issues/new>.
- The anvil order optimizer algorithm and data are adapted from iamcal/enchant-order, © 2021 Cal Henderson, under the MIT License. The upstream license is included at `assets/enchant-order-LICENSE.txt`.
- Enchantment icons are from Even Better Enchants by Mythitorium, based on Better Enchant Books by Yomna. The Modrinth project lists Apache-2.0; the pack's bundled README says all rights reserved. See `assets/even-better-enchants-NOTICE.txt` and `assets/even-better-enchants-LICENSE.txt`; verify the applicable terms before commercial use.
- Typeface: [Monocraft](https://github.com/IdreesInc/Monocraft) by Idrees Inc., licensed under the SIL Open Font License. The license is included at `assets/OFL.txt`.
- Category tab icons use Minecraft Java 26.3 item and block textures; Utility uses a matching anvil glyph. Minecraft assets are © Mojang/Microsoft and are used here in this unofficial fan project.

## SEO and deployment

- Nine crawlable locale routes: `/` (English, `x-default`), `/de/`, `/fr/`, `/it/`, `/es/`, `/uk/`, `/zh-hans/`, `/zh-hant/`, and `/ja/`.
- Each route has a localized `<html lang>`, title, description, Open Graph/Twitter metadata, JSON-LD, and no-JavaScript fallback listing all 43 enchantments.
- Every page has a reciprocal `hreflang` cluster, a self-referencing canonical URL, and localized `og:locale`; `/` is `x-default`.
- `sitemap.xml` lists all nine routes with `xhtml:link` hreflang alternates. `robots.txt` points to it from the domain root.
- The language selector navigates to the matching locale URL. The URL determines the page language; there are no forced browser-language redirects.
- `vercel.json` permanently redirects non-slash locale paths to their canonical trailing-slash URLs.
- The locale pages are generated from the main `index.html` template:
  ```sh
  node scripts/build-locales.mjs
  ```
  Re-run this after changing enchantment data, UI translations, or fallback copy. The generated locale folders are committed.
- Metadata currently targets the live custom domain: `https://enchantments.mc.zgv2.dev/`. If the domain changes, update `SITE` in `scripts/build-locales.mjs`, rerun the generator, and update `robots.txt`.
