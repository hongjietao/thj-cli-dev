"use strict";

const Package = require("@thj-cli-dev/package");
const log = require("@thj-cli-dev/log");

const SETTTINGS = {
  init: "@thj-cli-dev/init",
};

function exec(name, options, cmdObj) {
  let targetPath = process.env.CLI_TARGET_PATH;
  const homePath = process.env.CLI_HOME_PATH;
  const packageName = SETTTINGS[cmdObj.name()];
  const packageVersion = "latest";

  if (!targetPath) {
    // 生成缓存路径
    targetPath = "";
  }

  log.verbose("homePath: ", process.env.CLI_HOME_PATH);

  const pkg = new Package({
    targetPath,
    packageName,
    packageVersion,
  });

  console.log(pkg);
}

module.exports = exec;

// thj-cli-dev init -tp D:\\thj-cli-dev\\thj-cli-dev\\commands\\init  --debug
