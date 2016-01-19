(function(H) {
    'use strict';
    /**
     * json相关函数
     * @namespace hapj.json
     */
    H.json = {
        /**
         * 将js变量转化为字符串
         * @param {string} from
         * @returns {string}
         */
        encode: function (from) {
            return hapj.lib.serial.toString(from, 'json');
        },
        /**
         * 将字符串转化为js变量
         * @param from
         * @returns {*}
         */
        decode: function (from) {
            return hapj.lib.serial.getJson(from);
        }
    };
})(hapj);