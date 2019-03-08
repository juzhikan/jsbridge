/**
 * @api {get} hardRedirect 强制跳转
 * @apiName hardRedirect
 * @apiDescription 强制跳转，重新进入webview，相当于重新打开浏览器一样，免除了前进后退的问题
 * @apiGroup Util
 * @apiPermission jsbridge
 *
 * @apiParam {String} url 网址
 */

/**
 * @api {get} mediaPlay 播放媒体
 * @apiName mediaPlay
 * @apiDescription 播放媒体，媒体关闭时，客户端可以通过mediaClose事件主动通知js媒体已经被关闭了
 * 
 * registerHandler('mediaClose', functin() { console.log('ok, media is closed') });
 * 
 * // 记得清除事件
 * 
 * registerHandler('mediaClose', null);
 * 
 * @apiGroup Media
 * @apiPermission jsbridge
 *
 * @apiParam {String} url 网址
 * @apiParam {String} type 类型 video=视频 audio=音频
 * @apiParam {String} [title] 标题，音频时才需要
 *
 * @apiSuccess {Number} code 0为成功，其他为失败
 * @apiSuccess {String} [message] 可选，失败时的消息
 */

/**
 * @api {get} mediaClose 关闭当前播放媒体
 * @apiName mediaClose
 * @apiDescription 关闭当前播放媒体
 * @apiGroup Media
 * @apiPermission jsbridge
 *
 * @apiSuccess {Number} code 0为成功，其他为失败
 * @apiSuccess {String} [message] 可选，失败时的消息
 */


/**
* @api {get} refreshUserInfo 刷新用户信息
* @apiName refreshUserInfo
* @apiDescription 刷新用户信息
* @apiGroup Comic
* @apiPermission jsbridge
*
*/

/**
* @api {get} exchangeVmIntoCoin 钻石兑换金币
* @apiName exchangeVmIntoCoin
* @apiDescription 钻石兑换金币
* @apiParam {String} [required_count] 金币数，可选
* @apiGroup Comic
* @apiPermission jsbridge
*
*/

/**
* @api {get} openLoginView 打开登录页面
* @apiName openLoginView
* @apiDescription 打开登录页面
* @apiGroup PageNavagation
* @apiPermission jsbridge
* @apiVersion 0.0.2
*/

/**
* @api {get} sharePanelOpen 用户点击右上角打开分享浮层，客户端通知h5
* @apiName sharePanelOpen
* @apiDescription 用户点击右上角打开分享浮层，客户端通知h5
* @apiGroup General
* @apiPermission jsbridge
*
* @apiVersion 0.0.5
*/

/**
* @api {get} shareSuccess 分享完成，客户端通知h5
* @apiName shareSuccess
* @apiDescription 分享完成，客户端通知h5
* @apiGroup General
* @apiPermission jsbridge
* @apiSuccess {Number} code 0为成功，其他为失败
* @apiSuccess {String} [message] 可选，失败时的消息
* @apiSuccess {String} platform 分享平台
*
* @apiVersion 0.0.5
*/


/**
 * @api {get} savePictureAndShare 保存图片到本地并分享
 * @apiName savePictureAndShare
 * @apiGroup Util
 * @apiDescription 保存图片到本地并分享
 * @apiParam {String} text 分享到微博的文案
 * @apiParam {String} picurl 图片地址
 * @apiSuccess {Number} code 0为成功，其他为失败
 * @apiSuccess {String} [message] 可选，失败时的消息
 * @apiVersion 0.0.3
 */

/**
 * @api {post} hideHeader 隐藏客户端头部
 * @apiName hideHeader
 * @apiGroup Util
 * @apiDescription 隐藏客户端头部，iOS独有
 * @apiSuccess {Number} code 0为成功，其他为失败
 * @apiSuccess {String} [message] 可选，失败时的消息
 * @apiVersion 0.0.5
 */

/**
 * @api {get} getGender 
 * @apiName getGender
 * @apiGroup Util
 * @apiDescription 获取用户选择的是女频还是男频
 * @apiSuccess {Number} code 0为成功，其他为失败
 * @apiSuccess {String} [message] 可选，失败时的消息
 * @apiSuccess {Number} gender 性别
 * @apiVersion 0.0.6
 */