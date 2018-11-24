const precss = require('precss');

module.exports = {
	entry: './index.babel.js',
	mode: 'development',
	output: {
		path: __dirname,
		filename: 'index.js',
	},
	devtool: 'cheap-module-eval-source-map',
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-react'],
						plugins: [
							'@babel/plugin-proposal-class-properties',
							'@babel/plugin-proposal-object-rest-spread',
						],
					},
				},
			},
			{
				test: /\.pcss$/,
				exclude: /node_modules/,
				use: [
					'style-loader',
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							ident: 'postcss',
							plugins: [precss()],
						},
					},
				],
			},
		],
	},
};
