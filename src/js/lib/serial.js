/**
 * 序列化相关函数
 * @version ${VERSION}
 * @author ronnie<dengxiaolong@jiehun.com.cn>
 * @since 2016/01/16
 */
(function (H, undefined) {
    'use strict';
    var _e = encodeURIComponent,
        _d = decodeURIComponent,
        r20 = /%20/g,
        me,
        tos = {
            /**
             * 转化为json格式的字符串
             * @param {Mixed} from
             */
            toJsonFormatString: function (from) {
                if (undefined !== window.JSON) {
                    return JSON.stringify(from);
                }
                var results = [], v;
                if (H.isArray(from)) {
                    var self = this;
                    for (var i = 0, l = from.length; i < l; i++) {
                        v = this.toJsonFormatString(from[i]);
                        if (v !== undefined) {
                            results.push(v);
                        }
                    }
                    return '[' + results.join(',') + ']';
                } else {
                    switch (typeof from) {
                        case 'undefined':
                        case 'unknown':
                            return '';
                        case 'function':
                        case 'boolean':
                        case 'regexp':
                            return from.toString();
                        case 'number':
                            return isFinite(from) ? from.toString() : 'null';
                        case 'string':
                            return '"' +
                                from.replace(/(\\|\")/g, "\\$1").replace(/\n|\r|\t/g, function () {
                                    var a = arguments[0];
                                    return (a == '\n') ? '\\n' : (a == '\r') ? '\\r' : (a == '\t') ? '\\t' : "";
                                }) +
                                '"';
                        case 'object':
                            if (from === null) {
                                return 'null';
                            }
                            for (var p in from) {
                                v = this.toJsonFormatString(from[p]);
                                if (v !== undefined) {
                                    results.push(this.toJsonFormatString(p) + ':' + v);
                                }
                            }
                            return '{' + results.join(',') + '}';
                    }
                }
            },
            /**
             * 转化为键值对的字符串
             * @param {Object} from
             */
            toPairFormatString: function (from) {
                if (typeof from != 'object') {
                    throw new Error('serial.u_wrongTypeForPariString');
                }
                var ret = [];
                for (var key in from) {
                    var v = from[key];
                    key = _e(key);
                    if (typeof v == 'function') {
                        v = from[i].call(null);
                    } else if (H.isArray(v)) {
                        H.each(v, function (i) {
                            ret.push(key + '=' + _e(v[i]));
                        });
                        continue;
                    }
                    ret.push(key + '=' + _e(v));
                }
                return ret.join('&').replace(r20, '+');
            },
            /**
             * 转化成md5格式的字符串
             * @param {String} from
             */
            toMd5FormatString: function (from) {
                return H.lib.md5(from.toString());
            },
            /**
             * 转化成cookie格式的字符串
             * @param {Object} from
             */
            toCookieFormatString: function (from) {
                if (typeof from != 'object') {
                    throw new Error('serial.u_wrongTypeForCookieFormatString');
                }
                if (!('name' in from)) {
                    throw new Error('serial.u_keyOfNameLost');
                }
                var name = _e(from.name), value;
                if (!('value' in from) || from.value === null) {
                    value = '';
                    from.expires = -1;
                } else {
                    value = _e(from.value);
                }
                var expires = '';
                if (from.expires && (typeof from.expires == 'number' || from.expires.toUTCString)) {
                    var date;
                    if (typeof from.expires == 'number') {
                        date = new Date();
                        date.setTime(date.getTime() + (from.expires * 24 * 60 * 60 * 1000));
                    } else {
                        date = from.expires;
                    }
                    expires = '; expires=' + date.toUTCString();
                }
                var path = from.path ? '; path=' + (from.path) : '',
                    domain = from.domain ? '; domain=' + (from.domain) : '',
                    secure = from.secure ? '; secure' : '';
                return [name, '=', value, expires, path, domain, secure].join('');
            }
        },
        getKeyValue = function (from, elemTag, kvTag, key) {
            var arr = from.split(elemTag), i, l, ret = {};
            for (i = 0, l = arr.length; i < l; i++) {
                var tmp = arr[i].split(kvTag), k = _d(H.trim(tmp[0]));
                if (!k) continue;
                if (k in ret) {
                    if (!H.isArray(ret[k])) {
                        ret[k] = [ret[k]];
                    }
                    ret[k].push(_d(tmp[1]));
                } else {
                    ret[k] = _d(tmp[1]);
                }
            }
            if (key) {
                return key in ret ? ret[key] : null;
            }
            return ret;
        }
        ;

    me = {
        toString: function (from, format) {
            if (!from) {
                return '';
            }
            switch (format) {
                case 'md5':
                    return tos.toMd5FormatString(from);
                case 'json':
                    return tos.toJsonFormatString(from);
                case 'pair':
                    return tos.toPairFormatString(from);
                case 'cookie':
                    return tos.toCookieFormatString(from);
                default:
                    throw new Error('serial.u_formatNotImplemented');
            }
        },
        /**
         * 获取json对象
         * @param {Object} from
         */
        getJson: function (from) {
            if (undefined !== window.JSON) {
                return JSON.parse(from + '');
            }
            /* jshint ignore:start */
            return eval('(' + from + ')');
            /* jshint ignore:end */
        },
        /**
         * 获取cookie值
         * @param {Object} from
         * @param {Object} key
         */
        getCookie: function (from, key) {
            return getKeyValue(from, ';', '=', key);
        },
        /**
         * 获取键值对
         * @param {Object} from
         */
        getPair: function (from, key) {
            return getKeyValue(from, '&', '=', key);
        }
    };
    hapj.lib.serial = me;
})(hapj);