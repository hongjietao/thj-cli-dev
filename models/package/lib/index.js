"use strict";

const { isObject } = require("@thj-cli-dev/utils");
const formatPath = require("@thj-cli-dev/format-path");
const pkgDir = require("pkg-dir").sync
const path = require("path");
const npminstall = require("npminstall")
const { getDefaultRegistry } = require("@thj-cli-dev/get-npm-info")

class Package {
  constructor(options) {
    if (!options) {
      throw new Error("Package 类的 options 参数不能为空！");
    }
    if (!isObject(options)) {
      throw new Error("Package 类的 options 参数必须为对象！");
    }
    // package 的目标路径
    this.targetPath = options.targetPath;
    // package 的缓存路径
    this.storePath = options.storePath;
    // package 的 name
    this.packageName = options.packageName;
    // package 的 version
    this.packageVersion = options.packageVersion;
  }

  // 判断当前Package是否存在
  exists() { }

  // install package
  install() {
    npminstall({
      root: this.targetPath,
      storeDir: this.storeDir,
      registry: getDefaultRegistry(),
      pkgs: [{
        name: this.packageName, version: this.packageVersion
      }]

    })
  }

  // update packagex
  update() { }

  // 获取入口文件的路径
  getRootFilePath() {
    // 1. 获取 package.json 所在目录
    // TODO: 此处pkgDir不生效，寄
    // const dir = pkgDir(
    //   path.resolve(this.targetPath, '')
    // );
    const dir = path.resolve(this.targetPath, '')

    if (dir) {
      // 2. 读取 package.json
      const pkgFile = require(path.resolve(dir, 'package.json'));

      // 3. 寻找 main/lib
      if (pkgFile && pkgFile.main) {

        // 4. 路径的兼容 (macOS/windows)
        return formatPath(path.resolve(dir, pkgFile.main));
      }
    }

    return null;
  }
}

module.exports = Package;
