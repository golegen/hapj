/**
 *
 * 使元素可以自动提供建议
 * @copyright Copyright (c) 2015, Jiehun.com.cn Inc. All Rights Reserved
 * @author zhangyuemei@jiehun.com.cn
 * @date 2016-1-12
 * @version ${VERSION}
 * @example
 $('#suggestable').suggestable({
    items:['qq.com', 'hotmail.com', '163.com', '126.com'],
    onSelect: function(text) {
        this.value = text;
    },
    autoSearch:true,
    searchPrefix: '@'
});

 */
(function ($) {
    'use strict';

    var defaults = {
            width: 'auto',
            height: 0,
            className: 'suggestion',
            selectedClass: 'on', // 选中后的样式名
            items: null,        // 获取的数据，可以是数组，或者函数，或者网址
            onWrapperData: null, // 封装给远程调用url的数据
            autoSearch: false,   // 是否自动搜索
            searchPrefix: '',     // 搜索的匹配前缀，比如邮箱匹配可加@
            getItem: null         // 从items里边获取到显示的文字，如果设置，必须是一个函数，且返回字符串
        },
        generateItems = function (items, getItem) {
            var ret = [];
            if (!getItem) {
                $.each(items, function (key, item) {
                    ret.push('<li>' + item + '</li>');
                });
            } else {
                $.each(items, function (key, item) {
                    ret.push('<li>' + getItem(item) + '</li>');
                });
            }
            return ret.join('');
        },
        KEY_DOWN = 40,
        KEY_UP = 38,
        KEY_TAB = 9,
        KEY_ENTER = 13,
        KEY_ESC = 27,
        isShow = false;

    /**
     * 为一个可输入的组件提供自动化建议框。
     * @namespace jQuery.fn.suggestable
     * @param {Object} options 配置参数
     * @param {*} options.items 用来提供建议的列表，可以是网址、数组、函数。函数要求返回数组对象
     * @param {int} options.width 宽度，单位为px，默认为auto
     * @param {int} options.height 高度，默认为auto
     * @param {string} options.className 建议框的样式名称，默认为suggestion
     * @param {string} options.selectedClass 建议框条目被选中的样式名称，默认为on
     * @param {function} options.onWrapperData 如果items为远程网址，此函数被用来将远程网址获取的内容封装成数组
     * @param {boolean} options.autoSearch 是否自动搜索，只有在items为数组时才会有用。默认为false
     * @param {string} options.searchPrefix 自动搜索时的匹配前缀，默认为空。只有autoSearch为true时才有用。此选项在做邮箱匹配时非常有用，可设置为@
     * @param {function} onSelect 当选择了菜单的时候发生的事件
     * @param {string} options.onSelect.text 选择的菜单的文字
     * @param {function} options.beforeShow 在显示提示列表之前的事件。如果返回false，则不显示提示菜单
     * @param {string} options.beforeShwo.value 文本框里边的值
     * @param {function} options.getItem 从items里边获取到显示的文字，如果设置，必须是一个函数，且返回字符串
     * @example
     $('#suggestable').suggestable({
        items:['qq.com', 'hotmail.com', '163.com', '126.com'],
        onSelect: function(text) {
            this.value = text;
        },
        autoSearch:true,
        searchPrefix: '@'
    });
     */

    $.fn.suggestable = function (options) {
        var conf = $.extend({}, defaults), self = this;
        $.extend(conf, options);

        if (!conf.items) {
            throw new Error('$.fn.suggestable items is required');
        }

        var pos = this.offset();
        var elem = $('<div>');
        console.log(elem);
        elem.css({
            display: 'none',
            position: 'absolute',
            left: pos.left + 'px',
            top: (pos.top + self.height()) + 'px',
            width: conf.width ? (isNaN(conf.width) ? conf.width : conf.width + 'px') : self.width() + 'px',
            height: conf.height ? conf.height + 'px' : 'auto'
        }).attr({
            'class': conf.className
        }).html('<ul></ul>');

        var container = elem.find('ul'), suggestion = new Suggestion(elem);
        suggestion.selectedClass = conf.selectedClass;

        $(document.body).append(elem);

        if (typeof conf.items == 'string') { // 是网址
            var url = conf.items;
            if (!conf.onWrapperData) {
                conf.onWrapperData = function (ret) {
                    return ret.data.suggestion;
                };
            }
            conf.items = function (callback) {
                $.ajax({
                    url: url.replace('{value}', self.attr('value')),
                    method: 'get',
                    success: function (ret) {
                        suggestion.items = conf.onWrapperData(ret);
                        callback.call(null, suggestion.items);
                    }
                });
            };
        } else if ($.isArray(conf.items)) {
            items = conf.items;
            conf.items = function (callback) {
                if (!conf.autoSearch) {
                    callback.call(null, items);
                    return;
                }
                var ret = [], value = self[0].value;
                if (conf.searchPrefix) {
                    var pos = value.indexOf(conf.searchPrefix);
                    if (pos >= 0) {
                        var str = value.substring(pos + 1);
                        $.each(items, function (i, s) {
                            if (!str) {
                                ret.push(value + s);
                            } else {
                                var p = s.indexOf(str);
                                if (p > -1) {
                                    ret.push(value.substring(0, pos) + conf.searchPrefix + s);
                                }
                            }
                        });
                    }
                } else {
                    $.each(items, function (i, s) {
                        if (s.indexOf(value) >= 0) {
                            ret.push(s);
                        }
                    });
                }
                suggestion.items = ret;
                callback.call(null, ret);
            };
        } else if (typeof conf.items == 'function') {
            var items = conf.items;
            conf.items = function (callback) {
                suggestion.items = items.call(self[0], self[0].value);
                callback.call(null, suggestion.items);
            };
        }

        suggestion.onClick = function () {
            if (conf.onSelect) {
                conf.onSelect.call(self[0], conf.getItem ? suggestion.getItem() : suggestion.get());
            }
            suggestion.hide();
        };
        this.attr('autocomplete', 'off')
            .on('keydown', function (e) {
                switch (e.keyCode) {
                    case KEY_TAB:
                    case KEY_ENTER:
                    case KEY_DOWN:
                    case KEY_UP:
                        return false;
                }
            })
            .on('keyup', function (e) {
                if (suggestion._show) {
                    switch (e.keyCode) {
                        case KEY_TAB:
                        case KEY_ENTER:
                            suggestion.onClick();
                            return false;
                        case KEY_DOWN:
                            suggestion.next();
                            return false;
                        case KEY_UP:
                            suggestion.prev();
                            return false;
                        case KEY_ESC:
                            suggestion.hide();
                            return false;
                    }
                }
                if (!conf.beforeShow || conf.beforeShow.call(self, self[0].value) !== false) {
                    conf.items(function (items) {
                        suggestion.html(generateItems(items, conf.getItem));
                        suggestion.show();
                    });
                }
            });
    };

    function Suggestion(elem) {
        this.elem = elem;
        var self = this;
        this.elem.on('li', 'mouseover', function (e) {
            var index = e.target.getAttribute('index');
            self._index = index;
            self._select(index);
        }).on('li', 'click', function (e) {
            if (self.onClick) {
                self.onClick.call(null, self.get(true));
            }
        });
        this._index = 0;
        this._show = false;
        this._menuable = !!$.fn.menuable;
    }

    Suggestion.prototype = {
        selectedClass: 'on',
        items: null,
        getItem: function () {
            return this.items[this._index];
        },
        next: function () {
            this._index++;
            if (this._index >= this._tags.length) {
                this._index = 0;
            }
            this._select(this._index);
        },
        prev: function () {
            this._index--;
            if (this._index < 0) {
                this._index = this._tags.length - 1;
            }
            this._select(this._index);
        },
        get: function (html) {
            html = !!html;
            return html ? this._tags[this._index].innerHTML : $(this._tags[this._index]).text();
        },
        _select: function (index) {
            if (index >= this._tags.length) {
                return;
            }
            this._tags.removeClass(this.selectedClass);
            this._tags[index].className = this.selectedClass;
        },
        show: function () {
            if (this._tags.length > 0) {
                this._show = true;
                this.elem.show();
            } else {
                this.hide();
            }
        },
        hide: function () {
            this._show = false;
            this.elem.hide();
        },
        html: function (html) {
            this.elem.find('ul').html(html).find('li').each(function (i) {
                this.setAttribute('index', i);
            });
            this._tags = this.elem.find('li');
            this._index = 0;
            this._select(0);
        }
    };
})(jQuery);