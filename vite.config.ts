import {defineConfig} from 'vite';
import monkey, {cdn} from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: 'Coolify Monkey',
        version: process.env.npm_package_version,
        description: 'A userscript to make Coolify even cooler!',
        icon: 'https://coolify.io/favicon.png',
        namespace: 'https://github.com/taoyuan/coolify-monkey',
        author: 'TY',
        match: ['*://*/*'],
        grant: 'none',
      },
      build: {
        externalGlobals: {
          jquery: cdn.jsdelivr('jQuery', 'dist/jquery.min.js'),
        },
      },
    }),
  ],
});
