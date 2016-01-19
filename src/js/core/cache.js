/**
 * 本地缓存
 * @namespace hapj.cache
 */
(function (H) {
    'use strict';

    var LS;
    try {
        // 禁用cookie时会导致安全访问问题
        LS = window.localStorage;
    } catch (e) {
        LS = false;
    }
    var prefix = 'HAPJ_';
    /**
     * @lends hapj.cache
     */
    H.cache = {
        /**
         * 是否支持缓存
         */
        enable: !!LS,
        /**
         * 设置缓存
         * @param string key 键
         * @param string value 值，必须是字符串
         * @param int expire 过期时间，单位为ms。可以为空，默认为24个小时
         * @return boolean 存储是否成功
         */
        set: function (key, value, expire) {
            key = prefix + key;
            expire = expire || 24 * 3600 * 1000;
            if (expire > 0) {
                expire = new Date().getTime() + expire;
            }
            value = expire + "\n" + hapj.json.encode(value);
            LS.setItem(key, value);
        },
        /**
         * 获取缓存
         * @param string key 键
         * @return null | string 获取失败返回false，其他返回字符串
         */
        get: function (key) {
            key = prefix + key;
            var item = LS.getItem(key);
            if (!item) return null;
            var pos = item.indexOf("\n");
            if (pos < 0) {
                throw new Error('cache.u_valueTypeErrorForRead');
            }
            var expire = item.substring(0, pos), value = hapj.json.decode(item.substring(pos + 1));

            if (expire > 0 && expire < new Date().getTime()) {
                LS.removeItem(key);
                return null;
            }
            return value;
        },
        /**
         * 删除指定的缓存
         * @param string key 键
         */
        del: function (key) {
            key = prefix + key;
            LS.removeItem(key);
            return true;
        },
        /**
         * 清理缓存，将过期缓存释放掉
         */
        clean: function () {
            var key, item, pos, expire;
            for (var i = 0, l = localStorage.length; i < l; i++) {
                key = localStorage.key(0);
                if (key.indexOf(prefix) !== 0) {
                    continue;
                }
                item = LS.getItem(key);
                pos = item.indexOf("\n");
                if (pos < 0) {
                    continue;
                }
                expire = item.substring(0, pos);
                if (expire > 0 && expire < new Date().getTime()) {
                    LS.removeItem(key);
                }
            }
        }
    };
    if (H.cache.enable) {
        // 自动清理。1/10的概率清理
        var i = Math.ceil(Math.random() * 10);
        if (i == 20) {
            setTimeout(function () {
                H.cache.clean();
            }, 10000);
        }
    }
})(hapj);