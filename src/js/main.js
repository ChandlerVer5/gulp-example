/**
 * Description: requireJS 的main入口文件
 * Created Date: Saturday, August 19th 2017, 8:46:31 pm
 * Author: chandlerver5
 * -----
 * Last Modified:
 * Modified By:
 * -----
 * Copyright (c) 2017 Your Company
 * ------------------------------------
 * Javascript will save your soul!
 *
 * Useage：
 *  首先该文件main.js，是模块组用来封装模块，来加载其他的js文件。
 *  通过require函数完成依赖管理：
 *  require(deps, callback);
 *  如果把所有文件都放到这里肯定不行：
 *  define(?, ? , factory); //实现模块定义
 *
 */

 require.config({
    baseUrl:"./js",   //默认base路径位置
    paths:{     //别名
        jquery:'http://libs.baidu.com/jquery/1.5.2/jquery.min',
        slider:"./lib/unslider.min",
        tab:"./lib/jquery.tabso_yeso",
        //contact:'./lib/contact_module',
        scrollFollow:'./lib/scrollfollow.min'
    },
    shim:{      //不是amd规范定义的库
        jquery:{
            exports: '$'
        },
        scrollFollow:{
            deps:['jquery']
        },
        slider: {
            deps:['jquery']
        },
        tab: {
            deps:['jquery'],
            exports:'tabso',
        }
    }
 });


// 主加载文件-业务代码
 require([  'slider', 'tab', 'scrollFollow','jquery'],function(u, t, s, $){

        'use strict';

    if(window.chrome){$('.slider li').css('background-size', '100% 100%');}
    $('.slider').unslider({
        speed: 500,               //  滚动速度
        delay: 3000,              //  动画延迟
        complete: function() {},  //  动画完成的回调函数
        keys: true,               //  启动键盘导航
        dots: true,               //  显示点导航
        fluid: true               //  支持响应式设计
    });

	//淡隐淡现选项卡切换
	$("#fadeul").tabso({
		cntSelect:".cc-left-wrap",
		tabEvent:"click",
		tabStyle:"normal"
	});
	$("#con-ul").tabso({
		cntSelect:".cc-right-wrap",
		tabEvent:"click",
		tabStyle:"fade"
    });


    $(function(){

        var rchtml="<div id=\"r_cmenu\" class=\"r-cmenu\"><div class=\"cbtn cbtn-qq\"><div class=\"qq\"><a target=\"_blank\" href=\"http://wpa.qq.com/msgrd?v=3&amp;uin=800020292&amp;site=qq&amp;menu=yes\"><img border=\"0\" src=\"http://wpa.qq.com/pa?p=2:800020292:41 &amp;r=0.22914223582483828\" alt=\"�������\"></a></div></div><div class=\"cbtn cbtn-phone\"><div class=\"phone\">400-0037-931</div></div><div class=\"cbtn cbtn-wx\"><img class=\"pic\" src=\"image/lx_weixin.jpg\" width=\"145\" height=\"145\" /></div><div class=\"cbtn cbtn-top\"></div></div>";
        $("#contact").html(rchtml);
        $("#r_cmenu").each(function(){
            $(this).find(".cbtn-wx").mouseenter(function(){
                $(this).find(".pic").fadeIn("fast");
            });
            $(this).find(".cbtn-wx").mouseleave(function(){
                $(this).find(".pic").fadeOut("fast");
            });
            $(this).find(".cbtn-qq").mouseenter(function(){
                $(this).find(".qq").fadeIn("fast");
            });
            $(this).find(".cbtn-qq").mouseleave(function(){
                $(this).find(".qq").fadeOut("fast");
            });
            $(this).find(".cbtn-phone").mouseenter(function(){
                $(this).find(".phone").fadeIn("fast");
            });
            $(this).find(".cbtn-phone").mouseleave(function(){
                $(this).find(".phone").fadeOut("fast");
            });
            $(this).find(".cbtn-top").click(function(){
                $("html, body").animate({
                    "scroll-top":0
                },"fast");
            });
        });
        var lastRmenuStatus=false;
        var px = $('#r_cmenu').css('marginLeft');  // px = '400px'
        var num= parseInt(px);  // num = 400
        $(window).scroll(function(){//bug
            var _top=$(window).scrollTop();
            if(_top>200){
                $("#r_cmenu").data("expanded",true);
            }else{
                $("#r_cmenu").data("expanded",false);
            }
            if($("#r_cmenu").data("expanded")!=lastRmenuStatus){
                lastRmenuStatus=$("#r_cmenu").data("expanded");
                if(lastRmenuStatus){
                    $("#r_cmenu .cbtn-top").slideDown();
                }else{
                    $("#r_cmenu .cbtn-top").slideUp();
                }
            }

        });

        $('#r_cmenu').scrollFollow({
            offset:120, //距离页面顶端距离120
            container: 'contact'
        });
       //tab效果
       var $li = $('#tab-tit li');
       var $ul = $('#tab-content ul');

       $li.click(function(){
           var $this = $(this);
           var $t = $this.index();
           $li.removeClass();
           $this.addClass('current');
           $ul.css('display','none');
           $ul.eq($t).css('display','block');
       })
       var $fli = $('.fl-tab li');
       var $ful = $('.fl-content ul');

       $fli.click(function(){
           var $this = $(this);
           var $ft = $this.index();
           $fli.removeClass();
           $this.addClass('current');
           $ful.css('display','none');
           $ful.eq($ft).css('display','block');
       })


    });





 })