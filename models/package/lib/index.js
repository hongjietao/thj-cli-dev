"use strict";

const { isObject } = require("@thj-cli-dev/utils");

class Package {
  constructor(options) {
    if (!options) {
      throw new Error("Package 类的 options 参数不能为空！");
    }
    if (!isObject(options)) {
      throw new Error("Package 类的 options 参数必须为对象！");
    }
    // package 的路径
    this.targetPath = options.targetPath;
    // package 的存储路径
    this.storePath = options.storePath;
    // package 的 name
    this.packageName = options.packageName;
    // package 的 version
    this.packageVersion = options.packageVersion;
  }

  // 判断当前Package是否存在
  exists() {}

  // install package
  install() {}

  // update package
  update() {}

  // 获取入口文件的路径
  getRootFilePath() {}
}

module.exports = Package;
