/**
 * Description:
 * Created Date: Monday, August 21st 2017, 2:45:35 pm
 * Author: chandlerver5
 * -----
 * Last Modified:
 * Modified By:
 * -----
 * Copyright (c) 2017 Your Company
 * ------------------------------------
 * Javascript will save your soul!
 */
// =================静态服务器Server配置=============
/**
 * http://www.browsersync.cn/docs/options/#option-files
 * var browserSync = require('browser-sync').create();
 * 调用 .create() 意味着你得到一个唯一的实例并允许您创建多个服务器或代理。
 */

//Server
(function(r) {
  var gulp = r("gulp"),
    gutil = r("gulp-util"),
    config = r("../config/gulp.conf.js"),
    browserSync = r("browser-sync"),
    proxy = r("http-proxy-middleware");



  // ================任务============
    gulp.task("bs-reload", function() {
      browserSync.reload();
    });

  //---------------置代理中间件---------------
  /**
 * 通过配置pathRewrite和router，我们可以访问localhost:3000/test/testa 它将会代理到http://localhost:6000/apiA
 */
  /*
var middleware = proxy('**',config.middlewareConfig); */

  // ================导出============
  gulp.task("serve", function() {
    browserSync(config.browserSyncConfig, function() {
      //启动后的回调
      gutil.log(gutil.colors.green("------!服务器完成启动!------"));
    });

  });

  var serve = ["serve"];



  module.exports = serve;
})(require);
