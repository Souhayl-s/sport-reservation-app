import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Souhayl-s/sport-reservation-app', // Replace <your-repo-name> with the name of your GitHub repository
  plugins: [react()],
});