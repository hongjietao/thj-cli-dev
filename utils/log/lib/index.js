"use strict";

const log = require("npmlog");

log.level = process.env.LOG_LEVEL ? process.env.LOG_LEVE : "info"; // 判断 debug 模式
log.heading = "thj-cli"; // 修改前缀
log.headingStyle = { fg: "cyan", bg: "black" }; // 修改前缀样式
log.addLevel("success", 2000, { fg: "green", bold: true }); // 添加自定义命令

module.exports = log;
