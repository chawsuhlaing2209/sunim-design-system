// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// The docs site is its own Astro root (`astro build --root docs`) but resolves its
// dependencies from the repo's node_modules — there is deliberately no second package.json.
export default defineConfig({
  srcDir: './src',
  outDir: './dist',
  integrations: [
    starlight({
      title: 'Sunim Design System',
      description:
        'Component documentation for Sunim — built from Figma, tokens first, tested on the deployed staging build.',
      sidebar: [
        { label: 'Overview', link: '/' },
        // autogenerate must sit inside a group's `items` — Starlight rejects it as a
        // sibling of `label`. New component pages appear here with no config change.
        { label: 'Components', items: [{ autogenerate: { directory: 'components' } }] },
      ],
    }),
  ],
});
