'use strict';

const chalk = require("chalk");
const path = require('path');
const url = require('url-join');
const parse = require('yargs-parser');
const BUILDER_ENV = require('./env');
const ROOT_PATH = process.cwd();
const SAAS_CONFIG = require(path.join(ROOT_PATH, 'app.config.ts'));
const PKG = require(path.join(ROOT_PATH, 'package.json'));
const PLATFORM = process.platform;

console.log('platform', PLATFORM);
console.log('ROOT_PATH ', ROOT_PATH );
// 云构建 || 本地构建
const BUILD_ENV = BUILDER_ENV.BUILD_ENV;
const SRC_PATH = path.resolve(ROOT_PATH, 'src');
const BUILD_PATH = BUILDER_ENV.BUILD_DEST ? path.join(ROOT_PATH, BUILDER_ENV.BUILD_DEST) : path.resolve(ROOT_PATH, 'build');
const BUILD_GIT_GROUP = BUILDER_ENV.BUILD_GIT_GROUP;
let PUBLISH_ENV = '';

let argv = !!BUILDER_ENV.BUILD_ARGV_STR ? parse(BUILDER_ENV.BUILD_ARGV_STR) : {};

// 取得当前是日常还是生产环境
// 日常： --def_publish_type=assets --def_publish_env=daily
// 生产：
// console.log('获取构建环境：');
// console.log(BUILDER_ENV.BUILD_ARGV_STR);
// 云构建时校验是否开启线上构建
// BUILD_ENV === 'cloud' 云构建、BUILD_ENV === 'local' 本地构建
if (BUILD_ENV === 'cloud' && !argv.def_publish_env) {
  console.log(chalk.red('未开启线上构建, 参考文档：https://yuque.antfin-inc.com/alsc-saas/vt2tmg/ehge2p#UqnpK'));
  process.exit(0);
}

// 获取发布环境（daily、prod）
// PUBLISH_ENV = argv.def_publish_env;
PUBLISH_ENV = 'dev';
const BUILD_GIT_PROJECT = PKG.name;
const BUILD_GIT_VERSION = PKG.version || '0.0.1';
const CDN_BASE_DAILY = '//bohstatic.dev.choicesaas.cn';
const CDN_BASE_PROD = '//g.alicdn.com/';
let CDN_BASE = CDN_BASE_DAILY;

// 根据构建环境设置ASSETS_URL，ASSETS_URL作为静态资源的基础路径
let ASSETS_URL = '/';
// https://g.alicdn.com/alsc-saas/web-boh-common/1.2.7/navbar.js
// 暂时写死为dev http://bohstatic.dev.choicesaas.cn/boh-layout/dev/1.0.0/navbar.js
ASSETS_URL = url(CDN_BASE, BUILD_GIT_PROJECT, PUBLISH_ENV, BUILD_GIT_VERSION, '/');

console.log('CONST ASSETS_URL', ASSETS_URL);

// switch (BUILD_ENV) {
//   case 'cloud':
//     CDN_BASE = PUBLISH_ENV === 'daily' ? CDN_BASE_DAILY : CDN_BASE_PROD;
//     ASSETS_URL = url(CDN_BASE, BUILD_GIT_GROUP, BUILD_GIT_PROJECT, BUILD_GIT_VERSION, '/');
//     break;
//   case 'local':
//     ASSETS_URL = url(CDN_BASE, BUILD_GIT_GROUP, BUILD_GIT_PROJECT, BUILD_GIT_VERSION, '/');
//     break;
//   default:
//     break;
// }

// CSS MODULE NAMESPACE
let CSS_SCOPE = ROOT_PATH.split(path.sep).pop().split('-').pop();

const PATH_PARAMS = {
  ROOT_PATH,
  SRC_PATH,
  BUILD_PATH,
  CDN_BASE,
  ASSETS_URL,
  SAAS_CONFIG,
  CSS_SCOPE,
  PUBLISH_ENV,
};

// console.log('PROCESS_ENV');
// console.log(JSON.stringify(process.env, null, 2));

// console.log('PATH_PARAMS:');
// console.log(JSON.stringify(PATH_PARAMS, null, 2));

module.exports = PATH_PARAMS;