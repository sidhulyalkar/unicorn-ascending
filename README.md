# Unicorn Ascending

**A tiny vertical momentum climber about running on rainbows, hooking prism stars with a magical horn, and staying ahead of the Grey.**

Unicorn Ascending is a browser arcade game built for the **js13kGames 2026** theme, **Unicorns and Rainbows**. Its design starts from one simple rule: the Horn Hook should redirect movement, not replace it. The game is therefore less about grappling to arbitrary points and more about reading a route, building horizontal momentum, spending one hook, and converting that arc into a higher landing.

The entire contest game is procedural Canvas 2D and WebAudio. There are no image, font, music, framework, runtime-package, or network dependencies in the shipped entry.

## Core loop

```text
run on a rainbow
       ↓
jump with momentum
       ↓
hold Shift to hook the nearest legal prism
       ↓
shape the swing with A / D
       ↓
release Shift to redirect
       ↓
land on a genuinely higher rainbow
       ↓
Horn Hook recharges
```

A rising storm called **the Grey** follows from below. Hesitation costs vertical space, but the early ascent is deliberately forgiving enough to teach the movement vocabulary before the route becomes more lateral.

## Controls

| Input | Action |
| --- | --- |
| `A` / `D` | Run left / right |
| `←` / `→` | Alternate movement controls |
| `Space` | Jump, start a run, or restart after game over |
| Hold `Shift` | Acquire and hold the nearest eligible Horn Hook prism |
| Release `Shift` | Release the tether and carry redirected momentum |

The control set stays intentionally small. Difficulty should come from geometry, timing, momentum, and route choice rather than a large move list.

## Movement model

The player has acceleration, horizontal drag, gravity, jumping, curved-platform landing, and bounded tether forces. Rainbow art and rainbow collision are derived from the same curve instead of using an invisible rectangular floor underneath a decorative arc.

The important design constraint is that player-authored velocity remains meaningful. Hook acquisition supplies a bounded pull, and release preserves and slightly amplifies the earned motion. It is not an elevator button.

### Curved rainbow collision

Each rainbow is represented by a quadratic-looking analytical arc. The renderer draws seven colored bands around that path, while collision samples the same arc function. What the player sees is therefore what the player can land on.

### Deterministic generation

A compact xorshift PRNG generates:

- vertical gaps;
- horizontal drift;
- platform width;
- arc height;
- prism-anchor position.

The starting platform is broad and safe. Higher platforms progressively require more lateral commitment, creating increasingly useful Horn Hook decisions without introducing a second procedural system just for difficulty.

### 120 Hz gameplay authority

Rendering is free-running, but gameplay no longer integrates directly from browser frame time. The simulation uses a fixed:

```text
1 / 120 second step
```

with a bounded eight-step catch-up budget per rendered frame. This matters because a momentum game should not become easier on a 30 Hz render loop simply because a large frame delta was clipped before gravity, movement, or Grey pressure were integrated.

The fixed-step contract gives the important systems one shared clock:

```text
input state
    ↓
120 Hz simulation
    ├─ movement / gravity
    ├─ curved landing collision
    ├─ Horn spring and release timing
    ├─ Grey pressure
    ├─ Spectrum windows
    └─ particles / score state
    ↓
free-running Canvas render
```

If a browser stalls badly enough to exceed the catch-up budget, the game drops accumulated backlog instead of entering a spiral of death. The debug surface reports `fixedHz`, total `simSteps`, and `droppedFrames` so qualification can distinguish ordinary rendering cadence from simulation overload.

## Horn Hook authority

The Horn Hook is intentionally constrained.

### Nearest legal prism

A press searches the current world for the nearest unused prism inside the acquisition radius. The game does not silently choose a farther, more convenient target because it happens to point upward.

### One lease per landing cycle

The moment a legal Hook begins, that traversal cycle is spent. Repeated Shift presses do not create extra leases.

### Higher-rainbow recharge

The Hook becomes ready again only after the unicorn lands on a rainbow that is genuinely above the floor from which the Hook was spent.

```text
Hook used
   ↓
Hook spent
   ↓
higher physical landing
   ↓
Hook ready
```

This turns the mechanic into a route bridge rather than an infinite vertical locomotion system.

## Focus-safe input authority

Browser focus is treated as infrastructure state, not gameplay input.

If the tab, window, or embedded game loses focus while a Horn Hook is active:

- the tether is **cancelled**, not released;
- no Spectrum step is awarded;
- no score is awarded;
- no release velocity is injected;
- held movement keys are cleared;
- the simulation suspends until focus returns;
- the fixed-step accumulator is cleared so stale wall-clock time cannot burst into catch-up physics;
- the spent Hook remains spent, preventing focus churn from becoming a free recharge exploit.

The same safety path is wired to document visibility changes. This is especially important for embedded play, browser shortcuts, tab switching, and automated qualification.

## Spectrum mastery

A deliberate release can build a seven-step **Spectrum** chain. A release is considered clean only when the Hook has been held inside the intended timing window and the unicorn has meaningful horizontal velocity.

```text
1 / 7  red
2 / 7  orange
3 / 7  yellow
4 / 7  green
5 / 7  cyan
6 / 7  indigo
7 / 7  violet
```

Spectrum is deliberately lightweight. The player sees the chain through HUD color, unicorn accents, trail color, particles, and a brief flash rather than a large combo dashboard.

## The Grey

The Grey is a moving world boundary rather than an enemy AI system. Its rise rate increases with altitude within a bounded range.

That gives the game pressure with very little rules overhead:

```text
miss a line
  ↓
lose vertical safety
  ↓
recover quickly or get swallowed
```

Touching the Grey ends the run. The game stores only a local best score and offers an immediate restart.

## Rendering and sound

Everything is generated at runtime.

### Unicorn

The unicorn is composed of Canvas primitives: ellipses, circles, strokes, a horn triangle, mane/tail curves, and a velocity-dependent body tilt.

### Rainbows and prisms

Platforms are seven curved strokes. Hook anchors are procedural stars. The tether is a pair of lightweight line strokes.

### Atmosphere

The sky is a gradient with deterministic stars. The Grey is a filled storm front. Movement and clean releases produce tiny procedural particles.

### Audio

Short WebAudio oscillators provide jump, Hook, Spectrum, restart, and death feedback. No audio file is required.

## Architecture

The contest runtime deliberately avoids a framework.

```text
.
├── src/
│   ├── index.html          # self-contained contest shell
│   └── game.js             # complete readable game runtime
├── scripts/
│   ├── check.mjs           # offline source/invariant checks
│   ├── pack.mjs            # deterministic contest ZIP builder + size gate
│   ├── serve.mjs           # dependency-free static development server
│   └── smoke.mjs           # real Chromium gameplay/focus/clock qualification
├── .github/workflows/
│   └── ci.yml              # source, package-size, and browser gates
├── package.json
└── README.md
```

The readable runtime exposes a small `window.UA` debug surface strictly for qualification. It reports mode, position, velocity, Hook state, platform count, score, best score, Spectrum, Grey position, suspension state, fixed-step frequency, simulation steps, and dropped catch-up frames. Production mechanics do not depend on the debug API.

## js13k size discipline

The final artifact is a real DEFLATE ZIP containing only the contest files. The hard ceiling is:

```text
13 * 1024 = 13,312 bytes
```

`npm run build` recreates the exact package and fails if that ceiling is exceeded. CI should be treated as the source of truth for current compressed bytes and remaining headroom because gameplay work changes those numbers continuously.

The project prefers **fun per byte** over code golf for its own sake. Remaining bytes are budget for better movement feel, clearer teaching, richer hazards, audio, and animation.

## Development

Requires Node.js 20 or newer.

Run the source contracts and build the contest package:

```bash
npm test
```

Serve the readable source:

```bash
npm run dev
```

Build and serve the exact packed output:

```bash
npm run build
npm run preview
```

Run the browser qualification harness in an environment where the CI Playwright payload is available:

```bash
npm run smoke
```

## Qualification strategy

The repository uses several deliberately different gates.

### 1. Source contracts

`scripts/check.mjs` verifies that core gameplay state and control paths still exist, the entry remains offline/self-contained, focus loss cannot regress to a normal scored Hook release, and render-frame delta time cannot silently regain authority over gameplay simulation.

### 2. Deterministic package build

The packer recreates the final ZIP and measures the bytes that the competition actually judges.

### 3. Hard size gate

The build fails above 13,312 bytes. This prevents a polished local build from quietly becoming an invalid competition submission.

### 4. Real-browser smoke

The Chromium harness starts a run through keyboard input, proves the 120 Hz simulation is advancing, proves horizontal movement, primes a deterministic legal prism, proves Hook acquisition/release, rejects a second Shift lease before recharge, and then exercises focus loss while another Hook is live.

The focus test asserts that blur produces:

```text
active Hook → cancelled Hook
score       → unchanged
Spectrum    → unchanged
velocity    → unchanged
simSteps    → frozen while suspended
```

It then restores focus and proves fixed-step simulation authority resumes.

## Design principles

- **Movement remains primary.** The Hook redirects momentum rather than replacing traversal.
- **Deaths should be legible.** A player should usually understand which line failed.
- **Restarts should be immediate.** The learning loop lives between attempt and retry.
- **Skill lives in the player.** There is no permanent movement-stat progression.
- **World rules stay deterministic.** Failure does not secretly cause adaptive difficulty.
- **Simulation rules stay frame-rate independent.** Render cadence does not own gravity, Hook timing, or Grey pressure.
- **The HUD stays small.** The sky and route geometry should own the screen.
- **Browser state is not gameplay state.** Blur, visibility changes, and focus churn cannot create moves.
- **Every byte should earn player value.** Shipping constraints are a design instrument, not merely a final compression chore.

## Relationship to Sylvaria: Sequoia

Unicorn Ascending is a mechanical descendant, not a port.

The inherited design lesson is that a traversal tether becomes more interesting when it creates a new line through existing momentum. Unicorn Ascending rebuilds that idea around a tiny deterministic rainbow world, a rising storm, Spectrum timing, and a 13 KB competition budget.

The code, world generator, rendering, scoring, packaging, and qualification harnesses are independent.

## Current development direction

The next experiments should stay empirical and player-facing:

- tune Hook pull and release against repeated playtests;
- teach the first Hook with a brief in-world visual demonstration;
- explore moving or damaged rainbow segments;
- test a compact thundercloud hazard that changes routing without obscuring collision readability;
- deepen procedural audio without sacrificing control clarity;
- improve pose animation and impact readability;
- give a complete seven-color Spectrum a memorable presentation payoff without permanent power creep;
- evaluate touch controls only if they remain learnable within the byte budget;
- collect repeatable route/failure evidence before adding more systems.

The target is a tiny game that feels authored even when the climb is procedural: **one readable movement sentence, repeated under increasingly interesting geometry.**
