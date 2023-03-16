import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import topLevelAwait from 'vite-plugin-top-level-await';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills(), topLevelAwait(), svgr()],
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
