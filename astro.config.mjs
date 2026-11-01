// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import remarkMedia from './src/plugins/remark-media.mjs';
import rehypeSections from './src/plugins/rehype-sections.mjs';

// Until circuitdessert.org is registered, deploy to the GitHub Pages project URL by
// setting SITE_URL and BASE_PATH in the deploy workflow (see .github/workflows/deploy.yml).
const site = process.env.SITE_URL || 'https://circuitdessert.org';
const base = process.env.BASE_PATH || '/';
const licensesHref = `${base.replace(/\/?$/, '/')}licenses/`;

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  markdown: { remarkPlugins: [remarkMedia], rehypePlugins: [rehypeSections] },
  integrations: [
    starlight({
      title: 'Circuit Dessert',
      description:
        'An open repository of reference designs and parts, ready for your kitchen.',
      logo: { src: './src/assets/mark.svg', alt: 'Circuit Dessert' },
      favicon: '/favicon.svg',
      customCss: ['./src/styles/circuit-dessert.css'],
      // One light/dark button instead of Starlight's dropdown.
      components: {
        ThemeSelect: './src/components/ThemeToggle.astro',
        Header: './src/components/Header.astro',
        Footer: './src/components/Footer.astro',
      },
      head: [
        { tag: 'link', attrs: { rel: 'license', href: licensesHref } },
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' } },
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Archivo:wght@400;500;600;700&display=swap',
          },
        },
      ],
      social: [
        // Fill in once the GitHub repo exists:
        { icon: 'github', label: 'GitHub', href: 'https://github.com/rhino9686/circuitdessert' },
      ],
      sidebar: [
        { label: 'Recipes', link: '/recipes/' },
        { label: 'Parts', link: '/parts/' },
        { label: 'The Pantry', link: '/pantry/' },
        { label: 'Contribute', items: [{ autogenerate: { directory: 'contribute' } }] },
      ],
      lastUpdated: true,
    }),
  ],
});
