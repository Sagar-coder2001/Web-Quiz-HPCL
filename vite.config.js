import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,  // This makes the server accessible from the network
    port: 5000,
  },
  plugins: [react()],
  // base: '/WebQuiz/', // Uncomment if you need a custom base path
});
