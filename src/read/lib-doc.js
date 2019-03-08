

   /**
    * @api {get} getLoginUserToken 获取当前登录的token
    * @apiName getLoginUserToken
    * @apiGroup General
    * @apiDescription 获取当前登录的token，注意打开登录页用户登录成功也是需要回调的，匿名状态下，返回空值{keys: "", atype: "", userName: ""}
    * @apiPermission all
    *
    * @apiParam {Boolean} needClientLogin 是否需要在未登录的情况下强制打开登陆页
    * @apiSuccess (yuedu) {String} userName 同步登录用到的用户名
    * @apiSuccess (yuedu) {String} keys  同步登录用到的keys
    * @apiSuccess (yuedu) {String} atype 同步登录用到的atype
    *
    */

    /**
    * @api {get} pageRedirect h5跳转应用内页面
    * @apiName pageRedirect
    * @apiDescription h5跳转应用内页面
    * @apiGroup General
    * @apiPermission all
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
      actionUrl: 'web:getchat;data=%7B%22userId%22%3A%2267329447%22%2C%22nickname%22%3A%22%E9%98%85%E8%AF%BB%E5%B0%8F%E7%9F%A5%22%2C%22tag%22%3A3%7D'
  })
*/

