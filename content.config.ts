import { defineContentConfig, defineCollection, z } from '@nuxt/content'


export default defineContentConfig({
  collections: {
    index: defineCollection({
      type: 'page',
      source: 'index.yaml',
	  schema: z.object({
		  name: z.string(), 
	  }),
    }),
    content: defineCollection({
      type: 'page',
      source: '**/*.md',
    }),
	posts: defineCollection({
		type: 'page',
		source: 'posts/*.md',
	}),
	projects: defineCollection({
		type: 'page',
		source: 'projects/*.md',
	}),
  },
})
