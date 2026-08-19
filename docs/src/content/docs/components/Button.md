---
title: Button
description: The action. Primary is the one thing this view wants you to do, and there is one per view. Secondary sits beside it, ghost is tertiary.
---

The action. Primary is the one thing this view wants you to do, and **there is one per view**.
Secondary sits beside it, ghost is tertiary.

Set the text with the `Label` property.

:::danger[Ship the real states, not just Default]
From the design: *"Hover, Focus, Disabled and Loading are real states, not decoration: build them
into the screen rather than shipping Default only."*

Hover and focus come from `:hover` / `:focus-visible` and need nothing from you. `disabled` and
`loading` are props that change behaviour, not only colour — a screen that never sets them is an
unfinished screen.
:::

- **Figma:** node `19:231` — Variant (Primary · Secondary · Ghost) × Size (Md · Lg) ×
  State (Default · Hover · Focus · Disabled · Loading).
- **Storybook:** [Components/Button](https://storybook-static-roan-chi.vercel.app/?path=/story/components-button--playground)
  — 31 stories: the 30-cell matrix plus a `Playground`.

## Usage

```tsx
import { Button } from '../../src/components/Button';

<Button variant="primary" size="md" onClick={submit}>
  Apply for this cohort
</Button>;
```

The built token stylesheet must be loaded once by the app — `build/tokens/css/tokens.css`.
Without it every `var()` in the component resolves to nothing and the button renders unstyled.

### Trailing icon

The icon sits in a 16px slot after the label and is coloured by the button, so pass an icon that
inherits `currentColor`. It is `aria-hidden`, so it never becomes part of the accessible name.

```tsx
<Button icon={<ArrowIcon />}>Apply for this cohort</Button>
```

### Async actions

```tsx
<Button loading={isSubmitting} loadingLabel="Submitting application">
  Apply for this cohort
</Button>
```

## Coming from Figma

The variant matrix maps to `variant`, `size`, `disabled` and `loading`. The node's three other
component properties map like this — they are all implemented, but they carry different names in
code:

| Figma property | Type | Figma default | Prop |
| --- | --- | --- | --- |
| `Label` | TEXT | "Apply for this cohort" | `children` |
| `Icon` | INSTANCE_SWAP | node `9:20` | `icon` — rendered into the 16px trailing slot |
| `Show trailing` | BOOLEAN | true | implicit: pass `icon` to show the slot, omit it to hide it |

There is no `showTrailing` prop. The slot exists only when `icon` is given, so toggling
`Show trailing` off in Figma is the same as omitting `icon` in code.

## Props

`ButtonProps` extends `ButtonHTMLAttributes<HTMLButtonElement>`, so any native button attribute
(`name`, `value`, `form`, `aria-*`, …) is forwarded to the element.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'primary' \| 'secondary' \| 'ghost'` | `'primary'` | Visual weight of the action. One primary per view. |
| `size` | `'md' \| 'lg'` | `'md'` | Control size. Md is 37px tall in Figma, Lg is 47px. |
| `loading` | `boolean` | `false` | Swaps the trailing slot for a spinner, marks the button `aria-busy` and `aria-disabled`, and blocks activation. The button stays focusable. |
| `icon` | `ReactNode` | — | Trailing icon, rendered in a 16px slot after the label. Must inherit `currentColor`. Figma: `Icon` / `Show trailing`. |
| `children` | `ReactNode` | — | The button label. Figma: `Label`. |
| `loadingLabel` | `string` | `'Loading'` | Text announced to assistive tech while `loading` is true. Rendered visually hidden. |
| `forceState` | `'hover' \| 'focus'` | — | Visual-testing escape hatch — pins the resolved appearance so every matrix cell can be screenshotted. It does not change behaviour. |
| `disabled` | `boolean` | `false` | Native `disabled`. Not focusable, dispatches no click. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Defaulted so a button inside a form does not submit it by accident. |
| `className` | `string` | — | Merged with the component classes, never replacing them. |

Exported types: `ButtonProps`, `ButtonVariant`, `ButtonSize`, `ButtonForcedState`.

:::caution[forceState is for visual regression only]
`forceState` exists so each row of the Figma matrix can be rendered as a story and screenshotted.
Product code should let `:hover` and `:focus-visible` do their job.
:::

## States

Five states across three variants and two sizes — the full 30-cell matrix is published in Storybook.
All five are part of the design, not optional polish.

| State | How it is produced | Behaviour |
| --- | --- | --- |
| Default | — | Activates on click, Enter and Space. |
| Hover | `:hover` (or `forceState="hover"`) | Primary deepens its fill; secondary and ghost take the soft accent surface. Suppressed while disabled or loading. |
| Focus | `:focus-visible` (or `forceState="focus"`) | The design's focus ring token replaces the UA outline. On primary it replaces the drop shadow; on secondary it sits alongside the inset stroke. |
| Disabled | `disabled` prop | Native `disabled`: not focusable, dispatches no click. 50% opacity, `cursor: not-allowed`, and primary drops its shadow. |
| Loading | `loading` prop | Trailing icon is replaced by a spinner, `aria-busy` and `aria-disabled` are set, and a visually hidden label announces the busy state. Click, Enter and Space are blocked so the same action cannot fire twice. |

### Accessibility

- **Disabled and loading are deliberately different.** Disabled uses the native attribute and
  leaves the tab order. Loading stays focusable — a busy button that vanished from the tab order
  would hide the fact that anything is happening — but blocks activation.
- The trailing icon and the spinner are `aria-hidden`; the accessible name is the label alone.
- Motion respects `prefers-reduced-motion`: the spinner stops animating and transitions are removed.

## Tokens

Every value resolves to a semantic CSS custom property built by Style Dictionary from
`tokens/tokens.json` — 657 variables across 7 themes (`day`, `open`, `morning`, `sunrise`,
`sunset`, `overcast`, `night`). `day` is the default and matches `:root`. Themes are switched with
`data-theme` on the document root.

| Role | Token |
| --- | --- |
| Primary fill / accent text | `--color-accent-ink` |
| Primary hover fill, hover text | `--color-accent-ink-deep` |
| Secondary + ghost hover surface | `--color-accent-soft` |
| Label on primary | `--color-text-on-accent` |
| Secondary surface | `--color-surface-card` |
| Secondary stroke | `--color-line-default` |
| Type (Md / Lg) | `--font-action-md` / `--font-action-lg` |
| Padding (Md) | `--spacing-step-10` `--spacing-step-18` |
| Padding (Lg) | `--spacing-step-14` `--spacing-step-26` |
| Label → icon gap | `--spacing-space-2` |
| Corner | `--radius-radius-pill` |
| Resting shadow (primary) | `--effect-shadow-button` |
| Focus ring | `--effect-focus-ring` |

:::danger[Use the CSS variable, not the TS constant]
The TypeScript token export bakes the mode into the name and freezes a literal hex at build time —
`ColorDayAccentInk = "#1a78bd"`. Anything that must respond to `data-theme` **must** read the CSS
variable (`var(--color-accent-ink)`). A TS constant will keep rendering the day value in every
other theme.
:::

Five properties carry no Figma variable and are therefore not tokens: disabled opacity (0.5),
loading opacity (0.85), the secondary stroke width (1px), the icon slot (16px) and the spinner
(14px). They are isolated as local custom properties at the top of `Button.css` so they stay
auditable and can be swapped the moment tokens exist for them.

## Do / Don't

**Do**

- Use exactly one primary button per view — it is the one thing that view wants you to do.
- Pair primary with secondary for the alternative, and use ghost for tertiary actions.
- Build hover, focus, disabled and loading into the screen. Shipping Default only is an
  unfinished screen.
- Set `loading` for async work and give it a `loadingLabel` that names the action.
- Pass icons that inherit `currentColor` so the variant controls their colour.

**Don't**

- Don't put two primary buttons in one view. If both actions feel equally important, one of them
  is secondary.
- Don't ship Default only and treat the other states as polish to add later.
- Don't use `forceState` in product code — it is a screenshot hook, not a state.
- Don't reach for a TS token constant for anything themeable; use the CSS variable.
- Don't fake a disabled look with styling. Use the `disabled` prop so the button is really inert.
- Don't rely on `disabled` to block a double submit during async work — that removes the button
  from the tab order. Use `loading`.

## Known deviation

Md renders 36.5px against Figma's 37px. Chrome and Figma round an AUTO line-height differently.
Lg matches exactly. This is an accepted deviation, not a defect.
