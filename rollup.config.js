import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-js-harmony';

const { BUILD } = process.env;

const plugins = [ buble({jsx:'Tez.createElement'}) ];

let moduleName = 'Tez';
let destFile = moduleName;

if ( BUILD === 'prod' ) {
	plugins.push(uglify({}, minify));
	destFile = moduleName + '.min';
}

destFile = destFile + '.js';

export default {
  entry: 'src/index.js',
  format: 'umd',
  dest: destFile, // equivalent to --output
  moduleName: moduleName,
  exports: 'default',
  plugins: plugins
}