var bridgeCallbackQueue = [];

function setupWebViewJavascriptBridge(callback) {
    if (window.NEJSBridge) {
        callback(NEJSBridge);
        return;
    }
    bridgeCallbackQueue.push(callback);

    var NEJSBridgeReady = false;
    document.addEventListener('NEJSBridgeReady', function () {
        NEJSBridgeReady = true;
        bridgeCallbackQueue.forEach(function (callback) {
            callback(NEJSBridge);
        });
        bridgeCallbackQueue = [];
    }, false);

    var notifyAppTimes = 0;
    function notifyAppLoaded() {
        notifyAppTimes++;
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'nejb://nejb_loaded';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function () {
            document.documentElement.removeChild(WVJBIframe);
        }, 0);
    }
    notifyAppLoaded();
    var notifyAppTimer = setInterval(function () {
        if (notifyAppTimes < 6 && !NEJSBridgeReady) {
            notifyAppLoaded();
        } else {
            clearInterval(notifyAppTimer);
        }
    }, 300);
}

var callHandler$3 = function callHandler(actionName, data, callback) {
    setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler(actionName, data, function (resp) {
            if (resp !== undefined) {
                resp = JSON.parse(resp);
            }
            callback(resp);
        });
    });
};

var registerHandler = function registerHandler(actionName, callback) {
    setupWebViewJavascriptBridge(function (bridge) {
        bridge.registerHandler(actionName, function (resp, responseCallback) {
            if (resp !== undefined) {
                resp = JSON.parse(resp);
            }
            callback(resp, responseCallback);
        });
    });
};

var stringify = function stringify(query) {
    if (typeof query == 'string') return query;

    var i;
    var result = [];

    for (i in query) {
        if (query.hasOwnProperty(i)) {
            result.push(i + '=' + encodeURIComponent(query[i]));
        }
    }

    return result.join('&');
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

function connectToNative(url, isInApp) {
    if (!isInApp) {
        window.location.href = url;
        return;
    }

    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = url;
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function () {
        document.documentElement.removeChild(WVJBIframe);
    }, 0);
}

var setValueByPath = function setValueByPath(path, value) {
    var array = path.split('.');

    array.reduce(function (acc, currentValue, currentIndex, array) {

        if (currentIndex === array.length - 1) {
            acc[currentValue] = value;
        } else if (acc[currentValue] === undefined || acc[currentValue] === null) {
            acc[currentValue] = {};
        }

        return acc[currentValue];
    }, window);
};

var callHandler$4 = function callHandler(actionName, data, callback, isInApp) {
    var seperator = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '?';


    if ((typeof callback === 'undefined' ? 'undefined' : _typeof(callback)) === 'object' && callback !== null) {

        if (callback.name !== undefined) {
            setValueByPath(callback.name, function () {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                if (typeof callback.handler === 'function') {
                    callback.handler.apply(null, args);
                }
                setValueByPath(callback.name, null);
            });
        }
    }
    var url = actionName + seperator + stringify(data);
    connectToNative(url, isInApp);
};

var patternResult = navigator.userAgent.match(/NEJSBridge\/([\d.]+)\b/);

var isJsbridgeCapable = !!patternResult;

var callHandler$2 = isJsbridgeCapable ? callHandler$3 : callHandler$4;

var libSupport = function libSupport(actionName, versionMap) {
    if (!isJsbridgeCapable || !(actionName in versionMap)) {
        return false;
    }

    var sinceVersoin = versionMap[actionName];
    var currentVersion = parseInt(patternResult[1], 10);

    return sinceVersoin <= currentVersion;
};

var APIAbstract = function () {
    function APIAbstract() {
        classCallCheck(this, APIAbstract);
    }

    createClass(APIAbstract, [{
        key: 'getLegacyProtocolConfig',
        value: function getLegacyProtocolConfig(actionName, data) {
            
        }
    }, {
        key: 'getComputedUrl',
        value: function getComputedUrl(path) {
            if (/^[\w0-9]+:\/\//.test(path)) {
                //'necomics://manhua.163.com/v1', nereader://yuedu.163.com/v1?
                return path;
            }

            return this.schemaName_ + '://' + path;
        }
    }]);
    return APIAbstract;
}();

var APIInstance = void 0;

var schemaCallHandler = function schemaCallHandler(API, actionName, data, callback, seperator) {
    APIInstance = APIInstance || new API();

    var obj = APIInstance.getLegacyProtocolConfig(actionName, data) || {};

    actionName = obj.actionName || actionName;
    data = obj.data || data;
    if (data.seperator !== undefined) {
        seperator = data.seperator; //兼容'neteasereaderuri://entryid=cf3587af574a4056a798878f59fa1b60_4&type=2'
    }

    var oCallback = null;

    if (callback) {
        oCallback = {};
        if (typeof obj.callback === 'string') {
            oCallback.name = obj.callback;
            oCallback.handler = callback;
        } else if (obj.callback !== undefined) {

            if (obj.callback.name === undefined) {
                throw new Error('callback name must be provided');
            }

            oCallback.name = obj.callback.name;
            oCallback.handler = function () {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                if (typeof obj.callback.handler === 'function') {
                    var _result = obj.callback.handler.apply(null, args);
                    callback(_result);
                } else {
                    callback.apply(null, result);
                }
            };
        }
    }

    var isInApp = APIInstance.isInApp();

    if (actionName === 'pageRedirect') {
        var path = APIInstance.getComputedUrl(data.path);

        callHandler$2(path, data.query, oCallback, isInApp, seperator);
    } else {
        var _path = APIInstance.getComputedUrl(actionName);

        callHandler$2(_path, data, oCallback, isInApp, seperator);
    }
};

var jsbridgeCallHandler = function jsbridgeCallHandler(API, actionName, data, callback) {
    var seperator = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '?';

    APIInstance = APIInstance || new API();

    if (actionName === 'pageRedirect') {
        var path = void 0;
        var query = void 0;
        var close = void 0;
        var obj = APIInstance.getLegacyProtocolConfig(actionName, data);

        if (obj) {
            obj = obj.data;
            path = obj.path || data.path;
            query = obj.query || data.query;
            if (obj.seperator !== undefined) {
                seperator = obj.seperator; //兼容'neteasereaderuri://entryid=cf3587af574a4056a798878f59fa1b60_4&type=2'
            }
        } else {
            path = data.path;
            query = data.query;
            close = data.close;
        }

        path = APIInstance.getComputedUrl(path);

        data = { actionUrl: path + seperator + stringify(query) };
        if (close) {
            data.close = close;
        }
    }

    callHandler$2(actionName, data, callback);
};

var doCallHandler = isJsbridgeCapable ? jsbridgeCallHandler : schemaCallHandler;

var callHandler$1 = function callHandler$$1(API, actionName) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var callback = arguments[3];
    var seperator = arguments[4];

    if (typeof data === 'function') {
        callback = data;
        data = {};
    }

    doCallHandler(API, actionName, data, callback, seperator);
};

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

var map = {
    openLoginView: 2,
    savePictureAndShare: 3,
    openImagePickerDialog: 4,
    hideHeader: 5,
    changeDocumentTitle: 5,
    shareSuccess: 5,
    sharePanelOpen: 5
};

var support = function support(actionName) {
    return libSupport(actionName, map);
};

var getAppVersion = function getAppVersion() {
    var userAgent = navigator.userAgent;

    if (!userAgent.match(/(iPhone|iPad)/) && !userAgent.match(/Android/)) {
        return false;
    }

    var clientVersionPatternArray = userAgent.match(/\bNeteaseComic\/([.0-9]+)\b/);

    if (!clientVersionPatternArray) {
        return false;
    }

    var clientVersionArray = clientVersionPatternArray[1].split('.');
    return {
        mainVersion: parseInt(clientVersionArray[0], 10),
        subVersion: parseInt(clientVersionArray[1], 10)
    };
};

var getShouldUseNewSchema = function getShouldUseNewSchema() {
    var clientVersionObj = getAppVersion();

    if (!clientVersionObj) return false;

    if (clientVersionObj.mainVersion > 2 || clientVersionObj.mainVersion === 2 && clientVersionObj.subVersion >= 4) {
        return true;
    }

    return false;
};

var getPageRedirectData = function getPageRedirectData(data) {
    var shouldUseNewSchema = getShouldUseNewSchema();

    var action = void 0;
    var a = void 0;
    var newSchemaQuery = {};
    var defaultQuery = {};

    switch (data.path) {

        /**
         * @api {get} topic 话题
         * @apiName topic
         * @apiDescription 话题
         * @apiGroup PageNavagation
         * @apiDeprecated use now (#General:pageRedirect).
         * @apiPermission jsbridge & schema
         *
         * @apiParam {String} id 话题
         */
        case 'topic':
            action = 7;
            a = 9;
            newSchemaQuery.id = data.query.id;
            defaultQuery.id = data.query.id;

            break;

        /**
        * @api {get} detail 漫画详情
        * @apiName detail
        * @apiDescription 漫画详情
        * @apiGroup PageNavagation
        * @apiDeprecated use now (#General:pageRedirect).
        * @apiPermission jsbridge & schema
        *
        * @apiParam {String} id 漫画id
        */

        case 'detail':
            action = 4;
            a = 3;
            newSchemaQuery.id = data.query.id;
            defaultQuery.id = data.query.id;

            break;

        /**
        * @api {get} reader 漫画阅读器
        * @apiName reader
        * @apiDescription 漫画阅读器，2.4.0协议之前跳转详情页面
        * @apiGroup PageNavagation
        * @apiDeprecated use now (#General:pageRedirect).
        * @apiPermission jsbridge & schema
        *
        * @apiParam {String} id 漫画id
        * @apiParam {String} [sectionId] 漫画话ID
        */

        case 'reader':
            action = 5;
            a = 3;
            newSchemaQuery.id = data.query.id;
            defaultQuery.id = data.query.id;

            if (data.query.sectionId) {
                defaultQuery.sectionId = data.query.sectionId;
            }

            break;

        /**
        * @api {get} bookListSubject 漫画列表专题页面
        * @apiName bookListSubject
        * @apiDescription 漫画列表专题页面
        * @apiGroup PageNavagation
        * @apiDeprecated use now (#General:pageRedirect).
        * @apiPermission jsbridge & schema
        *
        * @apiParam {String} id 漫画列表专题ID
        */

        case 'bookListSubject':
            action = 22;
            a = 4;
            newSchemaQuery.id = data.query.id;
            defaultQuery.id = data.query.id;

            break;

        /**
        * @api {get} topLevelPage 一级页面
        * @apiName topLevelPage
        * @apiDescription 2.4.0之前没有此协议，iOS不支持bridge方式调用
        * @apiGroup PageNavagation
        * @apiDeprecated use now (#General:pageRedirect).
        * @apiPermission jsbridge & schema
        *
        * @apiParam {Number} index 0-推荐漫画，1-找漫画，2-我的漫画，5-话题列表页，4-账号页
        */

        case 'topLevelPage':
            action = 3;
            newSchemaQuery.index = data.query.index;

            break;

        case 'webview':
            action = 1;
            newSchemaQuery.url = data.query.url;

            if (data.query.auth) {
                newSchemaQuery.auth = data.query.auth;
            }

            if (data.query.title) {
                newSchemaQuery.title = data.query.title;
            }

            defaultQuery.url = data.query.url;

            break;
    }

    var newSchemaPath = 'necomics://manhua.163.com/v1';

    newSchemaQuery.action = action;

    if (shouldUseNewSchema) {
        return {
            path: newSchemaPath,
            query: newSchemaQuery
        };
    }

    if (a) {
        defaultQuery.a = a;
    }

    defaultQuery.actionUrl = newSchemaPath + '?' + stringify(newSchemaQuery);

    return {
        path: 'shareCallback',
        query: defaultQuery
    };
};

function getShareContent(platform, fromnative) {
    callHandler$$1('share', {
        platform: platform,
        fromnative: fromnative ? 'true' : 'false'
    });
}

var setupShareSupport = function setupShareSupport() {
    window.getShareContent = getShareContent;
};

var APIComic = function (_APIAbstract) {
    inherits(APIComic, _APIAbstract);

    function APIComic() {
        classCallCheck(this, APIComic);

        var _this = possibleConstructorReturn(this, (APIComic.__proto__ || Object.getPrototypeOf(APIComic)).call(this));

        _this.schemaName_ = 'neteasecomic';
        return _this;
    }

    createClass(APIComic, [{
        key: 'isInApp',
        value: function isInApp() {
            return navigator.userAgent.indexOf('NeteaseComic') !== -1;
        }
    }, {
        key: 'getLegacyProtocolConfig',
        value: function getLegacyProtocolConfig(actionName, data) {
            switch (actionName) {

                /**
                * @api {post} share 唤起客户端分享模块
                * @apiName share
                * @apiGroup General
                * @apiDescription 唤起客户端分享模块，comic直接分享对应的平台
                *
                * @apiParam {String} title 分享内容的标题 或 分享到微博的文字内容(仅限snail)
                * @apiParam {String} description 分享内容的描述
                * @apiParam {String} picurl 分享的缩略图url
                * @apiParam {String} link 分享内容的跳转url
                * @apiParam {String} [activity] 设置当前页的活动代号，用于特定活动的统计需求
                * @apiParam (comic) {String} [text] 分享到微博的文字内容
                * @apiParam (comic) {String} [platform] 分享平台
                * @apiParam (comic) {String} [panel_title] 分享框的文案，默认文案是分享给朋友
                * @apiParam (snail) {String} [channel] 不传代表可以分享到目前所有支持的分享渠道，用逗号分隔的字符串‘wechatFriend,wechatTimeline,weibo’对应微信好友、微信朋友圈、微博
                *
                * @apiSuccess {Boolean} success 成功还是失败
                */
                case 'share':

                    data = objectAssign({}, this.shareConfig_, data);

                    data = objectAssign({}, {
                        link: data.link,
                        picurl: data.picurl,
                        platform: data.platform,
                        subtitle: data.description,
                        title: data.title,
                        text: data.text || data.description
                    });

                    if (typeof data.fromnative === 'undefined') {
                        data.fromnative = 'false';
                    }

                    return {
                        actionName: 'share/content',
                        data: data,
                        callback: 'sendShareResult'
                    };
                    break;

                /**
                * @api {post} setShareConfig 设置webview当前页面的分享参数
                * @apiName setShareConfig
                * @apiGroup General
                * @apiDescription 设置webview当前页面的分享参数
                *
                * @apiParam {String} title 分享内容的标题 或 分享到微博的文字内容(仅限snail)
                * @apiParam {String} description 分享内容的描述
                * @apiParam {String} picurl 分享的缩略图url
                * @apiParam {String} link 分享内容的跳转url
                * @apiParam (comic) {String} [text] 分享到微博的文字内容
                * @apiParam (snail) {String} [channel] 不传代表可以分享到目前所有支持的分享渠道，用逗号分隔的字符串‘wechatFriend,wechatTimeline,weibo’对应微信好友、微信朋友圈、微博
                *
                */

                case 'setShareConfig':

                    // cache share config
                    this.shareConfig_ = objectAssign({}, data);
                    setupShareSupport();

                    return {
                        actionName: 'share/support'
                    };
                    break;

                /**
                * @api {get} appInstallCheck 通知客户端检测是否安装了应用
                * @apiName appInstallCheck
                * @apiDescription 安卓独有，JS通知客户端检测是否已经安装微信/支付宝/QQ
                * @apiGroup Util
                * @apiPermission jsbridge
                *
                * @apiParam {String} app_type 应用类型 50: 支付宝, 51: 微信, 55:QQ
                *
                * @apiSuccess {String} app_type 应用类型
                * @apiSuccess {Number} installed 安装结果 1: 已安装, 0:未安装
                */

                case 'appInstallCheck':

                    return {
                        callback: {
                            name: 'notify_app_installed',
                            handler: function handler(app_type, installed) {
                                return {
                                    app_type: app_type,
                                    installed: installed
                                };
                            }
                        }
                    };

                    break;

                /**
                * @api {post} rechargeContent 充值
                * @apiName rechargeContent
                * @apiDescription 安卓独有，JS通知客户端构造好的订单数据
                * @apiGroup Trade
                * @apiPermission jsbridge
                *
                * @apiParam {String} recharge_param SDK调用所需要的参数,可以直接拿来用
                * @apiParam {Number} pay_type 应用类型 50: 支付宝, 51: 微信, 55:QQ
                * @apiParam {String} callback_param app回调js时需要附加传入的内容
                *
                * @apiSuccess {Number} client_type 客户端类型: 0:WEB, 1:ANDROID, 2:IPAD, 3:IPHONE, 4:WINDOWS, 5:WAP
                * @apiSuccess {Number} pay_type 支付方式: 50:支付宝, 51:微信,55:QQ
                * @apiSuccess {String} callback_param JS通知客户端构造好的callback_param
                *
                * @apiError rechargeContentFailed 充值失败
                *
                * @apiErrorExample Error-Response:
                *     {code: -1}
                * 
                *
                * @apiError rechargeContentCancelled 用户取消充值
                *
                * @apiErrorExample Error-Response:
                *     {code: -2}
                * 
                */

                case 'rechargeContent':

                    return {
                        callback: {
                            name: 'notify_pay_result',
                            handler: function handler(client_type, pay_type, callback_param) {
                                return {
                                    client_type: client_type,
                                    pay_type: pay_type,
                                    callback_param: callback_param
                                };
                            }
                        }
                    };

                    break;

                /**
                 * @api {get} purchaseSuccess 购买成功通知
                 * @apiName purchaseSuccess
                 * @apiDescription 安卓独有，购买成功通知
                * @apiParam {String} type 购买类型 vip=vip coin=金币 vm=钻石
                * @apiGroup Trade
                * @apiPermission jsbridge
                *
                */
                case 'purchaseSuccess':

                    switch (data.type) {
                        case 'vip':
                            return {
                                actionName: '',
                                data: {
                                    vip: 'ok',
                                    client_refresh: '1'
                                }
                            };

                        case 'coin':

                            return {
                                actionName: '',
                                data: {
                                    coin: 'ok'
                                }
                            };
                    }

                    break;

                /**
                * @api {get} refreshVipInfo 刷新vip信息
                * @apiName refreshVipInfo
                * @apiDescription 安卓独有，刷新vip信息
                * @apiGroup Trade
                * @apiPermission jsbridge
                *
                */

                case 'refreshVipInfo':
                    return {
                        actionName: '',
                        data: {
                            vip: 'ok',
                            client_refresh: '1'
                        }
                    };

                    break;

                /**
                 * @api {post} closeCurrentWebview 关闭当前客户端打开的webview
                * @apiName closeCurrentWebview
                * @apiGroup General
                * @apiDescription 关闭当前客户端打开的webview，可用于充值成功页面点击关闭按钮关闭当前webview
                */
                case 'closeCurrentWebview':
                    return {
                        actionName: 'rechargeCloseClick'
                    };

                case 'getLoginUserToken':
                    return {
                        actionName: 'appLogin',
                        callback: {
                            name: 'notify_app_login_success_new',
                            handler: function handler(login_param, client_param) {
                                return {
                                    token: login_param,
                                    clientInfo: client_param
                                };
                            }
                        }

                    };
                    break;

                /**
                * @api {get} openVip 开通vip
                * @apiName openVip
                * @apiDescription iOS独有，开通vip
                * @apiGroup Trade
                * @apiPermission jsbridge
                *
                */
                case 'openVip':

                    return {
                        actionName: 'pageRedirect',
                        data: {
                            path: 'comic/vip'
                        }
                    };
                    break;

                case 'pageRedirect':

                    return {
                        data: getPageRedirectData(data)
                    };
            }
        }
    }]);
    return APIComic;
}(APIAbstract);

var callHandler$$1 = function callHandler$$1(actionName, data, callback) {
    callHandler$1(APIComic, actionName, data, callback);
};

export { support, callHandler$$1 as callHandler, registerHandler, callHandler$4 as schemaCallHandler };
