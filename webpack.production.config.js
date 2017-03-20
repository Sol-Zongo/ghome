var webpack = require('webpack');
var path = require('path');
var loaders = require('./webpack.loaders');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');

loaders.push({
	test: /\.scss$/,
	loader: ExtractTextPlugin.extract({fallback: 'style-loader', use : 'css-loader?sourceMap&localIdentName=[local]___[hash:base64:5]!sass-loader?outputStyle=expanded'}),
	exclude: ['node_modules']
});

module.exports = {
	entry: [
		'./client/index.jsx',
		'./styles/index.scss'
	],
	output: {
		publicPath: '/',
		path: path.join(__dirname, 'public'),
		filename: '[chunkhash].js'
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	module: {
		loaders
	},
	plugins: [
		new WebpackCleanupPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				screw_ie8: true,
				drop_console: true,
				drop_debugger: true
			}
		}),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new ExtractTextPlugin({
				filename: 'style.css',
				allChunks: true
		}),
		new HtmlWebpackPlugin({
			template: './client/template.html',
			files: {
				css: ['style.css'],
				js: [ "bundle.js", "http://localhost:3000/socket.io/socket.io.js"],
			}
		}),
        new HtmlWebpackExternalsPlugin(
            [
                {
                    name: 'jquery',
                    var: 'jQuery',
                    path: './js/jquery-3.1.1.min.js'
                },
                {
                    name: 'jquery-easing.js',
                    path: './js/modules/jquery-easing.js'
                },
                {
                    name: 'tether',
                    path: './js/tether.min.js'
                },
                {
                    name: 'bootstrap',
                    path: './js/bootstrap.min.js'
                },
                {
                    name: 'mdb',
                    path: './js/mdb.min.js'
                },

                {
                    name: 'bootstrap.css',
                    path: './css/bootstrap.min.css'
                },
                {
                    name: 'mdb.css',
                    path: './css/mdb.min.css'
                },


                {
                    name: 'Roboto-Regular.woff2',
                    path: './font/roboto/Roboto-Regular.woff2'
                },
                {
                    name: 'Roboto-Regular.woff',
                    path: './font/roboto/Roboto-Regular.woff'
                },
                {
                    name: 'Roboto-Regular.ttf',
                    path: './font/roboto/Roboto-Regular.ttf'
                },
                {
                    name: 'Roboto-Bold.woff2',
                    path: './font/roboto/Roboto-Bold.woff2'
                },
                {
                    name: 'Roboto-Bold.woff',
                    path: './font/roboto/Roboto-Bold.woff'
                },
                {
                    name: 'Roboto-Regular.ttf',
                    path: './font/roboto/Roboto-Bold.ttf'
                },
                {
                    name: 'Roboto-Light.woff2',
                    path: './font/roboto/Roboto-Light.woff2'
                },
                {
                    name: 'Roboto-Light.woff',
                    path: './font/roboto/Roboto-Light.woff'
                },
                {
                    name: 'Roboto-Light.ttf',
                    path: './font/roboto/Roboto-Light.ttf'
                },
            ],
            {
                basedir: './lib/bootstrap',
                dest: 'libs'
            }
        )
	]
};
