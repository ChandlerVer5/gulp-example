/**
 * Created Date: Saturday, August 19th 2017, 1:05:58 pm
 * Author: chandlerver5
 * -----
 * Last Modified:
 * Modified By:
 * -----
 * Copyright (c) 2017 Your Company
 * ------------------------------------
 * Javascript will save your soul!
 */
(function(r){
  "use strict";

var gulp = r('gulp'),

  gutil = r('gulp-util'),
  plumber = r('gulp-plumber'),

  config = r('../config/gulp.conf.js'),
// 图片
imagemin = r('gulp-imagemin'),
pngquant = r('imagemin-pngquant');       //使用pngquant深度压缩png图片的imagemin插件


//===============压缩图片和处理SVG文件============
  config['imageminConfig'].use = [pngquant()];    //深度压缩png图片

gulp.task('imagemin', function (tmp) {
  return gulp.src(config.src + '**/(*.*g|*.*f)')
    //防治gulp插件运行出错，导致pipe流程终止。终止，我们又要重启gulp任务了。
    .pipe(plumber())
    .pipe(imagemin(config.imageminConfig))
    .pipe(gulp.dest(config.dest));
});


//===============发布时，所做操作==========

gulp.task('images-deploy', function () {
  gulp.src(config.imagesFiles) //避免不需要的文件
    .pipe(plumber())
    .pipe(gulp.dest(config.dest + config.imagesDir));
});



//img生成文件hash编码并生成 rev-manifest.json文件名对照映射
var rev = require("gulp-rev");
gulp.task('revImg', function () {
  return gulp.src(config.src + '**/@(*.*g|*.*f)')
    .pipe(rev())
    .pipe(gulp.dest(config.dest))
    .pipe(rev.manifest())
    .pipe(gulp.dest(config.src + 'rev/images'));
});


// ============

/* gulp.task('gulpImageBuild', function (cb) {
  runSequence(
    'imagemin',
    'revImg',
    function () {
      gutil.log(gutil.colors.green('有关images的任务执行完毕～～～'));
    });
}); */

gulp.task('image:watch', function (cb) {
  runSequence(
    'imagemin',
    'revImg',
    function () {
      gutil.log(gutil.colors.green('有关images的任务执行完毕～～～'));
    });
});
gulp.task('image:notify', function () {
      gutil.log(gutil.colors.green('有关images的任务执行完毕～～～'));
});



var gulpImageBuild = [
  'imagemin',
  'revImg',
  'image:notify'
];

module.exports = gulpImageBuild;

}(require));
