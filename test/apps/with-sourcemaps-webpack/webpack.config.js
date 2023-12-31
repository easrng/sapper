const webpack = require('webpack');
const config = require('../../../config/webpack.js');

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

module.exports = {
	client: {
		entry: config.client.entry(),
		output: config.client.output(),
		resolve: {
			extensions: ['.js', '.json', '.html'],
			mainFields: ['svelte', 'module', 'browser', 'main']
		},
		module: {
			rules: [
				{
					test: /\.html$/,
					use: {
						loader: 'svelte-loader',
						options: {
							dev,
							hydratable: true,
							hotReload: true
						}
					}
				}
			]
		},
		mode,
		plugins: [
			dev && new webpack.HotModuleReplacementPlugin(),
			new webpack.DefinePlugin({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
		].filter(Boolean),
		devtool: dev ? 'inline-source-map' : 'source-map'
	},

	server: {
		entry: config.server.entry(),
		output: config.server.output(),
		target: 'node',
		resolve: {
			extensions: ['.js', '.json', '.html'],
			mainFields: ['svelte', 'module', 'browser', 'main']
		},
		module: {
			rules: [
				{
					test: /\.html$/,
					use: {
						loader: 'svelte-loader',
						options: {
							css: false,
							generate: 'ssr',
							dev
						}
					}
				}
			]
		},
		mode: process.env.NODE_ENV
	},

	serviceworker: {
		entry: config.serviceworker.entry(),
		output: config.serviceworker.output(),
		mode: process.env.NODE_ENV,
		devtool: 'source-map'
	}
};
