import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// Astro 7 requires the content collection to be declared here. Without it the
// `docs` collection is empty and Starlight builds nothing but the 404 page.
export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
};
