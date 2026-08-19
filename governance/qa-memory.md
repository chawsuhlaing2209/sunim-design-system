# QA memory

What testing this design system has taught the crew. 🔍 QA reads this at Step 0 of every run and
appends to it at Step 7.

This file lives in the **project**, not the plugin — the plugin is replaced on every update, and
these lessons are yours. Nothing here is generic advice; if a lesson turns out to apply to every
design system, propose moving it into the plugin's testing plan instead.

**Never delete a working entry.** Deprecate it with a note and the date.

---

## Component quirks

Behaviour that isn't in the testing plan and would help the next run.

<!-- Format:
### [Component] — [short description] (YYYY-MM-DD)
What was discovered, how to detect it, and what to do about it.
-->

### Button — a spinning spinner's bounding box lies (2026-08-19)
`Button/*/Loading` renders a 14px spinner with `animation: sunim-button-spin`. Because
`getBoundingClientRect()` returns the **transformed** box, a mid-rotation square reads up to
`14 × (|cos θ| + |sin θ|)` ≈ 19.8px. Md measured 15.93px and Lg 14.00px in the same pass — that
looked like a size bug and is not one. For any animated or transformed element, measure with
`getComputedStyle(el).inlineSize / blockSize`, never the rect. Both sizes resolve to 14px.

### Button — the matrix stories pin hover/focus with `data-force-state` (2026-08-19)
Hover and Focus cells cannot be produced by automation reliably, so the stories set
`data-force-state="hover" | "focus"`, and the CSS pairs each pseudo-class with the attribute
(`.sunim-button--primary:focus-visible, .sunim-button--primary[data-force-state='focus']`).
Two consequences: the forced-state story is the **correct** surface for judging the state's image,
and a passing forced-state story does **not** prove the real pseudo-class works — verify the live
`:hover` / `:focus-visible` path separately at least once (this run did, via a real Tab keypress).

### Button — Md is 36.5px against Figma's 37px, and that is accepted (2026-08-19)
Figma and Chrome round AUTO line-height differently (17 vs 16.5). Lg matches exactly at 47px.
Pinning a px line-height would hardcode a raw value, so the 0.5px stands. Confirmed again this run
across all six Md cells. Do not re-log it as a finding.

### Button — Disabled and Loading are behaviour, not decoration (2026-08-19)
Verified on the deployed build, worth repeating for any control: `Disabled` uses the native
`disabled` attribute (not focusable, dispatches no click at all), while `Loading` stays focusable
and carries `aria-disabled` + `aria-busy` + a visually-hidden "Loading", and blocks activation by
calling `preventDefault()`. The way to tell the guard fired is a document-level click listener
reading `event.defaultPrevented` — the click still dispatches, so counting clicks proves nothing.

## Recurring failure patterns

A failure type seen in more than one component. These are candidates for becoming standing checks —
once a pattern lands here, look for it everywhere.

<!-- Format:
### [Pattern name] (first seen YYYY-MM-DD · N components)
How it presents, how to detect it, the fix to recommend.
-->

### Focus ring is visible but under 3:1 against the page (first seen 2026-08-19 · 1 component)
Not the classic transparent-outline failure — the ring **renders and is plainly visible**, which is
why looking at the image alone passes it. The token `effect.focus.ring` is
`0 0 0 3px #2ba4ec66`; a 40%-alpha ring composited over a white surface resolves to `#aadbf7`,
which is **1.48:1** against that surface where WCAG 2.2 SC 2.4.11 / SC 1.4.11 want 3:1.
**Standing check for every focusable component:** composite the ring colour over the surface it is
drawn on and compute the ratio — don't stop at "the ring is there". A 4-line canvas composite plus
the WCAG relative-luminance formula does it. The fix is a token change, never a per-component
override, so the finding is named against `effect.focus.ring` and routed to whoever owns tokens.

> **RESOLVED — accepted as intentional design (Chaw Su, 2026-08-19).** The current alpha on
> `effect.focus.ring` is deliberate. The six Button `focus` rows were moved to `Passed` and Button
> advanced to `To be deployed`. **Do not re-raise this as a finding against Button or any other
> component while the token is unchanged** — measure it, note it matches the accepted value, pass
> the row. Re-raise ONLY if `effect.focus.ring` changes to a value that is *also* under 3:1, since
> that would be a new decision rather than the accepted one. The underlying WCAG 2.2 SC 2.4.11 gap
> (1.48:1 vs 3:1) is unchanged and remains a known non-conformance for keyboard users; it is
> recorded here so an audit finds it rather than being rediscovered as a defect each run.

### Opacity-based states quietly move label contrast (first seen 2026-08-19 · 1 component)
A group `opacity` on a control composites the **label as well as the fill**, so a state that only
"dims" the component also changes its text contrast. Button/Loading at 85% takes the label from
4.70:1 to **3.64:1**; Disabled at 50% reaches 2.04:1 (exempt — WCAG excludes inactive controls).
When a state is expressed as opacity, always recompute label contrast rather than assuming the
default state's number carries over.

## Tooling workarounds

How the tools behave, as opposed to how the components behave — MCP quirks, Storybook URL and id
resolution, browser automation limits, Airtable field constraints.

<!-- Format:
### [Tool] — [short description] (YYYY-MM-DD)
The behaviour and the workaround.
-->

### board.js — `tests add` cannot write this base: `Composed In` is a link field (2026-08-19)
**This blocked the whole recording step of the first Button run.** Every `tests add` returns:
`Airtable 422 INVALID_VALUE_FOR_COLUMN: "Value is not an array of record IDs."`
Cause is in the plugin, not the payload: `scripts/board/airtable.js → testsAdd()` opens each record
with `const fields = { [tf.component]: name }` — the component **name as a bare string** — but
`Composed In` in base `appZaeKPj6g6ls6MO` is a linked-record field and needs
`["recXEED0zlz31skvt"]`. Reproduces with a payload of only `case` + `result`, which proves the
rejected column is the one the script always sets and not a field QA supplied. Nothing is written,
so there is no half-written matrix to clean up. QA cannot fix this — the plugin is outside QA's
write scope and QA has no Airtable access of its own. Escalate to the orchestrator. Until it is
fixed, no component can be recorded and every run ends blocked at Step 7.

### Figma MCP — not exposed to crew agents on this machine (2026-08-19)
The tools named in the task (`mcp__c1f588cb-…__get_metadata` / `get_design_context` /
`get_screenshot`) return **"No such tool available"** inside the QA agent, and there is no
`FIGMA_*` token in the environment. This matches the standing note that claude.ai connectors are
invisible to productive-crew agents. Practical fallback used this run: the imported token file
`tokens/tokens.json` → `build/tokens/css/tokens.css` **is** the Figma tokens file, so every colour,
radius, spacing, shadow and type value can still be verified against design truth; only geometry
that lives on the node itself (symbol heights) has to come from the brief. Say so explicitly in the
card — a run that cannot open the node is not a full visual parity run.

### Chrome MCP — computed style is stale inside the same `browser_batch` (2026-08-19)
After `computer.key Tab`, a `javascript_tool` call **in the same batch** reported the button's
`box-shadow` as the base drop shadow while `matches(':focus-visible')` was already `true`. Reading
the same property in a **separate** call returned the ring,
`rgba(43, 164, 236, 0.4) 0px 0px 0px 3px`. Style recalc has not settled when the batched eval runs.
Never conclude a focus style is missing from a batched read — re-read it in its own call. This is
the concrete mechanism behind the testing plan's "never judge focus from computed style alone".

### Chrome MCP — a click only lands after a screenshot activates the tab (2026-08-19)
`computer.left_click` silently did nothing (0 events on a document listener) while
`document.visibilityState` was `hidden`; the identical click landed once a `screenshot` action
preceded it in the batch. Always order interaction batches
`screenshot → click → assert`, and **always run a positive control** — a click test that reports
"nothing happened" is indistinguishable from a click that never happened.

### Vercel — the Live feedback widget joins the tab order of the deployed Storybook (2026-08-19)
The staging deploy injects `<vercel-live-feedback>`, which takes focus during keyboard tests and
makes tab-order counting meaningless (8 tabs from the body landed on the widget, never the
component). Workaround: insert a temporary `<input>` immediately before the control in the DOM,
click it, then press Tab once — that gives a genuine keyboard-modality focus on the control.
Remember this is deployment furniture, not a component defect: do not log it against the component.

### Storybook — measure the matrix with parallel same-origin iframes (2026-08-19)
Reading 30 stories by navigating one at a time exceeds the CDP eval ceiling
(`Runtime.evaluate timed out after 45000ms`). What works: stay on the Storybook origin, create
hidden `<iframe>`s pointing at `/iframe.html?id=<id>&viewMode=story`, load a **chunk of 10 in
parallel**, `await d.fonts.ready`, poll for the component root, then read `getComputedStyle`.
Three chunks cover a 30-cell matrix in three calls. Resolve ids from `/index.json`
(`entries[].name` → `entries[].id`) — the deployed build publishes 31 entries, the 30 matrix cells
plus `Playground`, which is expected and not a defect.

### javascript_tool — returning raw CSS rule text can be blocked (2026-08-19)
Returning `cssRules[].cssText` from the Storybook stylesheets came back as
`[BLOCKED: Cookie/query string data]` twice, even trimmed to 160 chars. Return **derived** values
instead — counts, booleans, a single resolved property — e.g. counting rules that contain
`sunim-button` / `focus-visible` / `effect-focus-ring` confirmed the deployed CSS carried all three
focus rules without ever echoing the stylesheet.

## Protocol change log

Changes proposed to the plugin's testing plan, and what came of them.

<!-- Format:
### YYYY-MM-DD — [what changed and why]
-->

### 2026-08-19 — proposed to the orchestrator: fix `testsAdd()`'s link-field write
`scripts/board/airtable.js` must send the component link as an array of record ids
(`[component.id]`), not the component name, or `tests add` fails against any base where
`Composed In` is a linked-record field. Blocks recording for **every** component, not just Button.
Not changed by QA — the plugin is outside QA's write scope. Raised, awaiting the orchestrator.

### 2026-08-19 — suggested standing check, not yet proposed as a plan change
Step 6 currently treats focus indicators as a present/absent question ("a transparent outline is
the common failure"). This run found a ring that is present, visible, and still fails WCAG at
1.48:1. If a second component shows the same shape, propose adding "composite the ring over its
surface and compute the ratio" to the plugin's Step 6.
