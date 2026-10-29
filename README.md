this is an awesome gamin (and other cool stuff) website,\
made by me! TheAlphaLeopard (its a wip [the site i mean])
[thealphaleopard.github.io](https://thealphaleopard.github.io)

<h1>Structure</h1>

- `/` — main screen (not linked from the tabs; type the URL)
- `/apps/` — apps tab, reads `apps.json`
- `/games/` — games tab, reads `games.json`
- `/settings/` — settings tab (theme)

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

<h1>Help From</h1>
@binbashbanana, files from swfify\
@3kh0, some games from 3kh0 assets \
@ruffle, used in my swfify
