# Enchantment Index

A single-page, searchable Minecraft enchantment reference with a light green field-lab interface, a forest-green night mode, and blocky in-game-inspired details.

## Run it

Open `index.html` directly in a browser, or serve the folder:

```sh
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Features

- All 43 vanilla **Java Edition 26.3** enchantments, including Lunge
- Instant search by enchantment name
- Filter by category or max level
- Sort alphabetically or by max level
- Compatible items, conflicts, added-in versions, and treasure/curse notes
- Full-site localization for English, Ukrainian, Simplified Chinese, Traditional Chinese, German, French, Italian, Spanish, and Japanese (official names; wiki-sourced descriptions)
- Header language selector; search and sorting follow the selected language
- Persistent day/night theme toggle
- Responsive layout: persistent detail panel on desktop, modal drawer on smaller screens
- Keyboard shortcuts: `/` focuses search, `Esc` clears/closes

## Notes

- Audited against Java Edition 26.3 (released September 15, 2026). The experimental Cleaving enchantment is not included because it is not part of 26.3.
- Official names were extracted from the `en_us`, `uk_ua`, `zh_cn`, `zh_tw`, `de_de`, `fr_fr`, `it_it`, `es_es`, and `ja_jp` language files for Minecraft Java 26.3.
- Added-in values use the Java release version rather than pre-release snapshot names.
- Enchantment names use the official Java 26.3 in-game translations. Interface labels and notes were localized for this guide. Enchantment summaries and effects are adapted from the localized [Minecraft Wiki](https://minecraft.wiki/) editions, whose text is available under CC BY-NC-SA 3.0; they are community translations, not official game copy.
- This is an unofficial fan project and is not affiliated with Mojang or Microsoft.
- Typeface: [Monocraft](https://github.com/IdreesInc/Monocraft) by Idrees Inc., licensed under the SIL Open Font License. The license is included at `assets/OFL.txt`.

