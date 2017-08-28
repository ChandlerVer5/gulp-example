/**
 * Author: chandlerver5
 */
(function(r) {
  "use strict";

  var gulp = r("gulp"),
    plumber = r("gulp-plumber"),
    gutil = r("gulp-util"),
    // inject = require('gulp-inject'),
    // replace = require('gulp-replace'),
    // foreach = require('gulp-foreach'),

    htmlmin = r("gulp-htmlmin"),
    contentIncluder = r("gulp-content-includer"),
    config = r("../config/gulp.conf.js"),
    ifElse = r("gulp-if-else"),
    revCollector = r("gulp-rev-collector"),
    filter = r("gulp-filter"),
    runSequence = r("run-sequence");

  //==============加载html模块化片段========
  gulp.task("includePartials", function() {
    return (gulp
        .src([config.src + "**/*.html"])
        .pipe(plumber())
        .pipe(
          contentIncluder({
            includerReg: /<!\-\-\s*include\s*"([^"]+)"\s*\-\->/g
          })
        )
        // .pipe(rename('index.html'))
        .pipe(gulp.dest(config.dest)) );
  });

  //=============Html文件名对照映射 更换css、js、img文件版本========
  //Html更换css、js文件版本,.也是和本地html文件的路径一致
  //gulp-rev-collector进行文件路径替换是依据 rev-manifest.json 的，所以要先成生 .json 文件，然后再进行替换；
  gulp.task("rev-replace", function() {
    //读取 rev-manifest.json 文件以及需要进行css名替换的文件
    return (gulp
        .src([config.src + "rev/**/*.json", config.dest + "**/*.html"])
        //防止由于插件的错误而导致的管道破裂。
        // .pipe(plumber())
        //执行文件内css名的替换
        .pipe(
          revCollector({
            replaceReved: true //必须增加这个参数，否则更改了源文件之后不会热更新
            /* dirReplacements: {
          '': 'dist/'
        } */
          })
        )
        .pipe(gulp.dest(config.dest)) );
  });

  //=========================自动注入js和css================
  // https://www.npmjs.com/package/gulp-inject
  /* var inject = require('gulp-inject');
gulp.task('inject', function() {

    var js = gulp.src(config.js, {read: false}).pipe(plugins.order(config.jsOrder));
    var css = gulp.src(config.css, {read: false}).pipe(plugins.order(config.cssOrder));

    return gulp
        .src(config.index)
        .pipe(inject(js, {relative: true}))
        .pipe(inject(css, {relative: true}))
        .pipe(gulp.dest(config.src))
        .pipe(browserSync.reload({stream: true}));  //重新刷新浏览器
}); */

  // ==============压缩html页面==============
  var pagesf = filter([config.dest + config.pagesDir + "*.html"], { restore: true });
  var srcf = filter([config.dest + "*.html"], { restore: true });

  gulp.task("htmlminify", function() {
    var options = {
      removeComments: true, //清除HTML注释
      collapseWhitespace: false, //压缩HTML
      collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
      removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
      removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
      removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
      minifyJS: true, //压缩页面JS
      minifyCSS: true //压缩页面CSS
    };
    return (gulp.src(config.dest + "**/*.html").pipe(plumber()).pipe(htmlmin(options))// .pipe(pagesf)
      // .pipe(gulp.dest(config.dest + config.pagesDir))
      // .pipe(srcf)
      .pipe(gulp.dest(config.dest)) );
  });

  // ============合并html页面中的js或css=========
  // https://github.com/aDaiCode/gulp-merge-link
  var merge = r("gulp-merge-link");
  gulp.task("merge", function() {
    return gulp
      .src(config.index)
      .pipe(plumber())
      .pipe(
        merge(
          {
            "base.css": ["header.css", "footer.css", "./lib/*.css"],
            "base.js": ["lib/*.js", "header.js"]
          },
          {
            debug: true
          }
        )
      )
      .pipe(gulp.dest(config.dest));
  });

  //==================最后还要进行 html页面资源替换成带hash值的压缩丑化版本==========

  gulp.task("html:watch", function() {
    gutil.log(gutil.colors.green("有关html的任务执行完毕～～～"));
  });
  gulp.task("html:notify", function() {
    gutil.log(gutil.colors.green("有关html的任务执行完毕～～～"));
  });
  //============外输出=======
  /*  gulp.task("gulpHtmlBuild", function() {
    runSequence("includePartials", "rev-replace", "htmlminify", function() {
      gutil.log(gutil.colors.green("有关html的任务执行完毕～～～"));
    });
  }); */

  var gulpHtmlBuild = ["includePartials", "htmlminify", "rev-replace", "html:notify"];

  module.exports = gulpHtmlBuild;
})(require);
