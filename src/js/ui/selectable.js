/**
 * Copyright (c) 2016, Jiehun.com.cn Inc. All Rights Reserved
 * @author dengxiaolong@jiehun.com.cn
 * @date 2016-1-11
 * @version 1.6.1
 * @brief 映射下拉框到可定制的下拉组件
 **/
!function($, Me, undefined){
    'use strict';
    var defaults = {
        selectedClassName:'on',
        showEvent:'click',
        pack:null,
        hideDelayTime:1000,  // 隐藏延迟的时间，只有showEvent为mouseover或mouseenter才有效，如果该值小于0，则不会自动掩藏
        onHide:null,
        onShow:null,
        onChange:null
    };
    /**
     * @class jQuery.fn.selectable
     * @description 主要用来将普通的下拉框组件(或ul)转化为可以自定义样式的下拉框组件。绑定到原有下拉框的事件也会起作用。
     * @param options 配置参数，目前支持的有：
     * <dl>
     *  <dt>selectedClassName:<em>string</em></dt>
     *  <dd>表示选中时的样式名称，默认为on</dd>
     *  <dt>showEvent:<em>string</em></dt>
     *  <dd>用来显示菜单的事件，可选值为mouseover、mouseenter、click，默认为click。</dd>
     *  <dt>pack:<em>function(o)</em></dt>
     *  <dd>用来设定选择选项后显示的文字<br/><label>o</label>被选中的option或被选中的li</dd>
     *  <dt>hideDelayTime:<em>Int</em></dt>
     *  <dd>隐藏延迟的时间，只有showEvent为mouseover或mouseenter才有效，如果该值小于0，则不会自动掩藏</dd>
     *  <dt>onShow:<em>function()</em></dt>
     *  <dd>显示时调用的事件</dd>
     *  <dt>onHide:<em>function()</em></dt>
     *  <dd>隐藏时调用的方法</dd>
     *  <dt>onChange:<em>function()</em></dt>
     *  <dd>更改时调用的方法</dd>
     * </dl>
     * @example
     * 详细的例子参考<a href="../examples/selectable.html" target="_blank">例子</a>
     &lt;select&gt;
     &lt;option&gt;条目1&lt;/option&gt;
     &lt;option&gt;条目2&lt;/option&gt;
     &lt;option&gt;条目3&lt;/option&gt;
     &lt;/select&gt;

     &lt;script&gt;
     $('select').on('change', function(){
	alert('change');
}).selectable({
	pack:function(o) {
		return '搜索' + o.text;
	}
});
     &lt/script&gt;

     */
    $.fn.selectable = function(options){
        //判断如果调用的标签不是select或者ul这不支持
        this.each(function(k, v){//支持多个同时调用
            if (v.tagName != 'UL' && v.tagName != 'SELECT') {
                return;
            }
            var s = new Select();
            s.type = v.tagName.toLowerCase();
            var o = {};
            $.extend(o, defaults);
            s.options = $.extend(o, options || {});
            //此时s为：Select {type: "ul", options: Object}  options//整合穿入参数和默认参数整合后的对象
            //console.log(v)
            s.init(v);
        });
        return this;
    };

    var Select = function() {};
    Select.prototype = {
        init: function(elem) { //初始化函数
            /*this:Select {type: "select", options: Object}
              elem:select
            */
            this.elem = elem;
            this._options = this.type == 'ul' ? $(this.elem).find('>li') : this.elem.options;
            this.length = this._options.length;

            // 获取原有select控件的基本属性
            this.dom = $('<dl>').addClass(this.elem.className);
            this.dom.html(this.buildHtml());

            this.dom.insertBefore(elem);
            this.bindEvents();
            this.elem.style.display = 'none';
            //此时this:Select {type: "select", options: Object, elem: select, _options: HTMLOptionsCollection[4], length: 4…}
            if (this.type == 'select') {
                if (this.elem.selectedIndex > -1) { //获取被选中的选项的索引
                    this.select(this.elem.selectedIndex);
                }
            } else {
                var self = this;
                this._options.each(function(i){  //遍历li的class等于被选中的class则让此li执行被选中的函数
                    if (this.className == self.options.selectedClassName) {
                        self.select(i);
                    }
                });
            }
        },
        length:0,
        buildHtml: function() { //获取下拉列表中的文字，将标签替掉
            var ret = [], lh = '';
            if (this.length > 8) {
                lh = ' style="height:150px;overflow:auto;overflow-x:hidden;"';
            }
            ret.push('<dt><label></label><a></a></dt>');
            ret.push('<dd style="display:none"><ul' + lh + '>');
            for(var i = 0; i < this.length; i++) {
                ret.push('<li index="' + i + '">' + (this._options[i].text || this._options[i].innerHTML) + '</li>');
            }
            ret.push('</ul></dd>');
            return ret.join('');
        },
        bindEvents: function(){
            console.log(this.options.showEvent)
            var self = this, sevent = this.options.showEvent, inMe = false;
            // 绑定dt事件
            this.dom.find('dt').on(sevent, function(e) {
                if(inMe===false){
                    inMe = true;
                    self.dom.find('dd').fadeIn('fast');
                    self.options.onShow && self.options.onShow();
                }else{
                    inMe = false;
                    self.dom.find('dd').fadeOut('fast');
                    self.options.onHide && self.options.onHide();
                }

                e.stopPropagation();
            });
            if (sevent != 'click') {
                this.dom.find('dt').click(function(){
                    return false;
                });
            }

            if (self.options.hideDelayTime >= 0 && (sevent == 'mouseover' || sevent == 'mouseenter')) {
                this.dom.on('mouseleave', function() {
                    inMe = false;
                    setTimeout(function() {
                        if (!inMe) {
                            self.dom.find('dd').fadeOut('fast');
                            self.options.onHide && self.options.onHide();
                        }
                    }, self.options.hideDelayTime);
                });
            }
            $(document).click(function() {//点击document隐藏列表
                inMe = false;
                self.dom.find('dd').fadeOut('fast');
                self.options.onHide && self.options.onHide();
            });

            // 绑定dd事件
            this.dom.on('click', 'li', function(e) {
                inMe = false;
                self.select(e.target.getAttribute('index'));
                e.stopPropagation();
                self.dom.find('dd').fadeOut('fast');
            });

            if (this.type == 'ul' && this._options.find('a').length) {
                this.dom.on('mouseover', 'a', function(e) {
                    e.target.parentNode.className = self.options.selectedClassName;
                });
                this.dom.on('mouseout', 'a', function(e) {
                    e.target.parentNode.className = '';
                });
            }
            this.dom.on('mouseover', 'li', function(e) {
                e.target.className = self.options.selectedClassName;
            });
            this.dom.on('mouseout', 'li', function(e) {
                e.target.className = '';
            });
        },
        select: function(i) { //选择事件
            var option = this._options[i], txt;
            if (this.type == 'select') {
                this.elem.selectedIndex = i;
            }
            if (this.options.pack) {
                txt = this.options.pack(option);
            } else {
                txt = option.text || $(option).text();
            }
            this.dom.find('dt > label').html(txt);

            if (this.type == 'select') {  //如果是下拉列表则让其触发change事件
                $(this.elem).trigger('change');
            } else {
                this.options.onChange && this.options.onChange(txt);
            }
        }
    };
}(jQuery);