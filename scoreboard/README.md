# MetaSPN Season 1 Scoreboard

React scoreboard that displays MetaSPN Season 1 creator-agent pairs, conviction levels, and links to creator lineage reports.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Outputs to `docs/` for GitHub Pages deployment. The build copies `../players/index.json` into the output.

## GitHub Pages Deployment

1. **Settings**: In the repo, go to Settings → Pages
2. **Source**: Deploy from a branch
3. **Branch**: main (or default) → folder: **/docs**
4. Save. The site will be available at `https://<username>.github.io/<repo>/`

### Project site (subpath)

If the site is served at `https://username.github.io/season-one/`, set the base path:

```bash
VITE_BASE_PATH=/season-one/ npm run build
```

Or create `.env.production`:

```
VITE_BASE_PATH=/season-one/
```

### Custom repo for report links

Set `VITE_GITHUB_REPO` to match your fork:

```
VITE_GITHUB_REPO=username/repo-name
```
