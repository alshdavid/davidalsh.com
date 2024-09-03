import * as path from 'path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  globalStyles: path.join(__dirname, 'docs/index.css'),
  title: 'David Alsh',
  description: 'Rspack-based Static Site Generator',
  icon: '/rspress-icon.png',
  logo: undefined,
  logoText: 'David Alsh - Software Engineer',
  themeConfig: {
    searchPlaceholderText: 'Search Site',
    socialLinks: [
      { icon: 'youtube', mode: 'link', content: 'https://github.com/web-infra-dev/rspress' },
      { icon: 'github', mode: 'link', content: 'https://github.com/web-infra-dev/rspress' },
    ],
    nav: [],
    sidebar: {
      '/articles/2024-01-15-writing-a-bundler-part-1/': []
    }
  },
  markdown: {
    showLineNumbers: true,
    defaultWrapCode: false,
  },
  route: {
    exclude: ['**/sources', '**/assets', '**/public']
  },
});
