(function(){
    'use strict';

    /**
     * 对象相关函数
     * @namespace hapj.object
     */
    H.object = {
        /**
         * a是否包含属性b
         * @function hapj.object.has
         * @param {Object} a
         * @param {Object} b
         * @return {boolean}
         */
        has: function (a, b) {
            return a.hasOwnProperty(b);
        },
        /**
         * 对对象执行循环
         * @function hapj.object.each
         * @param {{}} obj
         * @param {function} func
         * @param {*} me this指针指向的对象
         */
        each: function (obj, func, me) {
            for (var k in obj) {
                if (!this.has(obj, k) || obj[k] === null) continue;
                if (func.call(me || obj[k], k, obj[k]) === false) {
                    break;
                }
            }
        },
        /**
         * 继承属性, 将b的属性继承到a
         * @function hapj.object.extend
         * @param {{}} a
         * @param {{}} b
         * @returns {{}}
         */
        extend: function (a, b) {
            if (typeof a == 'undefined') {
                a = {};
            }
            for (var k in b) {
                a[k] = b[k];
            }
            return a;
        },
        /**
         * 转化为参数形式
         * @function hapj.object.toString
         * @param {object} from
         * @return {string}
         */
        toString: function (from) {
            return hapj.lib.serial.toString(from, 'pair');
        },
        /**
         * 判断是否为空对象
         * @function hapj.object.isEmpty
         * @param {object} obj
         * @return {boolean}
         */
        isEmpty: function (obj) {
            for (var k in obj) {
                if (this.has(obj, k)) {
                    return false;
                }
            }
            return true;
        }
    };

    /**
     * @function hapj.extend
     * @see hapj.object.extend
     */
    H.extend = H.object.extend;
})(hapj);