function extend(obj1,obj2,obj3) {
    for(var property in obj2){
        if(typeof obj3[property]!=="undefined" && obj3[property]!==obj2[property]){
            obj1[property]=obj3[property];
        }else {
            obj1[property]=obj2[property];
        }
    }
    return obj1;
}
;(function (global, undefined) {
    "use strict";
    var _global;

    function BannerSlider(ele, option) {
        var defaults = {
            'autoPlay': true,  //是否自动播放
            'autoHeight': false,//是否自动高度
            'slideWrapper': '.slide-wrapper',//图片列表
            'slideNav': '.slide-page',//nav盒子
            'slide': '.slide',//图片
            'slideBtn': '.slide-btn',//prev,next 按钮样式
            'slidePrev': '.slide-prev',//prev按钮样式
            'slideNext': '.slide-next',//next按钮样式
            'active': 'active',//选中状态样式
            'slideTime': 4000,  //动画时间
            'hideCls': 'hide'
        };
        this.options = extend({}, defaults, option);
        //定义全局
        var $ele = ele,
            _this = this;
        this.ele = ele;
        this.$imgBox = $ele.querySelector(this.options.slideWrapper);
        this.$slide = $ele.querySelectorAll(this.options.slide);
        this.$navBox = $ele.querySelector(this.options.slideNav);
        this.$pageBtn = $ele.querySelector(this.options.slideBtn);
        this._length = this.$slide.length;//图片个数
        this.slideTarget = 0;//轮播动画的目标值
        this.timer = null;//计时器
        this.navIndex = 0;//当前图片的号数
        this.boolFlag=false;//判断是否在动画状态中
        _this.init();
    }

    BannerSlider.prototype = {
        init: function () {
            var _=this;
            this.initStyle();
            window.onresize=function () {
                _.initStyle();
            };
            this.autoPlay();
            //点击next按钮停止自动播放然后显示下一页
            this.ele.querySelector(this.options.slideNext).onclick=function () {
                _.nextSlide();
            };
            //点击prev按钮停止自动播放然后显示上一页
            this.ele.querySelector(this.options.slidePrev).onclick=function () {
                _.prevSlide();
            };
            //点击导航定位到具体的图片
            var spanArr=this.$navBox.childNodes;
            for(var i=0;i<spanArr.length;i++){
                spanArr[i].index=i;
                spanArr[i].onclick=function(){
                    var index = this.index;
                    _.slideTo(index);
                };
            }

        },
        //初始化样式
        initStyle: function () {
            this._imgBoxW = this.ele.offsetWidth;//盒子宽度
            this._imgSlideBoxW = this._imgBoxW * this._length;//图片列表宽度
            this.slideTarget = -(this.navIndex * this._imgBoxW);
            this.$imgBox.style.cssText = "width:" + this._imgSlideBoxW + "px;left:" + this.slideTarget;
            this.autoHeight();
            for(var k=0;k<this._length;k++){
                this.$slide[k].style.width=this._imgBoxW+"px";
                var imgs=this.$slide[k].getElementsByTagName("img");
                // imgs[0].style.height="100%";
            }
            /*生成nav*/
            var _html = '';
            for (var i = 0; i < this._length; i++) {
                if (this.navIndex === i) {
                    _html += '<span class="active"></span>';
                } else {
                    _html += '<span></span>';
                }
            }
            this.$navBox.innerHTML = _html;
        },
        //自动高度
        autoHeight:function () {
            var that=this;
            if (this.options.autoHeight) {
                var $img= this.$slide[this.navIndex].querySelector("img");
                var img=new Image();
                img.onload=function () {
                    var _h=(that._imgBoxW/this.width)*this.height;
                    that.ele.style.height = _h + "px";
                };
                img.src=$img.getAttribute("src");
            }
        },
        //自动播放
        autoPlay: function () {
            if (!this.options.autoPlay) {
                return false;
            }
            this.stopPlay();
            var that = this;
            this.timer = setInterval(function () {
                that.nextSlide();
            }, this.options.slideTime);
        },
        /*停止自动播放*/
        stopPlay: function () {
            clearInterval(this.timer);
        },
        //播放下一张
        nextSlide: function () {
            if(!this.boolFlag){
                var that=this;
                this.slideTarget -= this._imgBoxW;
                this.navIndex = -this.slideTarget / this._imgBoxW;
                if (this.slideTarget === -this._imgSlideBoxW) {
                    this.slideTarget=0;
                    this.navIndex = 0;
                }
                this.boolFlag=true;
                this.animate(this.$imgBox, {left: this.slideTarget}, 10,function () {
                    that.boolFlag=false;
                });
                that.autoHeight();
                that.navActive();
            }
        },
        //播放上一张
        prevSlide: function () {
            if(!this.boolFlag){
                var that=this;
                this.slideTarget+=this._imgBoxW;
                this.navIndex=-this.slideTarget/this._imgBoxW;
                if(this.navIndex<0){
                    this.slideTarget=-(this._length-1)*this._imgBoxW;
                    this.navIndex=this._length-1;
                }
                this.boolFlag=true;
                this.animate(this.$imgBox, {left: this.slideTarget}, 10,function () {
                    that.boolFlag=false;
                });
                that.autoHeight();
                that.navActive();
            }
        },
        //点击nav，直接定位图片
        slideTo: function (ind) {
            if(!this.boolFlag){
                var that=this;
                this.navIndex = ind;
                this.slideTarget = -(this._imgBoxW * this.navIndex);
                this.boolFlag=true;
                this.animate(this.$imgBox, {left: this.slideTarget}, 10,function () {
                    that.boolFlag=false;
                });
                this.autoHeight();
                this.navActive();
            }
        },
        //nav选中样式
        navActive:function () {
            var nav = this.$navBox.children;
            for (var i = 0; i < nav.length; i++) {
                if (i === this.navIndex) {
                    nav[i].setAttribute("class", this.options.active)
                } else {
                    nav[i].removeAttribute("class");
                }
            }
        },
        /*
         动画函数：
         dom:要运动的节点对象
         o:{属性：目标值，属性：目标值....}  (透明度使用属性：opacity:100) 透明度的值是0-100；  里面的opacity 和  filter会自动做转换。
         time:切换的频率，表示运动的快慢
         fn：回调函数，在运动执行完毕后执行。
         */
        animate: function (dom, o, time, fn) {
            var that = this;
            var termId=null;
            if (time == undefined) {  //默认的切换频率
                time = 10;
            }
            //termId :为每一个运动的物体添加一个属于自己的线程标识
            clearInterval(termId);

            termId = setInterval(function () { //创建一个定时器，实现运动
                dom.isOver = true; //是否可以停止定時器
                for (var property in o) {
                    if (property == "opacity") {//如果是透明度
                        var currentValue = parseInt(that.getStylePropertyValue(dom, property) * 100); //当前样式属性的值
                    } else {//其他样式属性
                        var currentValue = parseInt(that.getStylePropertyValue(dom, property)); ////当前样式属性的值
                    }

                    //速度   正速度  负速度
                    var speed = (o[property] - currentValue) / 10;
                    // 三元表达式  三目运算符
                    speed = currentValue > o[property] ? Math.floor(speed) : Math.ceil(speed);

                    currentValue += speed; //改变样式属性的值

                    if (currentValue != o[property]) {
                        dom.isOver = false; //標識不停止定時器
                    }

                    if (property == "opacity") {
                        dom.style.opacity = currentValue / 100;
                        dom.style.filter = 'alpha(opacity= ' + currentValue + ')';
                    } else {
                        dom.style[property] = currentValue + "px"; //改变物体的样式属性值
                    }

                }

                if (dom.isOver) {  //停止定时器
                    clearInterval(termId);
                    if (fn) {  //执行回调函数
                        fn();
                    }
                }

            }, time)  //基于切换的频率来改变运动的快慢

        },

        /*获取指定样式的属性值*/
        getStylePropertyValue: function (dom, property) {
            if (window.getComputedStyle) { //標準瀏覽器
                //
                return getComputedStyle(dom, null)[property];
            } else {
                return dom.currentStyle[property]; //IE瀏覽器
            }
        }
    };
    //将插件对象暴露给全局对象
    _global = (function () {
        return this || (0, eval)("this");
    }());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = BannerSlider;
    } else if (typeof define === "function" && define.amd) {
        define(function () {
            return BannerSlider;
        })
    } else {
        !("BannerSlider" in _global) && (_global.BannerSlider = BannerSlider);
    }
}());