/**
 * Copyright (c) 2016, Jiehun.com.cn Inc. All Rights Reserved
 * @author dengxiaolong@jiehun.com.cn
 * @date 2016-1-11
 * @version ${VERSION}
 * @description 映射单选按钮到界面良好的显示方式主要用于评分等场合
 * @namespace jQuery.fn.radioable
 **/
(function($, undefined) {
    'use strict';

    /**
     * @typedef jQuery.fn.radioable.options
     * @access private
     * @type {Object}
     * @description radioable的初始化参数
     * @property {string} name radio控件的name属性必填
     * @property {String} defaultClass默认的样式
     * @property {String} hoverClass 鼠标经过时的样式，其中{value}会被替换成经过的radio的值
     * @property {String} selectedClass 选择后的样式名称，其中{value}会被替换成经过的radio的值
     * @property {jQuery.fn.radioable~onChange} onChange 当选择值发生变化时的事件
     * @property {jQuery.fn.radioable~onHover} onHover 当鼠标经过时的事件
     */
    var defaults = {
        name: '',
        defaultClass: 'star',
        hoverClass: 'star-{value}',
        selectedClass: 'star-{value}',
        /**
         * 当选择值发生变化时的事件
         * this指针为被选择的radiobox
         * @callback jQuery.fn.radioable~onChange
         * @private
         * @param {Int}index被选择的radio的次序
         * @param {String}text提示文字此文字是和radio关联的label的文字
         */
        onChange: null,
        /**
         * 当鼠标经过时的事件
         * this指针为经过的radiobox
         * @callback jQuery.fn.radioable~onHover
         * @private
         * @param {number} index 经过的radio的次序
         * @param {string} text 提示文字 此文字是和radio关联的label的文字
         */
        onHover: null
    };

    //如果cls传入的是字符创则将字符串中的{value}替换成radio的value值并返回，如果是函数则将input带入执行函数
    function getRadioClass(radio, cls) {
        if (typeof cls == 'string') {
            return cls.replace('{value}', radio.value);
        } else if (typeof cls == 'function') {
            return cls.call(radio);
        }
        return '';
    }

    /**
     * 将元素内的radio控件美化 {@link jQuery.fn.radioable|详见}
     * @memberof jQuery
     * @function #radioable
     * @param {jQuery.fn.radioable.options} options 参数
     */

    /**
     * 初始化函数
     * @memberof jQuery.fn.radioable
     * @function ~new
     * @param {jQuery.fn.radioable.options} options 参数
     * @example
     &lt;style&gt;
     .star,.star-1,.star-2,.star-3,.star-4,.star-5{
		cursor:pointer;
		width:250px;
		height:50px;
		overflow:hidden;
		margin:0;
		padding:0;
		display:inline-block;
		background:url(../img/stars_sprite.gif) 0 top;
	}
     .star-1{background-position:0 -60px}
     .star-2{background-position:0 -120px}
     .star-3{background-position:0 -180px}
     .star-4{background-position:0 -240px}
     .star-5{background-position:0 -300px}
     &lt;/style&gt;

     &lt;p id="radio"&gt;
     &lt;input type="radio" name="star" value="1" id="star-1"/&gt;&lt;label for="star-1"&gt;一星级&lt;/label&gt;
     &lt;input type="radio" name="star" value="2" id="star-2"/&gt;&lt;label for="star-2"&gt;二星级&lt;/label&gt;
     &lt;input type="radio" name="star" value="3" id="star-3"/&gt;&lt;label for="star-3"&gt;三星级&lt;/label&gt;
     &lt;input type="radio" name="star" value="4" id="star-4"/&gt;&lt;label for="star-4"&gt;四星级&lt;/label&gt;
     &lt;input type="radio" name="star" value="5" id="star-5"/&gt;&lt;label for="star-5"&gt;五星级&lt;/label&gt;
     &lt;/p&gt;
     &lt;span id="hint"&gt;&lt;/span&gt;

     &lt;script&gt;
     var hint = $('#hint');
     $('#radio').radioable({
		name:'star',    input的name
		width:250,       背景图片的宽度
		onHover:function(i, t){
			hint.html('<span style="color:#FCC">' + t + '</span>');
		},
		onChange:function(i, t) {
			hint.html('<span style="color:#F00">' + t + '</span>');
		}
	});
     &lt;/script&gt;
     */
    $.fn.radioable = function (options) {
        var self = this[0];
        var opt = $.extend($.extend({}, defaults), options || {});
        //如果未填写name参数直接报错
        if (!opt.name) {
            throw new Error('radioable.noNameSupplied');
        }
        //设置一个空的jQuer对象
        var radios = $('');
        //如果容器内的单选框的name符合参数中的name则添加到radios中
        this.find('input').each(function () {
            if (this.type == 'radio' && this.name && this.name == opt.name) {
                radios = radios.add(this);
            }
        });
        if (radios.length <= 0) {
            return;
        }
        radios.each(function (i, r) {
            r.setAttribute('hoverClass', getRadioClass(r, opt.hoverClass));
            r.setAttribute('selectedClass', getRadioClass(r, opt.selectedClass));
            var label = $(r).next('label');
            if (!label.attr('for') || label.attr('for') == r.id) {
                r.setAttribute('hintText', $.trim(label.html()));
            }
            r.style.visibility = 'hidden';
            label.css('visibility', 'hidden');
        });
        var left = this.offset().left,
            width = opt.width || this.width(),
        //根据radios的个数均分容器
            offset = width / radios.length,
            currentCls = opt.defaultClass,
            currentIndex = -1,
            selected = false,
            selectedIndex = -1;

        //输入移入时的函数，传入事件发生的坐标，根据坐标相对容器的位置判断所在的区域，添加更改相应的dlass
        function hoverRadio(pos) {
            var index = parseInt(pos / offset, 10),
                delta = pos % offset;

            if (index === 0 && delta < 2) {
                currentIndex = -1;
                currentCls = self.className = opt.defaultClass;
                if (opt.onHover) {
                    opt.onHover.call(null, index, '');
                }
                return;
            }

            if (delta > 0) {
                var clsName = radios[index].getAttribute('hoverClass');
                if (clsName != currentCls) {
                    currentIndex = index;
                    self.className = clsName;
                    currentCls = clsName;
                    if (opt.onHover) {
                        opt.onHover.call(radios[index], index, radios[index].getAttribute('hintText'));
                    }
                }
            }
        }

        //选中的时候根据index判断点击的是那个块，则让对应的单选框选中
        function selectRadio() {
            if (currentIndex == -1) {
                radios[selectedIndex].checked = false;
                selectedIndex = currentIndex;
                selected = false;
                if (opt.onChange) {
                    opt.onChange.call(null, selectedIndex, '');
                }
                return;
            }
            if (currentIndex > -1 && currentIndex < radios.length) {
                selected = true;
                selectedIndex = currentIndex;
                radios[currentIndex].checked = true;
                self.className = radios[currentIndex].getAttribute('selectedClass');
                if (opt.onChange) {
                    opt.onChange.call(radios[currentIndex], currentIndex, radios[currentIndex].getAttribute('hintText'));
                }
            }
        }

        this.on('mousemove', function (e) {
                hoverRadio(e.clientX - left);
            })
            .on('touchmove', function (e) {
                e.preventDefault();
                var touch = e.targetTouches[0];
                hoverRadio(touch.pageX - left);
            })
            .on('click', function (e) {
                hoverRadio(e.clientX - left);
                selectRadio();
            })
            .on('touchend', selectRadio)
            .on('mouseleave', function () {
                if (!selected) {
                    self.className = opt.defaultClass;
                    if (opt.onChange) {
                        opt.onChange.call(null, -1, '');
                    }
                } else {
                    self.className = radios[selectedIndex].getAttribute('selectedClass');
                }
                currentCls = self.className;
            });
        self.className = opt.defaultClass;
        this.addClass(opt.defaultClass);
        return this;
    };
})(jQuery);