"use strict";

const { isObject } = require("@thj-cli-dev/utils");
const formatPath = require("@thj-cli-dev/format-path");
const pkgDir = require("pkg-dir").sync
const fse = require("fs-extra")
const pathExists = require("path-exists").sync
const path = require("path");
const npminstall = require("npminstall")
const { getDefaultRegistry, getNpmLatestVersion } = require("@thj-cli-dev/get-npm-info")

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
    this.storeDir = options.storeDir;
    // package 的 name
    this.packageName = options.packageName;
    // package 的 version
    this.packageVersion = options.packageVersion;
    // package 的缓存目录前缀
    this.cacheFilePathPrefix = this.packageName.replace('/', '_')
  }

  get cacheFilePath() {
    return path.resolve(this.storeDir, `_${this.cacheFilePathPrefix}@${this.packageVersion}@${this.packageName}`)
  }

  /**
   * 获取最新版本号
   * @returns {string} version
   */
  getLatestCacheFilePath() {
    return path.resolve(this.storeDir, `_${this.cacheFilePathPrefix}@${this.packageVersion}@${this.packageName}`)
  }

  /**
   * 获取指定版本号
   * @returns {string} version
   */
  getSpecificCacheFilePath(packageVersion) {
    return path.resolve(this.storeDir, `_${this.cacheFilePathPrefix}@${packageVersion}@${this.packageName}`)
  }

  // get latest version
  async prepare() {

    if (this.storeDir && !pathExists(this.storeDir)) {
      // 解决目录不存在的问题
      fse.mkdirpSync(this.storeDir);
    }

    if (this.packageVersion === 'latest') {
      this.packageVersion = await getNpmLatestVersion(this.packageName, getDefaultRegistry(true))

    }
  }


  // 判断当前Package是否存在
  async exists() {
    if (this.storeDir) {
      // 缓存模式
      await this.prepare()

      return pathExists(this.cacheFilePath)
    } else {

      return pathExists(this.targetPath)
    }

  }

  // install package
  async install() {
    await this.prepare()
    return npminstall({
      root: this.targetPath,
      storeDir: this.storeDir,
      registry: getDefaultRegistry(),
      pkgs: [{
        name: this.packageName,
        version: this.packageVersion
      }]

    })
  }

  // update package
  async update() {
    await this.prepare()

    // 1. 获取最新npm版本号
    const latestPackageVersion = await getNpmLatestVersion(this.packageName)

    // 2. 查询最新版本号对应的路径是否存在
    const latestFilePath = this.getSpecificCacheFilePath(latestPackageVersion)

    // 3. 如果不存在则直接安装最新版本
    if (!pathExists(latestFilePath)) {
      await npminstall({
        root: this.targetPath,
        storeDir: this.storeDir,
        registry: getDefaultRegistry(),
        pkgs: [{
          name: this.packageName,
          version: latestPackageVersion
        }]

      })

      this.packageVersion = latestPackageVersion
    } else {
      this.packageVersion = latestPackageVersion
    }
  }

  // 获取入口文件的路径
  getRootFilePath() {

    function _getRootFile(targetPath) {
      // 1. 获取 package.json 所在目录
      // const dir = targetPath
      const dir = pkgDir(targetPath)
      console.log('dir: ', dir, targetPath)
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
    console.log("this.storeDir:", this.storeDir)
    console.log("this.cacheFilePath:", this.cacheFilePath)
    if (this.storeDir) {
      return _getRootFile(this.cacheFilePath);
    } else {
      return _getRootFile(this.targetPath);
    }

  }
}

module.exports = Package;
