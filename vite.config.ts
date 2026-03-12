import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // local /api/prod → prod API Gateway (modules GET/POST)
      '/api/prod': {
        target: 'https://401i8cjuoj.execute-api.ap-south-1.amazonaws.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/prod/, '/prod'),
      },
      // local /api/dev → dev API Gateway (modules PUT/DELETE)
      '/api/dev': {
        target: 'https://6rdwi5p3pd.execute-api.ap-south-1.amazonaws.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/dev/, '/dev'),
      },
      // local /api/brand → brand API Gateway (brand POST/GET/PUT/DELETE)
      '/api/brand': {
        target: 'https://umehtqxexd.execute-api.ap-south-1.amazonaws.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/brand/, '/dev'),
      },
      // local /api/brandmod → brand-by-module API Gateway (GET brands by moduleId)
      '/api/brandmod': {
        target: 'https://zkw7qsaxz3.execute-api.ap-south-1.amazonaws.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/brandmod/, '/dev'),
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
