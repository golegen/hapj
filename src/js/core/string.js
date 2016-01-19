(function(H) {
    'use strict';

    /**
     * 字符串相关函数
     * @namespace hapj.string
     */
    H.string = {
        /**
         * 返回去掉前后空格的字符串
         * @function hapj.string.trim
         * @param {string} str
         * @return {string}
         */
        trim: function (str) {
            return str ? str.replace(/(^[ \t\n\r]+)|([ \t\n\r]+$)/g, '') : '';
        },
        /**
         * 去掉字符串右边的空格
         * @function hapj.string.rtrim
         * @param {string} str
         * @returns {string}
         */
        rtrim: function (str) {
            return str ? str.replace(/[ \t\n\r]+$/, '') : '';
        },
        /**
         * 去掉字符串左边的空格
         * @function hapj.string.ltrim
         * @param {string} str
         * @returns {string}
         */
        ltrim: function (str) {
            return str ? str.replace(/^[ \t\n\r]+/, '') : '';
        },
        /**
         * 将字符串进行md5加密
         * @function hapj.string.toMd5
         * @param {string} str
         * @returns {string}
         */
        toMd5: function (str) {
            return hapj.lib.serial.toString(str, 'md5');
        },
        /**
         * 将json字符串成json对象
         * @function hapj.string.toJson
         * @param str
         * @returns {*}
         */
        toJson: function (str) {
            return hapj.lib.serial.toString(str, 'json');
        },
        /**
         * 将字符串转化成键值对对象
         * @function hapj.string.toParam
         * @param {string} str
         * @returns {{}}
         */
        toParam: function (str) {
            return hapj.lib.serial.getPair(str);
        },
        /**
         * 去掉html标志
         * @function hapj.string.stripTags
         * @param {string} str
         * @return {string}
         */
        stripTags: function (str) {
            return (str || '').replace(/<[^>]+>/g, '');
        }
    };

    /**
     * @function hapj.trim
     * @see hapj.string.trim
     */
    H.trim = H.string.trim;

})(hapj);