"use strict";

module.exports = core;

const path = require("path");
const semver = require("semver");
const colors = require("colors/safe");
const userHome = require("user-home");
const pathExists = require("path-exists").sync;
const log = require("@thj-cli-dev/log");

const pkg = require("../package.json");
const constant = require("./constant");
let config;

function core() {
  try {
    checkPkgVersion();
    checkNodeVersion();
    checkRoot();
    checkUserHome();
    checkEnv();
  } catch (e) {
    log.error(e.message);
  }
}

/**
 * Checks env is exists
 *
 * 检查环境变量
 */
function checkEnv() {
  const dotenv = require("dotenv");
  const dotEnvPath = path.resolve(userHome, ".env");
  if (pathExists(dotEnvPath)) {
    config = dotenv.config({
      path: dotEnvPath,
    });
  }
  createDefaultConfig();
  log.info("环境变量：", process.env.CLI_CONFIG_PATH);
}

/**
 * create default env config
 *
 * 创建默认脚手架环境变量配置
 */
function createDefaultConfig() {
  const cliConfig = {
    home: userHome,
  };

  if (process.env.CLI_HOME) {
    cliConfig["cliHome"] = path.join(userHome, process.env.CLI_HOME);
  } else {
    cliConfig["cliHome"] = path.join(userHome, constant.DEFAULT_CLI_HOME);
  }

  process.env.CLI_CONFIG_PATH = cliConfig.cliHome;
}

/**
 * Checks user home directory is exists
 *
 * 检查用户主目录是否存在
 */
function checkUserHome() {
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red("当前登录用户主目录不存在！"));
  }
}

/**
 * check root account
 *
 * 检查 root 账号
 */
function checkRoot() {
  const rootCheck = require("root-check");
  rootCheck();
}

/**
 * check package version
 *
 * 检查当前版本号
 */
function checkPkgVersion() {
  log.notice(`thj-cli version: `, pkg.version);
}

/**
 * check and diff node version
 *
 * 检查并比较 node 版本
 */
function checkNodeVersion() {
  // 1. 获取当前版本号
  // log.notice(`node version: `, process.version);
  const curNodeVersion = process.version;
  const lowestNodeVersion = constant.LOWEST_NODE_VERSION;

  // 2. 对比最低版本号
  if (!semver.gte(curNodeVersion, lowestNodeVersion)) {
    throw new Error(
      colors.red(`thj-cli 需要安装 v${lowestNodeVersion} 以上版本的 Node.js`)
    );
  }
}