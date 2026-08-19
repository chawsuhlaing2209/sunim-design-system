# Design tokens — the contract

> Built and kept current by 🎨 token-builder from `tokens/tokens.json`. The handoff is this
> contract, not just the file.
> Version: `1.0.0` · Last built: `2026-08-19` · Source commit: `776a2ef`

## Files
- `tokens/tokens.json` — **the source**, exported from Figma (Design Tokens plugin,
  `org.lukasoppermann.figmaDesignTokens`) and committed here. Always this exact path and name.
  Hand-edit it and the next export overwrites you.
- `build/tokens/css/tokens.css` — CSS custom properties, themed. **Components use this.**
- `build/tokens/ts/tokens.js` + `tokens.d.ts` — typed constants for non-CSS contexts.
- Built output is **git-ignored**. Run `npm run tokens:build` after a clone or a source change.

## What's in it

| | count |
|---|---|
| Source tokens | **1024** |
| Primitives (raw values) | 132 |
| Semantic colors | 427 (61 × 7 modes) |
| CSS variables in `:root` | 657 |
| Per-theme variables | 61 × 7 |
| TS exports | 1023 |

By type: color 559 · dimension 252 · string 148 · custom-fontStyle 29 · number 29 · custom-shadow 7.

`:root` (657) = 596 mode-less tokens + the 61 semantics of the default mode. The source has 597
mode-less leaves; `effect.shadow.float` is a two-stop shadow whose `0`/`1` children merge into one
`--effect-shadow-float`, so 597 − 1 = 596. TS is 1024 − 1 = 1023 for the same reason.

## Usage
```css
@import './build/tokens/css/tokens.css';

.card {
  background: var(--color-surface-page);
  padding: var(--spacing-space-4);
  border-radius: var(--radius-radius-md);
  box-shadow: var(--effect-shadow-card);
  font: var(--font-quote);
}
```
- Use **semantic** tokens (`--color-surface-page`), never a primitive and never a raw value.
- Semantic colors resolve to `var(--primitives-…)`, so the alias chain stays visible in devtools.
- Dimensions are emitted in **px** (the export is unitless; `14` means `14px`).
- Fallbacks: agree with engineering whether to use `var(--x, <fallback>)`. Default: no fallbacks.

### Name prefixes follow the source group
A token's built name is its full path, so the group is part of the name:
`effect.shadow.card` → `--effect-shadow-card`, `type.weight.regular` → `--type-weight-regular`.
See *Known issues* — a few Figma descriptions quote a shorter name than the build emits.

## Theming (Figma modes)
7 modes, each a theme block. **Default is `day`**, which is also what `:root` declares — the
product renders correctly with no attribute set. Flip the whole product with one attribute:
```html
<html data-theme="night">
```
| mode | selector |
|---|---|
| Day *(default, also `:root`)* | `:root`, `[data-theme="day"]` |
| Open | `[data-theme="open"]` |
| Morning | `[data-theme="morning"]` |
| Sunrise | `[data-theme="sunrise"]` |
| Sunset | `[data-theme="sunset"]` |
| Overcast | `[data-theme="overcast"]` |
| Night | `[data-theme="night"]` |

All 7 blocks declare an **identical set of 61 names**; only the values differ. Verified per-block,
so nothing falls back silently at runtime.

### CSS themes, TS does not
The **CSS** platform collapses modes onto shared names. The **TS** platform does not: it keeps the
mode in the export name and resolves to a literal.
```ts
import { ColorDaySurfacePage, ColorNightSurfacePage } from './build/tokens/ts/tokens.js';
// ColorDaySurfacePage   === "#f4f6fb"
// ColorNightSurfacePage === "#101828"
```
Importing a TS constant **opts out of theming** — the value is frozen at build time. For anything
that must respond to `data-theme`, use the CSS variable.

## Updates
Designer changes Figma → **the variables are exported into `tokens/tokens.json`** (committed by
hand, or pushed by CI/CD) → 🎨 token-builder sees the change and re-runs the pipeline
(audit → build → theme → deliver) → the version bumps and this contract updates.

```bash
npm run tokens:build   # style-dictionary build --config style-dictionary.config.js
npm run tokens:check   # verifies every source token reached every theme block
```

`tokens:check` resolves the checker through `$CLAUDE_PLUGIN_ROOT`, which is set only inside the
Claude Code plugin runtime. From a plain shell or CI, set it first:
```bash
CLAUDE_PLUGIN_ROOT="$HOME/.claude/plugins/cache/productive/productive-crew/<version>" npm run tokens:check
```

A **"token collisions"** warning during the build is **expected**: 7 modes collapsing onto one
semantic name is the intent of the `name/kebab-themeless` transform. The check to trust is
`tokens:check`.

The export is the step a human or CI owns. The crew does not read the token set out of Figma: an
MCP read returns the variables that are *applied* in the file, not every variable that exists, so
building the source that way silently drops whatever isn't in use yet.

Never hand-edit the built output, and never hand-edit `tokens.json`.

## Known issues — for the designer, fix in Figma
Non-blocking; the build is correct and complete. Six token **descriptions** quote a CSS variable
name that does not exist in the output, because the description omits the group prefix:

| token | description says | actually built |
|---|---|---|
| `effect.shadow.card` | `--shadow-card` | `--effect-shadow-card` |
| `effect.shadow.card-hover` | `--shadow-card-hover` | `--effect-shadow-card-hover` |
| `effect.shadow.button` | `--shadow-button` | `--effect-shadow-button` |
| `effect.shadow.pin` | `--shadow-pin` | `--effect-shadow-pin` |
| `effect.focus.ring` | `--focus-ring-shadow` | `--effect-focus-ring` |
| `type.weight.regular` | `--weight-regular` | `--type-weight-regular` |

(`effect.shadow.float` carries the same mismatch on its group-level description.)
An engineer following a description would write a variable that resolves to nothing. Fix the
descriptions in Figma and re-export.

## Changelog
- `1.0.0` — 2026-08-19 — **first build.** 1024 source tokens audited clean (kebab naming; all 427
  semantic colors alias a primitive, none raw, no dangling or chained refs; all 61 semantics present
  in all 7 modes). Built `css` + `ts`. 7 theme blocks — day, open, morning, sunrise, sunset,
  overcast, night — 61 names each, day as default in `:root`. `tokens:check` ✓ 657/657.
  Fixed `tokens:build` to pass `--config style-dictionary.config.js`; the Style Dictionary v4 CLI
  only auto-discovers `./config.json`, so the scaffolded script could not find the config.
- `0.0.0` — scaffold. token-builder populates this on the first build after `tokens.json` lands.
