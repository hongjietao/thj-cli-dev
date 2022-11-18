"use strict";

const Package = require("@thj-cli-dev/package");
const log = require("@thj-cli-dev/log");

const SETTTINGS = {
  init: "@thj-cli-dev/init",
};

function exec(name, options, cmdObj) {
  const targetPath = process.env.CLI_TARGET_PATH;
  const homePath = process.env.CLI_HOME_PATH;
  const packageName = SETTTINGS[cmdObj.name()];
  const packageVersion = "latest";
  log.verbose("homePath: ", process.env.CLI_HOME_PATH);
  // const cmdObj = arguments[arguments.length - 1];
  console.log(name, options, cmdObj.name());
  // console.log(arguments, "arguments");
  const pkg = new Package({
    targetPath,
    packageName,
    packageVersion,
  });

  console.log(pkg);
}

module.exports = exec;

// thj-cli-dev init -tp D:\\thj-cli-dev\\thj-cli-dev\\commands\\init  --debug
