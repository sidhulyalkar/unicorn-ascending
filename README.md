# Unicorn Ascending

**A tiny vertical momentum climber about running on rainbows, hooking stars with a magical horn, and staying ahead of the Grey.**

Unicorn Ascending is a fresh browser game designed for the **js13kGames 2026** theme, **Unicorns and Rainbows**. The project borrows one design lesson from *Sylvaria: Sequoia* — traversal is most satisfying when a grapple-like tool redirects momentum instead of replacing movement — but the implementation is new, deliberately tiny, and built around the contest's compressed ZIP constraint from its first commit.

Official competition: https://js13kgames.com/

## The game in one sentence

> **Run along curved rainbows → jump → hold Shift to Horn Hook the nearest prism star → release to redirect → land on a higher rainbow to recharge.**

A gray storm called **the Grey** rises from below. The player is always making one readable decision: *which rainbow is my next landing, and can the Horn Hook make that line cleaner?*

## Current playable prototype

The initial implementation already includes:

- responsive full-screen Canvas rendering;
- a procedural unicorn drawn entirely from primitives;
- curved seven-band rainbow platforms with matching curved collision surfaces;
- deterministic procedural vertical world generation;
- acceleration, friction, gravity, jumping and forgiving landing geometry;
- nearest-eligible **Horn Hook** acquisition;
- bounded rope pull and release momentum;
- one Horn Hook lease per landing cycle;
- Horn recharge only after reaching a genuinely higher rainbow;
- per-anchor one-use state;
- a rising Grey threat that accelerates with altitude;
- clean-release timing that builds a seven-step **Spectrum** chain;
- procedural rainbow trails and impact particles;
- tiny WebAudio feedback with no audio files;
- local best-score persistence;
- instant restart;
- a browser-readable debug surface used only for qualification;
- an automated contest ZIP builder and hard size gate;
- a real Chromium movement/Horn Hook smoke test in CI.

There are **no image files, fonts, audio files, network requests, frameworks, runtime dependencies, or external assets** in the contest entry.

## Controls

| Input | Action |
| --- | --- |
| `A` / `D` | Run left / right |
| `←` / `→` | Alternate movement controls |
| `Space` | Jump; start; restart |
| Hold `Shift` | Fire and hold the Horn Hook on the nearest eligible prism |
| Release `Shift` | Release the tether and carry redirected momentum into the next landing |

The control vocabulary is intentionally tiny. The challenge should come from reading geometry and managing momentum, not remembering buttons.

## Horn Hook design

The Horn Hook is not intended to be a universal grappling gun.

A valid press searches for the nearest unused prism anchor in a bounded range. Once attached, the tether pulls the unicorn toward the anchor while horizontal input can shape the arc. Releasing preserves and slightly amplifies the earned velocity rather than injecting arbitrary vertical height.

The important authority rule is:

```text
use Horn Hook
      ↓
that landing cycle is spent
      ↓
land on a genuinely higher rainbow
      ↓
Horn Hook becomes ready again
```

This creates a traversal sentence instead of a button-mashing escape hatch. The player has to convert each Horn use into a real landing.

## Spectrum mastery

A Horn release counts as **clean** when the tether has been held inside a deliberate timing window and the unicorn has meaningful horizontal speed.

Clean releases build:

```text
1 / 7  red
2 / 7  orange
3 / 7  yellow
4 / 7  green
5 / 7  cyan
6 / 7  indigo
7 / 7  violet
```

The goal is not to bury the game under combo UI. Spectrum is communicated mainly through the unicorn's color and trail. Mastery should become visible in the sky behind the player.

## The Grey

The Grey is a single moving world boundary rather than an enemy AI system. That makes it extremely byte-efficient while giving every hesitation a cost.

At low altitude it rises gently, allowing the player to learn. As height increases, its rate increases within a bounded range. Touching the Grey ends the run immediately and shows the height score and local best.

The intended emotional loop is:

```text
miss a line
  ↓
understand the mistake immediately
  ↓
restart instantly
  ↓
try the cleaner rainbow / Horn sequence
```

No lives, consumables, timers, loot boxes, upgrades or artificial retention mechanics are necessary.

## Procedural world model

The world is generated from a tiny xorshift PRNG. Each new rainbow derives only a handful of values:

- vertical gap;
- horizontal drift;
- rainbow width;
- arc height;
- prism position.

The platform's *rendered curve is also its collision surface*. That is important for both feel and byte efficiency: there is no separate decorative geometry pretending to be traversable geometry.

The initial rainbow is deliberately broad and safe. Subsequent pieces gradually demand more lateral movement and therefore make Horn Hook routing increasingly important.

## Rendering without assets

Everything in the shipped game is Canvas 2D geometry.

### Unicorn

The unicorn is constructed from ellipses, circles, lines, a horn triangle, and curve strokes for mane and tail.

### Rainbows

Each platform is seven colored quadratic curves. Collision uses the corresponding analytical arc approximation.

### Prism anchors

Anchors are tiny procedural stars.

### Atmosphere

The sky is a gradient, stars are deterministic points, the Grey is a filled storm boundary, and particles are colored rectangles. The same small palette is reused throughout the game.

This is not just an optimization. It gives the game a coherent visual language where the mechanics and artwork are made from the same primitives.

## js13k byte budget

The repository treats the final ZIP size as a **testable product requirement**.

The current baseline is:

| Artifact | Bytes |
| --- | ---: |
| `src/index.html` | 612 raw |
| `src/game.js` | 8,507 raw |
| **`dist/unicorn-ascending.zip`** | **4,273** |
| Contest ceiling | **13,312** |
| Current headroom | **9,039** |

The build intentionally uses standard ZIP DEFLATE rather than quoting gzip/Brotli numbers that the competition does not judge.

Every CI run rebuilds the ZIP and fails if:

```text
zipBytes > 13 * 1024
```

That leaves the project free to spend remaining bytes where players will notice them most: movement feel, audio, animation, hazards, and teaching.

## Repository structure

```text
.
├── src/
│   ├── index.html          # complete contest shell
│   └── game.js             # readable game/runtime source
├── scripts/
│   ├── check.mjs           # offline/self-contained source contracts
│   ├── pack.mjs            # deterministic DEFLATE ZIP builder + byte gate
│   ├── serve.mjs           # dependency-free local static server
│   └── smoke.mjs           # real-browser movement/Horn Hook qualification
├── .github/workflows/
│   └── ci.yml              # build, byte budget, browser smoke, artifacts
└── README.md
```

`dist/` is generated and ignored. The contest ZIP always contains only:

```text
index.html
game.js
```

## Development

Requires Node.js 20 or newer. There are no npm runtime or build dependencies.

```bash
npm test
```

Runs source contracts and builds the contest artifact.

```bash
npm run dev
```

Serves the readable source at `http://127.0.0.1:4173`.

```bash
npm run build
npm run preview
```

Builds `dist/unicorn-ascending.zip`, writes `dist/size.json`, and serves the exact packed files.

## CI qualification

The GitHub Actions gate performs four layers:

1. **Source contract audit**
   - required movement/Horn/Spectrum state exists;
   - the entry has no `fetch`, XHR, WebSocket or external HTTP dependency;
   - the canvas shell is self-contained.
2. **Contest artifact build**
   - recreate `dist/index.html` and `dist/game.js`;
   - create a real DEFLATE ZIP using a dependency-free Node packer.
3. **Hard size gate**
   - fail above 13,312 bytes;
   - publish exact remaining headroom in `size.json`.
4. **Browser smoke**
   - launch Chromium;
   - start a run through real keyboard input;
   - prove horizontal movement;
   - prime a deterministic legal Horn target;
   - press/release Shift through real browser input;
   - assert the hook attaches and releases;
   - capture a screenshot artifact;
   - fail on browser page errors.

The CI artifact contains the exact ZIP that should eventually be submitted, its machine-readable size report, and the latest smoke screenshot.

## Design constraints

The project follows several rules deliberately:

- **Movement remains primary.** Horn Hook redirects movement; it does not invalidate it.
- **A death should be legible.** The player should usually know which line they missed.
- **No hidden adaptive difficulty.** World rules do not change because the player failed.
- **No permanent stat progression.** Skill lives in the player, not an upgrade tree.
- **Minimal HUD.** The sky should dominate the screen.
- **Procedural art first.** New presentation ideas should generally reuse existing geometry rather than add asset files.
- **Byte spend must create player value.** A feature that costs 600 compressed bytes should earn its place.

## Relationship to Sylvaria: Sequoia

Unicorn Ascending is a **mechanical descendant, not a port**.

The useful inherited design insight is:

> A traversal tether is more interesting when it creates a new line through existing momentum than when it simply pulls the player to a destination.

The code, world representation, rendering, progression, scoring and contest build pipeline are new. Full Sylvaria systems such as Heartwood progression, Living Canopy setpieces, Canopy Contracts and Mastery Lab are intentionally absent. They are excellent full-game systems and terrible 13 KB roommates.

## Near-term design room

Because the first ZIP has substantial headroom, the next experiments can be empirical rather than desperate code golf:

- tune Horn pull/release feel;
- add a two-second visual tutorial instead of more text;
- add broken/moving rainbows;
- add thundercloud knockback;
- add collectible shooting stars;
- deepen procedural audio;
- improve unicorn pose animation;
- make a completed seven-color Spectrum produce a memorable but non-power-creeping payoff;
- evaluate a compact touch control scheme if Mobile-category play feels worthwhile;
- run repeated desktop/browser playtests before spending remaining bytes.

The priority is **fun per byte**, not features per byte.

## Competition status

The 2026 js13kGames competition runs from August 13 to September 13 and the official theme is **Unicorns and Rainbows**. This repository is being developed as a possible Desktop-category submission and should not be considered final until its controls, difficulty curve and submission ZIP have received a dedicated playtest pass.
