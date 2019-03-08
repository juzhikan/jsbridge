文学漫画h5和native通信库
===========================

该项目包含h5和native通信库（schema和bridge实现）、文学漫画各个产品的通信协议文档和具体实现，并对老版本schema方式的通信做兼容，在 http://doc.hz.netease.com/pages/viewpage.action?pageId=80308439 了解jsbridge的细节

文档
----------

文档使用apidoc生成。

```Bash
# 全部
apidoc -i src/ -o out/all/

# 公用部分
apidoc -i src/lib/ -o out/lib/

# 蜗牛部分，在线地址 http://doc.hz.netease.com/pages/viewpage.action?pageId=85264142
apidoc -i src/snail -i src/lib/ -o out/snail/

# 漫画部分，在线地址 http://doc.hz.netease.com/pages/viewpage.action?pageId=85264165
apidoc -i src/comic -i src/lib/ -o out/comic/

# 阅读部分，在线地址 http://doc.hz.netease.com/pages/viewpage.action?pageId=105039339
apidoc -i src/read -o out/read/
```



使用
----------

每个产品都有单独的入口文件

1. 漫画在src/comic/comic.js
2. 蜗牛在src/snail/snail.js

使用rollup构建

```Bash
# 安装依赖
yarn

# 构建
npm run build

# 发布
npm version patch
npm publish
```

生成的文件在dist下，以漫画为例，bridge.comic.js是umd格式，如果通过script引入，命名空间为Bridge.comic，bridge.comic.es.js是module格式

```js
// umd

Bridge.comic.callHandler;
Bridge.comic.registerHandler;

// es
import {callHanlder, registerHandler} from 'nejsbridge/dist/bridge.comic.es.js';
```

API选项
----------

### `callHandler` h5主动跟客户端通信

```js
Bridge.comic.callHandler(actionName, data, callback);
```

* `actionName` – type: `string`. 接口名
* `data` – type: `object`. 数据
* `callback` – type: `funtion`. 回调函数，可选


### `registerHandler` h5注册协议，客户端发起通信

```js
Bridge.comic.callHandler(actionName, callback);
```

* `actionName` – type: `string`. 接口名
* `callback` – type: `funtion`. 回调函数


### `support` 判断当前客户端是否支持该协议

```js
Bridge.comic.support(actionName);
```

* `actionName` – type: `string`. 接口名

返回值为`Boolean`，`true`表示支持，`false`表示不支持

新产品接入
----------

### 准备工作

1. 熟悉apidoc的文档 http://apidocjs.com/
2. 了解rollup的基本使用和配置文件的构成
3. 参考蜗牛已有的实现 src/snail/snail.js

### 需要基于APIAbstract实现API接口说明

1. schemaName_是产品的schema头
2. isInApp判断是否在app里
3. getLegacyProtocolConfig实现具体兼容老版本的协议

### 开始

1. 定义产品所需的协议和文档
2. 实现接口
3. 处理好打包相关的内容
4. 记得更新本readme哦