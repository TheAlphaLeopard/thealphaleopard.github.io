https://thealphaleopard.github.io

<h1>what this repo is</h1>

just the launcher: html, css, js, the two json lists, and images.
no apps, no games, no game assets are hosted here. every entry in the
json files points at something hosted in another repo.

<h1>pages</h1>

- `/` - main screen with the three tabs (apps / games / settings)
- `/apps/` - apps, reads `apps.json`
- `/games/` - games, reads `games.json`
- `/settings/` - theme (black / white)

there is no nav bar. each page has a small `back` link to `/`.

<h1>adding apps / games</h1>

add an entry to `apps.json` or `games.json`:

```json
[
  {
    "name": "watch",
    "url": "/watch/",
    "image": "/images/watch.png"
  }
]
```

- `name` - the subtext under the square
- `url` - where the tile links to, local path or full url
- `image` - thumbnail for the square. a local file in `images/`, or any
  url for another host. if it is missing the square shows the url as text.

the square is always `aspect-ratio: 1/1` with `object-fit: cover`, so any
image size works.

<h1>look</h1>

- black and white only, amoled black by default
- m plus 1 only, everything lowercase
- sharp corners, no transitions, no animations
- square tiles in a `repeat(auto-fill, minmax(150px, 1fr))` grid

<h1>help from</h1>

@binbashbanana, files from swfify
@3kh0, some games from 3kh0 assets
@ruffle, used in my swfify
