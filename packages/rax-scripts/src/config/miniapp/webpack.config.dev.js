'use strict';
/* eslint no-console: 0 */
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const address = require('address');
const qrcode = require('qrcode-terminal');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const webpackConfigBase = require('./webpack.config.base');
const envConfig = require('../env.config');
const pathConfig = require('../path.config');

const ipv4 = address.ip();
const port = envConfig.port;
const webUrl = envConfig.protocol + '//' + ipv4 + ':' + port;

qrcode.generate(webUrl, { small: true });
console.log('Web: scan above QRCode ' + webUrl + ' or direct open in browser.\n');

const webpackConfigDev = webpackMerge(webpackConfigBase, {
  devtool: 'inline-source-map',
  entry: {
    index: [pathConfig.appManifest],
  },
  output: {
    publicPath: '/',
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    process.env.ANALYZER ? new BundleAnalyzerPlugin() : null,
  ].filter(Boolean),
});

Object.keys(webpackConfigDev.entry).forEach((point) => {
  // hot reaload client.
  webpackConfigDev.entry[point].unshift(require.resolve('../../hmr/webpackHotDevClient.entry'));
});

module.exports = webpackConfigDev;
