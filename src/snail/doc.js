

  /**
   * @api {post} closeQrWindow 关闭当前客户端打开的webview和扫码页
   * @apiName closeQrWindow
   * @apiGroup Util
   * @apiDescription 用户在扫码成功或者用户取消等情形，同时关闭当前webview和扫码页
   */



  /**
   * @api {get} getNoticeStatus 获取客户端通知权限开启状态
   * @apiName getNoticeStatus
   * @apiDescription 获取客户端通知权限开启状态
   * @apiGroup Util
   *
   * @apiSuccess {String} status 状态 on=打开 off=关闭
   */


  /**
   * @api {get} userinfo 用户个人主页
   * @apiDescription 用户个人主页
   * @apiName userinfo
   * @apiGroup PageNavagation
   * @apiDeprecated use now (#General:pageRedirect).
   * @apiPermission schema
   *
   * @apiSuccess {String} uuid 用户uuid
   */

  /**
   * @api {get} privatemsg 用户私信对话界面
   * @apiName privatemsg
   * @apiDescription 用户私信对话界面
   * @apiGroup PageNavagation
   * @apiDeprecated use now (#General:pageRedirect).
   * @apiPermission schema
   *
   * @apiSuccess {String} useruuid 用户uuid
   */


  /**
  * @api {get} bookdetail 书籍详情
  * @apiName bookdetail
  * @apiDescription 书籍详情
  * @apiGroup PageNavagation
  * @apiDeprecated use now (#General:pageRedirect).
  * @apiPermission schema
  *
  * @apiParam {Number} bookId 书籍id
  */

  /**
   * @api {get} bookcontent 书籍正文页
   * @apiName bookcontent
   * @apiDescription 书籍正文页
   * @apiGroup PageNavagation
   * @apiDeprecated use now (#General:pageRedirect).
   * @apiPermission schema
   *
   * @apiParam {Number} bookId 书籍id
   * @apiParam {Number} [articleId]  章节id，非必传，客户端需兼容没有指明articleId的情况
   */

  /**
  * @api {get} booklist 书单页
  * @apiName booklist
  * @apiDescription 书单页
  * @apiGroup PageNavagation
  * @apiDeprecated use now (#General:pageRedirect).
  * @apiPermission schema
  *
  * @apiParam {Number} bookListId 书单id
  */

  /**
   * @api {get} bookreview 书评详情页
   * @apiName bookreview
   * @apiDescription 书评详情页
   * @apiGroup PageNavagation
   * @apiDeprecated use now (#General:pageRedirect).
   * @apiPermission schema
   *
   * @apiParam {Number} bookReviewId 书评id
   */
  
  /**
   * @api {get} messagenotify 消息列表通知选项卡
   * @apiName messagenotify
   * @apiDescription 消息列表通知选项卡
   * @apiGroup PageNavagation
   * @apiDeprecated use now (#General:pageRedirect).
   * @apiPermission schema
   */

  /**
   * @api {get} messagecomment 消息列表评论选项卡
   * @apiName messagecomment
   * @apiDescription 消息列表评论选项卡
   * @apiGroup PageNavagation
   * @apiDeprecated use now (#General:pageRedirect).
   * @apiPermission schema
   */
  
  /**
   * @api {get} messageanswer 消息列表回答选项卡
   * @apiName messageanswer
   * @apiDescription 消息列表回答选项卡
   * @apiGroup PageNavagation
   * @apiDeprecated use now (#General:pageRedirect).
   * @apiPermission schema
   */
  
  /**
   * @api {get} bookrank 书籍排行榜
   * @apiName bookrank
   * @apiDescription 书籍排行榜
   * @apiGroup PageNavagation
   * @apiDeprecated use now (#General:pageRedirect).
   * @apiPermission schema
   *
   * @apiParam {Number} moduleId 模块ID
   * @apiParam {Number} entryId  排行榜ID
   * @apiParam {String} title  榜单名称
   */
  
  /**
   * @api {get} newbookreview 写书评
   * @apiName newbookreview
   * @apiDescription 写书评
   * @apiGroup PageNavagation
   * @apiDeprecated use now (#General:pageRedirect).
   * @apiPermission schema
   */
  
  /**
   * @api {get} question 问题回答页
   * @apiName question
   * @apiDescription 问题回答页
   * @apiGroup PageNavagation
   * @apiDeprecated use now (#General:pageRedirect).
   * @apiPermission schema
   *
   * @apiParam {Number} questionId  问题ID
   */
  
  /**
   * @api {get} bookstore 书城
   * @apiName bookstore
   * @apiDescription 书城
   * @apiGroup PageNavagation
   * @apiDeprecated use now (#General:pageRedirect).
   * @apiPermission schema
   */

  /**
   * @api {get} noticeSetting 通知客户端，跳转到本APP的系统通知权限设置页面
   * @apiName noticeSetting
   * @apiDescription 通知客户端，跳转到本APP的系统通知权限设置页面
   * @apiGroup PageNavagation
   * @apiPermission jsbridge
   */

   /**
   * @api {post} share2 新版唤起客户端分享模块
   * @apiName share2
   * @apiGroup General
   * @apiDescription 功能更强大，不支持新版接口的版本转为调用share接口
   * 
   * @apiParam {Array} channel 原share接口分享渠道设置，如果channel参数不为空，则channel参数中未添加的渠道设置的特定分享参数无效
   * @apiParam {string} activity 原share接口活动ID字段
   * @apiParam {Object} default 默认各渠道的分享参数设置
   *       @apiParam {String} title 分享内容的标题 或 分享到微博的文字内容(当weibo参数未设置时)
   *       @apiParam {String} description 分享内容的描述
   *       @apiParam {String} image 分享的缩略图url
   *       @apiParam {String} url 分享内容的跳转url
   * @apiParam {Object} wechatFriend/wechatTimeline/qqZone/qqFriend/weibo 具体某个渠道的分享参数设置，可选，如果设置，则该渠道以此参数设置为准
   *       @apiParam {String} title 分享内容的标题（微博渠道无此参数）
   *       @apiParam {String} description 分享内容的描述 或者微博的分享文案
   *       @apiParam {String} image 分享的缩略图url 或者微博渠道的配图
   *       @apiParam {String} url 分享内容的跳转url（微博渠道无此参数）
   *       @apiParam {Boolean} imageOnly 是否只分享图片形式的内容，可选（微博渠道无此参数）
   */

  /**
  * @api {post} setShareConfig2 新版设置当前webview页面的分享参数
  * @apiName setShareConfig2
  * @apiGroup General
  * @apiDescription 功能更强大，不支持新版接口的版本转为调用setShareConfig接口
  * 
  * @apiParam {Array} channel 原share接口分享渠道设置，如果channel参数不为空，则channel参数中未添加的渠道设置的特定分享参数无效
  * @apiParam {string} activity 原share接口活动ID字段
  * @apiParam {Object} default 默认各渠道的分享参数设置
  *       @apiParam {String} title 分享内容的标题 或 分享到微博的文字内容(当weibo参数未设置时)
  *       @apiParam {String} description 分享内容的描述
  *       @apiParam {String} image 分享的缩略图url
  *       @apiParam {String} url 分享内容的跳转url
  * @apiParam {Object} wechatFriend/wechatTimeline/qqZone/qqFriend/weibo 具体某个渠道的分享参数设置，可选，如果设置，则该渠道以此参数设置为准
  *       @apiParam {String} title 分享内容的标题（微博渠道无此参数）
  *       @apiParam {String} description 分享内容的描述 或者微博的分享文案
  *       @apiParam {String} image 分享的缩略图url 或者微博渠道的配图
  *       @apiParam {String} url 分享内容的跳转url（微博渠道无此参数）
  *       @apiParam {Boolean} imageOnly 是否只分享图片形式的内容，可选（微博渠道无此参数）
  */