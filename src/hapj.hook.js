!function (H, $) {
    $(function () {
        $('*[data-hook]').each(function () {
            var name = this.getAttribute('data-hook'),
                option = this.getAttribute('data-hook-option'),
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
                    callHook(self, name, opt);
                });
            } else {
                callHook(self, name, option);
            }
        });
    });

    /**
     * 调用hook
     * @param elem
     * @param name
     * @param option
     */
    function callHook(elem, name, option) {
        if (name in $.fn) {
            var el = $(elem);
            el[name].call(el, option);
        } else {
            var f = H.hook.get('hook.' + name);
            if (f && typeof f == 'function') {
                f.call(null, $(elem), option);
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