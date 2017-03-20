"use strict";
var webpack = require('webpack');
var path = require('path');
var loaders = require('./webpack.loaders');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var DashboardPlugin = require('webpack-dashboard/plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || "5000";

loaders.push({
	test: /\.css$/,
	loaders: ['style-loader', 'css-loader?importLoaders=1'],
	exclude: ['node_modules']
});

loaders.push({
	test: /\.scss$/,
	loaders: ['style-loader', 'css-loader?importLoaders=1', 'sass-loader'],
	exclude: ['node_modules']
});

module.exports = {
	entry: [
		'react-hot-loader/patch',
		'./client/index.jsx', // your app's entry point
	],
	devtool: process.env.WEBPACK_DEVTOOL || 'sourcemap',
	output: {
		publicPath: '/',
		path: path.join(__dirname, 'public'),
		filename: 'bundle.js'
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	module: {
		loaders
	},
	devServer: {
		contentBase: "./public",
		// do not print bundle build stats
		noInfo: true,
		// enable HMR
		hot: true,
		// embed the webpack-dev-server runtime into the bundle
		inline: true,
		// serve index.html in place of 404 responses to allow HTML5 history
		historyApiFallback: true,
		port: PORT,
		host: HOST
	},
	plugins: [
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new ExtractTextPlugin({
				filename: 'style.css',
				allChunks: true
		}),
		new DashboardPlugin(),
		new HtmlWebpackPlugin({
			template: './client/template.html',
			files: {
				css: ['style.css'],
				js: [ "bundle.js", "http://localhost:3000/socket.io/socket.io.js"],
			}
		}),
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
            jquery: 'jquery'
        }),
        new HtmlWebpackExternalsPlugin(
            [
                {
                    name: 'jquery',
                    var: 'jQuery',
                    path: './jquery.min.js'
                }, {
                    name: 'bootstrap.min.css',
                    var: 'bootstrap.min.css',
                    path: './bootstrap/css/bootstrap.min.css'
                },{
                    name: 'bootstrap-theme.min.css',
                    var: 'bootstrap-theme.min.css',
                    path: './bootstrap/css/bootstrap-theme.min.css'
                },{
                    name: 'bootstrap-material-design.min.css',
                    var: 'bootstrap-material-design.min.css',
                    path: './bootstrap-material/css/bootstrap-material-design.min.css'
                },{
                    name: 'ripples.min.css',
                    var: 'ripples.min.css',
                    path: './bootstrap-material/css/ripples.min.css'
                },{
                    name: 'material',
                    var: 'material',
                    path: './bootstrap-material/js/material.min.js'
                },{
                    name: 'ripples',
                    var: 'ripples',
                    path: './bootstrap-material/js/ripples.min.js'
                },{
                    name: 'bootstrap',
                    var: 'bootstrap',
                    path: './bootstrap/js/bootstrap.min.js'
                }
            ],
            {
                basedir: './lib',
                dest: 'libs'
            }
        )
	]
};
