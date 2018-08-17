/*
 * Textify - Columnize, Paginate and Touch Your Long Text
 * Programmer: Fabio Ferrante
 * CodeCanyon: http://codecanyon.net/user/kernelstudio/portfolio
 *
 * If this script you like, please put a comment on codecanyon.
 *
 * Includes jQuery Easing v1.3
 * http://gsgd.co.uk/sandbox/jquery/easing/
 * Copyright (c) 2008 George McGinley Smith
 * jQuery Easing released under the BSD License.
 *   $this=$(this)   <=   d = e(this);
 *   a = r.find(".page" + t.startPage)
 *   f = a.children(":last");
 *   r = $this.children(":first");   =>约等于$('.textify')
 *   u = r.children(":first");       =>约等于$('.contentText')
 *   v = $(this).clone(true);
 *   m = $(this);
 */
(function ($) {
    $.fn.textify = function (t) {
        defaults = {
            numberOfColumn: 2,
            margin: 20,
            padding: 15,
            width: "screen",
            height: "screen",
            showNavigation: true,
            textAlign: "justify",
            isZoom: false
        };
        var n;
        var t = $.extend(defaults, t);
        return this.each(function () {
            /*
             * 该方法应该是获取展示的宽度高度
             * */
            function getSize() {
                if (t.width === "auto") {
                    l = $this.width()
                } else if (t.width === "screen") {
                    l = $(window).width()
                } else if (typeof t.width == "string") {
                    l = parseInt(t.width);
                    if (isNaN(t.width)) {
                        l = defaults.width
                    }
                } else {
                    l = t.width
                }
                if (t.height === "auto") {
                    c = $this.height()
                } else if (t.height === "screen") {
                    c = $(window).height()
                } else if (typeof t.height === "string") {
                    c = parseInt(t.height);
                    if (isNaN(t.height)) {
                        c = defaults.height
                    }
                } else {
                    c = t.height
                }
                return [l, c]
            }

            /* e:this   <img src="image/image1.jpg">
             * r:$(this).children(":first")
             * s:width    最大宽度
             * t:  img 对象
             * 该方法应该是判断图片是否超出宽度，重新设置比例
             * */
            function setImgWidth(e, t) {
                var w=t.attr('width')?t.attr('width'):e.naturalWidth,
                    h=t.attr('height')?t.attr('height'):e.naturalHeight;
                if (w > s) {
                    thisNewHeight = s * h/w ;
                    t.css({display: "block", width: s, margin: 0, padding: 0,height:thisNewHeight});
                    if (thisNewHeight >= o) {
                        t.css({display: "block", width: "auto", margin: 0, height: o-50, padding: 0});
                    }
                } else {
                    if (h >= o - 150) {
                        t.css({display: "block", height: o - 150, margin: 0, padding: 0})
                    } else {
                        t.css({display: "block", "margin-top": "10px", "margin-bottom": "10px"})
                    }
                }
            }


            function b(n) {
                v = n.clone(true);
                m = n.clone(true);
                getSize();
                t.startPage = 1;
                $this.empty().append('<div class="textify"/>').children().css({
                    height: c,//getSize().c
                    width: l
                }).append('<div class="contentText"/>');
                s = Math.floor((l - t.padding * 2 - t.margin * (t.numberOfColumn - 1)) / t.numberOfColumn);//columnWidth
                o = c - t.padding * 2;//columnHeight
                r = $this.children(":first");
                u = r.children(":first");
                changePage();
                if (v.find("img").length > 0) {
                    v.find("img").each(function (index) {
                        var n = $(this).attr("src");
                        var _this = $(this);
                        var i = $("<img />").load(function () {
                            setImgWidth(this, _this);
                            if (index + 1 === v.find("img").length) {
                                E()
                            }
                        }).error(function () {
                            alert("There was a problem with the image file");
                            return false
                        }).attr("src", n)
                    })
                } else {
                    E()
                }
            }

            /*
             *暂时猜测是初始化第一页
             */
            function E() {
                r.children().css({
                    height: c,
                    width: l * t.startPage
                }).append('<div class="page' + t.startPage + '" />').children().css({
                    height: c - t.padding * 2,
                    width: l - t.padding * 2,
                    padding: t.padding,
                    "float": "left"
                });
                a = r.find(".page" + t.startPage);
                pageNav()
            }

            //t移除已经插入page中的节点
            function S(opt, n) {
                theBox = n;
                if (opt.contents().length > 0 /*&& v.text().length > 0*/) {
                    opt.contents().each(function () {
                        model = $(this).clone();
                        model.appendTo(theBox);
                        //超出高度，处理
                        if (f.height() > o) {//f:$last
                            model.detach();
                            x($(this), theBox);
                            return false
                        } else {
                            model.detach();
                            $(this).appendTo(theBox);
                        }
                    })
                }
            }
            function x(opt, n) {
                if (opt.contents().length > 0 /*&& v.text().trim().length > 0*/) {
                    if (opt[0].nodeType === 1) {
                        T(opt);
                        n.append(tag);
                        theBox = n.find(nodeName).last()
                    } else {
                        theBox = n
                    }
                    opt.contents().each(function (n) {
                        model = $(this).clone();
                        model.appendTo(theBox);
                        if (f.height() > o) {
                            model.detach();
                            if(this.nodeName==='BR'){
                                pageNav();//添加另一页
                                return false;
                            }else
                            if (this.nodeName === "IFRAME") {//超出高度节点为iframe
                                var iframe=this;
                                iframe.height=o-50;
                                iframe.width=l-t.padding*2;
                                pageNav();//添加另一页
                                return false
                            }
                            //超出高度里的子节点大于0(超出节点为iframe会报错)
                            else if ($(this).contents().length > 0) {
                                x($(this), theBox);
                                return false
                            } else if ($(this)[0].nodeName === "IMG") {//超出高度节点为img当前节点为img，则添加分页
                                pageNav();//添加另一页*/
                                return false
                            }else {
                                if (opt[0].nodeName.toLowerCase() === "pre") {//超出高度节点为li
                                    pref = true
                                } else {
                                    pref = false
                                }
                                if (opt[0].nodeName.toLowerCase() === "li") {//超出高度节点为li
                                    p = true
                                } else {
                                    p = false
                                }
                                N($(this), theBox);
                                return false
                            }
                        } else {
                            model.detach();
                            $(this).appendTo(theBox);
                        }
                    })
                } else {
                    allPar = $(t).text().split(".");
                    y = 0;
                    if (f.height() <= o) {
                        while (f.height() <= o) {
                            n.append(allPar[y] + ".");
                            $prefinish = v.html();
                            var r = new RegExp("(?![^<>]*>)" + allPar[y] + ".");
                            news = v.html();
                            news = news.replace(/\&nbsp\;/g, " ");
                            news = news.replace(r, "");
                            v.html(news);
                            y++
                        }
                        v.html($prefinish);
                        n.html(e(n).html().slice(0, n.html().lastIndexOf(allPar[y - 1])));
                        N(v, theBox);
                    }
                }
            }

            function T(e) {
                nodeName = e[0].nodeName.toLowerCase();
                var t, n, r, i;
                i = {};
                tag = "<" + nodeName;
                attr = e[0].attributes;
                for (t = 0; t < attr.length; t++) {
                    if (attr[t].specified) {
                        tag = tag + ' ' + attr[t].name.toLowerCase() + '="' + attr[t].value+'"';
                    }
                }
                tag = tag + "/>";
                return [nodeName, tag]
            }

            function N(t, n) {
                textString = $(t).text().replace(/\&nbsp\;/g, " ");
                // allChars = textString.split('');
                allChars = textString.split(/\s+/);
                y = 0;
                if (f.height() >= o) {
                    p = false;
                    pref=false;
                }
                if (f.height() <= o) {
                    while (f.height() <= o && y<allChars.length) {
                        // n.append(allChars[y]);
                        n.append(allChars[y] + " ");
                        $prefinish = v.html();
                        if (allChars[y].indexOf("[") > -1 || allChars[y].indexOf("]") > -1 || allChars[y].indexOf("(") > -1 || allChars[y].indexOf(")") > -1 || allChars[y].indexOf("?") > -1 || allChars[y].indexOf(".") > -1) {
                            thisChar = allChars[y].replace(/[[]/g, "[[]");
                            thisChar = thisChar.replace(/[]]/g, "[]]");
                            thisChar = thisChar.replace(/[(]/g, "[(]");
                            thisChar = thisChar.replace(/[)]/g, "[)]");
                            thisChar = thisChar.replace(/[?]/g, "[?]");
                            thisChar = thisChar.replace(/[.]/g, "[.]");
                        }else if (allChars[y].indexOf("&") > -1) {
                            thisChar = "&"
                        } else {
                            thisChar = allChars[y]
                        }
                        var r = new RegExp("(?![^<>]*>)" + thisChar);
                        news = v.html();
                        news = news.replace(/&nbsp;/g, " ");
                        news = news.replace(/=&gt;/g, "");
                        news = news.replace(r, "");
                        v.html(news);
                        y++;
                    }
                    v.html($prefinish);
                    n.html($(n).html().slice(0, n.html().lastIndexOf(allChars[y - 1])))
                }
                pageNav()
            }

            /*
             * 该方法应该是生成nav小标点并且执行分页方法*/
            function pageNav() {
                f = a.children(":last");
                f.find("li").filter(function () {
                    return $(this).text() == ""
                }).remove();
                if (p) {
                    v.find("li:first-child").css("list-style", "none");//v:$clone
                    p = false
                }
                if (t.showNavigation) {
                    if (r.find(".textify_nav").length == 0) {//r:$first
                        r.append('<div class="textify_nav"/>').children().last().css({left: Math.floor((l - r.find(".textify_nav").width()) / 2)}).append("<ul/>").children().attr("class", "text_pagination").append(function () {
                            var n = "";
                            h = r.find(".text_pagination");
                            for (i = 0; i < t.startPage; i++) {
                                $("<li/>").appendTo(h).click(function () {
                                    clickNav($(this))
                                });
                                if (i === 0) {
                                    h.find("li").attr("class", "selected")
                                }
                            }
                        })
                    }
                    o = c - t.padding * 2 - $(".textify_nav").outerHeight()
                }
                //初始页
                if (a.children().length < t.numberOfColumn) {
                    a.append('<div class="column"/>');
                    f = a.children(":last");
                    if (a.children().length !== t.numberOfColumn) {
                        f.css("margin-right", t.margin)
                    }
                    f.css({width: s, "float": "left", "text-align": t.textAlign});
                    setTimeout(function () {
                        S(v, f)
                    }, 0)
                } else {//大于一页
                    t.startPage++;
                    if (t.showNavigation) {
                        if (r.find(".textify_nav").length > 0) {
                            $("<li/>").appendTo(h).click(function () {
                                clickNav($(this))
                            });
                            r.find(".textify_nav").css({left: Math.floor((l - r.find(".textify_nav").width()) / 2)})
                        }
                    }
                    u.css("width", l * t.startPage);
                    u.append('<div class="page' + t.startPage + '" />');
                    a = r.find(".page" + t.startPage);
                    a.css({height: c - t.padding * 2, width: l - t.padding * 2, padding: t.padding, "float": "left"});
                    a.append('<div class="column"/>');
                    f = a.children(":last");
                    if (r.find(".column").length !== t.numberOfColumn) {//r:$first
                        f.css("margin-right", t.margin)
                    }
                    f.css({width: s, "float": "left", "text-align": t.textAlign});
                    setTimeout(function () {
                        S(v, f)
                    }, 0)
                }
                return false
            }
            /*
             * 该方法应该是点击nav小标点，更改样式*/
            function clickNav(e) {
                r.find(".text_pagination li").removeClass("selected");
                e.addClass("selected");
                marginLeft = l * e.index();
                u.animate({marginLeft: [-marginLeft, "easeOutExpo"]}, 600)
            }

            /*
             * 该方法应该是设置手动拖拽效果*/
            function changePage() {
                var n, i, s, o = u;
                o.on("gesturechange", function (e) {
                    t.isZoom = true
                });
                o.on("gestureend", function (e) {
                    t.isZoom = false
                });
                if (!t.isZoom) {
                    o.bind("touchstart touchmove touchend", function (t) {
                        if (t.originalEvent.touches.length > 1)return;
                        if (t.type == "touchstart") {
                            i = parseInt(o.css("margin-left"));
                            s = i;
                            n = t.originalEvent.touches[0].pageX || t.originalEvent.changedTouches[0].pageX;
                            startY = t.originalEvent.touches[0].pageY || t.originalEvent.changedTouches[0].pageY
                        } else if (t.type == "touchmove") {
                            movX = t.originalEvent.changedTouches[0].pageX - n;
                            movY = t.originalEvent.changedTouches[0].pageY - startY;
                            s = i + movX;
                            if (Math.abs(movY) < Math.abs(movX)) {
                                o.css("margin-left", s + "px");
                                t.preventDefault()
                            }
                        } else if (t.type == "touchend") {
                            if (Math.abs(movY) < Math.abs(movX)) {
                                r.find(".text_pagination").children().each(function () {
                                    if ($(this).hasClass("selected") && i !== s) {
                                        if (s < i && $(this).index() + 1 < r.find(".text_pagination").children().length) {
                                            obj = $(this).next()
                                        } else if (s > i && $(this).index() + 1 > 1) {
                                            obj = $(this).prev()
                                        } else {
                                            obj = $(this)
                                        }
                                        s = i;
                                        clickNav(obj);
                                        return false
                                    }
                                })
                            }
                        }
                    })
                }
            }
/*r:$first；u:$first_first;a:$nowPage? a = r.find(".page" + t.startPage);;f:$last,*/
            var r, s, o, u, a, f, l, c, h, p = false,pref=false;
            var $this = $(this);
            var v = $(this).clone(true);//v:$clone
            var m = $(this);
            b(v);
            /*$(window).resize(function () {
             getSize();
             if (l !== $(".textify").width() || c !== $(".textify").height()) {
             clearInterval(n);
             $this.empty();
             $this.next(".textify_nav").remove();
             n = setTimeout(function () {
             b(m)
             }, 0)
             }
             })*/
        })
    }
})(jQuery);