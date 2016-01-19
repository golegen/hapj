(function (H) {
    'use strict';
    
    var ps, cs;
    /**
     * 页面相关事情的处理
     * @namespace hapj.page
     */
    H.page = {
        /**
         * 获取页面url参数
         * @function hapj.page.getParam
         * @param {string} key
         * @return {string}
         */
        getParam: function (key) {
            if (!ps) {
                ps = hapj.page.getParams();
            }
            return ps[key];
        },
        /**
         * 获取所有网页参数
         * @function hapj.page.getParams
         * @return {array}
         */
        getParams: function () {
            return ps ? ps : (ps = hapj.lib.serial.getPair(location.search ? location.search.substr(1) : ''));
        },
        /**
         * 设置cookie值
         * @function hapj.page.setCookie
         * @param {String} key 名称
         * @param {String} value 值
         * @param {Date | Number} expire 过期时间
         * @param {String} path 路径
         * @param {String} domain 域名
         * @param {Boolean} secure 是否安全
         */
        setCookie: function (key, value, expire, path, domain, secure) {
            document.cookie = hapj.lib.serial.toString({
                name: key,
                value: value,
                expires: expire,
                path: path,
                domain: domain,
                secure: secure
            }, 'cookie');
        },
        /**
         * 获取cookie值
         * @function hapj.page.getCookie
         * @param {String} key
         */
        getCookie: function (key) {
            if (!cs) {
                cs = hapj.page.getCookies();
            }
            return cs[key];
        },
        /**
         * 获取所有cookie对象
         * @function hapj.page.getCookies
         * @return {{}}
         */
        getCookies: function () {
            return cs ? cs : (cs = hapj.lib.serial.getCookie(document.cookie));
        }
    };
})(hapj);