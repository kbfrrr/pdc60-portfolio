# PDC60 Prompt Engineering Portfolio

Double-click **Start Portfolio.cmd** to open the site at <http://127.0.0.1:4173/>. It only accepts connections from this computer. Run the launcher again after restarting Windows.

You can also run `node serve-local.cjs` from this folder to keep the server attached to your terminal, then press Ctrl+C to stop it. To read the portfolio without running a server, open `dist/index.html` directly in a browser. The page needs no build step.

## Adding an activity (a level)

The level map, XP bar, skill badges, and prompt diffs are all built from `dist/activities.js`. To add an activity, edit its object in that list (or replace one of the `locked` placeholders):

- `id`, `title`: the level number and name.
- `skill`: the prompting skill it unlocks, shown as a badge (for example "Role prompting").
- `status`: `done` once the prompts and results are recorded, `proposed` for a planned experiment with no result yet, `locked` for an empty slot.
- `question`, `tried`: what you wanted the output to do and what you did.
- `prompt`: the exact prompt, one line per item. The page shows a red/green diff against the previous level's prompt, so keep lines that didn't change identical.
- `setting` (optional): anything else that changed, such as personalization or a system prompt.
- `outputs`: screenshots to compare, each with a `label`, a short `summary` of a specific detail, and descriptive `alt` text. Set `highlight: true` on the response that better met the goal.
- `takeaway`: what the result suggests and what you would change next.

Keep an idea as `proposed` until its prompts and results are available. Put new screenshots in `dist/assets/`. Levels are linkable as `#level-01`, `#level-02`, and so on.
