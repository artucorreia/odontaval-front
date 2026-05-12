import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
        },
      },
      allowedHosts: ['d340-2804-29b8-511b-cbae-89c-c4d7-14bd-ccec.ngrok-free.app']
    },
  };
});
