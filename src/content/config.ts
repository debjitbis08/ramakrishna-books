import { defineCollection, z } from "astro:content";

const booksCollection = defineCollection({
  schema: ({ image }) =>
    z.object({
      bookId: z.string().optional(),
      type: z.enum(["book", "frontmatter", "chapter", "backmatter"]),
      cover: image().optional(),

        title: z.object({
            en: z.string(),
            bn: z.string(),
        }).optional(),
      chapter: z.number().optional(),
        order: z.number().optional(),
      chapterTitle: z.object({
        en: z.string(),
        bn: z.string(),
      }).optional(),
        sectionTitle: z.object({
            en: z.string(),
            bn: z.string(),
        }).optional(),
      author: z
        .object({
          en: z.string(),
          bn: z.string(),
        })
        .optional(),
      description: z
        .object({
          en: z.string(),
          bn: z.string(),
        })
        .optional(),
      date: z
        .object({
          en: z.string(),
          bn: z.string(),
        })
        .optional(),
      quote: z
        .object({
          en: z.string(), // Multiline text
          bn: z.string(),
          source: z.object({
            en: z.string(),
            bn: z.string(),
          }).optional(),
        })
        .optional(),
    }),
});

export const collections = {
  books: booksCollection,
};
