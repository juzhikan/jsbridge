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

var callHandler$1 = function callHandler(actionName, data, callback) {
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

var callHandler$2 = function callHandler(actionName, data, callback, isInApp) {
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

var callHandler$$1 = isJsbridgeCapable ? callHandler$1 : callHandler$2;

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

        callHandler$$1(path, data.query, oCallback, isInApp, seperator);
    } else {
        var _path = APIInstance.getComputedUrl(actionName);

        callHandler$$1(_path, data, oCallback, isInApp, seperator);
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

    callHandler$$1(actionName, data, callback);
};

var doCallHandler = isJsbridgeCapable ? jsbridgeCallHandler : schemaCallHandler;

var callHandler$4 = function callHandler$$2(API, actionName) {
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
    sharePanelOpen: 5,
    getGender: 6
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
    callHandler$3('share', {
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

var callHandler$3 = function callHandler$$2(actionName, data, callback) {
    callHandler$4(APIComic, actionName, data, callback);
};

var map$1 = {
    share2: 2,
    setShareConfig2: 2,
    shareComplete: 2
};

var support$1 = function support(actionName) {
    return libSupport(actionName, map$1);
};

var APISnail = function (_APIAbstract) {
    inherits(APISnail, _APIAbstract);

    function APISnail() {
        classCallCheck(this, APISnail);

        var _this = possibleConstructorReturn(this, (APISnail.__proto__ || Object.getPrototypeOf(APISnail)).call(this));

        _this.schemaName_ = 'nesnailreader';
        return _this;
    }

    createClass(APISnail, [{
        key: 'isInApp',
        value: function isInApp() {
            return (/NeteaseSnailReader/i.test(window.navigator.userAgent)
            );
        }
    }, {
        key: 'getLegacyProtocolConfig',
        value: function getLegacyProtocolConfig(actionName, data) {
            switch (actionName) {

                /**
                 * @api {get} updateClient 跳转到对应的渠道下载最新版app
                 * @apiName updateClient
                 * @apiGroup General
                 */
                case 'updateClient':
                    break;

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
                * @apiParam (comic) {String} [text] 分享到微博的文字内容
                * @apiParam (comic) {String} [platform] 分享平台
                * @apiParam (snail) {String} [channel] 不传代表可以分享到目前所有支持的分享渠道，用逗号分隔的字符串‘wechatFriend,wechatTimeline,weibo’对应微信好友、微信朋友圈、微博
                *
                * @apiSuccess {Boolean} success 成功还是失败
                */

                case 'share':

                    data = objectAssign({}, {
                        url: data.link,
                        icon: data.picurl,
                        channel: data.channel,
                        description: data.description,
                        title: data.title
                    });

                    return {
                        actionName: 'share',
                        data: {
                            data: JSON.stringify(data)
                        },
                        callback: 'snailJS.shareComplete'

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
                        * @apiParam {String} [activity] 设置当前页的活动代号，用于特定活动的统计需求
                        * @apiParam (comic) {String} [text] 分享到微博的文字内容
                        * @apiParam (comic) {String} [platform] 分享平台
                        * @apiParam (comic) {String} [panel_title] 分享框的文案，默认文案是分享给朋友
                        * @apiParam (snail) {String} [channel] 不传代表可以分享到目前所有支持的分享渠道，用逗号分隔的字符串‘wechatFriend,wechatTimeline,weibo’对应微信好友、微信朋友圈、微博
                        *
                        */

                    };case 'setShareConfig':

                    data = objectAssign({}, {
                        url: data.link,
                        icon: data.picurl,
                        channel: data.channel,
                        description: data.description,
                        title: data.title,
                        activity: data.activity
                    });

                    return {
                        data: {
                            data: JSON.stringify(data)
                        }
                    };

                case 'getLoginUserToken':
                    return {
                        callback: {
                            name: 'snailJS.tokenCallBack',
                            handler: function handler(token) {
                                return {
                                    token: token
                                };
                            }
                        }
                    };

                case 'receiveLoginUserTokenSuccess':
                    break;

                case 'getUserInfo':
                    return {
                        callback: {
                            name: 'snailJS.userInfoCallBack',
                            handler: function handler(json) {
                                return JSON.parse(json);
                            }
                        }
                    };

                /**
                   * @api {post} receiveLoginUserTokenSuccess 成功收到token
                   * @apiDescription 成功收到token
                   * @apiName receiveLoginUserTokenSuccess
                   * @apiGroup General
                   * @apiPermission jsbridge
                   */

                case 'receiveLoginUserTokenSuccess':
                    return {};

                /**
                 * @api {get} purchase 购买
                 * @apiName purchase
                 * @apiGroup Trade
                 * @apiPermission jsbridge
                 *
                 * @apiParam (iOS) {Number} [itunesId] ios商品id，如果不传则打开商品选择页
                 * @apiParam (android) {Number} [goodId] 商品ID，如果不传则打开商品选择页
                 * @apiParam (android) {String} [goodName] 商品名称，随goodId出现
                 * @apiParam (android) {Number} [money] 对应商品的价格，随goodId出现
                 *
                 * @apiSuccess {Boolean} success 成功还是失败
                 *
                 * @apiSuccessExample Success-Response:
                 *     {
                 *       "success": true
                 *     }
                 *
                 * @apiError purchaseCancelled 用户取消购买
                 *
                 * @apiErrorExample Error-Response:
                 *     null
                 */
                case 'purchase':
                    return {
                        callback: 'snailJS.purchaseCallBack'
                    };
            }
        }
    }]);
    return APISnail;
}(APIAbstract);

var callHandler$5 = function callHandler$$2(actionName, data, callback) {
    //新接口兼容老版本
    switch (actionName) {
        case 'share2':
            if (!support$1('share2')) {
                data = objectAssign({}, {
                    url: data.default.url,
                    icon: data.default.image,
                    channel: data.channel || '',
                    description: data.default.description,
                    title: data.default.title,
                    activity: data.activity
                });
                actionName = 'share';
            }
            break;

        case 'setShareConfig2':
            if (!support$1('setShareConfig2')) {
                data = objectAssign({}, {
                    url: data.default.url,
                    icon: data.default.image,
                    channel: data.channel,
                    description: data.default.description,
                    title: data.default.title,
                    activity: data.activity
                });
                actionName = 'setShareConfig';
            }
            break;
    }
    callHandler$4(APISnail, actionName, data, callback);
};

var registerHandler$1 = function registerHandler$$1(actionName, callback) {
    //新接口兼容老版本
    switch (actionName) {
        case 'shareComplete':
            if (!support$1('shareComplete')) {
                window.snailJS = window.snailJS || {};
                snailJS.shareComplete = function (result) {
                    var json = {
                        result: result
                    };
                    callback(json);
                };
                return;
            }
            break;
    }
    registerHandler(actionName, callback);
};

var USER_AGENT = navigator.userAgent;





function isYueduApp() {
  return USER_AGENT.indexOf('PRIS') != -1;
}



function ios() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

var map$2 = {
    shareComplete: 1,
    bindMobileComplete: 1,
    commentClientComplete: 1
};

var NEREADER_ACTION_MAP = {
    'recharge': 1,
    'trade': 2,
    'packagebuy': 3,
    'audio': 4,
    'bookshelf': 5,
    'mobileBind': 6,
    'rank': 7,
    'bookstore': 8,
    'category': 9,
    'package': 10 //包月详情
};

var isInternal = isYueduApp();

var support$2 = function support(actionName) {
    return libSupport(actionName, map$2);
};

var getPageRedirectData$1 = function getPageRedirectData(data) {
    var newSchemaQuery = {};
    var newSchemaPath = data.path;

    if (NEREADER_ACTION_MAP[data.path]) {
        /**
         * @api {get} nereader方式跳转客户端页面
         * @apiName recharge(充值)、trade(购买)、packagebuy(打包购详情)、audio(听书详情)、bookshelf(书架)、mobileBind(手机号绑定页)、
         * rank(排行榜)、bookstore(书城)、category(分类)、package(包月详情)
         * @apiDescription 具体见通信协议定义
         * @apiGroup (#General:pageRedirect)
         * @apiPermission all
         *
         */
        newSchemaQuery = objectAssign({}, data.query, {
            action: NEREADER_ACTION_MAP[data.path],
            out: ~~!isInternal //out: 1 外部浏览器; 0 内嵌页
        });
        newSchemaPath = 'nereader://yuedu.163.com/v1';
        return {
            path: newSchemaPath,
            query: newSchemaQuery,
            seperator: '?'
        };
    }

    switch (data.path) {
        /**
         * @api {get} getbookdetail/detail 跳转书籍详情页
         * @apiName getbookdetail/detail
         * @apiDescription 兼容getbookdetail和detail两种方式
         * @apiGroup (#General:pageRedirect)
         * @apiPermission all
         *
         * @apiParam {String} entryid 书籍id，字段也兼容id
         */
        case 'detail':
        case 'getbookdetail':
            newSchemaPath = 'getbookdetail';
            newSchemaQuery.entryid = data.query.entryid || data.query.id;
            if (!isInternal) {
                newSchemaPath = 'neteasereaderuri://';
                newSchemaQuery.type = 2;
            }
            break;

        /**
         * @api {get} webview 跳转首页
         * @apiName webview
         * @apiGroup (#General:pageRedirect)
         * @apiPermission all
         *
         */
        case 'webview':
            newSchemaPath = 'neteasereaderuri://';
            newSchemaQuery.type = 6;
            break;

        /**
         * @api {get} getarticledetail/news 跳转资讯详情页
         * @apiName getarticledetail/news
         * @apiDescription 兼容getarticledetail和news两种方式
         * @apiGroup (#General:pageRedirect)
         * @apiPermission all
         *
         * @apiParam {String} entryid 资讯文章id，字段也兼容cid
         */
        case 'news':
        case 'getarticledetail':
            newSchemaQuery.entryid = data.query.entryid || data.query.cid;
            if (isInternal) {
                newSchemaPath = 'getarticledetail';
                newSchemaQuery.url = 'http://easyread.ph.126.net/3cEFkZeOrGqi_l66u7mP9g==/8796093023568626976.zip';
            } else {
                newSchemaPath = 'neteasereaderuri://';
                newSchemaQuery.type = 0;
                newSchemaQuery.temurl = 'http://easyread.ph.126.net/3cEFkZeOrGqi_l66u7mP9g==/8796093023568626976.zip';
            }
            var result = [];
            for (var i in newSchemaQuery) {
                if (newSchemaQuery.hasOwnProperty(i)) {
                    result.push(i + '=' + newSchemaQuery[i]);
                }
            }
            newSchemaQuery = result.join('&');
            break;

        /**
         * @api {get} baoyue 跳转包月详情页
         * @apiName baoyue
         * @apiGroup (#General:pageRedirect)
         * @apiPermission all
         *
         * @apiParam {String} entryid 包月id，字段也兼容id
         */
        case 'baoyue':
            newSchemaPath = 'neteasereaderuri://';
            newSchemaQuery.type = 4;
            newSchemaQuery.entryid = data.query.entryid || data.query.id;
            break;

        /**
         * @api {get} shelf 跳转书架
         * @apiName shelf
         * @apiGroup (#General:pageRedirect)
         * @apiPermission all
         *
         */
        case 'shelf':
            newSchemaPath = 'neteasereaderuri://';
            newSchemaQuery.type = 7;
            break;

        /**
         * @api {get} viewProfile 打开客户端个人主页
         * @apiName viewProfile
         * @apiGroup (#General:pageRedirect)
         * @apiPermission all
         *
         * @apiParam {String} uid 用户id   （匿名传0）
         * @apiParam {String} nickname 用户昵称 (匿名传评论昵称)
         */
        case 'viewProfile':
        /**
         * @api {get} getchat 登录状态下发送私信
         * @apiName getchat
         * @apiDescription 在登录状态下，官网传递发送私信请求给客户端，调起私信，同时，传递反馈分类标签
         * @apiGroup (#General:pageRedirect)
         * @apiPermission all
         *
         * @apiParam {String} userId 阅读小知的id
         * @apiParam {String} nickname 阅读小知的昵称
         * @apiParam {String} tag 反馈所属类别
         */
        case 'getchat':
        /**
         * @api {get} gotofeedback 未登录状态下调起反馈意见页面
         * @apiName gotofeedback
         * @apiDescription 在游客情况下使用，发送私信请求给客户端，调起反馈意见页面
         * @apiGroup (#General:pageRedirect)
         * @apiPermission all
         *
         * @apiParam {String} userId 阅读小知的id
         * @apiParam {String} nickname 阅读小知的昵称
         * @apiParam {String} tag 反馈所属类别
         */
        case 'gotofeedback':
            newSchemaQuery = {
                data: JSON.stringify(data.query)
            };
            break;

        /**
         * @api {get} gethtmlclick 升级客户端或者用于客户端内跳转
         * @apiName gethtmlclick
         * @apiDescription 1. 升级客户端web:gethtmlclick;encodeURIComponent('http://yuedu.163.com/download');
         * 2. 客户端内跳转，后面加上neteasereaderuri://xxx, 示例web:gethtmlclick;neteasereaderuri://type=2&entryid=a2a4841d50e04a31a6185becd23ff999_4
         * @apiGroup (#General:pageRedirect)
         * @apiPermission all
         */
        case 'gethtmlclick':
            newSchemaQuery = data.query.url;
            break;

        default:
            newSchemaQuery = data.query;
            break;
    }

    if (newSchemaPath.indexOf('neteasereaderuri') > -1) {
        if (isInternal) {
            newSchemaPath = 'web:gethtmlclick;' + newSchemaPath;
        }
        return {
            path: newSchemaPath,
            query: newSchemaQuery,
            seperator: ''
        };
    }

    return {
        path: newSchemaPath,
        query: newSchemaQuery
    };
};

var APIRead = function (_APIAbstract) {
    inherits(APIRead, _APIAbstract);

    function APIRead() {
        classCallCheck(this, APIRead);

        var _this = possibleConstructorReturn(this, (APIRead.__proto__ || Object.getPrototypeOf(APIRead)).call(this));

        _this.schemaName_ = 'web';
        return _this;
    }

    createClass(APIRead, [{
        key: 'isInApp',
        value: function isInApp() {
            return window.navigator.userAgent.toLocaleLowerCase().indexOf('pris') > 0;
        }

        /**
         * 通常情况下
         * @return {
         *  actionName: 对应的schema协议
         *  data: json或者string格式,json格式的后期会拼接成字符串(stringify)，string的直接使用
         *  callback: 定义schema协议对应的回调函数
         * }
         * 'pageRedirect'时 拼接path、query、seperator
         * @return {
         *   path: 协议path
         *   query: json或者string格式,json格式的后期会拼接成字符串(stringify)，string的直接使用
         *   seperator: 默认值';'
         * }
         */

    }, {
        key: 'getLegacyProtocolConfig',
        value: function getLegacyProtocolConfig(actionName, data) {
            switch (actionName) {
                /**
                * @api {post} share 唤起客户端分享模块
                * @apiName share
                * @apiGroup General
                * @apiDescription 唤起客户端分享模块，直接分享到对应的平台
                *
                * @apiParam {String} title 分享内容的标题 或 分享到微博的文字内容(仅限snail)
                * @apiParam {String} description 分享内容的描述
                * @apiParam {String} picurl 分享的缩略图url
                * @apiParam {String} link 分享内容的跳转url
                * @apiParam {String} [activity] 设置当前页的活动代号，用于特定活动的统计需求
                * @apiParam (yuedu) {String} [channel] 不传代表可以分享到目前所有支持的分享渠道，格式为channel:"['_share_weixin','_share_weixinquan','_share_yixin','_share_yixinquan','_share_tsina','_share_qqfriend','_share_qzone','_share_ttengxun','_share_alipay']"
                * @apiParam (yuedu) {String} [topicId] 统计相关，分享内容id(专题id)
                * @apiParam (comic) {String} [text] 分享到微博的文字内容
                * @apiParam (comic) {String} [platform] 分享平台
                * @apiParam (comic) {String} [panel_title] 分享框的文案，默认文案是分享给朋友
                * @apiParam (snail) {String} [channel] 不传代表可以分享到目前所有支持的分享渠道，用逗号分隔的字符串‘wechatFriend,wechatTimeline,weibo’对应微信好友、微信朋友圈、微博
                *
                */
                case 'share':
                    var topicIdConfig = data.topicId ? { topicId: data.topicId } : {};
                    data = objectAssign({}, topicIdConfig, {
                        activityId: data.activity,
                        url: data.link,
                        pics: data.picurl,
                        summary: data.description,
                        title: data.title,
                        shareType: '1',
                        moduleType: data.channel || "['_share_weixin','_share_weixinquan','_share_yixin','_share_yixinquan','_share_tsina','_share_qqfriend','_share_qzone','_share_ttengxun','_share_alipay']",
                        data: { "activityId": data.activity }
                    });
                    return {
                        actionName: 'getclientsharemodule',
                        data: {
                            data: JSON.stringify(data)
                        }
                    };
                    break;

                /**
                * @api {post} setShareConfig 设置右上角分享
                * @apiName setShareConfig
                * @apiGroup General
                * @apiDescription 设置分享参数后，客户端右上角显示分享
                *
                * @apiParam {String} title 分享内容的标题 或 分享到微博的文字内容(仅限snail)
                * @apiParam {String} description 分享内容的描述
                * @apiParam {String} picurl 分享的缩略图url
                * @apiParam {String} link 分享内容的跳转url
                * @apiParam {String} [activity] 设置当前页的活动代号，用于特定活动的统计需求
                * @apiParam (yuedu) {String} [channel] 不传代表可以分享到目前所有支持的分享渠道，格式为channel:"['_share_weixin','_share_weixinquan','_share_yixin','_share_yixinquan','_share_tsina','_share_qqfriend','_share_qzone','_share_ttengxun','_share_alipay']"
                * @apiParam (yuedu) {String} [topicId] 统计相关，分享内容id(专题id)
                * @apiParam (comic) {String} [text] 分享到微博的文字内容
                * @apiParam (comic) {String} [platform] 分享平台
                * @apiParam (comic) {String} [panel_title] 分享框的文案，默认文案是分享给朋友
                * @apiParam (snail) {String} [channel] 不传代表可以分享到目前所有支持的分享渠道，用逗号分隔的字符串‘wechatFriend,wechatTimeline,weibo’对应微信好友、微信朋友圈、微博
                *
                */
                case 'setShareConfig':
                    topicIdConfig = data.topicId ? { topicId: data.topicId } : {};
                    data = objectAssign({}, topicIdConfig, {
                        activityId: data.activity,
                        url: data.link,
                        pics: data.picurl,
                        summary: data.description,
                        title: data.title,
                        shareType: '1',
                        moduleType: data.channel || "['_share_weixin','_share_weixinquan','_share_yixin','_share_yixinquan','_share_tsina','_share_qqfriend','_share_qzone','_share_ttengxun','_share_alipay']",
                        data: { "activityId": data.activity }
                    });
                    return {
                        actionName: 'setSharePage',
                        data: {
                            data: JSON.stringify(data)
                        }
                    };
                    break;

                case 'getLoginUserToken':
                    return {
                        callback: {
                            name: 'active.tokenCallBack',
                            handler: function handler(data) {
                                if (data == "") {
                                    return { keys: "", atype: "", userName: "" };
                                }
                                return JSON.parse(decodeURIComponent(data));
                            }
                        }
                    };
                    break;

                /**
                 * @api {get} getQuickSignStatus 获取快速签到按钮开关的状态
                 * @apiName getQuickSignStatus
                 * @apiGroup Sign
                 * @apiPermission all
                 *
                 * @apiSuccess {Number} status 整型，如果用户打开快速签到入口开关，则为1，反之为0
                 */
                case 'getQuickSignStatus':
                    return {
                        callback: {
                            name: 'pris.getQuickSignCallBack',
                            handler: function handler(status) {
                                return { status: status };
                            }
                        }

                        /**
                         * @api {get} requestRegControl 获取签到提醒开关状态
                         * @apiName requestRegControl
                         * @apiGroup Sign
                         * @apiPermission all
                         *
                         * @apiSuccess {Number} status 整型，如果用户打开了提醒，则为1，反之为0
                         */
                    };case 'requestRegControl':
                    return {
                        callback: {
                            name: 'pris.setRegControl',
                            handler: function handler(status) {
                                return { status: status };
                            }
                        }

                        /**
                         * @api {get} getclientinfo 获取客户端信息
                         * @apiName getclientinfo
                         * @apiGroup General
                         * @apiPermission all
                         */
                    };case 'getclientinfo':
                    return {
                        callback: {
                            name: 'pris.setclientinfo',
                            handler: function handler(data) {
                                return JSON.parse(decodeURIComponent(data));
                            }
                        }
                    };
                    break;

                /**
                 * @api {get} updateClientUI 更新IOS应用UI
                 * @apiName updateClientUI
                 * @apiGroup General
                 * @apiDescription 通过参数去更新IOS应用的UI，如页面title和是否显示关闭按钮
                 * @apiPermission all
                 *
                 * @apiParam {String} type 更新UI的类型，包含title、showCloseButton、showSafariOpen等
                 * @apiParam {String} data 设置对应的具体数据：客户端title、'no'、'no'
                 */
                case 'updateClientUI':
                    return {
                        data: {
                            data: JSON.stringify(data)
                        }
                    };
                    break;

                /**
                 * @api {post} changeDocumentTitle 更改文档标题 
                 * @apiName changeDocumentTitle
                 * @apiGroup General
                 * @apiDescription 更改文档标题，对应schema：安卓里面的web:setTitle;data=xxx，IOS里面的web:updateClientUI;data=xxx
                 * @apiPermission all
                 *
                 * @apiParam {String} title 标题
                 * @apiSuccess {Number} code 0为成功，其他为失败
                 * @apiSuccess {String} [message] 可选，失败时的消息
                 * @apiVersion 0.0.5
                 */
                case 'changeDocumentTitle':
                    if (ios()) {
                        return {
                            actionName: 'updateClientUI',
                            data: {
                                data: JSON.stringify({ type: 'title', data: data.title })
                            }
                        };
                    }

                    return {
                        actionName: 'setTitle',
                        data: {
                            data: JSON.stringify(data)
                        }
                    };
                    break;
                /**
                 * @api {post} closeCurrentWebview 关闭当前客户端打开的webview
                * @apiName closeCurrentWebview
                * @apiGroup General
                * @apiDescription 关闭当前客户端打开的webview，可用于充值成功后关闭当前webview页，对应于web:closeCurrentPage
                * @apiPermission all
                */
                case 'closeCurrentWebview':
                    return {
                        actionName: 'closeCurrentPage'
                    };
                    break;
                /**
                 * @api {post} wapChannel wap端向客户端调用请求通道接口
                * @apiName wapChannel
                * @apiGroup Util
                * @apiDescription wap端向客户端调用请求通道接口
                * @apiPermission all
                *
                * @apiParam {String} action 请求的类型，需要与后台约定好请求操作的类型值
                * @apiParam {json} [data] 请求数据，可以是json格式(data:{"userId": "67335423034"})也可以是string(如data: "dailySign")
                *
                * @apiSuccess {String} action 请求类型
                * @apiSuccess {json} response 后台返回的响应结果（schema方式获取后要decode处理）
                */
                case 'wapChannel':
                    return {
                        data: {
                            action: data.action,
                            data: typeof data.data == 'string' ? data.data : JSON.stringify(data.data || {})
                        },
                        callback: {
                            name: 'pris.wapChannelCallback',
                            handler: function handler(action, response) {
                                return {
                                    action: action,
                                    response: JSON.parse(decodeURIComponent(response))
                                };
                            }
                        }
                    };
                    break;
                /**
                 * @api {post} getRecharge 调起苹果支付。目前只有ios 5版本以上适用
                * @apiName getRecharge
                * @apiGroup General
                * @apiPermission all
                *
                * @apiSuccess {Number} rechargeResult 如果为大于0的整数，表示充值成功，该整数值为充值金额;为0表示充值失败
                * @apiSuccess {String} rechargeId  rechargeId为协议返回的本次充值成功的rechargeId，充值失败时返回""
                */
                case 'getRecharge':
                    return {
                        callback: {
                            name: 'pris.updateRechargeStatus',
                            handler: function handler(rechargeResult, rechargeId) {
                                return {
                                    rechargeResult: rechargeResult,
                                    rechargeId: rechargeId || ''
                                };
                            }
                        }
                    };
                    break;

                /**
                * @api {get} setRegResult 签到成功通知客户端
                * @apiName setRegResult
                * @apiGroup Sign
                * @apiPermission all
                *
                * @apiParam (570版本前) {Number} res 签到结果， 1为成功，0为失败
                * @apiParam (570版本前) {String} propmt 提示文案，不能为空
                * @apiParam (570版本前) {String} advertUrl 广告图片，可为空
                * @apiParam (570版本及以后) {String} propmt 提示文案，不能为空
                * @apiParam (570版本及以后) {String} advertUrl 广告图片，可为空
                * @apiParam (570版本及以后) {Number} count 签到获得的红包数
                * @apiParam (570版本及以后) {Json} module Json格式 {list:[,,], hint:'标题', module:59}
                */
                case 'setRegResult':
                    if (data.module) {
                        return {
                            data: {
                                data: JSON.stringify(data)
                            }
                        };
                    }
                    break;

                /**
                * @api {post} doTradeSuccess 书籍或章节购买成功
                * @apiDescription 书籍或章节购买成功
                * @apiName doTradeSuccess
                * @apiGroup Notice
                * @apiPermission all
                *
                * @apiParam {String} bookId 书籍id
                * @apiParam {String} chapterIds 多个章节以逗号分隔
                * @apiParam {String} [type] 购买成功方式，type=baoyue表示书籍已包月
                */
                case 'doTradeSuccess':
                    //schema要求的格式：web:doTradeSuccess;bookId=cf3587af574a4056a798878f59fa1b60_4;chapterIds=4acd95d7b3c34b9dabe33062ba30721d_4,5529eab97e5d4a60b0081b8140a1c03b_4
                    var result = [];
                    for (var i in data) {
                        if (data.hasOwnProperty(i)) {
                            result.push(i + '=' + data[i]);
                        }
                    }
                    return {
                        data: result.join(';')
                    };
                    break;

                case 'noticeStats':
                    var result = [];
                    for (var i in data) {
                        if (data.hasOwnProperty(i)) {
                            result.push(i + '=' + data[i]);
                        }
                    }
                    return {
                        data: result.join('&')
                    };
                    break;

                case 'pageRedirect':
                    return {
                        data: getPageRedirectData$1(data)
                    };
                    break;
            }
        }
    }, {
        key: 'getComputedUrl',
        value: function getComputedUrl(path) {
            if (/[\w0-9]+:\/\//.test(path)) {
                return path;
            }

            return this.schemaName_ + ':' + path;
        }
    }]);
    return APIRead;
}(APIAbstract);

var callHandler$6 = function callHandler$$2(actionName, data, callback) {
    callHandler$4(APIRead, actionName, data, callback, ';');
};

/**
 * 获取某个API对应的schema url，例如schemaGetter('pageRedirect', {path: 'recharge'}) 会返回'nereader://yuedu.163.com/v1?action=1&out=0'
 * @param  {string}   actionName    API名字，同callHandler
 * @param  {json}     data          json格式参数，同callHandler
 * @return {string}                 返回生成的schema url
 */
var APIInstance$1 = void 0;
var schemaGetter = function schemaGetter(actionName, data) {
    APIInstance$1 = APIInstance$1 || new APIRead();
    var seperator = ';';
    var obj = APIInstance$1.getLegacyProtocolConfig(actionName, data) || {};
    actionName = obj.actionName || actionName;
    data = obj.data || data;
    if (data.seperator !== undefined) {
        seperator = data.seperator;
    }
    if (actionName == 'pageRedirect') {
        actionName = data.path;
        data = data.query;
    }
    var path = APIInstance$1.getComputedUrl(actionName);

    return path + seperator + stringify(data);
};

var registerHandler$2 = function registerHandler$$1(actionName, callback) {
    switch (actionName) {
        //新接口兼容老版本
        /**
        * @api {get} shareComplete 分享完成，客户端通知h5
        * @apiName shareComplete
        * @apiDescription 客户端完成右上角分享后，通知h5分享结果
        * @apiGroup registerHandler
        * @apiPermission jsbridge
        * @apiParam {Number} code 0为成功，其他为失败
        * @apiParam {String} [message] 可选，失败时的消息
        * @apiParam {String} platform 分享平台
        *
        *
        */
        case 'shareComplete':
            if (!support$2('shareComplete')) {
                window.active = window.active || {};
                active.shareCompleted = function (result) {
                    var ua = navigator.userAgent.toLowerCase();
                    var isAndroid = ua.indexOf("android") > -1;
                    if (isAndroid) {
                        //安卓失败不会回调，故只要回调就是成功
                        callback({ code: 0 });
                    } else {
                        callback(JSON.parse(decodeURIComponent(result)));
                    }
                };
                return;
            }
            break;

        /**
         * @api {get} commentClientComplete 通知h5评价完成
         * @apiName commentClientComplete
         * @apiDescription 调起评价客户端后，跳转回到客户端，客户端通知h5页面评价完成
         * @apiGroup registerHandler
         * @apiPermission jsbridge
         *
         */
        case 'commentClientComplete':
            if (!support$2('commentClientComplete')) {
                window.active = window.active || {};
                active.commentClientCallback = function () {
                    callback();
                };
                return;
            }
            break;

        /**
          * @api {get} bindMobileComplete 通知h5手机号绑定成功
          * @apiName bindMobileComplete
          * @apiDescription 通知h5手机号绑定成功
          * @apiGroup registerHandler
          * @apiPermission jsbridge
          *
          * @apiParam {Number} code 0: 绑定成功
          *
          */
        case 'bindMobileComplete':
            if (!support$2('bindMobileComplete')) {
                window.active = window.active || {};
                active.bindMobileCallback = function (result) {
                    callback(JSON.parse(decodeURIComponent(result)));
                };
                return;
            }
            break;
    }
    registerHandler(actionName, callback);
};

export { isJsbridgeCapable, callHandler$3 as comicCallHandler, registerHandler as comicRegisterHandler, support as comicSupport, callHandler$5 as snailCallHandler, registerHandler$1 as snailRegisterHandler, support$1 as snailSupport, callHandler$6 as readCallHandler, registerHandler$2 as readRegisterHandler, support$2 as readSupport, schemaGetter as readSchemaGetter, callHandler$2 as schemaCallHandler };
