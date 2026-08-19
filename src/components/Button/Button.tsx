import type { ButtonHTMLAttributes, KeyboardEvent, MouseEvent, ReactNode } from 'react';
import './Button.css';

/** Visual weight of the action. Mirrors the Figma `Variant` property. */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

/** Control size. Mirrors the Figma `Size` property (Md is 37px tall, Lg is 47px). */
export type ButtonSize = 'md' | 'lg';

/**
 * Interaction states that are normally produced by the browser. Setting this
 * pins the resolved appearance so every row of the Figma variant matrix can be
 * rendered as a story and screenshotted.
 *
 * Visual regression testing only — it does not change behaviour, and product
 * code should let `:hover` / `:focus-visible` do their job.
 */
export type ButtonForcedState = 'hover' | 'focus';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual weight of the action. Primary is the single main action per view. */
  variant?: ButtonVariant;
  /** Control size. */
  size?: ButtonSize;
  /**
   * Swaps the trailing slot for a spinner, marks the button `aria-busy` and
   * `aria-disabled`, and blocks activation. The button stays focusable so the
   * busy state is reachable with a screen reader.
   */
  loading?: boolean;
  /**
   * Trailing icon, rendered in a 16px slot after the label. It is coloured by
   * the button, so pass an icon that inherits `currentColor`.
   */
  icon?: ReactNode;
  /** The button label. */
  children?: ReactNode;
  /** Visual-testing escape hatch — see {@link ButtonForcedState}. */
  forceState?: ButtonForcedState;
  /** Text announced to assistive tech while `loading` is true. */
  loadingLabel?: string;
}

function Spinner() {
  return (
    <svg
      className="sunim-button__spinner"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      focusable="false"
      data-testid="sunim-button-spinner"
    >
      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
      <path d="M13 7A6 6 0 0 0 7 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * The action. Primary is the one thing a view wants you to do; secondary sits
 * beside it and ghost is tertiary.
 *
 * Hover, focus, disabled and loading are real states rather than decoration:
 * hover and focus come from `:hover` / `:focus-visible`, while disabled and
 * loading are props that change behaviour and not only colour.
 *
 * Figma: node 19:231 — Variant (Primary · Secondary · Ghost) × Size (Md · Lg)
 * × State (Default · Hover · Focus · Disabled · Loading).
 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  forceState,
  loadingLabel = 'Loading',
  disabled = false,
  className,
  type = 'button',
  onClick,
  onKeyDown,
  ...rest
}: ButtonProps) {
  const classes = [
    'sunim-button',
    `sunim-button--${variant}`,
    `sunim-button--${size}`,
    disabled ? 'sunim-button--disabled' : null,
    loading ? 'sunim-button--loading' : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Loading stays focusable (so the busy state is discoverable) but must not
  // activate — otherwise the same action fires twice.
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (loading && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      return;
    }
    onKeyDown?.(event);
  };

  return (
    <button
      {...rest}
      type={type}
      className={classes}
      disabled={disabled}
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      data-force-state={forceState}
      data-variant={variant}
      data-size={size}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <span className="sunim-button__label">{children}</span>
      {loading ? (
        <>
          <Spinner />
          <span className="sunim-button__sr-only">{loadingLabel}</span>
        </>
      ) : icon ? (
        <span className="sunim-button__trailing" aria-hidden="true">
          {icon}
        </span>
      ) : null}
    </button>
  );
}
