const webpack = require('webpack');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const path = require('path');
const env = require('yargs').argv.env; // use --env with webpack 2

const libraryName = 'Tez';

let plugins = [], outputFile;

if (env === 'build') {
	plugins.push(new UglifyJsPlugin({
			minimize: true,
			output: {
				comments: false
			}
		}));
	outputFile = libraryName + '.min.js';
} else {
	outputFile = libraryName + '.js';
}

const config = {
	entry: __dirname + '/src/index.js',
	devtool: 'source-map',
	output: {
		path: __dirname,
		filename: outputFile,
		libraryTarget: 'umd'
	},
	module: {
		loaders: [{
				test: /.js$/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015']
				}
			}
		]
	},
	plugins: plugins
};

module.exports = config;
