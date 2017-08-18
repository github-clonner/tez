import uglify from 'rollup-plugin-uglify';
const { build } = process.env;
const plugins = [];
let TezJS = 'Tez';
if (build === "build") {
	plugins.push(uglify());
	TezJS += '.min';
}
TezJS += '.js';

export default {
  entry: 'src/index.js',
  sourceMap: true,
  format: 'umd',
  dest: TezJS,
  moduleName: 'Tez',
  plugins
}