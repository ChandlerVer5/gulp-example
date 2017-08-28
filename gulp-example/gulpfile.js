(function(r) {
  "use strict";

  // 主要代码
  var gulp = r("gulp"),
    gutil = r("gulp-util"),
    // 加载配置文件
    config = r("./gulp/config/gulp.conf.js");

  //===================任务模块加载=================
  var gulpPackBuild = r("./gulp/tasks/pack.js"),
    gulpBuild = r("./gulp/tasks/build.js"),
    gulpImageBuild = r("./gulp/tasks/images.js"),
    gulpCssBuild = r("./gulp/tasks/css.js"),
    gulpJsBuild = r("./gulp/tasks/js.js"),
    gulpHtmlBuild = r("./gulp/tasks/html.js"),
    gulpServerBuild = r("./gulp/tasks/server.js");

  var runSequence = r("run-sequence");

  // =====================================================================

  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx详细构建任务xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

  // test
  // gulp.task("test", [gulpServerBuild, gulpCssBuild], function() {
  //   gulp.watch([config.dest + config.cssDir , config.dest + config.scssDir], ["bs-reload"]); //当`src/scss/**/*.scss`修改时，应该自动执行`css`任务
  //   // gulp.watch(config.dest + config.jsDir + "**/*.js", [gulpJsBuild]);
  //   // gulp.watch(config.dest + "**/*.html", ["bs-reload"]);
  // });
  // test
  gulp.task("test", function() {
    var task = [].concat(gulpImageBuild, gulpCssBuild, gulpJsBuild, gulpHtmlBuild, gulpServerBuild, function() {
      gutil.log(gutil.colors.yellow("监视源目录src并且自动同步到目标目录dist, 按 Ctrl-C 可以退出！"));
      // if (!env || env == "development") {
      //   gutil.log(gutil.colors.yellow("监视源目录src并且自动同步到目标目录dist, 按 Ctrl-C 可以退出！"));
      // }
    });
    runSequence.apply(null, task);
  });

  // 主要入口,watch任务是并行的，不是串行的
  gulp.task("build", [gulpBuild], function() {});

  // 主要入口,watch任务是并行的，不是串行的
  gulp.task("pack", [gulpPackBuild], function() {
    //gulp.watch(config.allCss, ['css']);  //当`src/scss/**/*.scss`修改时，应该自动执行`css`任务
    gulp.watch(config.src + config.jsDir + "**/*.js", [gulpJsBuild]);
    gulp.watch(config.src + "**/*.html", [gulpHtmlBuild, "bs-reload"]);
  });
})(require);
