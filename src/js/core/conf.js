// hapj conf 配置
(function (H, undefined) {
    'use strict';

    var option = {};
    /**
     * hapj的配置系统
     * @namespace hapj.conf
     */
    H.conf = {
        /**
         * 设置选项，如果有，则会覆盖
         * @function hapj.conf.set
         * @param {string} key
         * @param {*} value
         */
        'set': function (key, value) {
            if (undefined === value && typeof key == 'object') {
                H.object.each(key, function (k, v) {
                    option[k] = v;
                });
            } else {
                option[key] = value;
            }
        },
        /**
         * 获取配置项
         * @function hapj.conf.get
         * @param {string} key
         * @param {*} def
         * @returns {*}
         */
        'get': function (key, def) {
            if (hapj.object.has(option, key)) {
                return option[key];
            }
            if (undefined === def) {
                def = null;
            }
            return def;
        },
        /**
         * 更新配置项中的值（慎用）
         * @function hapj.conf.update
         * @param {string} key
         * @param {string} prefix
         * @param {*} value
         */
        update: function (key, prefix, value) {
            if (!(key in option)) {
                return;
            }
            var o = option[key], ns = prefix.split('.'), n = ns.shift(), exp = 'option["' + key + '"]';
            while (n) {
                if (!(n in o)) return;
                o = o[n];
                exp += '["' + n + '"]';
                n = ns.shift();
            }
            if (o) {
                exp += ' = ' + value;
                /* jshint ignore:start */
                eval(exp);
                /* jshint ignore:end */
            }
        },
        /**
         * 删除指定选项
         * @function hapj.conf.remove
         * @param {string} key
         */
        remove: function (key) {
            if (hapj.object.has(option, key)) {
                delete option[key];
            }
        },
        /**
         * 获取所有配置
         * @function hapj.conf.all
         * @returns {{}}
         */
        all: function () {
            return option;
        }
    };
})(hapj);