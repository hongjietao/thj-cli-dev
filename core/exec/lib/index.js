/*
 * @Author: taohongjie 
 * @Date: 2023-09-01 20:40:41 
 * @Last Modified by: taohongjie
 * @Last Modified time: 2023-09-06 15:07:54
 */
"use strict";

const Package = require("@thj-cli-dev/package");
const log = require("@thj-cli-dev/log");
const path = require("path");

const SETTINGS = {
  init: "@thj-cli-dev/init",
};

const CACHE_DIR = 'dependencies'



async function exec() {

  let targetPath = process.env.CLI_TARGET_PATH;
  const homePath = process.env.CLI_HOME_PATH;
  let storeDir = ''
  let pkg;
  log.verbose("targetPath: ", targetPath);
  log.verbose("homePath: ", homePath);

  // const packageName = SETTLINGS[cmdObj.name()];
  // const packageName = '@thj-cli-dev/log';
  // const packageVersion = "latest";

  const cmdObj = arguments[arguments.length - 1];
  const cmdName = cmdObj.name();
  const packageName = SETTINGS[cmdName];
  const packageVersion = 'latest';


  if (!targetPath) {
    // 生成缓存路径
    targetPath = path.resolve(homePath, CACHE_DIR);
    storeDir = path.resolve(targetPath, 'node_modules');

    log.verbose("targetPath: ", targetPath);
    log.verbose("storeDir: ", storeDir);

    // thj-cli-dev init test-project --force --debug

    pkg = new Package({
      targetPath,
      storeDir,
      packageName,
      packageVersion,
    });


    if (await pkg.exists()) {
      // update package
      await pkg.update();
    } else {

      await pkg.install();
    }

  } else {
    pkg = new Package({
      targetPath,
      packageName,
      packageVersion,
    })
  }


  // console.log(await pkg.exists());
  const rootFile = pkg.getRootFilePath();
  // FIXME: 此处root file有问题
  if (rootFile) {

    // 在当前进程中使用 
    require(rootFile).apply(null, Array.from(arguments));

    // 
  }

}

module.exports = exec;

// package test
// thj-cli-dev init test-project --force --debug

// thj-cli-dev init -tp D:\\VScode\\thj-cli-dev\\commands\\init  --debug
