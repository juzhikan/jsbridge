import APIAbstract, {callHandler as abstractCallHandler} from '../lib/abstract.js';
import {registerHandler as libRegisterHandler} from '../lib/bridge/jsbridge';
import objectAssign from 'object-assign';
import {callHandler as schemaCallHandler} from '../lib/bridge/schema';
import {libSupport as bridgeSupport} from '../lib/bridge';


import versionMap from './version_map';

export const support = (actionName) => {
    return bridgeSupport(actionName, versionMap);
}

class APISnail extends APIAbstract {
    constructor() {
        super();
        this.schemaName_ = 'nesnailreader';
    }

    isInApp() {
        return /NeteaseSnailReader/i.test(window.navigator.userAgent);
    }

    getLegacyProtocolConfig(actionName, data) {
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
            }

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

            case 'setShareConfig':

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
                    handler: (token) => {
                        return {
                            token
                        }
                    }
                }
            };

            case 'receiveLoginUserTokenSuccess':
            break;

            case 'getUserInfo':
            return {
                callback: {
                    name: 'snailJS.userInfoCallBack',
                    handler: (json) => {
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
                return {
                };


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
}

export const callHandler = (actionName, data, callback) => {
    //新接口兼容老版本
    switch (actionName) {
        case 'share2':
        if (!support('share2')){
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
    abstractCallHandler(APISnail, actionName, data, callback);
}

export const registerHandler = (actionName, callback) => {
    //新接口兼容老版本
    switch (actionName) {
        case 'shareComplete':
        if (!support('shareComplete')) {
            window.snailJS = window.snailJS || {};
            snailJS.shareComplete = (result) => {
                let json = {
                    result: result
                }
                callback(json);
            };
            return;
        }
        break;
    }
    libRegisterHandler(actionName, callback);
}

export {schemaCallHandler}