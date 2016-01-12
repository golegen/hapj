/**
 * Copyright (c) 2016, Jiehun.com.cn Inc. All Rights Reserved
 * @author dengxiaolong@jiehun.com.cn
 * @date 2016-1-11
 * @version 1.6.1
 * @brief ӳ�������򵽿ɶ��Ƶ��������
 **/
!function($, Me, undefined){
    'use strict';
    var defaults = {
        selectedClassName:'on',
        showEvent:'click',
        pack:null,
        hideDelayTime:1000,  // �����ӳٵ�ʱ�䣬ֻ��showEventΪmouseover��mouseenter����Ч�������ֵС��0���򲻻��Զ��ڲ�
        onHide:null,
        onShow:null,
        onChange:null
    };
    /**
     * @class jQuery.fn.selectable
     * @description ��Ҫ��������ͨ�����������(��ul)ת��Ϊ�����Զ�����ʽ��������������󶨵�ԭ����������¼�Ҳ�������á�
     * @param options ���ò�����Ŀǰ֧�ֵ��У�
     * <dl>
     *  <dt>selectedClassName:<em>string</em></dt>
     *  <dd>��ʾѡ��ʱ����ʽ���ƣ�Ĭ��Ϊon</dd>
     *  <dt>showEvent:<em>string</em></dt>
     *  <dd>������ʾ�˵����¼�����ѡֵΪmouseover��mouseenter��click��Ĭ��Ϊclick��</dd>
     *  <dt>pack:<em>function(o)</em></dt>
     *  <dd>�����趨ѡ��ѡ�����ʾ������<br/><label>o</label>��ѡ�е�option��ѡ�е�li</dd>
     *  <dt>hideDelayTime:<em>Int</em></dt>
     *  <dd>�����ӳٵ�ʱ�䣬ֻ��showEventΪmouseover��mouseenter����Ч�������ֵС��0���򲻻��Զ��ڲ�</dd>
     *  <dt>onShow:<em>function()</em></dt>
     *  <dd>��ʾʱ���õ��¼�</dd>
     *  <dt>onHide:<em>function()</em></dt>
     *  <dd>����ʱ���õķ���</dd>
     *  <dt>onChange:<em>function()</em></dt>
     *  <dd>����ʱ���õķ���</dd>
     * </dl>
     * @example
     * ��ϸ�����Ӳο�<a href="../examples/selectable.html" target="_blank">����</a>
     &lt;select&gt;
     &lt;option&gt;��Ŀ1&lt;/option&gt;
     &lt;option&gt;��Ŀ2&lt;/option&gt;
     &lt;option&gt;��Ŀ3&lt;/option&gt;
     &lt;/select&gt;

     &lt;script&gt;
     $('select').on('change', function(){
	alert('change');
}).selectable({
	pack:function(o) {
		return '����' + o.text;
	}
});
     &lt/script&gt;

     */
    $.fn.selectable = function(options){
        //�ж�������õı�ǩ����select����ul�ⲻ֧��
        this.each(function(k, v){//֧�ֶ��ͬʱ����
            if (v.tagName != 'UL' && v.tagName != 'SELECT') {
                return;
            }
            var s = new Select();
            s.type = v.tagName.toLowerCase();
            var o = {};
            $.extend(o, defaults);
            s.options = $.extend(o, options || {});
            //��ʱsΪ��Select {type: "ul", options: Object}  options//���ϴ��������Ĭ�ϲ������Ϻ�Ķ���
            //console.log(v)
            s.init(v);
        });
        return this;
    };

    var Select = function() {};
    Select.prototype = {
        init: function(elem) { //��ʼ������
            /*this:Select {type: "select", options: Object}
              elem:select
            */
            this.elem = elem;
            this._options = this.type == 'ul' ? $(this.elem).find('>li') : this.elem.options;
            this.length = this._options.length;

            // ��ȡԭ��select�ؼ��Ļ�������
            this.dom = $('<dl>').addClass(this.elem.className);
            this.dom.html(this.buildHtml());

            this.dom.insertBefore(elem);
            this.bindEvents();
            this.elem.style.display = 'none';
            //��ʱthis:Select {type: "select", options: Object, elem: select, _options: HTMLOptionsCollection[4], length: 4��}
            if (this.type == 'select') {
                if (this.elem.selectedIndex > -1) { //��ȡ��ѡ�е�ѡ�������
                    this.select(this.elem.selectedIndex);
                }
            } else {
                var self = this;
                this._options.each(function(i){  //����li��class���ڱ�ѡ�е�class���ô�liִ�б�ѡ�еĺ���
                    if (this.className == self.options.selectedClassName) {
                        self.select(i);
                    }
                });
            }
        },
        length:0,
        buildHtml: function() { //��ȡ�����б��е����֣�����ǩ���
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
            // ��dt�¼�
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
            $(document).click(function() {//���document�����б�
                inMe = false;
                self.dom.find('dd').fadeOut('fast');
                self.options.onHide && self.options.onHide();
            });

            // ��dd�¼�
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
        select: function(i) { //ѡ���¼�
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

            if (this.type == 'select') {  //����������б������䴥��change�¼�
                $(this.elem).trigger('change');
            } else {
                this.options.onChange && this.options.onChange(txt);
            }
        }
    };
}(jQuery);