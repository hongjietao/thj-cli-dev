## 基于 lerna 开发的脚手架工具

https://www.wolai.com/ftQ9aTJVQwQmsdmQHVZDyQ

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

## 思考

Q: reqiure 能加载那些文件，为什么 .md 文件无法加载？

A: reqiure 只能加载 .js, .json, .node 这三种文件。如果是其它文件，会以.js 的方式加载，如果文件里面是 js 代码，则可以解析，否则会报错

```js

.js   -> .js文件 module.exports or exports
.json -> reqiure 会通过 JSON.parse 解析 json 文件，并输出一个对象
.node -> process.dlopen() // 基本不用

.any  -> reqiure 默认以 .js 方式加载
```

## TODO:

debug 模式调参？
为什么执行 thj-cli-dev --debug 不起作用

# 其它

## 如何让 Node 支持 ES module

模块化方案：CMD / AMD / require.js

1. CommonJS
   - 加载模块：require
   - 输出模块：module.exports / exports.x
2. ES module
   - 加载模块：import
   - 输出模块：export default

<!-- week 4: 4-5-->
