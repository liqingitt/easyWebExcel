import { defineConfig } from 'father';

export default defineConfig({
  // more father config: https://github.com/umijs/father/blob/master/docs/config.md
  esm: {
    output: 'dist',
    ignores: ['**/demo/**'],
  },

  // extraBabelPlugins: [
  //   ['babel-plugin-ignore-import', { pattern:['\\.demo\\.[jt]sx?$'] }]
  // ]
});
