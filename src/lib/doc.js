/**
 * @api {get} updateClient 下载
 * @apiName updateClient
 * @apiGroup General
 * @apiDescription 跳转到对应的渠道下载最新版app<br>
 * iOS： App Store<br>
 * Android：对应的下载渠道
 */

 /**
  * @api {get} getUserInfo 用户信息
  * @apiName getUserInfo
  * @apiGroup General
  * @apiPermission jsbridge
  *
  * @apiSuccess {String} firstname Firstname of the User.
  * @apiSuccess {String} lastname  Lastname of the User.
  *
  * @apiSuccessExample Success-Response:
  *     {
  *       "firstname": "John",
  *       "lastname": "Doe"
  *     }
  *
  * @apiError getUserInfoError 登录信息错误
  *
  * @apiErrorExample Error-Response:
  *     null
  */


  /**
   * @api {get} webview 打开webview
   * @apiName webview
   * @apiGroup General
   * @apiDeprecated use now (#General:pageRedirect).
   * @apiDescription webview，为保证消息长度不超标，url最好做短链处理，iOS universal link最好支持该接口
   *
   * @apiSuccess {String} url 打开的链接地址
   * @apiSuccess {Boolean} [inside=false] 默认不允许webview和native交互，除非inside=true
   * 对于inside=true的情况，应用需要判断url的域名是否在可信任名单内，可信任名单写死或者在/extra/init.json接口中返回，由具体应用决定；除蜗牛外其他应用的旧版本不支持该字段。
   * @apiSuccess {Boolean} [auth=false] 漫画免登陆，漫画的登录这块后面还需改造，所以暂时待定
   * @apiSuccess {String} [title] 打开的页面标题，除漫画外其他应用的旧版本不支持该字段
   */

   /**
    * @api {get} getLoginUserToken 获取当前登录的token
    * @apiName getLoginUserToken
    * @apiGroup General
    * @apiDescription 获取当前登录的token，注意打开登录页用户登录成功也是需要回调的
    *
    * @apiParam {Boolean} needClientLogin 是否需要在未登录的情况下强制打开登陆页
    * @apiSuccess {String} [token] 如果未登录，则token不传
    * @apiSuccess (comic) {String} clientInfo 如果设备信息
    * @apiError loginCancelled 用户取消登录
    *
    * @apiErrorExample Error-Response:
    *     {code: -2}
    * 
    */


 /**
  * @api {post} closeCurrentWebview 关闭当前客户端打开的webview
  * @apiName closeCurrentWebview
  * @apiGroup General
  * @apiDescription 关闭当前客户端打开的webview，可用于扫码登录失败(二维码过期等情形)时关闭当前webview以便用户重新扫码
  */


    /**
    * @api {get} pageRedirect h5跳转应用内页面
    * @apiName pageRedirect
    * @apiDescription h5跳转应用内页面
    * @apiGroup General
    * @apiPermission jsbridge和schema
    *
    * @apiParam (前端人员适用) {String} path h5跳转应用内页面
    * @apiParam (前端人员适用) {Object} query h5跳转应用内页面参数
    * @apiParam (客户端适用) {String} actionUrl 完整schema url
    *
    * @apiExample {javascript} Example usage:
  callHandler('pageRedirect', {
      path: 'privatemsg',
      query: {
          useruuid: '12'
      }
  })

  
  // !!客户端注意!!，这个接口会在调用jsbridge时会做参数转换


  callHandler('pageRedirect', {
      actionUrl: 'nesnailreader://privatemsg?useruuid=12'
  })
    */

/**
 * @api {post} changeDocumentTitle 更改文档标题 
 * @apiName changeDocumentTitle
 * @apiGroup General
 * @apiDescription 更改文档标题
 * @apiParam {String} title 标题
 * @apiSuccess {Number} code 0为成功，其他为失败
 * @apiSuccess {String} [message] 可选，失败时的消息
 * @apiVersion 0.0.5
 */

/**
 * @api {get} openThirdPartyApp 打开第三方App
 * @apiName openThirdPartyApp
 * @apiGroup General
 * @apiDescription 打开第三方App
 * @apiParam {String} schemaUrl schema地址
 * @apiSuccess {Number} code 0为成功，-1为没装应用，其他为失败
 * @apiSuccess {String} [message] 可选，失败时的消息
 * @apiVersion 0.0.5
 */

/**
 * @api {get} openImagePickerDialog 打开图片选择框
 * @apiName openImagePickerDialog
 * @apiGroup General
 * @apiDescription 打开图片选择框
 * @apiSuccess {Number} code 0为成功，-1为取消，其他为失败
 * @apiSuccess {String} [message] 可选，失败时的消息
 * @apiSuccess {String} data 图片Base64 String
 * @apiVersion 0.0.4
 */