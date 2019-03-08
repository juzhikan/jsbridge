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

var registerHandler$1 = function registerHandler(actionName, callback) {
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
    share2: 2,
    setShareConfig2: 2,
    shareComplete: 2
};

var support = function support(actionName) {
    return libSupport(actionName, map);
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

var callHandler$$1 = function callHandler$$1(actionName, data, callback) {
    //新接口兼容老版本
    switch (actionName) {
        case 'share2':
            if (!support('share2')) {
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
            if (!support('setShareConfig2')) {
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
    callHandler$1(APISnail, actionName, data, callback);
};

var registerHandler$$1 = function registerHandler$$1(actionName, callback) {
    //新接口兼容老版本
    switch (actionName) {
        case 'shareComplete':
            if (!support('shareComplete')) {
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
    registerHandler$1(actionName, callback);
};

export { support, callHandler$$1 as callHandler, registerHandler$$1 as registerHandler, callHandler$4 as schemaCallHandler };
