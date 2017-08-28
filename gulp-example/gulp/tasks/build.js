/**
 * Description:
 * Created Date: Monday, August 21st 2017, 3:02:42 pm
 * Author: chandlerver5
 * -----
 * Last Modified:
 * Modified By:
 * -----
 * Copyright (c) 2017 Your Company
 * ------------------------------------
 * Javascript will save your soul!
 *

/// 根据环境进行不同的任务操作，只需运行`gulp build --env 'development，staging，production'`
// ===============build task for Development mode、 Staging mode or Production mode==========
/**
 * @description 获取用户命令行参数， * type like `gulp build --env development`
 * gutil.env = { _: [ 'default' ], env: 'development' }
 */
(function(r) {
  var gulp = r("gulp"),
    del = r("del"),
    runSequence = r("run-sequence"),
    gutil = r("gulp-util"),
    //===================任务模块加载==========

    gulpServerBuild = r("./server.js"),
    gulpJsBuild = r("./js.js"),
    gulpCssBuild =r("./css.js"),
    gulpHtmlBuild = r("./html.js"),
    gulpImageBuild = r("./images.js"),
    config = r("../config/gulp.conf"),
    env = gutil.env["env"];

  //==============api 设置 ,现在项目中配置文件==========

  var apiConfig = function(arg) {
    gulp
      .src([paths.src + "/config/config.default.json", paths.src + "/config/config." + arg + ".json"])
      .pipe(extend("config.json", true))
      .pipe(
        ngConstant({
          name: "starter.configs",
          deps: []
        })
      )
      .pipe(
        rename(function(path) {
          path.basename = "config";
          path.extname = ".js";
        })
      )
      .pipe(gulp.dest(paths.src + "/config"));
  };

  gulp.task("set-api-config", function() {
    apiConfig(env || "development");
  });

  // ==========================================================
  /* `-deploy`后缀的表示要部署时的操作任务。*/

  // 清空目标输出目录
  gulp.task("clean", function() {
    return del
      .sync([config.dest]) //清除目标文件夹
      .pipe(gutil.log(gutil.colors.green("clean task completed!")));
  });

  //以下是拷贝
  gulp.task("copy-src-to-dest", function() {
    return gulp
      .src(config.src, { read: false }) //src的第二个参数的{read:false}，是不读取文件,加快程序。
      .pipe(gulp.dest(config.dest));
  });

  // =======================构建任务模式====================
  var developmentTask, stagingTask, productionTask;

  // 开发环境下的任务
  developmentTask = ["sass", "copy-src-to-dest", "watch-src-folder", "set-api-config"];

  // 预发布 & 部署任务
  stagingTask = productionTask = [
    "clean",
    "sass",
    "html",
    "styles",
    "fonts",
    ,
    "scripts",
    "set-api-config",
    "minify-third-library-js",
    "images"
  ];

  //------主要build任务-------
  /**
 * gulp.task('gulpJsBuild',function(callback) {
    runSequence('build-clean',
                ['build-scripts', 'build-styles'],
                'build-html',
                callback);
    });
 */
  gulp.task("build", function(callback) {
    runSequence(
      "clean",
      eval((env || "development") + "Task"), //生成对应的任务数组集合
      function() {
        if (!env || env == "development") {
          gutil.log(gutil.colors.yellow("监视源目录src并且自动同步到目标目录dist, 按 Ctrl-C 可以退出！"));
        }
      }
    );
  });

  /*
//开发构建
gulp.task('dev', function (done) {
    condition = false;
    runSequence(
        ['revCss'],
       ['revJs'],
       ['revImg'],
       ['revHtml'],
       done);
});
 */
  // 默认任务 `gulp`运行
  gulp.task("default", ["css", "js", "browser-sync"], function() {
    gulp.watch(config.src + config.cssDir + "**/*.css", ["css"]); //当`src/scss/**/*.scss`修改时，应该自动执行`css`任务
    gulp.watch(config.src + config.jsDir + "**/*.js", ["js"]);
    gulp.watch(config.src + config.pagesDir + "**/*.html", ["bs-reload"]);
  });

  module.exports = "build";
})(require);
