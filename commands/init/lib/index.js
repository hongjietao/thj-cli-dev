"use strict";

const fs = require("fs");
const path = require('path');
const inquirer = require('inquirer');
const Command = require('@thj-cli-dev/command');
const Package = require('@thj-cli-dev/package');
const log = require('@thj-cli-dev/log');

module.exports = init;

function init(projectName, cmdObj) {
  console.log("init:", projectName, process.env.CLI_TARGET_PATH, cmdObj.targetPath);
}

