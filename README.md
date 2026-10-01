# DOIT

A daily interview-prep tracker for macOS. It gives you 8 weeks (Oct 1 to Nov 25, 2026) of ~50 min LeetCode (C++) plus ~50 min system design per day.

## Use it
- **Today**: what to do right now. It shows today's problems (pattern, target complexity, links) and today's system design topic (resources, questions to answer out loud, an exercise). Each block has a timer, and logging takes one click.
- **Calendar**: a month view. Finished days are green. Future days are projected from your actual pace, so missed days push the plan back instead of vanishing.
- **Progress**: streak, hours, LeetCode vs system design split, daily minutes chart, per-topic LeetCode progress, system design confidence.
- **Roadmap**: all 56 days. Click any day to open it.

Every 7th day is a review day. It automatically pulls each problem you solved with hints, only studied, or skipped.

## Run / rebuild
```bash
npm install
npm run install-app   # builds DOIT.app and copies it to /Applications
npm start             # run without packaging
```

## Data
Progress is saved to `~/Library/Application Support/DOIT/progress.json`, which is plain JSON that Claude can read. The sidebar has a button that shows the file in Finder.

## Where the plan lives
- `src/data/lc-plan.js`: LeetCode problems and the day-by-day schedule. Days 1–38 follow the leetcode-coach roadmap.
- `src/data/sd-curriculum.json`: the 56-day system design curriculum, with verified links.
