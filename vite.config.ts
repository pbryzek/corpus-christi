import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

function copyPublicPlugin(): import('vite').Plugin {
  return {
    name: 'safe-copy-public',
    apply: 'build',
    closeBundle() {
      const src = path.resolve(__dirname, 'public');
      const dest = path.resolve(__dirname, 'dist');
      const skip = new Set(['image000004 copy.JPG']);

      function copyDir(from: string, to: string) {
        fs.mkdirSync(to, { recursive: true });
        for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
          if (skip.has(entry.name)) continue;
          const s = path.join(from, entry.name);
          const d = path.join(to, entry.name);
          if (entry.isDirectory()) {
            copyDir(s, d);
          } else {
            try { fs.copyFileSync(s, d); } catch { /* skip locked files */ }
          }
        }
      }
      copyDir(src, dest);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react(), copyPublicPlugin()],
  publicDir: command === 'build' ? false : 'public',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
}));
