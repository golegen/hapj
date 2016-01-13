/**
 * Copyright (c) 2016, Jiehun.com.cn Inc. All Rights Reserved
 * @namespace hapj
 * @author <ronnie>dengxiaolong@jiehun.com.cn
 * @date 2016-01-07
 * @version 1.6.1
 * @description hapj 1.6.1版本，去掉基础ui功能，完全依赖jQuery作为UI底层。增加全新的hook机制
 **/
window.hapj = {
    __version: '1.6.1',
    /**
     * @descript 官方类库
     */
    lib: {},
    /**
     * @description 第三方扩展
     */
    ext: {}
};


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

/**
 * Copyright (c) 2012, Jiehun.com.cn Inc. All Rights Reserved
 * @author dengxiaolong@jiehun.com.cn
 * @since 2012-01-09
 * @version 1.0
 * @brief md5算法
 **/
/* jshint ignore:start */
(function (H) {
    /*
     * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
     * Digest Algorithm, as defined in RFC 1321.
     * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
     * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
     * Distributed under the BSD License
     * See http://pajhome.org.uk/crypt/md5 for more info.
     */

    /*
     * Configurable variables. You may need to tweak these to be compatible with
     * the server-side, but the defaults work in most cases.
     */
    var hexcase = 0;
    /* hex output format. 0 - lowercase; 1 - uppercase        */
    var b64pad = "";
    /* base-64 pad character. "=" for strict RFC compliance   */

    /*
     * These are the functions you'll usually want to call
     * They take string arguments and return either hex or base-64 encoded strings
     */
    function hex_md5(s) {
        return rstr2hex(rstr_md5(str2rstr_utf8(s)));
    }

    function b64_md5(s) {
        return rstr2b64(rstr_md5(str2rstr_utf8(s)));
    }

    function any_md5(s, e) {
        return rstr2any(rstr_md5(str2rstr_utf8(s)), e);
    }

    function hex_hmac_md5(k, d) {
        return rstr2hex(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)));
    }

    function b64_hmac_md5(k, d) {
        return rstr2b64(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)));
    }

    function any_hmac_md5(k, d, e) {
        return rstr2any(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)), e);
    }

    /*
     * Perform a simple self-test to see if the VM is working
     */
    function md5_vm_test() {
        return hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72";
    }

    /*
     * Calculate the MD5 of a raw string
     */
    function rstr_md5(s) {
        return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
    }

    /*
     * Calculate the HMAC-MD5, of a key and some data (raw strings)
     */
    function rstr_hmac_md5(key, data) {
        var bkey = rstr2binl(key);
        if (bkey.length > 16) bkey = binl_md5(bkey, key.length * 8);

        var ipad = Array(16), opad = Array(16);
        for (var i = 0; i < 16; i++) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }

        var hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
        return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
    }

    /*
     * Convert a raw string to a hex string
     */
    function rstr2hex(input) {
        try {
            hexcase
        } catch (e) {
            hexcase = 0;
        }
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var output = "";
        var x;
        for (var i = 0; i < input.length; i++) {
            x = input.charCodeAt(i);
            output += hex_tab.charAt((x >>> 4) & 0x0F)
                + hex_tab.charAt(x & 0x0F);
        }
        return output;
    }

    /*
     * Convert a raw string to a base-64 string
     */
    function rstr2b64(input) {
        try {
            b64pad
        } catch (e) {
            b64pad = '';
        }
        var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var output = "";
        var len = input.length;
        for (var i = 0; i < len; i += 3) {
            var triplet = (input.charCodeAt(i) << 16)
                | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0)
                | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
            for (var j = 0; j < 4; j++) {
                if (i * 8 + j * 6 > input.length * 8) output += b64pad;
                else output += tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F);
            }
        }
        return output;
    }

    /*
     * Convert a raw string to an arbitrary string encoding
     */
    function rstr2any(input, encoding) {
        var divisor = encoding.length;
        var i, j, q, x, quotient;

        /* Convert to an array of 16-bit big-endian values, forming the dividend */
        var dividend = Array(Math.ceil(input.length / 2));
        for (i = 0; i < dividend.length; i++) {
            dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
        }

        /*
         * Repeatedly perform a long division. The binary array forms the dividend,
         * the length of the encoding is the divisor. Once computed, the quotient
         * forms the dividend for the next step. All remainders are stored for later
         * use.
         */
        var full_length = Math.ceil(input.length * 8 /
            (Math.log(encoding.length) / Math.log(2)));
        var remainders = Array(full_length);
        for (j = 0; j < full_length; j++) {
            quotient = Array();
            x = 0;
            for (i = 0; i < dividend.length; i++) {
                x = (x << 16) + dividend[i];
                q = Math.floor(x / divisor);
                x -= q * divisor;
                if (quotient.length > 0 || q > 0)
                    quotient[quotient.length] = q;
            }
            remainders[j] = x;
            dividend = quotient;
        }

        /* Convert the remainders to the output string */
        var output = "";
        for (i = remainders.length - 1; i >= 0; i--)
            output += encoding.charAt(remainders[i]);

        return output;
    }

    /*
     * Encode a string as utf-8.
     * For efficiency, this assumes the input is valid utf-16.
     */
    function str2rstr_utf8(input) {
        var output = "";
        var i = -1;
        var x, y;

        while (++i < input.length) {
            /* Decode utf-16 surrogate pairs */
            x = input.charCodeAt(i);
            y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
            if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
                x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
                i++;
            }

            /* Encode output as utf-8 */
            if (x <= 0x7F)
                output += String.fromCharCode(x);
            else if (x <= 0x7FF)
                output += String.fromCharCode(0xC0 | ((x >>> 6 ) & 0x1F),
                    0x80 | ( x & 0x3F));
            else if (x <= 0xFFFF)
                output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                    0x80 | ((x >>> 6 ) & 0x3F),
                    0x80 | ( x & 0x3F));
            else if (x <= 0x1FFFFF)
                output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                    0x80 | ((x >>> 12) & 0x3F),
                    0x80 | ((x >>> 6 ) & 0x3F),
                    0x80 | ( x & 0x3F));
        }
        return output;
    }

    /*
     * Encode a string as utf-16
     */
    function str2rstr_utf16le(input) {
        var output = "";
        for (var i = 0; i < input.length; i++)
            output += String.fromCharCode(input.charCodeAt(i) & 0xFF,
                (input.charCodeAt(i) >>> 8) & 0xFF);
        return output;
    }

    function str2rstr_utf16be(input) {
        var output = "";
        for (var i = 0; i < input.length; i++)
            output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF,
                input.charCodeAt(i) & 0xFF);
        return output;
    }

    /*
     * Convert a raw string to an array of little-endian words
     * Characters >255 have their high-byte silently ignored.
     */
    function rstr2binl(input) {
        var output = Array(input.length >> 2);
        for (var i = 0; i < output.length; i++)
            output[i] = 0;
        for (var i = 0; i < input.length * 8; i += 8)
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
        return output;
    }

    /*
     * Convert an array of little-endian words to a string
     */
    function binl2rstr(input) {
        var output = "";
        for (var i = 0; i < input.length * 32; i += 8)
            output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
        return output;
    }

    /*
     * Calculate the MD5 of an array of little-endian words, and a bit length.
     */
    function binl_md5(x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << ((len) % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;

        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;

            a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
            d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

            a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
            a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

            a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
            d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
            c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

            a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
            d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd);
        }
        return Array(a, b, c, d);
    }

    /*
     * These functions implement the four basic operations the algorithm uses.
     */
    function md5_cmn(q, a, b, x, s, t) {
        return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
    }

    function md5_ff(a, b, c, d, x, s, t) {
        return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }

    function md5_gg(a, b, c, d, x, s, t) {
        return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }

    function md5_hh(a, b, c, d, x, s, t) {
        return md5_cmn(b ^ c ^ d, a, b, x, s, t);
    }

    function md5_ii(a, b, c, d, x, s, t) {
        return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     */
    function safe_add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }

    /*
     * Bitwise rotate a 32-bit number to the left.
     */
    function bit_rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }

    H.lib.md5 = hex_md5;
})(hapj);
/* jshint ignore:end */

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

// 兼容性函数
(function (H) {
    'use strict';

    var ts = Object.prototype.toString;
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

    // json
    hapj.json = {
        encode: function (from) {
            return hapj.lib.serial.toString(from, 'json');
        },
        decode: function (from) {
            return hapj.lib.serial.getJson(from);
        }
    };

    hapj.date = {
        /**
         * 格式化日期
         * @param string format
         * Y 年份
         * m 月份
         * d 日期
         * H 时钟
         * i 分钟
         * s 秒钟
         * @param Date date 必须是日期，不提供则使用当前时间
         * @return string
         * @example hapj.date.format('Y-m-d')  // rutrn 2014-06-15
         */
        format: function (format, date) {
            date = date || new Date();
            var t, dates = {
                Y: date.getFullYear(),
                m: (t = date.getMonth() + 1) < 10 ? '0' + t : t,
                d: (t = date.getDate()) < 10 ? '0' + t : t,
                H: (t = date.getHours()) < 10 ? '0' + t : t,
                i: (t = date.getMinutes()) < 10 ? '0' + t : t,
                s: (t = date.getSeconds()) < 10 ? '0' + t : t
            };
            return format.replace(/(([YmdHis]))/g, function (m, i, k) {
                return dates[k];
            });
        }
    };

    hapj.isArray = hapj.array.isArray;
    /**
     * @function hapj.extend
     * @see hapj.object.extend
     */
    H.extend = hapj.object.extend;
    /**
     * @function hapj.trim
     * @see hapj.string.trim
     */
    H.trim = hapj.string.trim;

    /**
     * 对对象或数组执行循环
     * @function hapj.each
     * @param {array|object} obj
     * @param {function} func
     * @param {*} me this指针
     * @example
     * 如果是array类型，查看 {@link hapj.array.each}
     * 如果是object类型，查看 {@link hapj.object.each}
     */
    H.each = function (obj, func, me) {
        if (!obj) return;
        if ('length' in obj) {
            return hapj.array.each(obj, func, me);
        } else {
            return hapj.object.each(obj, func, me);
        }
    };

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

/**
 * 本地缓存 hapj.cache
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

// hapjId
(function (H) {
    'use strict';

    var _hapjIdCount = 0, _hapjId;
    /**
     * 获取或设置hapjId，注意，同一个页面只能设置一次，后面的设置不再起作用
     * @param {String} id
     * @return {String} hapjId
     */
    H.id = function (id) {
        if (id && _hapjIdCount === 0) {
            _hapjId = id;
            _hapjIdCount++;
        }
        if (!_hapjId) {
            _hapjId = new Date().getTime() * 1000 + parseInt(Math.random() * 899 + 100);
        }
        return _hapjId;
    };
})(hapj);

// module 机制
(function (H) {
    'use strict';

    var _modules = {};
    /**
     * 获取模块
     * @function hapj.get
     * @param {String} moduleName
     * @return {mixed}
     */
    H.get = function (moduleName) {
        return hapj.object.has(_modules, moduleName) ? _modules[moduleName] : null;
    };
    /**
     * 设置模块
     * @function hapj.set
     * @param {String} moduleName 必须是以字母开头，后面是字母数字或者.、_。
     * @param {Function} module 必须是函数
     */
    H.set = function (moduleName, module) {
        if (!moduleName || !/[a-z][a-z0-9\._]+/i.test(moduleName)) {
            throw new Error('hapj.u_wrongModuleNameFormat moduleName=' + moduleName);
        }
        var type = typeof module;
        if (type != 'function' && type != 'object') {
            throw new Error('hapj.u_wrongModuleType type=' + type);
        }
        var parent = _modules;

        var nss = moduleName.split('.'), ns;
        while (nss.length > 1) {
            ns = nss.shift();
            if (!hapj.object.has(_modules, ns)) {
                parent = parent[ns] = function () {
                };
            } else {
                parent = parent[ns];
            }
        }
        ns = nss.shift();
        parent[ns] = module;
    };
})(hapj);

// 基本错误处理逻辑
(function (H) {
    'use strict';
    var _we = window.onerror;
    window.onerror = function (msg, url, line) {
        if (line === 0) {
            return;
        }
        if (_we) {
            _we.call(null, msg, url, line);
        }
        var fs = hapj.hook.gets('hapj.error');
        H.each(fs, function () {
            this.call(null, msg, url, line);
        });
    };
})(hapj);

// 浏览器
(function (H) {
    'use strict';
    /**
     * 浏览器的属性
     * @namespace hapj.browser
     * @property {string} hapj.browser.type 浏览器类型
     * @property {string} hapj.browser.version 版本号
     * @property {boolean} hapj.browser.mobile 是否为移动设备访问
     */
    H.browser = (function () {
        var ua = navigator.userAgent.toLowerCase(),
            rwebkit = /(webkit)[ \/]([\w.]+)/,
            ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
            rmsie = /(msie) ([\w.]+)/,
            rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,
            match = rwebkit.exec(ua) ||
                ropera.exec(ua) ||
                rmsie.exec(ua) ||
                ua.indexOf('compatible') < 0 && rmozilla.exec(ua) ||
                [];
        return {
            type: match[1] || '',
            version: match[2] || '0',
            mobile: /(MIDP|WAP|UP\.Browser|Smartphone|Obigo|AU\.Browser|wxd\.Mms|WxdB\.Browser|CLDC|UP\.Link|KM\.Browser|UCWEB|UCBrowser|SEMC\-Browser|Mini|Symbian|Palm|Nokia|Panasonic|MOT|SonyEricsson|NEC|Alcatel|Ericsson|BENQ|BenQ|Amoisonic|Amoi|Capitel|PHILIPS|SAMSUNG|Lenovo|Mitsu|Motorola|SHARP|WAPPER|LG|EG900|CECT|Compal|kejian|Bird|BIRD|G900\/V1\.0|Arima|CTL|TDG|Daxian|DAXIAN|DBTEL|Eastcom|EASTCOM|PANTECH|Dopod|Haier|HAIER|KONKA|KEJIAN|LENOVO|Soutec|SOUTEC|SAGEM|SEC|SED|EMOL|INNO55|ZTE|iPhone|Android|Windows CE|BlackBerry|MicroMessenger)/i.test(navigator.userAgent)
        };
    })();

    if (H.browser.mobile) {
        // 增加异步，保证能通过hook读取到内容
        setTimeout(function () {
            if (hapj.hook.get('browser.mobile')) {
                hapj.hook.get('browser.mobile').call();
            }
        }, 0);
    }

    // 缓存ie6背景图
    if (H.browser.type == 'msie' && hapj.browser.version < 7) {
        try {
            document.execCommand('BackgroundImageCache', false, true);
        } catch (e) {
        }
    }
})(hapj);

// hapj 日志
(function (H, _d) {
    'use strict';
    var _img,
        _en = encodeURIComponent,
        _firebug = (window.console && window.console.trace),
        toString = function (msg, encode) {
            if (undefined === encode) {
                encode = true;
            }
            if (typeof msg == 'object') {
                var ret = [];
                for (var p in msg) {
                    ret.push(p + '=' + (encode ? _en(msg[p]) : msg[p]));
                }
                return ret.join('&');
            }
            return msg;
        },
        _vdn,
        _vdd = {},
        _vdc = 0,
        _vdlu = location.href,
        _vdf = function () {
            var ext = hapj.get('ext');
            if (!ext || !ext.jsDecoder) {
                setTimeout(_vdf, 1000);
                return;
            }

            var n = hapj.ui._node('li'), code = ext.jsDecoder(hapj.lib.serial.toString(_vdd, 'json'), 4, '\t'),
                jsc = new ext.jsColorizer();
            jsc.s = code;
            code = jsc.colorize();
            n.innerHTML = code.replace(/\n/g, '<br/>').replace(/\t/g, '&nbsp;');
            if (_vdn.lastChild.firstChild) {
                _vdn.lastChild.insertBefore(n, _vdn.lastChild.firstChild);
            } else {
                _vdn.lastChild.appendChild(n);
            }
            if (!this.hasAppend) {
                this.hasAppend = true;
                if (!_d.body) {
                    setTimeout(function () {
                        _d.body.appendChild(_vdn);
                    }, 1000);
                } else {
                    _d.body.appendChild(_vdn);
                }
            }
        }
        ;
    /**
     * 日志相关的处理
     * @namespace hapj.log
     * @property {number} hapj.log.DEVELOP_MODE 开发模式
     * @property {number} hapj.log.ONLINE_MODE 在线模式
     * @property {number} hapj.log.mode 开发模式，默认为 1
     * @property {string} hapj.log.url 日志访问网址
     */
    DEVELOP_MODE: 1, // 开发模式
        H.log = {
        ONLINE_MODE: 2, // 在线模式
        mode: 1,
        url: '',
        /**
         * @function hapj.log.server
         * @param msg 信息
         */
        server: function (msg) {
            if (!this.url) {
                return this.warn('hapj.log.server url is not defined');
            }
            var self = H.log;

            $(function () {
                if (!_img) {
                    _img = hapj.ui._node('img', {
                        width: 0,
                        height: 0,
                        style: 'position:absolute;left:-999px;top:-999px;'
                    });
                    _d.body.appendChild(_img);
                }
                _img.setAttribute('src', self.url + '?' + msg.toString());
            }, true);
        }
    };
    if (_firebug) {
        H.object.extend(H.log, {
            debug: function (msg) {
                if (this.mode != this.ONLINE_MODE) {
                    console.log.apply(console, arguments);
                }
            },
            warn: function (msg) {
                if (this.mode != this.ONLINE_MODE) {
                    console.warn.apply(console, arguments);
                }
            },
            error: function (msg) {
                if (this.url) {
                    this.server(toString(msg));
                }
                if (this.mode != this.ONLINE_MODE) {
                    console.error.apply(console, arguments);
                    alert(toString(msg, false));
                }
            }
        });
    } else {
        var log, getElem = function () {
            if (!log) {
                var node = _d.createElement('textarea');
                node.style.cssText = 'position:absolute;top:0;right:0;width:400px;height:200px;font-size:12px;font-family:verdana;padding:2px;border:solid 1px #FF0;background:#FFF;z-index:9999;';
                _d.body.appendChild(node);
                log = node;
            }
            return log;
        }, getTime = function () {
            var now = new Date();
            return '[' + [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-') + ' ' + [now.getHours(), now.getMinutes(), now.getSeconds()].join(':') + ']';
        }, showMsg = function (msg, type) {
            var el = getElem();
            console.log(el);
            el.value += (getTime() + ' ' + type + ' ' + decodeURIComponent(msg) + "\n");
        };
        H.object.extend(hapj.log, {
            /**
             * 调试日志
             * @function hapj.log.debug
             * @param {string} msg
             */
            debug: function (msg) {
                if (this.mode != this.ONLINE_MODE) {
                    showMsg(toString(msg), 'DEBUG');
                }
            },
            /**
             * 警告日志
             * @function hapj.log.warn
             * @param {string} msg
             */
            warn: function (msg) {
                if (this.mode != this.ONLINE_MODE) {
                    showMsg(toString(msg), 'WARN');
                }
            },
            /**
             * 错误日志
             * @function hapj.log.error
             * @param {string} msg
             */
            error: function (msg) {
                var m = toString(msg, false);
                if (typeof msg == 'string') {
                    msg = 'msg=' + _en(msg);
                } else {
                    msg = m;
                }
                if (this.url) {
                    this.server(msg);
                }
                if (this.mode != this.ONLINE_MODE) {
                    showMsg(m, 'ERROR');
                    alert(m);
                }
            }
        });
    }
})(hapj, document, jQuery);

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
