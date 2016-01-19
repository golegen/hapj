(function (H) {
    'use strict';

    var ts = Object.prototype.toString;


    /**
     * 数组相关函数
     * @namespace hapj.array
     */
    H.array = {
        /**
         * 是否为数组
         * @function hapj.array.isArray
         * @param {*} arr
         * @returns {boolean}
         */
        isArray: function (arr) {
            return ts.call(arr) == '[object Array]';
        },
        /**
         * 循环数组
         * @function hapj.array.each
         * @param {array} obj
         * @param {function} func 函数
         *   function(obj, func)
         * @param {*} me this指针
         */
        each: function (obj, func, me) {
            for (var i = 0, l = obj.length; i < l; i++) {
                if (obj[i] === null) continue;
                if (func.call(me || obj[i], i, obj[i]) === false) {
                    break;
                }
            }
        },
        /**
         * 合并两个数组，将arr2合并到arr1
         * @function hapj.array.merge
         * @param {array} arr1
         * @param {array} arr2
         */
        merge: function (arr1, arr2) {
            for (var i = 0, l = arr2.length; i < l; i++) {
                arr1.push(arr2[i]);
            }
            return arr1;
        }
    };

    /**
     * @function hapj.isArray
     * @see hapj.array.isArray
     */
    H.isArray = H.array.isArray;
})(hapj);