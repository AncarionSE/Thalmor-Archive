import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const reports = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/reports' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    date: z.string(),               // in-world date, free text
    classification: z.string().default('Internal'),
    summary: z.string(),
    order: z.number(),              // filing number; higher = newer
  }),
});

export const collections = { reports };
