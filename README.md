# The Enchantment Codex

A single-page, searchable Minecraft enchantment codex with a light green field-lab interface, a forest-green night mode, and blocky in-game-inspired details.

## Run it

Open `index.html` directly in a browser, or serve the folder:

```sh
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Features

- All 43 vanilla **Java Edition 26.3** enchantments, including Lunge
- Instant search by enchantment name
- Shareable per-enchantment links, e.g. `#mending`, including direct links into the mobile detail drawer
- Cross-links and a **From the same workshop** feature card for [Shapeshift](https://shapeshift.mc.zgv2.dev/), the Minecraft shape generator by ZGV2
- Filter by category or max level
- Sort alphabetically or by max level
- Compatible items, conflicts, added-in versions, and treasure/curse notes
- Full-site localization for English, Ukrainian, Simplified Chinese, Traditional Chinese, German, French, Italian, Spanish, and Japanese (official names; wiki-sourced descriptions)
- Header language selector; search and sorting follow the selected language
- On first visit the language follows the browser when supported; manual choices take precedence
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
- Enchantment names, item names, and the enchanting table name use the official Java 26.3 in-game translations. Category labels, source groupings, and notes are editorial. Enchantment summaries and effects are adapted from the localized [Minecraft Wiki](https://minecraft.wiki/) editions, whose text is available under CC BY-NC-SA 3.0; they are community translations, not official game copy.
- This is an unofficial fan project and is not affiliated with Mojang or Microsoft.
- The anvil order optimizer algorithm and data are adapted from iamcal/enchant-order, © 2021 Cal Henderson, under the MIT License. The upstream license is included at `assets/enchant-order-LICENSE.txt`.
- Enchantment icons are from Even Better Enchants by Mythitorium, based on Better Enchant Books by Yomna. The Modrinth project lists Apache-2.0; the pack's bundled README says all rights reserved. See `assets/even-better-enchants-NOTICE.txt` and `assets/even-better-enchants-LICENSE.txt`; verify the applicable terms before commercial use.
- Typeface: [Monocraft](https://github.com/IdreesInc/Monocraft) by Idrees Inc., licensed under the SIL Open Font License. The license is included at `assets/OFL.txt`.

## SEO and deployment

- Includes canonical metadata, Open Graph/Twitter cards, a 1200×630 social image, JSON-LD (`WebSite`, `WebApplication`, and a 43-item `ItemList`), `robots.txt`, `sitemap.xml`, a web manifest, and a no-JavaScript fallback listing every enchantment.
- Metadata currently targets the live custom domain: `https://enchantments.mc.zgv2.dev/`.
- If the site moves to another domain, update the canonical URL, `og:url`, `og:image`, `sitemap.xml`, and `robots.txt`.
- `robots.txt` and `sitemap.xml` are served from the custom domain root.
