/**
 * Created Date: Saturday, August 19th 2017, 1:00:05 pm
 * Author: chandlerver5
 * -----
 * Copyright (c) 2017 Your Company
 */
(function(r) {
  var gulp = r("gulp"),
    plumber = r("gulp-plumber"),
    order = r("gulp-order"),
    gutil = r("gulp-util"),
    browserSync = r("browser-sync"),
    // sourcemaps生成
    sourcemaps = r("gulp-sourcemaps"),
    header = r("../utils/copyright"),
    rename = r("gulp-rename"),
    runSequence = r("run-sequence"),
    revCollector = r("gulp-rev-collector"),
    config = r("../config/gulp.conf.js"); // lazypipe = require('lazypipe')

  // css和scss
  var scss = r("gulp-sass"), //SASS/SCSS in СSS.
    cssnano = r("gulp-cssnano"),
    spritesmith = r("gulp.spritesmith");

  //  postcss和插件操作css/scss
  var postcss = r("gulp-postcss"),
    autoprefixer = r("autoprefixer"),
    /*   bem = require('postcss-bem');
      cssNext = require('postcss-cssnext');
      px2rem = require('postcss-px2rem');//px转换成rem
      autoprefixer = require('autoprefixer');
      postcssSimpleVars = require("postcss-simple-vars");
      postcssMixins = require("postcss-mixins");
      postcssNested = require("postcss-nested"); */
    reporter = r("postcss-reporter"),
    syntax_scss = r("postcss-scss"), //让 PostCSS 识别 .scss 语法
    stylelint = r("stylelint");

  // ==============变量设置============
  var cssFiles = [config.src + config.cssDir, config.src + config.scssDir];

  //==================postcss的stylelint审查 css|scss 代码======================
  var autoPrefixBrowserList = [
    "> 1%",
    "last 2 version",
    "firefox >= 4",
    "safari 8",
    "ie 8",
    "ie 9",
    "IE 10",
    "IE 11",
    "opera 12.1",
    "ios 6",
    "android 4"
  ];

  gulp.task("style-lint", function() {
    // stylelint config rules
    var stylelintConfig = {
      //忽略部分文件
      ignoreFiles: ["*.min.css"],
      //默认报告为错误。可选值：warning、error
      defaultSeverity: "error",
      //加载扩展规则。需要 npm install 在项目目录或父级下
      extends: ["stylelint-config-standard"],
      rules: {
        indentation: [
          4,
          {
            warn: true,
            except: ["param"],
            message: "请用4个空格来缩进。 Tabs make The Architect grumpy."
          }
        ],
        "number-leading-zero": null
      }
    };

    var processors = [
      stylelint(stylelintConfig),
      reporter({
        clearMessages: true,
        throwError: false
      })
    ];

    return gulp
      .src([config.src + config.cssDir + "./**/*.css", config.src + config.cssDir + "./**/*.scss"])
      .pipe(plumber())
      .pipe(postcss(processors), {
        syntax: syntax_scss
      });
  });

  // =================scss编译和自动添加前缀================

  gulp.task("scss&prefixer", function() {
    var processors = [
      autoprefixer({
        browsers: autoPrefixBrowserList, //主流浏览器的版本
        cascade: true, //是否美化属性值 默认：true 像这样：
        //-webkit-transform: rotate(45deg);
        //        transform: rotate(45deg);
        remove: true //是否去掉不必要的前缀 默认：true
      })
    ];

    return (gulp
        .src(config.src + "**/*.*ss")
        .pipe(plumber())
        .pipe(scss().on("error", scss.logError))
        // ===根据设置浏览器版本自动处理浏览器前缀===
        .pipe(postcss(processors))
        .pipe(gulp.dest(config.src)) );
  });

  //=================生成sprites图片和样式表=======
  gulp.task("sprite", function() {
    var spriteData = gulp.src(config.spriteFiles).pipe(
      spritesmith({
        imgName: "sprite.png",
        cssName: "sprite.css",
        padding: 1 // normal usage is 1 or 2
      })
    );
    return spriteData.pipe(gulp.src(config.dest + config.imagesDir + config.spriteDir));
  });

  //===================将px转换成rem==============
  /*   gulp.task('px2rem', function () {
    var processors = [
      px2rem({
        remUnit: 75 //75代表了1rem对应的px值,编译后，会自动将px转化为rem
      })
    ];
    return gulp.src('./css/*.css')
      .pipe(postcss(processors))
      .pipe(gulp.dest('./dest'));
  }); */

  //==========================CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射=============
  var rev = r("gulp-rev");
  gulp.task("revCss", function() {
    return (gulp
        .src(config.dest + "**/*.css")
        .pipe(plumber())
        .pipe(rev())
        //重命名添加后缀
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest(config.dest))
        .pipe(rev.manifest())
        .pipe(gulp.dest(config.src + "rev/css"))
        .pipe(
          browserSync.reload({
            stream: true
          })
        ) );
  });

  //===============css，主要是针对css 中的img替换=============
  gulp.task("revReplaceImgInCss", function() {
    return gulp
      .src([config.src + "rev/**/*.json", config.dest + "**/*.*ss"])
      .pipe(plumber())
      .pipe(
        revCollector({
          replaceReved: true
        })
      )
      .pipe(gulp.dest(config.dest));
  });

  // ===================|css压缩===============
  gulp.task("build-css", function() {
    return (gulp
        .src(config.src + "**/*.css")
        .pipe(plumber())
        .pipe(sourcemaps.init())
        //压缩css
        .pipe(cssnano())
        // .pipe(header())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.dest)) );
  });

  // 监听
  //当`src/scss/**/*.scss`修改时，应该自动执行`css`任务
  gulp.task("css:watch", function() {
    gulp.watch(config.cssFiles, ["gulpCssBuild"]);
  });

  gulp.task("css:notify", function() {
    gutil.log(gutil.colors.green("有关css的任务执行完毕～～～"));
  });

  // ==============css导出=================

  var gulpCssBuild = [
    // "style-lint",
    "scss&prefixer",
    "build-css",
    "revCss",
    "revReplaceImgInCss",
    "css:watch",
    "css:notify"
  ];

  gulp.task("gulpCssBuild", function() {
    runSequence(
      // "style-lint",
      "scss&prefixer",
      "build-css",
      "revCss",
      "revReplaceImgInCss",
      "css:watch",
      "css:notify",
      function() {
        gutil.log(gutil.colors.green("有关css的任务执行完毕～～～"));
      }
    );
  });

  module.exports = gulpCssBuild;
})(require);
