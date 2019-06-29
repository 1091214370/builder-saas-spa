/**
 * css样式
 */

'use strict';

const path = require('path');
const get = require('lodash/get');
const saasConfig = require(path.join(process.cwd(), 'saas.config.js'));
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const pxtoremPlugin = require('postcss-pxtorem');
const safeAreaInsetPlugin = require('postcss-safe-area-inset')
const autoprefixer = require('autoprefixer');
const { SAAS_CONFIG } = require('../util/const');
// 获取sass.config.js themes配置
let themes = get(SAAS_CONFIG, 'webpack.themes', {});
// 获取sass.config.js 端配置
let sat = SAAS_CONFIG.sat || 'pc';

const getPostcssConfig = () => {
  const postcssOptions = {
    plugins: [
      autoprefixer({
        browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
      }),
    ],
  };
  // H5/app postcss配置：屏幕适配
  sat !== 'pc' && postcssOptions.plugins.push(
    pxtoremPlugin({
      rootValue: 100,
      propList: ['*'],
    }),
    safeAreaInsetPlugin()
  );
  return postcssOptions;
}

module.exports = function (config, argv) {
  config.module = config.module || {};
  config.module.rules = config.module.rules || [];
  config.plugins = config.plugins || [];

  const postcssOptions = getPostcssConfig();

  const styleModuleRule = [{
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        use: [{
          loader: require.resolve('css-loader'),
        }, {
          loader: require.resolve('postcss-loader'),
          options: postcssOptions,
        }],
      })
    },
    {
      test: /\.less$/,
      use: ExtractTextPlugin.extract({
        use: [{
          loader: require.resolve('css-loader'),
        }, {
          loader: require.resolve('postcss-loader'),
          options: postcssOptions,
        }, {
          loader: require.resolve('less-loader'),
          options: {
            sourceMap: true,
            modifyVars: themes,
          },
        }]
      })
    },
  ];

  config.module.rules = config.module.rules.concat(styleModuleRule);
  config.plugins.push(new ExtractTextPlugin({
    filename: '[name].css',
    disable: false,
    allChunks: true,
  }));
};