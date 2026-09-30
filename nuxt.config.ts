// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/ui',
    'motion-v/nuxt',
    '@nuxt/image'
  ],
  ssr: true,
  nitro: {
	  preset: 'cloudflare-module',
	  prerender: {
		  crawlLinks: true,
		  autoSubfolderIndex: false,
	  },
  },
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
  css: ['~/assets/css/main.css'],
  routeRules: {
	  '/': {
		  prerender: true,
	  },
	  '/projects/**': {
		  prerender: true,
	  }
  },
  colorMode: {
	  preference: 'dark',
	  fallback: 'dark',
  }
})
