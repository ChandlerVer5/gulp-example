/**
 * Description: 打包压缩文件，将目标目录dist的文件全部压缩打包
 * Created Date: Tuesday, August 22nd 2017, 10:14:45 am
 * Author: chandlerver5
 * -----
 * Last Modified:
 * Modified By:
 * -----
 * Copyright (c) 2017 Your Company
 * ------------------------------------
 * Javascript will save your soul!
 */

'use strict';

const cfg = global.cfg;

const path = require('path');
const gulp = require('gulp');

const plumber = require('gulp-plumber');
// const tar = require('gulp-tar');
// const gzip = require('gulp-gzip');

/**
 * 打包产出文件成tar.gz文件
 * @return
 */
function gulpTar() {
  // let buildPath = cfg.distPath;
  // let distPath = cfg.appPath;

  // return gulp.src(buildPath + '**/*')
  //   .pipe(plumber())
  //   .pipe(tar('output.tar'))
  //   .pipe(gzip())
  //   .pipe(gulp.dest(distPath));
};

module.exports = 'gulpPackBuild';