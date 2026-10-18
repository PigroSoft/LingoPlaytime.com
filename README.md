# LingoPlaytime

Language games for toddlers in multilingual families. Live at https://lingoplaytime.com

This repository holds the built static site (no build step to run here). Copyright PigroSoft, all rights reserved.

## Game addresses

Every game has its own page, like https://lingoplaytime.com/market/. The game folders (`market/`, `sky-words/` and so on) are copies of `index.html` with that game's title and description, made by a script. After any change to `index.html`, run:

    python3 tools/game-pages.py

It rewrites the game folders and the game entries in `sitemap.xml`. The list of addresses is `SLUG` in `index.html`.
