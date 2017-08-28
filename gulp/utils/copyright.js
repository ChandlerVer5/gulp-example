/**
 * Description:
 * Created Date: Tuesday, August 22nd 2017, 7:01:06 pm
 * Author: chandlerver5
 * -----
 * Last Modified:
 * Modified By:
 * -----
 * Copyright (c) 2017 Your Company
 * ------------------------------------
 * <<licensetext>>
 */

module.exports = function(){


        // 文档
        //var markdown = require('gulp-markdown');
        //var fileinclude = require('gulp-file-include');

        /** ================文件版权banner注释============
         * 实际当中部署的文件还是不太需要头注释，还想文件体积不够大？
         */
            // 头版权注释
            var header  = require('gulp-header');

            var pkg = require('../../package.json');
            var banner = [
            '/*!\n' +
            ' * <%= pkg.name %>\n' +
            ' * <%= pkg.title %>\n' +
            ' * <%= pkg.url %>\n' +
            ' * @author <%= _.capitalize(pkg.author) %>\n' +
            ' * @version <%= pkg.version %>\n' +
            ' * Copyright ' + new Date().getFullYear() + '. <%= pkg.license %> licensed.\n' +
            ' */',
            '\n'
            ].join('');

            return  function() {
                    return header(banner, { package : pkg });
             };



};
