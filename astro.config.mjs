import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://proheatrepair.com',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      serialize(item) {
        let url = item.url.replace(/\.html?$/i, '');
        if (!url.endsWith('/')) {
          url = `${url}/`;
        }
        item.url = url;
        return item;
      },
    }),
  ],
  build: {
    format: 'file',
  },
  vite: {
    css: {
      preprocessorOptions: {},
    },
  },
});
