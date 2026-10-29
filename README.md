this is an awesome gamin (and other cool stuff) website,\
made by me! TheAlphaLeopard (its a wip [the site i mean])
[thealphaleopard.github.io](https://thealphaleopard.github.io)

<h1>What this repo is</h1>

Just the launcher: HTML, CSS, JS, the two JSON lists, and images.
No apps, no games, no game assets are hosted here — every entry in the
JSON files points at something hosted in another repo.

<h1>Pages</h1>

- `/` — main screen (unlinked; type the URL)
- `/apps/` — apps tab, reads `apps.json`
- `/games/` — games tab, reads `games.json`
- `/settings/` — theme setting (AMOLED / Light)

<h1>Adding apps / games</h1>

Add an entry to `apps.json` or `games.json`:

```json
[
  {
    "name": "Watch",
    "url": "/watch/",
    "description": "optional"
  }
]
```

`name` and `url` are required; `description` is optional.
Both `url` values can be a path on this domain or a full URL to another host.

<h1>Look</h1>

- AMOLED black by default, light theme in Settings
- Nunito Sans for text, M PLUS 1 for headings
- Collapsible sidebar (state is remembered, Esc closes it)

<h1>Help From</h1>
@binbashbanana, files from swfify\
@3kh0, some games from 3kh0 assets \
@ruffle, used in my swfify
