import { defineCollection, defineContentConfig ,z} from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blogs: defineCollection({
      source: 'blogs/*.md',
      type: 'page',
      schema: z.object({
        title: z.string(),
        date: z.string(), // 允許 string 或 Date
        description: z.string(),
        image: z.string().url().optional(), // 確保是 URL，允許為空
        alt: z.string().optional(),
        ogImage: z.string().url().optional(),
        tags: z.array(z.string()).default([]),
        published: z.boolean()
      })
    })
  }
})