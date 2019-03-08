import APIAbstract, {callHandler as abstractCallHandler} from '../lib/abstract.js';
import {stringify} from '../lib/util';
import {registerHandler} from '../lib/bridge/jsbridge';
import {libSupport as bridgeSupport} from '../lib/bridge';
import objectAssign from 'object-assign';
import {callHandler as schemaCallHandler} from '../lib/bridge/schema';
import versionMap from './version_map';

export const support = (actionName) => {
    return bridgeSupport(actionName, versionMap);
}

const getAppVersion = () => {
    const userAgent = navigator.userAgent;

    if (!userAgent.match(/(iPhone|iPad)/) && !userAgent.match(/Android/)) {
        return false;
    }

    let clientVersionPatternArray = userAgent.match(/\bNeteaseComic\/([.0-9]+)\b/);

    if (!clientVersionPatternArray) {
        return false;
    }

    const clientVersionArray = clientVersionPatternArray[1].split('.');
    return {
        mainVersion: parseInt(clientVersionArray[0], 10),
        subVersion: parseInt(clientVersionArray[1], 10)
    }
};

const getShouldUseNewSchema = () => {
    var clientVersionObj = getAppVersion();

    if (!clientVersionObj) return false;

    if (clientVersionObj.mainVersion > 2 ||
        (clientVersionObj.mainVersion === 2 && clientVersionObj.subVersion >= 4)) {
        return true;
    }

    return false;
}

const getPageRedirectData = (data) => {
    const shouldUseNewSchema = getShouldUseNewSchema();

    let action;
    let a;
    let newSchemaQuery = {};
    let defaultQuery = {};

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


    const newSchemaPath = 'necomics://manhua.163.com/v1';

    newSchemaQuery.action = action;

    if (shouldUseNewSchema) {
        return {
            path: newSchemaPath,
            query: newSchemaQuery
        }
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
    callHandler('share', {
        platform,
        fromnative: fromnative ? 'true' : 'false'
    });
};

const setupShareSupport = () => {
    window.getShareContent = getShareContent
}

class APIComic extends APIAbstract {
    constructor() {
        super();
        this.schemaName_ = 'neteasecomic';
    }

    isInApp() {
        return navigator.userAgent.indexOf('NeteaseComic') !== -1;
    }

    getLegacyProtocolConfig(actionName, data) {
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
            }
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
                }
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
                    handler: (app_type, installed) => {
                        return {
                            app_type,
                            installed
                        };
                    }
                }
            }

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
                    handler: (client_type, pay_type, callback_param) => {
                        return {
                            client_type,
                            pay_type,
                            callback_param
                        };
                    }
                }
            }

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
                }


            case 'getLoginUserToken':
            return {
                actionName: 'appLogin',
                callback:
                    {
                        name: 'notify_app_login_success_new',
                        handler: (login_param, client_param) => {
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
                }
                break;


            case 'pageRedirect':

            return {
                data: getPageRedirectData(data)
            };
        }
    }
}

export const callHandler = (actionName, data, callback) => {
    abstractCallHandler(APIComic, actionName, data, callback);
}

export {registerHandler, schemaCallHandler}