# Unicorn Ascending

**A 13 KB momentum climber about carrying color through a sky being erased by the Grey.**

Unicorn Ascending is being built for **js13kGames 2026: Unicorns and Rainbows**. The project is deliberately small in controls and large in expression: run, jump, spend one Horn Hook, shape the swing, release, and convert that motion into the next higher landing.

The target is not “many mechanics in 13 KB.” The target is one movement language that keeps producing new decisions until the summit.

## Premise

The Grey is eating the sky from below. Seven chromatic layers remain between the unicorn and the **Prism Crown at 777 m**.

The world explains the story mechanically:

- rainbows are terrain;
- prisms are Horn Hook anchors;
- the horn spends one traversal lease per landing cycle;
- the Grey physically consumes the color of rainbows it overtakes;
- clean higher landings rebuild Spectrum;
- completing all seven Spectrum colors creates a burst that drives the Grey downward;
- reaching the Prism Crown reignites the sky.

There is no lore screen to memorize. The story is the state of the playfield.

## The movement sentence

```text
build momentum
      ↓
     jump
      ↓
spend one Horn Hook
      ↓
shape the pendulum
      ↓
release when the tether shines
      ↓
convert velocity into a higher landing
      ↓
Horn relights
```

The Horn is intentionally not an elevator. It redirects velocity the player has already created.

A Hook is spent from the **last rainbow the unicorn actually landed on**, even if Shift is pressed later while airborne. A higher landing is therefore judged against the launch rainbow, not against an arbitrary midair coordinate.

## Why 777 matters

`777 = 7 × 111` is the organizing grammar of the game.

The climb is divided into seven 111 m chromatic strata:

```text
1  ROSE
2  EMBER
3  GOLD
4  MINT
5  AZURE
6  INDIGO
7  VIOLET
                 ↓
          PRISM CROWN
              777 m
```

Crossing a new stratum changes the sky tint, audio register, trail character, and difficulty context. Higher strata also introduce stronger visual wind streaks and more demanding procedural geometry without adding new controls.

This gives the run landmarks. The player is no longer climbing an endless number; they are moving through a seven-part journey.

## Player motivation

The game has four nested goals that all use the same movement system.

### Immediate: survive the next arc

Read the nearest prisms, build enough lateral momentum, Hook, and land before the Grey reaches you.

### Tactical: choose the line

Every generated sky contains a conservative safe spine. Optional narrow side rainbows create higher-risk alternate lines. Moving toward the desired prism biases Horn targeting, so route selection is performed with movement rather than a separate menu or aiming mode.

Risk routes award **+111**.

### Mastery: rebuild Spectrum

A clean release only becomes Spectrum when it is converted into a genuinely higher landing.

Each successful color conversion awards **+11** and advances Spectrum. A poor release fades one color instead of deleting the whole chain. At `7 / 7`, Spectrum Burst awards **+777**, produces a large audiovisual payoff, and knocks the Grey downward.

### Run objective: ignite the Crown

Reach the Prism Crown at **777 m**. Summit completion is not locked behind perfect Spectrum play, so a first win is achievable through survival and routing while mastery remains valuable for score and safety.

## Score language

Scoring is intentionally legible:

```text
1 vertical meter          = +1
clean Spectrum conversion = +11
risky side rainbow        = +111
full Spectrum Burst       = +777
summit height             = 777 base points
```

This replaces arbitrary multipliers with a hierarchy the player can understand at a glance. The live HUD shows current score because route bonuses should affect a decision immediately, not only appear on the death screen.

## Game feel

The simulation stays fixed at **120 Hz**, but presentation is allowed to be soft and organic.

The current feel layer includes:

- jump buffering so slightly early jump input is remembered;
- coyote time so stepping a few frames off an edge does not create brittle failures;
- a damped spring camera rather than a hard positional lerp;
- velocity-driven unicorn tilt;
- procedural squash/stretch on launch and impact;
- animated Grey wave motion;
- persistent rainbow trails;
- target pulses and a bright clean-release tether;
- particles and synthesized audio tied to actual movement events.

These systems change how the game feels without changing what the player must learn.

## Procedural ascent

Generation uses a compact deterministic xorshift PRNG and one normalized altitude parameter to continuously change several geometric dimensions together.

As altitude rises:

- safe gaps expand;
- rainbows become somewhat narrower;
- lateral drift grows;
- risky alternate routes become more frequent;
- the Grey accelerates;
- presentation shifts from calm lower sky toward windier upper Chroma.

The important distinction is **procedural variation inside authored constraints**. Randomness chooses the sky; it is not allowed to choose whether the sky is fair.

A repository topology gate stress-tests tens of thousands of deterministic skies against a conservative Hook acquisition model. The safe spine must remain reachable before a change is allowed to qualify.

## Run structure

The opening remains authored and forgiving. It teaches the input vocabulary using geometry before the generator becomes demanding.

The approximate dramatic arc is:

```text
0–111 m      discover movement
111–333 m    learn to choose lines
333–555 m    maintain momentum under pressure
555–777 m    precision ascent through the upper Chroma
777 m        Prism Crown
```

The difficulty increase comes primarily from geometry and pressure, not from introducing enemy types or ability trees.

## The Grey

The Grey is a world boundary, not an AI opponent.

Its rise accelerates with altitude. As it overtakes rainbows their color fades, the screen darkens as danger closes in, and the storm surface continuously moves. Spectrum Burst can buy breathing room, but never removes the threat permanently.

A loss therefore has a readable cause: the player failed to convert enough upward motion before the Grey caught their position.

## Art and audio

The contest artifact contains no external image, font, music, framework, runtime-package, or network dependency.

Canvas 2D generates:

- analytical seven-band rainbow arcs whose rendering and collision share the same curve;
- primitive unicorn animation;
- prisms and target indicators;
- Chroma-tinted skies;
- stars, wind streaks, particles and trails;
- the moving Grey front;
- the animated Prism Crown.

WebAudio creates compact event cues plus a subtle pulse whose pitch follows both altitude Chroma and Spectrum state.

## Byte strategy

Readable source remains split in `src/`, while the contest packer inlines the runtime into one `index.html` before raw DEFLATE.

```text
readable source
      ↓
inline JS into HTML
      ↓
raw DEFLATE level 9
      ↓
minimal deterministic ZIP
      ↓
13,312-byte hard gate
```

The current Chroma/game-feel candidate is about **6.1 KB zipped**, leaving more than **7 KB** of headroom. That budget is deliberately being preserved for playtesting-driven improvement rather than spent merely because it exists.

## Qualification

`npm test` runs source contracts, the deterministic topology audit, and the exact contest pack.

The Chromium smoke test additionally verifies viewport geometry, fixed-step progress, persistent ground state, movement, Hook acquisition, one-Horn-per-landing authority, launch-rainbow recharge authority, blocked Hook spam, focus cancellation, frozen suspended simulation, resume behavior, and zero page errors.

## Design influences

The development process draws from several ideas collected in [FronkonGames/Awesome-Gamedev](https://github.com/FronkonGames/Awesome-Gamedev): game juice through spring dynamics, camera motion driven by math rather than canned animation, procedural character animation, color as functional communication, and procedural generation constrained by level-design intent.

Those ideas are being used as **compression multipliers**. A spring, an analytic curve, or one normalized difficulty variable can create many moments of feel without requiring assets or large content tables.

## Design rules

1. **Movement stays primary.** New content should ask new questions of the existing controls.
2. **The world teaches.** Geometry and feedback should explain rules before prose does.
3. **A stylish move must become progress.** Spectrum rewards conversion, not button timing alone.
4. **Route choice beats feature count.** Alternative lines create depth more efficiently than inventories.
5. **Difficulty should transform continuously.** Higher altitude should feel different without requiring a new control scheme.
6. **Failure must be legible.** The player should usually understand the line that failed.
7. **Restarts are immediate.** Failure is part of learning the movement language.
8. **Theme is mechanical.** Color, Grey, rainbows, prisms, Spectrum and the Crown all affect play.
9. **Compressed bytes are the real budget.** Source-character golf is irrelevant if the ZIP gets larger or iteration becomes unsafe.

The desired final reaction is simple: **“I know exactly which swing I want to try differently next run.”**
