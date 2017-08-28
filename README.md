[TOC]

# 功能
略～

# 配置文件
gulp目录包含了所有任务，把每个任务进行了分割。配置文件是：`gulp/config/gulp.conf.js`。
每个任务都油有详细的注释。

## 使用：
`gulp build --env development|staging|production`

对应 **开发、预发布、部署** 三种环境模式。

## `package.json` 配置

scripts项目配置各个指令:

* 启动webpack调试server： `npm server`
* 测试环境打包: `npm build`
* 生产环境打包: `npm buildP`
* 发布到测试环境: `npm deploy`
* 发布到生产环境: `npm deployP`

# 环境模式
## 编译（测试/dev环境） ##

    $ npm run build

## 本地调试 ##

    $ npm run server

 ## 编译（生产环境） ##

预发布和发布环境会对js混淆压缩，对css、html进行压缩，字符替换等处理

     $ npm run buildP

## 部署发布 ##

在配置文件中配置好`localServer`、`remoteServer`和`api接口`，编译后将最终目录发布到服务端。

发布到localServer

    $ npm run deploy

发布到remoteServer

    $ npm run deployP



# 构建顺序
## 缺省默认任务，输出的js和css文件都带参数
### 执行顺序：
* 1、清除编译输出目录build的全部文件
* 2、复制第三方组件依赖到build文件夹
* 3、使用带md5对js文件进行压缩打包一个文件，命名根据gulp-rev插件md5之后的命名进行命名，如build-asdf123.min.js，并输出到build/js文件夹
* 4、使用带md5对cs文件进行压缩打包一个文件，命名根据gulp-rev插件md5之后的命名进行命名，如build-asd323.min.css，并输出到build/cs文件夹
* 5、（可选）使用带md5对img文件夹的全部文件进行重命名，命名根据gulp-rev插件md5之后的命名进行命名，如common-asdf123.jpg，并输出到build/img文件夹；如果这部不操作，下面第10步将不执行。
* 6、将build目录下的全部html页面进行压缩处理，采用gulp-minhtml插进
* 7、由于项目上使用了模块开发，然后每个页面上都会引入common.js文件，而合并后的js文件为build.min.js，所以使用gulp-replace插进对html页面进行替换，并将html文件输出到build目录上
* 8、再次在build目录上，将html进行common.css文件替换成build.min.css
* 9、使用gulp-rev-collectorc插件对刚才生成带参数的js和css文件在html页面上进行替换，如build.min.js替换成build-asdf123.min.js。还是输出到build目录。
* 10、（可选）使用gulp-rev-collectorc插件对刚才生成带参数的img文件在css文件上进行替换，如common.jpg替换成common-asdf12.jpg。输出到目录

```js
gulp.task(‘default‘,[‘clean:Build‘,‘copy‘,‘minifyjsmd5‘,‘minifycssmd5‘,‘minifyimgmd5‘,‘replacejs‘,‘replacecss‘,‘html‘,‘rev‘,‘revimg‘]);
```

## 默认任务2，输出的js和css文件不带参数
### 执行顺序：
 * 1、清除编译输出目录build的全部文件
 * 2、复制第三方组件依赖到build文件夹
 * 3、对js文件进行压缩打包一个文件，命名如build.min.js，并输出到build/js文件夹
 * 4、对cs文件进行压缩打包一个文件，命名如build.min.css，并输出到build/cs文件夹
 * 5、将build目录下的全部html页面进行压缩处理，采用gulp-minhtml插进
 * 6、由于项目上使用了模块开发，然后每个页面上都会引入common.js文件，而合并后的js文件为build.min.js，所以使用gulp-replace插进对html页面进行替换，并将html文件输出到build目录上
 * 7、再次在build目录上，将html进行common.css文件替换成build.min.css

```js
gulp.task(‘default2‘, [‘clean:Build‘,‘copy‘,‘copyimg‘,‘minifyjs‘,‘minifycss‘,‘replacejs‘,‘replacecss‘,‘html‘]);
```

## 开发使用默认任务，js和css不带参数，且不合并
### 执行顺序：
 * 1、清除编译输出目录build的全部文件
 * 2、复制第三方组件依赖到build文件夹
 * 3、对js文件进行压缩打包一个文件，命名如build.js，并输出到build/js文件夹
 * 4、对cs文件进行压缩打包一个文件，命名如build.css，并输出到build/cs文件夹
 * 5、将build目录下的全部html页面进行压缩处理，采用gulp-minhtml插进
 * 6、由于项目上使用了模块开发，然后每个页面上都会引入common.js文件，而合并后的js文件为build.js，所以使用gulp-replace插进对html页面进行替换，并将html文件输出到build目录上
 * 7、再次在build目录上，将html进行common.css文件替换成build.css

```js
gulp.task(‘defaultdev‘, [‘clean:Build‘,‘copy‘,‘copyimg‘,‘minifyjs‘,‘minifycss‘,‘replacejsdev‘,‘replacecssdev‘,‘html‘]);
```