# Unicorn Ascending: Prismwild

A js13kGames 2026 momentum-action climber built around one rule:

> **Velocity is traversal, offense, defense, and style.**

This branch is an experimental redesign of the qualified vertical climber on `main`. The old build remains intact while `feat/momentum-world` tests a much larger competition concept: remove the side walls, turn the 960×640 canvas into a moving camera over a broad world, and make the Horn Hook the center of both traversal and combat.

## Core loop

```text
explore a branching rainbow route
        ↓
build speed by running / jumping / hooking
        ↓
convert velocity into a Horn strike or Comet Dive
        ↓
defeat enemies without stopping
        ↓
kill / new landing / prism shard recharges Horn authority
        ↓
build Spectrum and push back the Grey
        ↓
climb through three sky regions to the Crown
        ↓
defeat the Color Eater
```

The important design constraint is that combat must never become a separate stop-and-fight mode. Enemies are movement geometry: targets to break through, rebound from, pull, orbit, dodge, or use as temporary Hook anchors.

## Controls

| Input | Action |
| --- | --- |
| `A` / `D` or `←` / `→` | Accelerate horizontally |
| `Space` | Jump / start / restart |
| Hold `Shift` | Horn Hook the nearest eligible prism or enemy |
| Release `Shift` | Release the Hook while preserving redirected momentum |
| `S` or `↓` while airborne | Comet Dive |

There is intentionally no normal attack button. Movement produces attacks.

## World-space redesign

The Canvas remains an aspect-safe 960×640 presentation surface, but it is no longer the game world. Player coordinates are not clamped to the Canvas edges. A two-axis camera follows position plus velocity look-ahead, so horizontal exploration can extend well beyond one screen while high-speed motion reveals the route ahead.

The current vertical slice creates a deterministic broad campaign route with:

- a guaranteed ascending spine;
- horizontally distant side rainbows;
- optional prism-shard detours;
- enemy-bearing combat routes;
- three altitude-based visual regions;
- a Crown platform and final boss.

The route is deliberately authored by a compact grammar rather than by unconstrained random platform soup. Future iterations can replace the current finite campaign generator with chunk-addressable world cells without changing combat or camera authority.

## Momentum combat

Enemy contact is resolved from player-authored velocity.

A sufficiently fast horn-first collision becomes an attack. Comet Dive converts downward velocity into an attack and rebounds the unicorn upward after a kill. Weak contact instead breaks flow and knocks the unicorn away, making enemies dangerous primarily because they destabilize traversal.

High-speed kills preserve or amplify useful motion instead of forcing the player to stop.

### Current enemy set

- **Greyling** — basic moving target; also a light Hook target that can be pulled.
- **Storm Eye** — floating Hook anchor that fires slow Grey projectiles.
- **Prismback** — armored from the front; reward for approaching from behind with real speed.
- **Cloudram** — heavy charger; dangerous collision and useful Hook pivot.
- **Color Eater** — Crown boss with multiple high-speed hit points.

The implementation intentionally reuses the same distance, spring, velocity, contact, particle, and scoring machinery across these enemy roles.

## Horn Hook authority

`main` used one Hook lease per higher-landing cycle because the game only wanted upward traversal. That rule is intentionally generalized here for a two-dimensional world.

A successful Hook spends the current lease. Repeated Shift presses cannot create free traversal. Horn authority is rearmed by meaningful progression events:

- landing on a different rainbow;
- defeating an enemy;
- collecting a prism shard.

The Hook can target both world prisms and enemies. Most targets pull the player. Greyling is deliberately light enough for the same spring machinery to pull the enemy instead.

Focus loss remains neutral browser infrastructure state: an active Hook is cancelled without release velocity, score, Spectrum progress, or other player-authored benefit, the fixed-step accumulator is cleared, input state is reset, and simulation remains suspended until focus returns.

## Spectrum / Prismatic Flow

Clean Hook releases, kills, and optional prism shards build Spectrum.

At seven steps the game enters a short **Prismatic Flow** state. Movement acceleration and velocity ceiling increase, Hook reach expands, high-speed combat becomes more permissive, the Grey is pushed back, and audio/visual feedback becomes brighter. The intent is to create brief expert-controlled fireworks rather than a passive stat bonus.

## The Grey

The Grey remains the run's time pressure, but exploration is now allowed to buy time through mastery.

The Grey rises continuously. Efficient combat and prism-shard detours push it downward. This creates a compact exploration economy:

```text
side exploration costs time
combat earns time
skillful movement earns routes and score
```

Touching the Grey ends the run immediately and restarts remain fast.

## Boss

The current Crown encounter uses the **Color Eater**, a heavy orbiting target with five hit points. Ordinary low-speed contact is dangerous. The player must repeatedly build meaningful velocity, strike, rebound, reconnect to prisms/enemies, and attack again. Defeating it ends the run with `ASCENDED` rather than silently continuing forever.

This is intentionally still a prototype boss. The next design pass should make each hit change the surrounding route so the fight becomes a final traversal exam rather than merely a moving high-speed target.

## Fixed-step authority

Gameplay continues to run at exactly 120 Hz with a bounded eight-step catch-up budget. Rendering is free-running. Movement, gravity, Hooks, enemy movement, projectiles, combat, Grey pressure, Spectrum state, particles, and score therefore share one authoritative clock.

A severe browser stall drops stale accumulated backlog rather than allowing a spiral of death.

## js13k size discipline

The contest artifact is still generated by `scripts/pack.mjs` as a real DEFLATE ZIP containing only:

```text
index.html
game.js
```

The hard gate remains:

```text
13 * 1024 = 13,312 bytes
```

`npm test` runs source contracts and recreates the package. The build fails if the ZIP exceeds that ceiling.

This branch deliberately keeps the readable development source ungolfed while mechanics are changing. Fun is being purchased before code-golf. Once the design stabilizes we can evaluate deterministic minification, property mangling, single-file packaging, stronger DEFLATE search, and Roadroller as independent production candidates.

## Qualification

The branch CI now protects both the old infrastructure guarantees and the new design boundaries.

Source checks require:

- 120 Hz fixed-step authority;
- aspect-safe 3:2 presentation;
- no restored horizontal side-wall clamps;
- world-space camera state;
- momentum combat and enemy update paths;
- Comet Dive;
- Spectrum / Prismatic Flow;
- Color Eater boss state;
- focus-neutral Hook cancellation;
- offline/self-contained contest runtime.

The Chromium smoke test additionally proves:

- the packed entry starts;
- the Canvas remains aspect-safe;
- fixed-step simulation advances;
- generated world extents exceed the viewport substantially in both axes;
- horizontal movement drives the world-space camera;
- Hook leases cannot be spammed;
- blur cannot manufacture release benefits;
- suspended simulation does not advance;
- a deterministic high-velocity horn strike defeats a Greyling and recharges Horn authority;
- generated platform/enemy populations remain nontrivial.

## Development

```bash
npm test
npm run dev
```

To exercise the exact packed artifact:

```bash
npm run build
npm run preview
```

Browser qualification requires the Playwright payload used by CI:

```bash
npm run smoke
```

## Current design checkpoint

The most important playtest question for this branch is not whether it contains enough content.

It is:

> **Does hooking, redirecting, killing at speed, rebounding, and immediately catching the next route feel better than stopping to attack?**

If yes, this becomes the foundation for encounter grammar, more authored biome structure, a stronger Crown fight, procedural music, and competition polish. If not, combat should be retuned before any additional content is added.
