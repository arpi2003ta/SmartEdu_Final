import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
 
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("react-player")) return "media-player";
          if (id.includes("antd") || id.includes("@ant-design")) return "antd";
          if (id.includes("@radix-ui")) return "radix-ui";
          if (id.includes("firebase")) return "firebase";
          if (id.includes("recharts")) return "charts";
          if (id.includes("react-quill") || id.includes("quill")) return "editor";
          if (id.includes("react") || id.includes("redux")) return "react-vendor";
          return "vendor";
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
