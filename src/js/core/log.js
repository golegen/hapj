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
        H.log = {
            DEVELOP_MODE: 1, // 开发模式
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