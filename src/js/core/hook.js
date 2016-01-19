(function (H) {
    'use strict';

    var hooks = {};
    /**
     * hook机制
     * @namespace hapj.hook
     */
    H.hook = {
        /**
         * 设置hook
         * @function hapj.hook.set
         * @param {string} name 名称
         * @param {function} h 函数
         */
        'set': function (name, h) {
            if (!(name in hooks)) {
                hooks[name] = [];
            }
            hooks[name].push(h);
        },
        /**
         * 获取hook
         * @function hapj.hook.get
         * @param name
         * @returns {function}
         */
        'get': function (name) {
            if (!(name in hooks)) {
                return null;
            }
            return hooks[name][0];
        },
        /**
         * 获取多个hook
         * @function hapj.hook.gets
         * @param {string} name 名称
         * @returns {array}
         */
        gets: function (name) {
            if (!(name in hooks)) {
                return [];
            }
            return hooks[name];
        },
        /**
         * 删除hook
         * @function hapj.hook.remove
         * @param {string} name
         */
        remove: function (name) {
            if (name in hooks) {
                delete hooks[name];
            }
        }
    };
})(window.hapj);