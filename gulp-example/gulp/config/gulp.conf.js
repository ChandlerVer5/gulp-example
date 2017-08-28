/**
 * Description 项目gulp配置文件
 * Created Date: Saturday, August 19th 2017, 11:41:28 am
 * Author: chandlerver5
 *
 * Copyright (c) 2017 Your Company
 */

// 配置为模块化，可以很好的个人自定义。
module.exports = (function() {
  /**
   * 目录结构配置
   * 开发和部署目录结构完全一致，如果你改变了jsDir的名称，那么生成的目标目录下也会相应改变。
   */
  var src = "src/", //开发目录
    dest = "app/", // 生产的目录
    pagesDir = "pages/",
    jsDir = "js/", // js的目录
    cssDir = "css/", // css的目录
    scssDir = "scss/", // scss的目录
    // 图片相关目录
    imagesDir = "image/",
    spriteDir = "sprite/";

  var useRequirejs = false; // false 没有使用requireJS，则不会进行r.js打包,
  var requirejs_mian = src + jsDir + "main.js"; // 指向data-mian路径文件。

  return {
    // 目录
    src: src,
    dest: dest, // 生产的目录
    pagesDir : pagesDir,
    jsDir: jsDir, // js的目录
    cssDir : cssDir, // css的目录
    scssDir: scssDir, // scss的目录
    // 图片相关目录
    imagesDir : imagesDir,
    spriteDir: spriteDir,

  //=============文件==============
    index: src + "index.html", //web app首页文件
    // js 文件
    jsFiles: [src + jsDir + "./**/*.js"],
    // css 文件
    cssFiles: [
      src + cssDir + "./**/*.css",
      src + scssDir + "./**/*.scss"
    ],
    // 页面文件，默认为html
    pagesFiles: [
      src + pagesDir + '**/*.html'
    ],
// 图片文件
    imagesFiles:[
      src + imagesDir + '**/*',
      '!' + src + '!/images/README.md'
    ],

// sprite图片文件
    spriteFiles:[src + imagesDir +spriteDir + "**/*"],


    //========================指定开发目录下的第三方js文件顺序================
    // 如果打包后出错，注意顺序
    jsOrder: [src + "./js/require.js", src + "./js/stickUp.min.js", src + "./js/html5.js"],
    // css文件顺序
    cssOrder: ["**/app.css", "**/*.module.css", "**/*.css"],

    //===================lint设置================
    jslint: false,
    csslint: false,

    // =====================图片设置=====================
    // imagemin插件的配置
    imageminConfig: {
      optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
      progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
      interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
      multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
      svgoPlugins: [{ removeViewBox: false }] //不要移除svg的viewbox属性
    },

    //==================requirejs 设置===================
    r_FilesNeedRjs: src + "./js/**/*.js", //指定需要打包的文件。
    r_outDir: src, // out: 'main.min.js',// 输出压缩后的文件的输出位置
    r_Config: {
      //r.js插件配置对象
      name: "main", // 模块入口,指向data-mian文件名称
      out: "./main.min.js", // 输出压缩后的文件名称
      mainConfigFile: requirejs_mian && useRequirejs || false
      // exclude: [       //排除文件
      //   'jquery'
      // ]
    },
    // ===================服务器配置===============
    browserSyncConfig: {
      //files:['**'],   //在工作中监听文件
      //logPrefix: 'PSK',
      // 启动静态服务器，默认监听3000端口，设置启动时打开的index.html的路径
      server: {
        baseDir: dest //启动开发目录下的静态服务器
        //index:'blink/blink.html',    // 指定默认打开的文件
        //middleware:[middleware]       //中间件进行反向代理
      },
      //port:8050,  // 指定访问服务器的端口号
      options: {
        reloadDelay: 250
      },
      notify: false
      //startPath: '/index.html'
      //open: false //需不需要自动打开浏览器
    },

    //---------------置代理中间件---------------
    /**
     * 通过配置pathRewrite和router，我们可以访问localhost:3000/test/testa 它将会代理到http://localhost:6000/apiA
     */
    middlewareConfig: {
      target: "https://api.github.com",
      changeOrigin: true, // 对于 vhosted 的网站,改变主机头匹配到目标主机
      logLevel: "debug",
      pathRewrite: {
        "^/test/testa": "/apiA",
        "^/test/testb": "/apiB"
      },
      // 转向目标 proxyTable
      router: {
        "/test": "http://localhost:6000",
        local: "http://localhost:8989",
        test: "http://test-server:8989",
        product: "http://product-server:8989"
      }
    }
  };
})();
