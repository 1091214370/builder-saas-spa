'use strict';

const path = require('path');
const fs = require('fs');
const get = require('lodash/get');
const nunjucks = require('nunjucks');
const { ROOT_PATH, SAAS_CONFIG, SRC_PATH } = require('../util/const');
const microAppName = get(SAAS_CONFIG, 'microAppName', '');

nunjucks.configure('*', {
  autoescape: false,
});

module.exports = function (config, argv) {
  let entries = config.entry || {};
  const pages = get(SAAS_CONFIG, 'page', {});

  Object.keys(pages).forEach(chunkName => {
    let entryValue = [];

    //每个页面的index.jsx入口文件
    let jsEntryFile = path.join(SRC_PATH, chunkName, 'index');
    let commonEntryFile = path.join(SRC_PATH, 'common/index');
    entryValue.push(commonEntryFile, jsEntryFile);
    entries[chunkName] = entryValue;
  })

  fs.writeFileSync(
    path.join(ROOT_PATH, '.micro_app_config.js'),
    nunjucks.renderString(fs.readFileSync(path.join(__dirname, '../dynamic/micro_app_config.es')).toString(), {
      appName: microAppName,
      pages: JSON.stringify(pages),
    }),
  );

  // micro app config file
  entries['app-config'] = path.join(ROOT_PATH, '.micro_app_config.js');

  console.log(entries);
  config.entry = entries;
}