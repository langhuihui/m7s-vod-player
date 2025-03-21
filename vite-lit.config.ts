import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: 'src/components/video-player.ts',
      name: 'VideoPlayer',
      fileName: 'video-player',
      formats: ['es']
    },
    rollupOptions: {
      external: ['lit'],
      output: {
        dir: 'src/components',
        format: 'es',
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        paths: {
          lit: '/node_modules/lit/index.js',
          'lit/decorators.js': '/node_modules/lit/decorators.js'
        }
      }
    },
    target: 'esnext',
    outDir: 'src/components',
    emptyOutDir: false
  },
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  },
  optimizeDeps: {
    include: ['lit'],
    esbuildOptions: {
      plugins: [
        {
          name: 'babel',
          setup(build) {
            build.onLoad({ filter: /\.(ts|js)$/ }, async (args) => {
              const babel = await import('@babel/core');
              const result = await babel.transformFileAsync(args.path, {
                plugins: [
                  ['@babel/plugin-proposal-decorators', { legacy: true }],
                  ['@babel/plugin-proposal-class-properties', { loose: true }]
                ]
              });
              return {
                contents: result.code,
                loader: 'js'
              };
            });
          }
        }
      ]
    }
  }
})