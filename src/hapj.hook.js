!function (H, $) {
    $(function () {
        $('*[data-hook]').each(function () {
            var name = this.getAttribute('data-hook'),
                option = this.getAttribute('data-hook-option'),
                selector = this.getAttribute('data-hook-selector'),
                self = this;
            if (option) {
                try {
                    option = eval('(' + option + ')');
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
}(hapj, jQuery);

(function (H) {
    // 设置一个错误的钩子
    H.hook.set('hapj.error', function (msg, url, line) {
        H.log.error({msg: msg, url: url, line: line});
    });
})(hapj);