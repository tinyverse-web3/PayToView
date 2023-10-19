import { resolve } from 'path'
import { defineConfig } from 'vite'
import viteCompression from 'vite-plugin-compression';


export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.js'),
      name: 'tvs',
      fileName: 'tvs'
    }
  },
  plugins : [
    viteCompression({
      algorithm: 'gzip',
    })
  ]
});

