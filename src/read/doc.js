  /**
   * @api {get} setQuickSignStatus 快速签到入口开关
   * @apiName setQuickSignStatus
   * @apiGroup Sign
   * @apiPermission all
   *
   * @apiParam {Boolean} data 打开快速签到true，关闭快速签到false
   */

  /**
   * @api {get} setRegControl 签到提醒开关，选择打开或关闭签到提醒
   * @apiName setRegControl
   * @apiGroup Sign
   * @apiPermission all
   *
   * @apiParam {Number} reg 打开签到提醒1，关闭签到提醒0
   * @apiParam {Number} time 签到提醒时设置了time=72000
   */

 /**
   * @api {get} reload 重新加载当前客户端打开的webview
   * @apiName reload
   * @apiGroup Util
   * @apiDescription 重新加载当前客户端打开的webview
   * @apiPermission android
   */

  /**
  * @api {get} saveImage 保存图片到相册
  * @apiName saveImage
  * @apiDescription 保存图片到相册
  * @apiGroup Util
  * @apiPermission all
  *
  * @apiParam {Number} url 图片url地址
  * @apiSuccess {Number} code 0为成功，其他为失败
  * @apiSuccess {String} [message] 可选，失败时的消息
  */

 /**
  * @api {post} receiveLoginUserTokenSuccess 成功收到token
  * @apiDescription 成功收到token
  * @apiName receiveLoginUserTokenSuccess
  * @apiGroup General
  * @apiPermission android
  */

  /**
  * @api {get} noticeStats 通知客户端记录统计信息
  * @apiName noticeStats
  * @apiDescription 通知客户端记录统计信息(签到统计)
  * @apiGroup General
  * @apiPermission all
  *
  * @apiParam {String} activity 活动名称
  * @apiParam {String} [position] 可选，触发统计操作的位置
  * @apiParam {String} [data] 可选，该统计操作的附加内容，例如开关的打开/关闭
  */

 /**
  * @api {post} doTradeBaoYueSuccess 包月订购成功
  * @apiDescription 包月订购成功
  * @apiName doTradeBaoYueSuccess
  * @apiGroup Notice
  * @apiPermission all
  *
  * @apiParam {String} id 包的id
  */

    /**
   * @api {get} getbookcomment 跳转书籍评论页
   * @apiName getbookcomment
   * @apiGroup (#General:pageRedirect)
   * @apiPermission all
   *
   * @apiParam {String} entryid 书籍id
   */

    /**
   * @api {get} getbookreward 跳转书籍打赏页
   * @apiName getbookreward
   * @apiGroup (#General:pageRedirect)
   * @apiPermission all
   *
   * @apiParam {String} entryid 书籍id
   */
    /**
   * @api {get} getdaysign 跳转到签到页面
   * @apiName getdaysign
   * @apiGroup (#General:pageRedirect)
   * @apiPermission all
   *
   */

    /**
   * @api {get} commentClient 评价云阅读
   * @apiName commentClient
   * @apiDescription 调起客户端的'评价云阅读'，分别跳转APP Store和安卓应用市场;
   * @apiGroup General
   * @apiPermission all
   *
   */

  /**
   * @api {get} setAutoBuy 设置自动购买
   * @apiName setAutoBuy
   * @apiDescription 设置是否自动购买下一章
   * @apiGroup General
   * @apiPermission all
   *
   * @apiParam {Boolean} isAutoBuy true/false
   */
  
    /**
   * @api {get} openNewPage 打开新的h5页面
   * @apiName openNewPage
   * @apiDescription 在安卓客户端内新开h5页
   * @apiGroup General
   * @apiPermission all
   *
   * @apiParam {String} url 待打开的h5页面url
   */

