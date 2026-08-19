import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';
import type { ButtonSize, ButtonVariant } from './Button';

const VARIANTS: ButtonVariant[] = ['primary', 'secondary', 'ghost'];
const SIZES: ButtonSize[] = ['md', 'lg'];

describe('Button — props', () => {
  it('renders its label as an accessible button', () => {
    render(<Button>Apply</Button>);
    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
  });

  it('defaults to the primary variant at md, and to type="button"', () => {
    render(<Button>Apply</Button>);
    const el = screen.getByRole('button');
    expect(el).toHaveClass('sunim-button', 'sunim-button--primary', 'sunim-button--md');
    expect(el).toHaveAttribute('type', 'button');
  });

  it('covers every row of the Figma variant matrix with a variant and size class', () => {
    for (const variant of VARIANTS) {
      for (const size of SIZES) {
        const { unmount } = render(
          <Button variant={variant} size={size}>
            Apply
          </Button>,
        );
        const el = screen.getByRole('button');
        expect(el).toHaveClass(`sunim-button--${variant}`);
        expect(el).toHaveClass(`sunim-button--${size}`);
        unmount();
      }
    }
  });

  it('merges a caller className instead of replacing the component classes', () => {
    render(<Button className="u-mt-4">Apply</Button>);
    const el = screen.getByRole('button');
    expect(el).toHaveClass('sunim-button', 'sunim-button--primary', 'u-mt-4');
  });

  it('renders the trailing icon slot only when an icon is given', () => {
    const { unmount } = render(<Button>Apply</Button>);
    expect(document.querySelector('.sunim-button__trailing')).toBeNull();
    unmount();

    render(<Button icon={<svg data-testid="arrow" />}>Apply</Button>);
    expect(document.querySelector('.sunim-button__trailing')).not.toBeNull();
    expect(screen.getByTestId('arrow')).toBeInTheDocument();
  });

  it('keeps the trailing icon out of the accessible name', () => {
    render(<Button icon={<svg data-testid="arrow" />}>Apply</Button>);
    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
  });

  it('forwards arbitrary button attributes', () => {
    render(
      <Button type="submit" name="apply" value="1">
        Apply
      </Button>,
    );
    const el = screen.getByRole('button');
    expect(el).toHaveAttribute('type', 'submit');
    expect(el).toHaveAttribute('name', 'apply');
  });
});

describe('Button — disabled state', () => {
  it('is really disabled, not just styled as disabled', () => {
    render(<Button disabled>Apply</Button>);
    const el = screen.getByRole('button');
    expect(el).toBeDisabled();
    expect(el).toHaveClass('sunim-button--disabled');
  });

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Apply
      </Button>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('is not reachable by keyboard when disabled', async () => {
    render(<Button disabled>Apply</Button>);
    await userEvent.tab();
    expect(screen.getByRole('button')).not.toHaveFocus();
  });
});

describe('Button — loading state', () => {
  it('exposes the busy state to assistive tech, not only a colour change', () => {
    render(<Button loading>Apply</Button>);
    const el = screen.getByRole('button');
    expect(el).toHaveAttribute('aria-busy', 'true');
    expect(el).toHaveAttribute('aria-disabled', 'true');
    expect(el).toHaveClass('sunim-button--loading');
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('swaps the trailing icon for the spinner while loading', () => {
    render(
      <Button loading icon={<svg data-testid="arrow" />}>
        Apply
      </Button>,
    );
    expect(screen.getByTestId('sunim-button-spinner')).toBeInTheDocument();
    expect(screen.queryByTestId('arrow')).toBeNull();
  });

  it('blocks activation by click while loading', async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Apply
      </Button>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('blocks activation by Enter and Space while loading', async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Apply
      </Button>,
    );
    const el = screen.getByRole('button');
    el.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(onClick).not.toHaveBeenCalled();
  });

  it('stays focusable while loading so the busy state is discoverable', async () => {
    render(<Button loading>Apply</Button>);
    await userEvent.tab();
    expect(screen.getByRole('button')).toHaveFocus();
  });

  it('accepts a custom loadingLabel', () => {
    render(
      <Button loading loadingLabel="Submitting application">
        Apply
      </Button>,
    );
    expect(screen.getByText('Submitting application')).toBeInTheDocument();
  });
});

describe('Button — interaction', () => {
  it('fires onClick when enabled', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Apply</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('activates with Enter and Space from the keyboard', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Apply</Button>);
    await userEvent.tab();
    expect(screen.getByRole('button')).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('still calls a caller onKeyDown when not loading', async () => {
    const onKeyDown = vi.fn();
    render(<Button onKeyDown={onKeyDown}>Apply</Button>);
    screen.getByRole('button').focus();
    await userEvent.keyboard('{Enter}');
    expect(onKeyDown).toHaveBeenCalled();
  });
});

describe('Button — forced states (visual testing hook)', () => {
  it.each(['hover', 'focus'] as const)('reflects forceState=%s as a data attribute', (state) => {
    render(<Button forceState={state}>Apply</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-force-state', state);
  });

  it('sets no data-force-state by default', () => {
    render(<Button>Apply</Button>);
    expect(screen.getByRole('button')).not.toHaveAttribute('data-force-state');
  });
});
