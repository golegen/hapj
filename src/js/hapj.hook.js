/**
 * @namespace jQuery
 */
 /**
 * @namespace jQuery.fn
 */

(function (H, $) {
    'use strict';

    /**
     * hook机制详解
     */
    $(function () {
        $('*[data-hook]').each(function () {
            var name = this.getAttribute('data-hook'),
                option = this.getAttribute('data-hook-option'),
                selector = this.getAttribute('data-hook-selector'),
                self = this;
            if (option) {
                try {
                    /* jshint ignore:start */
                    option = eval('(' + option + ')');
                    /* jshint ignore:end */
                } catch (ex) {
                    option = {};
                }
            } else {
                var hookId = this.getAttribute('data-hook-id');
                if (hookId) {
                    option = H.conf.get('hook.' + hookId);
                }
            }
            var pos = name.indexOf(',');
            if (pos > 0) {
                var arr = name.split(',');
                $.each(arr, function (i, n) {
                    var opt = {};
                    if (n in option) {
                        opt = option[n];
                    }
                    callHook(self, selector, name, opt);
                });
            } else {
                callHook(self, selector, name, option);
            }
        });
    });

    /**
     * 调用hook
     * @param elem
     * @param selctor 选择器
     * @param name
     * @param option
     */
    function callHook(elem, selector, name, option) {
        var el = $(elem);
        if (selector) {
            el = el.find(selector);
        }
        if (name in $.fn) {
            el[name].call(el, option);
        } else {
            var f = H.hook.get('hook.' + name);
            if (f && typeof f == 'function') {
                f.call(null, el, option);
            }
        }
    }
})(hapj, jQuery);

(function (H) {
    'use strict';
    // 设置一个错误的钩子
    H.hook.set('hapj.error', function (msg, url, line) {
        H.log.error({msg: msg, url: url, line: line});
    });
})(hapj);

(function ($) {
    'use strict';
    //jQuery.ajaxPrefilter(function(options, originalOptions, jqXHR) {
    //    console.log(arguments);
    //});

    var loading;

    $(document).ajaxStart(function () {
        if (!loading) {
            loading = $('<div style="background:#369;position:fixed;height:200px;width:200px;border-radius:20px;opacity:0.5;"><div class="load4"><div class="loader"></div></div></div> ').appendTo(document.body);
        }
        var w = $(document).width(), h = $(document).height();
        loading.css({
            left: w / 2 - 100,
            top: h / 2 - 100
        });

        loading.show();
    });

    $(document).ajaxComplete(function () {
        setTimeout(function () {
            loading.hide();
        }, 800);
    });

    $(document).ajaxError(function (evt, xhr, settings, error) {
        setTimeout(function () {
            loading.hide();
        }, 800);
        if ($.dialog) {
            $.dialog.error(error);
        } else {
            alert(error);
        }
    });

    $(document).ajaxSuccess(function () {
        console.log(arguments);
    });
})(jQuery);

(function (H) {
    'use strict';
    // 表单提交
    H.hook.set('form.submit', function (e, options) {
        // 设置debug参数
        var form = this, action = options.action || form.action || document.URL;
        options.action = action;

        $.ajaxable.ajaxForm(form, options);
        return false;
    });
})(hapj);