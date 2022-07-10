"use strict";

module.exports = core;

const semver = require("semver");
const colors = require("colors/safe");
const pkg = require("../package.json");
const log = require("@thj-cli-dev/log");
const constant = require("./constant");

function core() {
  try {
    checkPkgVersion();
    checkNodeVersion();
    checkRoot();
  } catch (e) {
    log.error(e.message);
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
  // console.log(process.geteuid());
  // log.info();
}

/**
 * check package version
 *
 * 检查当前版本号
 */
function checkPkgVersion() {
  log.notice(`version: `, pkg.version);
}

/**
 * check and diff node version
 *
 * 检查并比较 node 版本
 */
function checkNodeVersion() {
  // 1. 获取当前版本号
  log.notice(`node version: `, process.version);
  const curNodeVersion = process.version;
  const lowestNodeVersion = constant.LOWEST_NODE_VERSION;

  // 2. 对比最低版本号
  if (!semver.gte(curNodeVersion, lowestNodeVersion)) {
    throw new Error(
      colors.red(`thj-cli 需要安装 v${lowestNodeVersion} 以上版本的 Node.js`)
    );
  }
}
