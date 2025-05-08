import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: 'src/components/video-player.ts',
      name: 'VideoPlayer',
      formats: ['es'],
      fileName: 'video-player' // Specify the output filename, .js will be appended by Vite
    },
    rollupOptions: {
      external: [], // Attempt to bundle all dependencies
      output: {
        dir: 'src/components', // Output directory
        format: 'es',
        preserveModules: false, // Set to false to bundle dependencies
        paths: {}
      }
    },
    target: 'esnext',
    outDir: 'src/components', // Ensure this matches rollupOptions.output.dir
    emptyOutDir: false
  },
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  },
  optimizeDeps: {
    include: [],
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
                loader: args.path.endsWith('.ts') ? 'ts' : 'js',
              };
            });
          }
        }
      ]
    }
  }
});