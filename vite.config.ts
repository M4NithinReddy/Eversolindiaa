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
      '/api/prod':     { target: 'https://401i8cjuoj.execute-api.ap-south-1.amazonaws.com', changeOrigin: true, rewrite: p => p.replace(/^\/api\/prod/, '/prod') },
      '/api/dev':      { target: 'https://6rdwi5p3pd.execute-api.ap-south-1.amazonaws.com',  changeOrigin: true, rewrite: p => p.replace(/^\/api\/dev/, '/dev') },
      '/api/brandmod': { target: 'https://zkw7qsaxz3.execute-api.ap-south-1.amazonaws.com',  changeOrigin: true, rewrite: p => p.replace(/^\/api\/brandmod/, '/dev') },
      '/api/brand':    { target: 'https://umehtqxexd.execute-api.ap-south-1.amazonaws.com',  changeOrigin: true, rewrite: p => p.replace(/^\/api\/brand/, '/dev') },
      '/api/img':      { target: 'https://yf5ifvprf2.execute-api.ap-south-1.amazonaws.com',  changeOrigin: true, rewrite: p => p.replace(/^\/api\/img/, '/dev') },
      '/api/products': { target: 'https://llbjgne219.execute-api.ap-south-1.amazonaws.com',  changeOrigin: true, rewrite: p => p.replace(/^\/api\/products/, '/dev') },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
