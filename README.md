## 基于 lerna 开发的脚手架工具

[记录](https://www.wolai.com/ftQ9aTJVQwQmsdmQHVZDyQ)
<a href="https://www.wolai.com/ftQ9aTJVQwQmsdmQHVZDyQ" title="标题"  target="_blank">记录</a>
学习用

# 开发流程

## 创建新包

eg: 创建 log 包

```bash
leran create @thj-cli-dev/log
```

## 安装依赖

### 给子项目安装依赖

eg: 安装 semver， semver 可以用来比较版本号，可以对比的场景比较多

```bash
lerna add semver core/cli
```

安装完包时，需要重新在子项目中执行 npm i，不然 "@thj-cli-dev/log": "file:../../utils/log" 这种不生效

## 发布流程

创建 LICENSE.md 文件
对 packages 中的每一个项目的 package.json 都添加下面代码

```json
"publishConfig": {
    "access": "public"
  }
```

然后执行下面命令，发布版本

```bash
git add .
git cm 'feat: xxx'
git push
lerna publish
```
