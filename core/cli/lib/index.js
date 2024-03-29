"use strict";

module.exports = core;

const path = require("path");
const semver = require("semver");
const colors = require("colors/safe");
const { homedir } = require("os");
const pathExists = require("path-exists").sync;
const log = require("@thj-cli-dev/log");
const init = require("@thj-cli-dev/init");
const exec = require("@thj-cli-dev/exec");
const commander = require("commander");
const pkg = require("../package.json");
const constant = require("./constant");

const userHome = homedir()
const program = new commander.Command();

async function core() {
  try {
    await prepare();
    registerCommand();
  } catch (e) {
    log.error(e.message);

    if (process.env.LOG_LEVEL === 'verbose') { console.log(e) }

  }
}

/**
 * register Command
 *
 * 注册命令
 */
function registerCommand() {
  program
    .name(Object.keys(pkg.bin)[0])
    .usage("<command> [options]")
    .version(pkg.version)
    .option("-d,--debug", "是否开启调试模式", false)
    .option("-tp, --targetPath <targetPath>", "是否指定本地调试文件路径", "")


  program
    .command("init [projectName]")
    .option("-f, --force", "是否强制初始化项目")
    .action(exec);

  // 开启脚手架模式
  program.on("option:debug", function () {
    // debug变量在this.opts内
    if (this.opts().debug) {
      process.env.LOG_LEVEL = "verbose";
    } else {
      process.env.LOG_LEVEL = "info";
    }
    log.level = process.env.LOG_LEVEL;
    log.verbose("debug 模式已开启！");
  });

  // 指定targetPath
  program.on("option:targetPath", function () {
    log.verbose("targetPath：", this.opts().targetPath);
    process.env.CLI_TARGET_PATH = this.opts().targetPath;
  });

  // 未知命令监听
  program.on("command:*", function (obj) {
    const availableCommands = program.commands.map((cmd) => cmd.name);
    console.log(colors.red("未知的命令：" + obj[0]));
    console.log(colors.green("可用命令：" + availableCommands.join("、")));
  });

  if (process.argv.length < 3) {
    program.outputHelp();
  }
  program.parse(process.argv);
}

/**
 * 准备阶段
 */
async function prepare() {
  checkPkgVersion();
  checkNodeVersion();
  checkRoot();
  checkUserHome();
  checkEnv();
  await checkGlobalUpdate();
}

/**
 * Checks global version
 *
 * 1. 获取当前版本号和模块名
 * 2. 调用npm API, 获取所有版本号
 * 3. 提取所有版本号，比对那些版本号时大于当前版本的
 * 4. 获取最新的版本号，提示用户更新版本
 */
async function checkGlobalUpdate() {
  // 1. 获取当前版本号和模块名
  const currentVersion = pkg.version;
  const npmName = pkg.name;

  // 2. 调用npm API, 获取所有版本号
  const { getNpmSemverVersions } = require("@thj-cli-dev/get-npm-info");
  const lastVersion = await getNpmSemverVersions(currentVersion, npmName);
  if (lastVersion && semver.gt(lastVersion, currentVersion)) {
    log.warn(
      "更新提示",
      colors.yellow(
        `请手动更新 ${npmName}, 当前版本 ${currentVersion}, 最新版本 ${lastVersion}
更新命令： npm install -g ${npmName}`
      )
    );
  }

  // 3. 提取所有版本号，比对那些版本号时大于当前版本的
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
  const config = createDefaultConfig(); // 准备基础配置
  log.verbose('环境变量', config);
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

  process.env.CLI_HOME_PATH = cliConfig.cliHome;
  log.verbose('process.env.CLI_HOME_PATH', process.env.CLI_HOME_PATH);
  return cliConfig;
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
  log.notice(`thj-cli-dev version: `, pkg.version);
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
      colors.red(`thj-cli-dev 需要安装 v${lowestNodeVersion} 以上版本的 Node.js`)
    );
  }
}
