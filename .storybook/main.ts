import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  // examples/ is a reference stub that reads from tokens which do not exist in
  // this project's build, and it declares the same title as the real Button —
  // so it merged into Components/Button in the sidebar. It is already excluded
  // from vitest for the same reason: it is for reading, not running.
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
  framework: { name: '@storybook/react-vite', options: {} },
};

export default config;
