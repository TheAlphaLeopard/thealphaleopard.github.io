this is an awesome gamin (and other cool stuff) website, made by me! thealphaleopard

<h1>what this repo is</h1>

just the launcher: html, css, js, the two json lists, and images.
no apps, no games, no game assets are hosted here. every entry in the
json files points at something hosted in another repo.

<h1>pages</h1>

- `/` - main screen (unlinked, type the url)
- `/apps/` - apps tab, reads `apps.json`
- `/games/` - games tab, reads `games.json`
- `/settings/` - theme (black / white)

<h1>adding apps / games</h1>

add an entry to `apps.json` or `games.json`:

```json
[
  {
    "name": "watch",
    "url": "/watch/"
  }
]
```

`name` and `url` are both required. `url` can be a path on this domain
or a full url to another host. each entry shows as a square holding the
url, with the name above it.

<h1>look</h1>

- black and white only, amoled black by default
- m plus 1 only, everything lowercase
- sharp corners, no animations
- collapsible sidebar (esc closes it)

<h1>help from</h1>

@binbashbanana, files from swfify
@3kh0, some games from 3kh0 assets
@ruffle, used in my swfify
