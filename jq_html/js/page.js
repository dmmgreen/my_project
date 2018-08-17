/*<div class="textify"><div class="contentText"><div class="page1"><div class="column"></div></div></div></div>*/
(function ($) {
    $.fn.textify=function (option) {
        var defaults={
            numberOfColumn:2,//分成几列显示
            margin:20,//外边距
            padding:15,//内边距
            width:"screen",//盒子宽度(screen,auto,400)
            height:"screen",//盒子高度
            showNavigation:false,//是否显示导航
            textAlign:"justify",//字体对齐方式
            isZoom:false
        };
        var options=$.extend({},defaults,option);
        return this.each(function () {
            var columnWidth=0,//用于保存单列能展示的最大宽度
                columnHeight=0,//用于保存单列能展示的最大高度
                $textify,//用于保存第一个子元素
                $nowPage,//获取当前分页元素
                $conText,//$first.children(":first")
                $last;//保存当前页面的最后一个column元素

            /*获取可以展示的高度和宽度*/
            function getSize() {
                var w=0,h=0,
                    _width=options.width,
                    _height=options.height;
                if(_width === "auto"){
                    w=$this.width();
                }else if(_width === "screen"){
                    w=$(window).width();
                }else{
                    w=parseInt(_width);
                    if(isNaN(_width)){
                        w=defaults.width;
                    }
                }
                if(_height === "auto"){
                    h=$this.height();
                }else if(_height === "screen"){
                    h=$(window).height();
                }else{
                    h=parseInt(_height);
                    if(isNaN(_height)){
                        h=defaults.height;
                    }
                }
                return [w,h];
            }

            /*设置图片大小，判断图片是否超出宽度，重新设置比例
            * e:img对象,
            * obj,完全加载后的img对象*/
            function setImgWidth(e, obj) {
                var w=obj.attr('width') ? obj.attr('width') : e.naturalWidth,
                    h=obj.attr('height')? obj.attr('height') : e.naturalHeight;
                var thisNewHeight;
                obj.removeAttr("width");
                obj.removeAttr("height");
                if(w>columnWidth){//图片宽度>展示宽度，则宽度为展示宽度
                    thisNewHeight=Math.floor(columnWidth*h/w);
                    obj.css({display:"block",width:columnWidth,margin:0,padding:0,height:thisNewHeight});
                    if(thisNewHeight >= columnHeight){//新生成的高度>展示高度，需注意编辑器生成的内容多放在p标签，p标签是带高度的（初始化css，去掉高度）
                        obj.css({display:"block",width:"auto",margin:0,height:columnHeight-50,padding:0});
                    }
                }else {
                    if(h>=columnHeight-20){
                        obj.css({display:"block",height:columnHeight-20,margin:0,padding:0});
                    }else {
                        obj.css({display:"block","margin":"10px 0"});
                    }
                }
            }
            
            /*运行*/
            function init(e) {
                 $clone=e.clone(true);
                 var _w=getSize()[0],
                     _h=getSize()[1];
                options.startPage=1;
                $this.empty().append('<div class="textify"></div>').children().css({
                    height:_h,
                    width:_w
                }).append('<div class="contentText"></div>');
                columnWidth=Math.floor((_w-options.padding*2-options.margin*(options.numberOfColumn-1))/options.numberOfColumn);
                columnHeight=_h-options.padding*2;
                $textify=$this.children(":first");
                $conText=$textify.children(":first");
                changePage();
                var $allimg=$clone.find('img');
                if($allimg.length>0){
                    $allimg.each(function (index) {
                        var _src=$(this).attr('src');
                        var _this=$(this);
                        $("<img />").load(function () {
                            setImgWidth(this,_this);
                            /*所有图片处理完毕后，执行分页操作*/
                            if(index+1 === $allimg.length){
                                createPage();
                            }
                        }).error(function () {
                            alert("图片地址有问题");
                            $(this).attr("src","../image/361.png")
                            return false;
                        }).attr("src",_src);
                    });
                }else {
                    /*执行分页操作*/
                    createPage();
                }
            }
            
            /*分页操作*/
            function createPage() {
                var getsize=getSize();
                $textify.children().css({
                    height:getsize[1],
                    width:getsize[0]*options.startPage
                }).append('<div class="page'+options.startPage+'"></div>').children().css({
                    height:getsize[1]-options.padding*2,
                    width:getsize[0]-options.padding*2,
                    padding:options.padding,
                    "float":"left"
                });
                $nowPage=$textify.find(".page"+options.startPage);
                pageNav();
            }

            /*页面初始化操作*/
            function pageNav() {
                $last=$nowPage.children(":last");
                /*过滤li内容为空的元素移除掉*/
                $last.find("li").filter(function () {
                    return $(this).text() === "";
                }).remove();
                if(pflag){
                    $clone.find("li:first-child").css("list-style","none");
                    pflag=false;
                }
                //开启了显示导航
                if(options.showNavigation){
                    /*判断如果nav元素不存在，则新增*/
                    if($textify.find(".textify_nav").length<=0){
                        $textify.append('<div class="textify_nav"/>').children().last().css({left:Math.floor((getSize()[0]-$textify.find('.textify_nav').width()))/2}).append("<ul/>").children().attr("class","text_pagination").append(function () {
                            var $pagination=$textify.find('.text_pagination');
                            for(var i=0;i<options.startPage;i++){
                                $("<li />").appendTo($pagination).click(function () {
                                    /*点击nav翻页*/
                                    clickNav($(this));
                                });
                                if(i===0){
                                    $pagination.find("li").attr("class","selected");
                                }
                            }
                        });
                    }
                    columnHeight=getSize()[1]-options.padding*2-$('.textify_nav').outerHeight();
                }
                /*页面*/
                if($nowPage.children().length<options.numberOfColumn){
                    $nowPage.append("<div class='column' />");
                    $last=$nowPage.children(":last");
                    if($nowPage.children().length !== options.numberOfColumn){
                        $last.css("marginRight",options.margin);
                    }
                    $last.css({width:columnWidth,"float":"left","textAlign":options.textAlign});
                    /**/
                    setTimeout(function () {
                        addContent($clone,$last);
                    },0);
                }else {
                    options.startPage++;
                    if (options.showNavigation) {
                        var $pagination=$textify.find('.text_pagination');
                        var $nav=$textify.find(".textify_nav");
                            if ($nav.length > 0) {
                            $("<li/>").appendTo($pagination).click(function () {
                                clickNav($(this))
                            });
                                $nav.css({left: Math.floor((getSize()[0] - $nav.width()) / 2)})
                        }
                    }
                    $conText.css("width",getSize()[0]*options.startPage);
                    $conText.append('<div class="page'+options.startPage+'"/>');
                    $nowPage=$textify.find(".page"+options.startPage);
                    $nowPage.css({
                        height:getSize()[1]-options.padding*2,
                        width:getSize()[0]-options.padding*2,
                        "float":"left",
                        "padding":options.padding
                    }).append("<div class='column' />");
                    $last=$nowPage.children(":last");
                    if($textify.find(".column").length !== options.numberOfColumn){
                        $last.css("marginRight",options.margin);
                    }
                    $last.css({width:columnWidth,"float":"left","textAlign":options.textAlign});
                    /**/
                    setTimeout(function () {
                        addContent($clone,$last);
                    },0);
                }
                return false;
            }

            /*节点循环判断*/
            function addContent(opt,last) {
                theBox=last;
                /*后面一个判断原本是为了判断是否已经没有内容可以展示了，但是如果是img也是满足的*/
                if(opt.contents().length>0 /*&& $clone.text().length>0*/){
                    opt.contents().each(function () {
                        model=$(this).clone();
                        model.appendTo(theBox);
                        /*判断如果超出高度*/
                        if($last.height()>columnHeight){
                            model.detach();
                            /*节点内再循环判断*/
                            tagContent($(this),theBox);
                            return false;
                        }else{
                            model.detach();
                            $(this).appendTo(theBox);
                        }
                    });
                }
            }

            function tagContent(opt,box) {
                if(opt.contents().length>0 /*&& $clone.text().length>0*/){
                    if(opt[0].nodeType === 1){
                        /*生成标签*/
                        var tags=addTag(opt);
                        box.append(tags.tag);
                        theBox=box.find(tags.nodeName).last();
                    }else{
                        theBox=box;
                    }
                    opt.contents().each(function () {
                        model=$(this).clone();
                        model.appendTo(theBox);
                        if($last.height()>columnHeight){
                            model.detach();
                            if(this.nodeName === 'BR'){
                                if($clone.text().length>0){
                                    pageNav();
                                }
                                return false;
                            }else if(this.nodeName === 'IFRAME'){
                                var iframe=this;
                                iframe.height=columnHeight-50;
                                iframe.width=getSize()[0] - options.padding*2;
                                pageNav();//添加另一页
                                return false;
                            }else if($(this).contents().length>0){
                                tagContent($(this),theBox);
                                return false;
                            }else if(this.nodeName === 'IMG'){
                                pageNav();
                                return false;
                            }else {
                                /*if(opt[0].nodeName.toLowerCase() === 'pre'){
                                    pref=true;
                                }else {
                                    pref=false;
                                }*/
                                if(opt[0].nodeName.toLowerCase()==="li"){
                                    pflag=true;
                                }else{
                                    pflag=false;
                                }
                                splitText($(this),theBox);
                                return false;
                            }
                        }else {
                            model.detach();
                            $(this).appendTo(theBox);
                        }
                    })
                }else {
                    var allPar = $($clone).text().split(".");
                    var y = 0;
                    if ($last.height() <= columnHeight) {
                        while ($last.height() <= columnHeight) {
                            theBox.append(allPar[y] + ".");
                            var $prefinish = $clone.html();
                            var r = new RegExp("(?![^<>]*>)" + allPar[y] + ".");
                            var news = $clone.html();
                            news = news.replace(/\&nbsp\;/g, " ");
                            news = news.replace(r, "");
                            $clone.html(news);
                            y++
                        }
                        $clone.html($prefinish);
                        theBox.html($(theBox).html().slice(0, theBox.html().lastIndexOf(allPar[y - 1])));
                        splitText($clone, theBox);
                    }
                }
            }

            function addTag(opt) {
                var nodeName=opt[0].nodeName.toLowerCase();
                var tag="<"+nodeName;
                var attr=opt[0].attributes;
                for(var i=0;i<attr.length;i++){
                    if(attr[i].specified){
                        tag=tag+' '+attr[i].name.toLowerCase() + '="'+attr[i].value+'"';
                    }
                }
                tag=tag+"/>";
                return {nodeName:nodeName,tag:tag};
            }
            /*截字*/
            function splitText(opt,box) {
                var textString=$(opt).text().replace(/\&nbsp\;/g," "),
                    allChars=textString.split(/\s+/),
                    y=0;
                if($last.height()>=columnHeight){
                    pflag=false;
                    pref=false;
                }
                if($last.height()<=columnHeight){
                    var $prefinish,thisChar;
                    while ($last.height()<=columnHeight && y<allChars.length){
                        box.append(allChars[y]+" ");
                        $prefinish=$clone.html();
                        if(allChars[y].indexOf("[")>-1 || allChars[y].indexOf("]")>-1 || allChars[y].indexOf("(")>-1 || allChars[y].indexOf(")")>-1 || allChars[y].indexOf("?")>-1 || allChars[y].indexOf(".")>-1){
                            thisChar=allChars[y].replace(/[[]/g,"[[]");
                            thisChar=thisChar.replace(/[]]/g,"[]]");
                            thisChar=thisChar.replace(/[(]/g,"[(]");
                            thisChar=thisChar.replace(/[)]/g,"[)]");
                            thisChar=thisChar.replace(/[?]/g,"[?]");
                            thisChar=thisChar.replace(/[.]/g,"[.]");
                        }else if(allChars[y].indexOf("&")>-1){
                            thisChar="&";
                        }else {
                            thisChar=allChars[y];
                        }
                        var reg=new RegExp("(?![^<>]*>)"+thisChar);
                        var news=$clone.html();
                        news=news.replace(/&nbsp;/g," ");
                        news=news.replace(/=&gt;/g,">=");
                        news=news.replace(reg,"");
                        $clone.html(news);
                        y++
                    }
                    $clone.html($prefinish);
                    box.html($(box).html().slice(0,box.html().lastIndexOf(allChars[y-1])));
                }
                pageNav();
            }
            
            /*点击翻页*/
            function clickNav(e) {
                $textify.find(".text_pagination li").removeClass("selected");
                e.addClass("selected");
                var ml=getSize()[0]*e.index();
                $conText.animate({
                    "marginLeft":-ml
                });
            }

            /*缩放*/
            function changePage() {
                var $obj=$conText,ml,sml;
                $obj.on("gesturechange",function () {
                    options.isZoom=true;
                });
                $obj.on("gestureend",function () {
                    options.isZoom=false
                });
                if(!options.isZoom){
                    $obj.bind("touchstart touchmove touchend",function (e) {
                        if(t.originalEvent.touches.length>1){
                            return;
                        }
                        if(t.type === "touchstart"){
                            ml=parseInt($obj.css("marginLeft"));
                            sml=ml;
                            var startX=t.originalEvent.touches[0].pageX || t.originalEvent.changedTouches[0].pageX;
                            var startY=t.originalEvent.touches[0].pageY || t.originalEvent.changedTouches[0].pageY;
                        }else if(t.type === "touchmove"){
                            var movX=t.originalEvent.changedTouches[0].pageX-startX;
                            var movY=t.originalEvent.changedTouches[0].pageY-startY;
                            sml=ml+movX;
                            if(Math.abs(movY)<Math.abs(movX)){
                                $obj.css("marginLeft",sml+"px");
                                t.preventDefault();
                            }
                        }else if(t.type === "touchend"){
                            if(Math.abs(movY)<Math.abs(movX)){
                                $textify.find(".text_pagination").children().each(function () {
                                    if($(this).hasClass("selected") && ml!==sml){
                                        var obj;
                                        if(sml<ml && $(this).index()+1<$textify.find(".text_pagination").children().length){
                                            obj=$(this).next();
                                        }else if(sml>ml && $(this).index()+1>1){
                                            obj=$(this).prev();
                                        }else {
                                            obj=$(this);
                                        }
                                        sml=ml;
                                        clickNav(obj);
                                        return false;
                                    }
                                })
                            }
                        }
                    })
                }
            }
            
            var $this=$(this),
                $clone=$(this).clone(true),pflag=false,pref=false;
            init($clone);
        })
    }
})(jQuery);