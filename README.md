# Legion Lab

A tool for MapleStory to help track your Legion's gear and progress.

## Try it

Use the app on GitHub Pages — that's the main way to run it. **Search** (look up characters from Nexon Rankings) is fast and reliable there.

- **Online:** [https://anepicsquirrel-gh.github.io/legion-lab/](https://anepicsquirrel-gh.github.io/legion-lab/) (enable GitHub Pages in the repo settings if needed)
- **Locally:** Open `index.html` or run `npx serve`; for local Search you can run `node server.js` and open http://localhost:3000.

## Features

- Track characters, levels, classes, worlds, and gear (slot + starforce)
- **Search** fills in level/class/world/sprite from Nexon Rankings (on the main site this uses a hosted API; repeat lookups are cached for 5 minutes)
- Mass import by name list (one name per line)
- Gear presets, set bonuses, and legion block icons

## Deploying the lookup API (for the main GitHub Pages app)

The GitHub Pages app calls a hosted lookup API so Search doesn't rely on slow public proxies. To provide that API, deploy this repo to [Vercel](https://vercel.com) (connect the repo and deploy; the `api/` folder is used as serverless functions). After deploy, set `LOOKUP_API_BASE_URL` in `js/state.js` to your Vercel URL (e.g. `https://legion-lab.vercel.app`) so the app knows where to call. If you don't deploy to Vercel, the app falls back to a CORS proxy for Search (slower, may time out).

## License

MIT — see [LICENSE](LICENSE).
