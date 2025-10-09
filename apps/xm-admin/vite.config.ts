import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  server: {
    // watch: {
    //   // 监听 packages 目录的变化，包括 node_modules 中的本地包
    //   ignored: ['!**/node_modules/@repo/**'],
    // },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  // optimizeDeps: {
  //   // 排除本地包，避免预构建缓存
  //   exclude: ['@repo/ui-component'],
  //   // 明确包含 React 相关依赖，避免解析问题
  //   include: ['react', 'react-dom', 'react/jsx-runtime'],
  // },
});
