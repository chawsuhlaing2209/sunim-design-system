import type { Preview } from '@storybook/react';

// The built tokens are the only source of values. Run `npm run tokens:build` first —
// without it every var() below falls back to nothing and components render unstyled.
import '../build/tokens/css/tokens.css';

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
  globalTypes: {
    theme: {
      description: 'Figma mode → data-theme on the preview root',
      defaultValue: '',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [{ value: '', title: 'Default (:root)' }],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      document.documentElement.setAttribute('data-theme', context.globals.theme ?? '');
      return Story();
    },
  ],
};

export default preview;
