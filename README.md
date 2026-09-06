# Unicorn Ascending

**A 13 KB momentum climber about turning one magical swing into the next higher landing before the Grey eats the sky.**

Unicorn Ascending is a browser arcade game for **js13kGames 2026: Unicorns and Rainbows**. The design is intentionally narrow: movement should stay expressive, every rule should be readable, and every byte should create player value.

## The sentence of the game

```text
run → jump → spend one Horn Hook → shape the swing → release → land higher → recharge
```

The Horn is not an elevator. It redirects velocity the player has already created. One legal Hook can be spent per landing cycle, and the Horn only relights after a genuinely higher landing.

The long-term mastery loop is equally simple:

```text
clean release + higher landing
        ↓
    Spectrum +1
        ↓
       7 / 7
        ↓
   SPECTRUM BURST
        ↓
 shove the Grey downward
```

A stylish release only counts when the player converts it into progress.

## Run structure

The climb now has a destination: **777 m**.

The opening is deliberately authored and forgiving so the player can discover running, jumping, Hook acquisition, release timing, and Horn recharge before the generator becomes more demanding. Above the opening, a guaranteed procedural spine keeps the run solvable while optional narrow side rainbows create higher-risk score routes.

The run therefore has three layers:

1. **Learn the movement language.** Broad opening rainbows teach without a separate tutorial scene.
2. **Read the sky.** Procedural safe lines and optional +90 side routes create route choice.
3. **Outrun the Grey.** Pressure rises with altitude until the player reaches the summit or loses their colors.

## Controls

| Input | Action |
| --- | --- |
| `A` / `D` or `←` / `→` | Run and shape swings |
| `Space` | Jump / start / restart |
| Hold `Shift` | Acquire the nearest legal prism and hold the Horn Hook |
| Release `Shift` | Release the tether and carry redirected momentum |

When the current swing enters the clean-release window, the tether brightens and displays **RELEASE!**. After a Horn is spent, the HUD says **LAND HIGHER TO RELIGHT YOUR HORN** and the horn itself visibly dims.

## Movement and landing authority

Gameplay is simulated at a fixed **120 Hz** while rendering remains free-running. Gravity, Horn timing, Grey pressure, collision, score state, particles, and progression therefore share one simulation clock rather than inheriting browser frame cadence.

Rainbow rendering and collision use the same analytical arc. The player lands on the curve they can actually see.

Ground contact is persistent state. Standing on a rainbow no longer re-fires the landing path every simulation tick; landing particles, recharge logic, route rewards, and Spectrum conversion occur only on a genuine airborne-to-ground transition.

## Horn Hook

A Hook press chooses the nearest unused prism inside the legal acquisition radius. A subtle pulse marks the target while the Horn is ready.

The moment a Hook begins, that traversal lease is spent. Repeated Shift presses cannot manufacture extra Hooks. Losing browser focus cancels a live tether without releasing it, injecting velocity, or awarding score.

## Spectrum mastery

A release is clean only when:

- it occurs inside the intended tether-age window;
- the unicorn has meaningful horizontal velocity;
- the resulting traversal is converted into a higher landing.

Each successful conversion advances Spectrum. Completing all seven colors triggers **Spectrum Burst**, awards a large score bonus, creates a strong audiovisual payoff, and pushes the Grey downward to buy breathing room.

This is intentionally not permanent progression. The player becomes stronger by playing better, not by accumulating movement stats.

## The Grey

The Grey is a moving world boundary rather than enemy AI. Its rise accelerates with altitude.

Rainbow visibility now decays as the Grey overtakes it, so the threat is not just a rectangle approaching from below: the Grey is visually consuming the color of the route. Screen tone darkens as the storm closes on the unicorn.

## Procedural route design

Generation uses a compact deterministic xorshift PRNG. The main spine varies:

- vertical gap;
- horizontal drift;
- rainbow width;
- arc height;
- prism position.

Optional narrow side rainbows appear above the authored opening. They pay a one-time `+90` route bonus and are deliberately less forgiving than the spine. This creates player-authored route choice without adding a second movement system.

Old rainbows are pruned once they are safely below the active camera region so long runs do not accumulate an ever-growing world list.

## Presentation

Everything is generated at runtime with Canvas 2D and WebAudio:

- seven-band analytical rainbows;
- procedural stars and prism anchors;
- primitive-drawn unicorn with movement tilt and lightweight run motion;
- particles and rainbow trail;
- Grey storm front and danger tint;
- synthesized jump, Hook, landing, route, Spectrum, death, and summit cues;
- a subtle reactive pulse whose pitch follows current Spectrum state.

There are no image, font, music, framework, runtime-package, or network dependencies in the contest artifact.

## 13 KB packaging

Readable development source stays split between `src/index.html` and `src/game.js`, but the contest packer now **inlines the runtime into a single `index.html` before DEFLATE**. This eliminates the second ZIP member and gives the compressor one shared stream across HTML, CSS, and JavaScript.

```text
readable source
      ↓
single-file contest HTML
      ↓
raw DEFLATE level 9
      ↓
minimal deterministic ZIP
      ↓
13,312-byte hard gate
```

The latest local candidate after the contest-run tranche is roughly **5.4 KB zipped**, leaving substantial headroom for further playtesting-driven polish. CI remains the source of truth for the exact branch artifact.

The project optimizes **compressed bytes**, not source-character count. Code golf that hurts the final ZIP or makes gameplay harder to safely iterate is not considered an optimization.

## Qualification

`npm test` runs source contracts and builds the exact contest ZIP.

The repository's Chromium smoke harness additionally proves:

- the 3:2 gameplay viewport remains undistorted;
- the 120 Hz simulation advances independently of rendering;
- keyboard movement works;
- Horn acquisition and release work;
- one-Horn-per-landing authority cannot be bypassed by Shift spam;
- focus loss cancels the Hook without manufacturing score, Spectrum, or release velocity;
- suspended simulation steps stay frozen and resume safely.

Best-score persistence is fail-soft so a restrictive or sandboxed embed cannot prevent the game itself from booting.

## Design rules

- **Movement stays primary.** New content should ask new questions of the existing controls.
- **A stylish move must become progress.** Spectrum rewards successful conversion, not button timing alone.
- **Route choice beats feature count.** Safe and risky lines create depth more efficiently than inventories or upgrade trees.
- **Deaths should be legible.** The player should usually know which line failed.
- **Restarts should be immediate.** Failure is part of learning the movement language.
- **The run needs a climax.** 777 m creates a finish worth chasing instead of an endless treadmill.
- **The theme must be mechanical.** Rainbows are terrain, the horn is traversal, Spectrum is mastery, and the Grey literally consumes color.
- **Every byte must earn player value.** Compression is a design instrument, not a substitute for design.

## Next experiments

The next tranche should stay empirical:

- cold-playtest the authored opening with people who receive no verbal explanation;
- tune safe-spine versus risky-route frequency from actual death/retry behavior;
- decide whether one additional geometric modifier, such as a fractured rainbow, creates enough route depth to justify its rule cost;
- deepen the reactive soundtrack only after movement timing is frozen;
- add summit spectacle and stronger Grey/weather animation while retaining collision readability;
- A/B conservative minification and Roadroller/ECT-style packing only after the gameplay source is close to feature freeze.

The target is not the most systems inside 13 KB. It is a tiny game with one exceptionally good movement sentence that keeps producing new decisions all the way to the top.
