/**
 * Description: 打包有关js的操作
 * Created Date: Monday, August 21st 2017, 1:42:44 pm
 * Author: chandlerver5
 * -----
 * Last Modified:
 * Modified By:
 * -----
 * Copyright (c) 2017 Your Company
 * ------------------------------------
 * Javascript will save your soul!
 * example：
 * var source = {
    js: {
        'third': [
            'master/third/jquery/dist/jquery.min.js',
            'master/third/angular/angular.min.js',
            //...
        ],

        'app': [
            'master/js/app.js',
            //...
        ]
    },
    css: [
        'master/third/bootstrap/dist/css/bootstrap.min.css',
        //...
    ]
}
 return gulp.src([source.js.third, source.js.app].join(",").split(","))
 */

// for requireJS--合并，压缩优化 (如果有的话)
(function (r) {
  "use strict";

  var gulp = r('gulp'),
    ifElse = r('gulp-if-else'),
    config = r('../config/gulp.conf.js'),
    plumber = r('gulp-plumber'),
    browserSync = r('browser-sync'),

    // js
    uglify = r('gulp-uglify'),

    rename = r('gulp-rename'),
    order = r('gulp-order'),
    gutil = r('gulp-util'),
    sourcemaps = r('gulp-sourcemaps'),

    // lazypipe = r('lazypipe')
    runSequence = r('run-sequence');
  runSequence.options.ignoreUndefinedTasks = true;

  var env = gutil.env["env"]; //获取命令行参数


  //=================转换ES6代码为ES5语法形式==============
  gulp.task('babel', function () {
    return gulp.src('./js/*.js')
      .pipe(babel())
      .pipe(gulp.dest('dist/es6'));
  });

  //=================编译ts文件===================
  gulp.task('typescript', function () {
    return gulp.src(paths.app.coffee)
      .pipe(plugins.coffeelint())
      .pipe(plugins.coffee({
        bare: true
      }))
      .pipe(gulp.dest(paths.app + '/js'));
  });

  // ======操作r.js打包任务=======
  var rjsOptimize = r('gulp-requirejs-optimize');
  var doRjs = !!config.r_Config.mainConfigFile; //是否需要压缩requirejs模块

  gulp.task('require-rjs', function () {
    return gulp.src(config.r_FilesNeedRjs) //只打包 目录下requirejs模块化用到的js文件
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(rjsOptimize(config.r_Config))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(config.r_outDir)); //最后的文件在`config.r_outDir`下面

  });

  // 通用js打包合并压缩===多页面====
gulp.task('scripts', function() {
 return gulp.src('./js/*.js')
      .pipe(concat('all.js'))
      .pipe(gulp.dest('./dist'))
      .pipe(rename('all.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('./dist/js'));
});


  // =========由于强制更新静态缓存============
  // js生成文件hash编码并生成 rev-manifest.json文件名对照映射
  var rev = r("gulp-rev");
  //revision 用来增加散列值和生成rev.manifest.json
  gulp.task("revision", function () {
    return gulp.src([
        config.src + config.jsDir + "**/*.js"
      ])
      //防止由于插件的错误而导致的管道破裂。
      // .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
      .pipe(plumber())
      //对文件名加MD5后缀
      .pipe(rev())
      //生成一个rev-manifest.json
      .pipe(rev.manifest())
      .pipe(gulp.dest(config.src + 'rev/js'))
  })

  // =============eslint或者编译ts文件=======
  /*


  gulp.task('scripts', ['coffee', 'lintscripts'], function () {
  	return gulp.src([
  			// setup script sequence
  			paths.app + '/js/vendor/jquery-2.1.0.js',
  			paths.app + '/js/coffee.js'
  		])
  		.pipe(plugins.concat('main.js'))
  		.pipe(gulp.dest(paths.app + '/js'))
  		.pipe(plugins.uglify())
  		.pipe(plugins.rename({suffix: '.min'}))
  		.pipe(gulp.dest( paths.dest + '/js'));
  });
  */
  // ========jshint js代码校验=========
  var jshint = r('gulp-jshint');
  gulp.task("jshint", function () {
    return gulp.src(config.allJs)
      .pipe(plumber())
      .pipe(jshint('.jshintrc'))
      .pipe(jshint.reporter('default'));
  });


  /**
   * @desc js gulp部署时打包
   * TODO:三种模式的任务执行构建不同
   */
  var js_production = function () {
    return gulp.src(config.jsOrder)
      .pipe(plumber())
      //this is the filename of the compressed version of our JS
      //.pipe(concat('app.js'))
      // 压缩
      .pipe(uglify())
      .on('error', function (err) {
        gutil.log(gutil.colors.red('[Error]'), err.toString());
      })
      // .pipe(header(banner, {
      //   package: package
      // }))
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(config.dest + './assets/js')); //存储压缩后的版本
  };

  // ====build for js====
  gulp.task('build-js', function () {

    // var isProduction = env === "production";
    var isProduction = true;
    return gulp.src(config.jsDir)
      //防止由于插件的错误而导致的管道破裂。
      .pipe(plumber())
      .pipe(ifElse(isProduction, function () {
        return sourcemaps.init()
      })) //要进行压缩，会首先进行sourcemap分析
      //.pipe(gulpif(false, rjs()))  //是否进行r.js压缩！
      //stream流过的时候，通过gulpif判断类型
      //可以做压缩处理
      //.pipe(gulpif('*.js',uglify()))

      //bc .pipe(header(banner, { package : package }))
      .pipe(gulp.dest(config.dest + './assets/js')) //未压缩的版本，没有
      .pipe(ifElse(isProduction, js_production))
      .pipe(browserSync.reload({ //热更新
        stream: true,
        once: true
      }));

  });


  gulp.task("js:watch", function() {
    gutil.log(gutil.colors.green("有关js的任务执行完毕～～～"));
  });
  gulp.task("js:notify", function() {
    gutil.log(gutil.colors.green("有关js的任务执行完毕～～～"));
  });
  // ==========对外导出========
/*   gulp.task('gulpJsBuild', function () {
    runSequence(
      config.jslint ? 'jshint' : null,
      doRjs ? 'require-rjs' : null,
      'build-js',
      'revision',
      function () {
        gutil.log(gutil.colors.green('有关js的任务执行完毕～～～'));
      }
    );
  }); */

  var gulpJsBuild = [
    config.jslint ? 'jshint' : null,
    doRjs ? 'require-rjs' : null,
    'build-js',
    'revision',
    "js:notify"
  ]
  // 导出
  module.exports =  gulpJsBuild;

}(require));
