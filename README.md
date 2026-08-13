# reshinthadithyan.github.io

Personal website of **Reshinth Adithyan** — Research Engineer at Stability AI,
working on large-scale pretraining of code language models.

Live at **<https://reshinthadithyan.github.io>**.

## Stack

A hand-built static site — no framework, no build step.

- `index.html` — the single-page site (about, research, publications, patents, experience, writing).
- `writing/` — long-form posts as standalone HTML pages.
- `assets/css/site.css` — the entire stylesheet: light + dark.
- `assets/img/` — images.

Type is [Manrope](https://fonts.google.com/specimen/Manrope) throughout, with the system
mono stack for code. The theme respects `prefers-color-scheme` and remembers the visitor's
choice in `localStorage`.

## Credit

The UI style — single sans family, white paper and near-black ink, and the flat
highlighter chips behind inline links — is borrowed from
[Shayaan Azeem](https://www.shayaanazeem.com/). The original is Next.js + Tailwind;
this is a plain-CSS reimplementation of the look.

## Local preview

```sh
python3 -m http.server 4321
# then open http://localhost:4321
```

## Deploy

Pushing to `master` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which publishes the static files to the `gh-pages` branch that GitHub Pages serves.
There is no Jekyll step — `.nojekyll` tells Pages to serve the files as-is.
