import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import type { ButtonSize, ButtonVariant } from './Button';

/**
 * Trailing arrow, matching the Icon Slot instance in the Figma set (node 19:60).
 * It inherits `currentColor` so the button controls its colour.
 */
function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M3.33 8h9.34M9.33 4.67 12.67 8l-3.34 3.33"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const LABEL = 'Apply for this cohort';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  args: { children: LABEL, icon: <ArrowIcon /> },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'inline-radio', options: ['md', 'lg'] },
    forceState: { control: 'inline-radio', options: [undefined, 'hover', 'focus'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'The action. Primary is the one thing a view wants you to do; secondary sits beside it and ghost is tertiary. Figma node 19:231.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

/** One row of the Figma variant matrix: Variant x Size x State. */
const row = (
  variant: ButtonVariant,
  size: ButtonSize,
  state: 'default' | 'hover' | 'focus' | 'disabled' | 'loading',
): Story => ({
  args: {
    variant,
    size,
    forceState: state === 'hover' || state === 'focus' ? state : undefined,
    disabled: state === 'disabled',
    loading: state === 'loading',
  },
});

/* --- Playground -------------------------------------------------------- */
export const Playground: Story = { args: { variant: 'primary', size: 'md' } };

/* --- Primary / Md ------------------------------------------------------ */
export const PrimaryMdDefault = row('primary', 'md', 'default');
export const PrimaryMdHover = row('primary', 'md', 'hover');
export const PrimaryMdFocus = row('primary', 'md', 'focus');
export const PrimaryMdDisabled = row('primary', 'md', 'disabled');
export const PrimaryMdLoading = row('primary', 'md', 'loading');

/* --- Primary / Lg ------------------------------------------------------ */
export const PrimaryLgDefault = row('primary', 'lg', 'default');
export const PrimaryLgHover = row('primary', 'lg', 'hover');
export const PrimaryLgFocus = row('primary', 'lg', 'focus');
export const PrimaryLgDisabled = row('primary', 'lg', 'disabled');
export const PrimaryLgLoading = row('primary', 'lg', 'loading');

/* --- Secondary / Md ---------------------------------------------------- */
export const SecondaryMdDefault = row('secondary', 'md', 'default');
export const SecondaryMdHover = row('secondary', 'md', 'hover');
export const SecondaryMdFocus = row('secondary', 'md', 'focus');
export const SecondaryMdDisabled = row('secondary', 'md', 'disabled');
export const SecondaryMdLoading = row('secondary', 'md', 'loading');

/* --- Secondary / Lg ---------------------------------------------------- */
export const SecondaryLgDefault = row('secondary', 'lg', 'default');
export const SecondaryLgHover = row('secondary', 'lg', 'hover');
export const SecondaryLgFocus = row('secondary', 'lg', 'focus');
export const SecondaryLgDisabled = row('secondary', 'lg', 'disabled');
export const SecondaryLgLoading = row('secondary', 'lg', 'loading');

/* --- Ghost / Md -------------------------------------------------------- */
export const GhostMdDefault = row('ghost', 'md', 'default');
export const GhostMdHover = row('ghost', 'md', 'hover');
export const GhostMdFocus = row('ghost', 'md', 'focus');
export const GhostMdDisabled = row('ghost', 'md', 'disabled');
export const GhostMdLoading = row('ghost', 'md', 'loading');

/* --- Ghost / Lg -------------------------------------------------------- */
export const GhostLgDefault = row('ghost', 'lg', 'default');
export const GhostLgHover = row('ghost', 'lg', 'hover');
export const GhostLgFocus = row('ghost', 'lg', 'focus');
export const GhostLgDisabled = row('ghost', 'lg', 'disabled');
export const GhostLgLoading = row('ghost', 'lg', 'loading');
