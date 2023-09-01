/*
 * @Author: taohongjie 
 * @Date: 2023-09-01 20:40:41 
 * @Last Modified by: taohongjie
 * @Last Modified time: 2023-09-01 20:59:54
 */
"use strict";

const Package = require("@thj-cli-dev/package");
const log = require("@thj-cli-dev/log");
const path = require("path");

const SETTLINGS = {
  init: "@thj-cli-dev/init",
};

const CACHE_DIR = 'dependencies'



async function exec(name, options, cmdObj) {

  let targetPath = process.env.CLI_TARGET_PATH;
  let storeDir = ''
  let pkg;
  // FIXME: 此处 homePath 无法解析
  const homePath = process.env.CLI_HOME_PATH;
  const packageName = SETTLINGS[cmdObj.name()];
  const packageVersion = "latest";

  log.verbose("homePath: ", homePath);

  if (!targetPath) {
    // 生成缓存路径
    targetPath = path.resolve(homePath, CACHE_DIR);
    storeDir = path.resolve(targetPath, 'node_modules');
    log.verbose("targetPath: ", targetPath);
    log.verbose("storeDir: ", storeDir);

    // thj-cli-dev init test-project --force --debug

    pkg = new Package({
      targetPath,
      packageName,
      storeDir,
      packageVersion,
    });

    if (pkg.exists()) {
      // update package
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


  console.log(await pkg.exists());
  const rootFile = pkg.getRootFilePath();
  if (rootFile) {
    require(rootFile).apply(null, arguments);
  }

}

module.exports = exec;

// thj-cli-dev init -tp D:\\VScode\\thj-cli-dev\\commands\\init  --debug
