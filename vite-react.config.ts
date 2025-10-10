import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    {
      name: 'block-vue-files',
      enforce: 'pre', // 在所有插件之前运行
      resolveId(id) {
        // 直接拒绝所有 .vue 文件的导入
        if (id.includes('.vue') || id.endsWith('.vue')) {
          return { id: '\0virtual:empty', moduleSideEffects: false };
        }
      },
      load(id) {
        if (id === '\0virtual:empty') {
          return 'export default {}';
        }
      },
      transform(code, id) {
        // 在 transform 阶段也拦截
        if (id.includes('.vue') || id.endsWith('.vue')) {
          return {
            code: 'export default {}',
            map: null
          };
        }
      }
    },
    react()
  ],
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist-react',
    emptyOutDir: true,
    rollupOptions: {
      input: './index-react.html'
    }
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    dedupe: ['react', 'react-dom']
  },
  server: {
    open: '/index-react.html',
    watch: {
      ignored: ['**/src/App.vue', '**/src/components/VideoPlayer.vue', '**/src/**/*.vue', '**/dist/**', '**/node_modules/**']
    }
  },
  optimizeDeps: {
    entries: ['./index-react.html'],
    exclude: ['vue', '@vitejs/plugin-vue'],
    include: ['react', 'react-dom', 'react/jsx-runtime']
  }
});

