"use strict";

const Package = require("@thj-cli-dev/package");

function exec() {
  const pkg = new Package();
  console.log("exec");
  console.log(pkg);
  console.log(process.env.CLI_TARGET_PATH);
  console.log(process.env.CLI_HOME_PATH);
}

module.exports = exec;
