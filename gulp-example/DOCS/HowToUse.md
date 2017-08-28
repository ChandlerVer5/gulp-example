# FastShell 使用文档

## 项目安装和Gulp安装
FastShell的工作流方式使用了开源组件，所以你先要安装`Node`和`Gulp`。
下面是如何让一个项目在几分钟内启动和运行的演练。一旦安装了`Node`和`Gulp`的所有项目，所有运行的项目都可以立即进行。

1. 安装 [Node.js](http://nodejs.org/download), [Sass](http://sass-lang.com/tutorial.html) 和 [Git](http://git-scm.com)。如果你使用了windows，你可能还需要安装[Ruby](http://rubyinstaller.org/downloads)。
2. 通过`npm install -g gulp`来安装Gulp。你如果没有权限，还需要加`sudo`。
3. 通过 Fork/Clone/Download 来下载FastShell到本地，你会看到所有文件。
4. 打开终端通过`npm install`来安装该项目的所有依赖到`node_modules`。这一步不需要`sudo`来获取权限。
5. `npm install`安装该项目的所有依赖之后，通过该项目下是否有`node_modules`来确认。之后，可以使用`gulp`（这步需要回到项目根目录下）运行与FastShell关联的命令，并自动打开`localhost:3000`的地址来运行的新FastShell项目。
6. 从现在开，只需要在项目下使用`gulp`来自动运行 FastShell的gulp任务。

## 怎么使用FastShell？
使用FastShell是非常容易的，它基于一种简单的方法，即保持简单的东西，以便任何人都可以使用它，即使在命令行上没有任何经验。FastShell使用 Gulp 来管理构建web所需要的所有基本任务。

### 脚手架
FastShell的脚手架是轻量和超级简单的。它使用了一个构建目录，会把所有必要的代码编译到该目录下。它保留了原本的开发代码文件(原始文件：`scss`和`.js`)，这写代码不会实际部署，在部署过程中，你只需要把`app`文件夹的内容部署到服务器上。

在运行时，FastShell执行下列步骤：

1. 挂载`app`文件夹到一个本地服务器。
2. 监听`src`文件夹中的更改，将改动的文件编译到`app`文件夹，然后将自动实时重新加载或注入更改。CSS更改会被注入，其他所有更改都会强制重新加载页面。

### 动态版权/项目标语（Dynamic copyright/project banners）

package.json 文件包含了该项目的所有依赖和该项目的信息。这些信息将被动态地追加到生成的`.css` 和 `.js`文件的顶部，默认情况下，它会使用FastShell的标语:

````js
/*!
 * fastshell
 * Fiercely quick and opinionated front-ends
 * https://HosseinKarami.github.io/fastshell
 * @author Hossein Karami
 * @version 1.0.0
 * Copyright 2014. MIT licensed.
 */
````

### Browser-Sync
Gulp的`browser-sync` 会注入下面的脚本到html页面中（在实际部署时，它不会存在的）:

````html
<script type='text/javascript'>//<![CDATA[
;document.write("<script defer src='//HOST:3000/socket.io/socket.io.js'><\/script><script defer src='//HOST:3001/client/browser-sync-client.0.9.1.js'><\/script>".replace(/HOST/g, location.hostname));
//]]></script>
````

当使用一个单独的浏览器时，它非常有用，可以监听CSS文件进行更改并且注入这些文件。但真正的强大来自于建立响应式网站，你会使用多种设备/显示器，因为它能让所有的浏览器同步，使你的工作流程更快。

### 扩展 Gulp 任务
如果你在项目中添加了更多的Gulp任务，记住使用`npm install <Gulp package> --save-dev`让他们添加到`package.json`文件。可以确保未来该项目的依赖性。

将新任务添加到`gulpfile.js`中。

## JavaScript

FastShell附带了一个`scripts.js`让你开始你的项目，当然，如果你要建立一个AngularJS项目或者其他类型你需要定制这个结构，但是这只是让你开始起来。这个脚本文件使用了一个立即调用的函数表达式(IIFE):

````js
(function ($, window, document, undefined) {
  'use strict';
  // FastShell
})(jQuery, window, document);
````

这可以帮助您实现所有的最小化，并且不会对全局变量造成污染，例如，在最小化之前，您已经有了非常可读的代码和变量名(包括`document` 和 `window`对象):

````js
(function ($, window, document, undefined) {
  'use strict';
  var test = document.createElement('script');
})(jQuery, window, document);
````

当简化为以下内容时，减少了许多实例：

````js
(function (a,b,c,d) {
  'use strict';
  // Also not global
  var test = a.createElement('script');
})(jQuery,window,document);
````

这样就节省了很多字节，减少了文件的大小和性能，并保持了全局命名空间的整洁。传入`jQuery`对象并为其提供美元别名，如果您包含了使用`$`名称空间的其他框架，也可以很好地发挥作用。

## 为什么只要 style.min.css 和 scripts.min.js?
在HTML中只包含两种自己定制的CSS和JavaScript文件，与现代web开发中的最佳实践相一致，减少代码和限制HTTP请求会是一个巨大的性能增强器。

## Sass/SCSS 安装
FastShell附带一个`.scss`文件设置和现有的`@import`声明给非常常见的web组件。FastShell希望帮助那些不确定如何构建CSS项目的人，以及让他们安装和使用CSS预处理器。它的基本思想是:

* `mixins` 拥有所有的sass/scss mixins，FastShell自带了一些辅助mixins。
* `module` 拥有模块，更多面向对象的组件和一个代表其他所有的组件的通用`app.scss`，所有文件名都应该是模块化的/面向对象。
* `partials` 拥有项目蓝图（blueprints），页眉，页脚，边栏等。
* `vendor`  持有任何第三方的文件，如字体awesome图标CSS。
* `style.scss` 从上面的文件夹中导入所有必要的文件，当添加新文件时，一定要把它添加到这个文件中。

## 隐藏文件的解释

公开隐藏的文件是个好主意，这样你就可以配置 `.editorconfig`, `.jshintrc`, `.gitignore` 这些文件了。在命令行输入:

````
defaults write com.apple.Finder AppleShowAllFiles YES
````

隐藏隐藏文件的命令：

````
defaults write com.apple.Finder AppleShowAllFiles NO
````

### .editorconfig

EditorConfig帮助开发人员在不同的编辑器和IDE之间定义和维护一致的编码风格。该.editorconfig文件由用于定义编码样式的格式和文本编辑器插件的集合组成，使编辑者能够读取文件格式并遵守定义的样式。


### .gitignore
忽略压缩的和生成的文件，这最适合在团队中工作可以避免持续的冲突，只需要源文件就行了。

### .travis.yml
这在[travis-ci.org](http://travis-ci.org/)上用于持续集成测试，用于监视FastShell构建。

## 平台支持
FastShell 可以在Mac OS X, Linux 和 Windows上运行。自动命令行脚本仅在Mac OS X和Windows中受支持。


