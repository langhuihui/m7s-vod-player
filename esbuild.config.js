import * as esbuild from 'esbuild';
import babelPlugin from 'esbuild-plugin-babel';

await esbuild.build({
  entryPoints: ['src/components/video-player.ts'],
  bundle: true,
  outfile: 'src/components/video-player.js',
  target: 'es2018',
  loader: {
    '.ts': 'ts',
  },
  plugins: [
    babelPlugin()
  ],
  tsconfig: 'tsconfig.build.json'
}); 