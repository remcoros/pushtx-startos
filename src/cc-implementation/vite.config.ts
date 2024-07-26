import { defineConfig, type UserConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { viteSingleFile } from 'vite-plugin-singlefile';

const plugins = [
  nodePolyfills({
    // needed for bitcoinjs-lib
    include: ['buffer'],
    globals: {
      Buffer: true,
    },
  }),
];

// single file config - builds a single HTML file with everything inlined
const singleFileConfig: UserConfig = {
  plugins: [...plugins, viteSingleFile()],
  build: {
    outDir: '../PushTX/wwwroot',
    emptyOutDir: true
  },
};

export default defineConfig(singleFileConfig);
