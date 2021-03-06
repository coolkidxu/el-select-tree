const vue = require('rollup-plugin-vue'); // Handle .vue SFC files
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const postcss = require('rollup-plugin-postcss');
const json = require('rollup-plugin-json');
const commonjs = require('rollup-plugin-commonjs');
const alias = require('rollup-plugin-alias');
const cleanup = require('rollup-plugin-cleanup');
const clear = require('rollup-plugin-clear');
const pkg = require('../package.json');
const visualizer = require('rollup-plugin-visualizer');
const sizes = require('rollup-plugin-sizes');

require('dotenv').config();

const externalReg = new RegExp(
  '^(' + Object.keys(pkg.dependencies).join('|') + ')(/|$)'
);

module.exports = {
  // input: 'src/index.js',
  // output: {
  //   dir: 'lib/',
  //   format: 'es'
  // },
  plugins: [
    clear({
      targets: ['lib']
    }),
    cleanup(),
    alias({
      resolve: ['.vue', '/index.js', '/index.vue']
    }),
    resolve({
      extensions: ['.js', '.vue']
    }),
    commonjs({
      include: /node_modules/
    }),
    // 先解析 .vue 文件
    vue({
      css: false, // Dynamically inject css as a <style> tag
      compileTemplate: true, // Explicitly convert template to render function
      template: {
        compilerOptions: {
          preserveWhitespace: false // 丢弃模版空格
        }
      },
      // https://github.com/vuejs/rollup-plugin-vue/issues/262
      normalizer: '~vue-runtime-helpers/dist/normalize-component.js'
    }),
    // 再 babel 转义
    babel({
      runtimeHelpers: true,
      extensions: ['.js', '.vue'] // 新版本需要配置 .vue 进行 babel 编译
    }),
    json(),
    postcss({
      minimize: true
    }),
    sizes(),
    visualizer({
      filename: './stat/statistics.html'
    })
  ],
  external: (id) => externalReg.test(id)
};
