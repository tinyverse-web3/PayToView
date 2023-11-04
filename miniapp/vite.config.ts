import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // server: {
  //   https: {
  //     key: path.resolve(__dirname, 'keys/cert.key'),
  //     cert: path.resolve(__dirname, 'keys/cert.crt'),
  //   }
  // },
  plugins: [react()],
  define: {
    'process.env': process.env,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
