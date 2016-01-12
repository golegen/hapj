/**
 * Copyright (c) 2016, Jiehun.com.cn Inc. All Rights Reserved
 * @author dengxiaolong@jiehun.com.cn
 * @date 2016-01-11
 * @version 1.6.1
 * @brief 使元素可验证
 * @example
 *
 * ## html code
 <form id="formAdd" method="post">
 <input type="text" name="data[username]" verify-rule="{
        required:{
            msg:'username is required.'
        },
        remote: {
            url: '/user/username-is-exist',
            data:'username={$value}',
            msg:'username is existed.',
    }"/>
    <input type="email" name="data[email]" verify-rule="{
        email:{
            msg:'email format is wrong.'
        }
    }"/>
</form>
 *
 * ## js code
hapj(function(H){
    H.ui.id('formAdd').verifiable();
 });
 **/
(function (H, $, undefined) {
    'use strict';

    var verifyRules = {
            addRule: function (type, verify) {
                if (type in _vRules) {
                    return H.log.warn('hapj.ui.verifiable the rule named ' + type + ' is exited');
                }
                _vRules[type] = verify;
            },
            addRules: function (verifies) {
                var self = this;
                H.each(verifies, function (type) {
                    self.addRule(type, this);
                });
            },
            /**
             * 验证规则
             * @param {Mixed} value
             * @param {String} type
             * @param {Object} rule
             * @return Boolean
             */
            verify: function (value, type, rule) {
                if (type in _vRules) {
                    if (H.isArray(value)) {
                        var pass = true;
                        if (type == 'selectRange') {
                            if (!_vRules[type](value, rule)) {
                                pass = false;
                                return false;
                            }
                        }
                        $.each(value, function (i) {
                            if (!_vRules[type](value[i], rule)) {
                                pass = false;
                                return false;
                            }
                        });
                        return pass;
                    }
                    return _vRules[type](value, rule);
                } else {
                    H.log.warn('hapj.ui.verifiable the verify type named ' + type + ' is not supported');
                }
            }
        },
        _vRules = {},
        _rules = {},
        _hints = {},
        _inited = false,
        _notValueElemExp = /RADIO|CHECKBOX/,
        getValue = function (elem) {
            if (elem.type && /^(select\-multiple|radio|checkbox)$/.test(elem.type)) {
                var values = [];
                if (elem.nodeName == 'SELECT') {
                    $.each(elem.options, function () {
                        if (this.selected) {
                            values.push(this.value);
                        }
                    });
                } else {
                    var eachElemArr = [];
                    if (elem.form[elem.name].length === undefined) {
                        eachElemArr.push(elem.form[elem.name]);
                    } else {
                        eachElemArr = elem.form[elem.name];
                    }
                    $.each(eachElemArr, function () {
                        if (this.checked) {
                            values.push(this.value);
                        }
                    });
                }
                if (values.length > 1) {
                    return values;
                }
                return values.join(',');
            }
            return elem.value;
        },
        _init = function () {
            if (_inited) {
                return;
            }
            _addRules();
            _inited = true;
        },
        _dateReg = /^([12][0-9]{3})[\-\/\_\.\s]?(0?[1-9]|1[012])[\-\/\_\.\s]?(0?[1-9]|[12][0-9]|3[01])$/,
        _str2date = function (str) {
            var ms = _dateReg.exec(str), date;
            if (ms) {
                var y = parseInt(ms[1], 10), m = parseInt(ms[2], 10) - 1, d = parseInt(ms[3], 10);
                try {
                    return new Date(y, m, d);
                } catch (e) {
                    return false;
                }
            }
            return false;
        },
        urlRegex = new RegExp("^((https|http|ftp|ciw)?://)" +
                // //ftp的user@
            "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" +
                // IP形式的URL- 199.194.52.184
            "(([0-9]{1,3}\.){3}[0-9]{1,3}" +
                // 允许IP和DOMAIN（域名）
            "|" +
                // 域名- www.
            "([0-9a-z_!~*'()-]+\.)*" +
                // 二级域名
            "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." +
                // first level domain- .com or .museum
            "[a-z]{2,6})" +
                // 端口- :80
            "(:[0-9]{1,4})?" +
                // a slash isn't required if there is no file name
            "((/?)|" +
            "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$", 'i'),
    // 简单url地址
        sUrlRegex = /^(((https?|ciw):\/\/)|\/)[0-9a-zA-Z\_\!~\*\'\(\)\.;\?:@&=\+$,%#\-\/]*$/,
        _addRules = function () {
            verifyRules.addRules({
                /**
                 * 验证是否为空
                 * @param {Object} val
                 */
                required: function (val) {
                    return $.trim(val) !== '';
                },
                /**
                 * 验证是否为数字
                 * @param {Object} val
                 */
                number: function (val, rule) {
                    return !isNaN(val);
                },
                /**
                 * 验证是否为正整数
                 * @param {Object} val
                 */
                posint: function (val, rule) {
                    return /^[1-9](\d+)?$/.test(val);
                },
                /**
                 * 验证是否为金钱,保留两位小数
                 * @param {Object} val
                 */
                price: function (val) {
                    return /^(\d{1,7})(\.\d{2})?$/.test(val);
                },
                /**
                 * 验证是否为email地址
                 * @param {Object} val
                 */
                email: function (val) {
                    return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|\.|-|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)((com(\.[a-z]{2})?)|net|cn|cc)$/i.test(val);
                },
                /**
                 * 验证是否符合正则表达式
                 */
                regexp: function (val, rule) {
                    return new RegExp(rule.exp).test(val);
                },
                /**
                 * 验证是否中文
                 * @param {String} val
                 * @param {Object} rule
                 * {
                 *  min:最小长度
                 *  max:最大长度
                 * }
                 */
                chinese: function (val, rule) {
                    if (undefined === rule.min) {
                        rule.min = 0;
                    }
                    if (undefined === rule.max) {
                        rule.max = Number.MAX_VALUE;
                    }
                    return new RegExp('^[\u4e00-\u9fa5]{' + rule.min + ',' + rule.max + '}$').test(val);
                },
                /**
                 * 身份证验证
                 * @param {String} val
                 * @param {Object} rule
                 * {
                 *  minAge: 最小年龄
                 *  maxAge: 最大年龄
                 *  sex: ['male', 'female'] male 男性 female 女性
                 *  province: 省份名称，如北京、天津等
                 * }
                 */
                ID: function (val, rule) {
                    if (!val) return false;
                    var len = val.length;
                    if (len != 15 && len != 18) {
                        return false;
                    }
                    // 检测基本格式是否正确
                    if (!/^(\d{15})|(\d{17}([0-9xX]))$/.test(val)) {
                        return false;
                    }

                    // 根据校验规则检查身份证合法性
                    if (len == 18) {
                        var total = 0, v = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2], mod, rightCode;
                        $.each([7, 9, 10, 5, 8, 4, 2, 1, 6, 3], function (i) {
                            if (i < 7) {
                                total += ((parseInt(val.charAt(i)) + parseInt(val.charAt(i + 10))) * this);
                            } else {
                                total += (parseInt(val.charAt(i))) * this;
                            }
                        });
                        mod = total % 11;
                        rightCode = v[mod] + '';
                        if (val.charAt(17).toLowerCase() != rightCode.toLowerCase()) {
                            return false;
                        }
                    }

                    // 校验地区的合法性
                    if (!this.cities) {
                        this.cities = {
                            11: '北京',
                            12: '天津',
                            13: '河北',
                            14: '山西',
                            15: '内蒙古',
                            21: '辽宁',
                            22: '吉林',
                            23: '黑龙江 ',
                            31: '上海',
                            32: '江苏',
                            33: '浙江',
                            34: '安徽',
                            35: '福建',
                            36: '江西',
                            37: '山东',
                            41: '河南',
                            42: '湖北 ',
                            43: '湖南',
                            44: '广东',
                            45: '广西',
                            46: '海南',
                            50: '重庆',
                            51: '四川',
                            52: '贵州',
                            53: '云南',
                            54: '西藏 ',
                            61: '陕西',
                            62: '甘肃',
                            63: '青海',
                            64: '宁夏',
                            65: '新疆',
                            71: '台湾',
                            81: '香港',
                            82: '澳门',
                            91: '国外'
                        };
                    }
                    if (!(val.substr(0, 2) in this.cities)) {
                        return false;
                    }
                    // 检测限制的地区是否正确
                    if (rule.province && this.cities[val.substr(0, 2)] != rule.province) {
                        return false;
                    }

                    // 检查性别
                    if (rule.sex) {
                        var tag = val.substr(len == 15 ? len - 1 : len - 2, 1);
                        if (tag % 2 === 0) {
                            if (rule.sex != 'female') {
                                return false;
                            }
                        } else {
                            if (rule.sex != 'male') {
                                return false;
                            }
                        }
                    }

                    // 检测生日的合法性
                    var yearLen = len == 15 ? 2 : 4,
                        year = parseInt(len == 2 ? '19' + val.substr(6, yearLen) : val.substr(6, 4), 10),
                        month = parseInt(val.substr(6 + yearLen, 2), 10),
                        day = parseInt(val.substr(8 + yearLen, 2), 10),
                        d = new Date(year, month - 1, day);

                    if (d.getFullYear() != year || d.getMonth() != month - 1 || d.getDate() != day) {
                        return false;
                    }

                    var offDay = parseInt((new Date().getTime() - d.getTime()) / (1000 * 3600 * 24));
                    // 检查最小年龄
                    if (!isNaN(rule.minAge)) {
                        if (offDay < 365 * rule.minAge) {
                            return false;
                        }
                    }
                    // 检查最大年龄
                    if (!isNaN(rule.maxAge)) {
                        if (offDay > 365 * rule.maxAge) {
                            return false;
                        }
                    }
                    return true;
                },
                /**
                 * 验证是否为url链接
                 * @param {Object} val
                 */
                url: function (val) {
                    return urlRegex.test(val);
                },
                /**
                 * 验证是否为简单的url链接
                 * @param val
                 * @returns {boolean}
                 */
                surl: function (val) {
                    return sUrlRegex.test(val);
                },
                /**
                 * 手机号码规则验证
                 * @param {String} val
                 * @param {Object} rule 具有如下参数
                 * {
         *         mobile:['mobile','home','400','both'] 手机类型，mobile 移动电话 home 座机 400电话 both 移动、座机、400都行
         * }
                 */
                phone: function (val, rule) {
                    if (undefined === rule.mobile) {
                        rule.mobile = 'mobile';
                    }
                    switch (rule.mobile) {
                        case 'mobile':
                            return /^1[3|4|5|8|7]\d{9}$/.test(val);
                        case 'home':
                            return /^\d{3,5}\-\d{7,8}$/.test(val);
                        case '400':
                            return /^400\d{7}(\d{1,5})?$/.test(val.replace(/[\s\-转]/g, ''));
                        case 'both':
                            if (/(^1[3|4|5|8|7]\d{9}$)|(^\d{3,5}\-\d{7,8}$)/.test(val)) {
                                return true;
                            } else {
                                return /^400\d{7}(\d{1,5})?$/.test(val.replace(/[\s\-转]/g, ''));
                            }
                    }
                },
                /**
                 * 比较两个对象的值
                 * @param {String} val
                 * @param {Object} rule
                 * {
                 *      to: 要比较对象的id
                 *      type: ['elem', 'value']
                 * }
                 */
                compare: function (val, rule) {
                    var cVal = $(rule.to).val();
                    if (!rule.condition) {
                        rule.condition = '=';
                    }
                    switch (rule.condition) {
                        case '=':
                        case 'equal':
                            return val == cVal;
                        case '!=':
                        case '<>':
                        case 'notEqual':
                            return val != cVal;
                        case '>':
                        case 'great':
                            return val > cVal;
                        case '<':
                        case 'less':
                            return val < cVal;
                        case '>=':
                        case 'notGreat':
                            return val >= cVal;
                        case '<=':
                        case 'notLess':
                            return val <= cVal;
                        default:
                            return H.log.error('hapj.ui.verifiable the condition(' + rule.condition + ') is not defined');
                    }
                },
                /**
                 * 范围比较
                 * @param {String} val
                 * @param {Object} rule
                 * {
         *         type: ['length','number', 'integer'] length 长度比较 number 数值比较 integer 整数数值比较(包含0)
         *         min: 最小值
         *         max: 最大值
         * }
                 */
                range: function (val, rule) {
                    if (undefined === rule.min) {
                        rule.min = Number.MIN_VALUE;
                    }
                    if (undefined === rule.max) {
                        rule.max = Number.MAX_VALUE;
                    }
                    switch (rule.type) {
                        case 'integer':
                            if (!/^-?\d+$/.test(val)) {
                                return false;
                            }
                            return val <= rule.max && val >= rule.min;
                        case 'length':
                            return val.length <= rule.max && val.length >= rule.min;
                        case 'number':
                            if (!isNaN(val)) {
                                return val <= rule.max && val >= rule.min;
                            } else {
                                return false;
                            }
                    }
                },
                /**
                 * 远程校验
                 * @param {Object} val
                 * @param {Object} rule
                 * {
                 *  url:  // 远程校验的网址
                 *  type:['POST','GET'] 方法，默认为post
                 *  data:提交给服务器端的数据，可以是key1=value1&key2=value2、{key1:value1}、function(){return {key1:value1}}等形式
                 *  dataType:['text','json', 'html']等
                 *  verify:函数，用来校验返回数据，如果返回true，说明校验成功，如果返回false，说明校验失败。如果没有这个函数，则返回的数据为true或者'true'时认为成功，其他都为失败
                 * }
                 */
                remote: function (val, rule) {
                    if (undefined === this.cache) {
                        this.cache = {};
                    }
                    if (undefined === this.cache[rule.name]) {
                        this.cache[rule.name] = {};
                    }

                    if (undefined === rule.url) {
                        return H.log.warn('hapj.ui.verifiable the url of the remote rule is not supplied');
                    }

                    var data = rule.data || {value: val};
                    if (typeof data == 'function') {
                        data = data.call(this, val);
                    }
                    // 序列化data数据
                    var dataKey = (typeof data == 'object') ? H.lib.serial.toString(data, 'pair') : data.toString(),
                        callback = function (data) {
                            var pass = false;
                            if (rule.verify) {
                                pass = rule.verify.call(rule, data);
                            } else {
                                pass = (data === true || data == 'true');
                            }
                            if (pass) {
                                if (rule.success) {
                                    rule.success.call();
                                }
                            } else {
                                if (rule.failure) {
                                    rule.failure.call();
                                }
                            }
                        },
                        cache = this.cache[rule.name];

                    if (cache[dataKey]) {
                        callback(cache[dataKey]);
                    } else {
                        // 如果是表单提交的，默认通过
                        if (rule.formSubmit) {
                            return true;
                        }
                        $.ajax({
                            url: rule.url,
                            type: rule.type ? rule.type : 'POST',
                            async: undefined !== rule.async ? rule.async : true,
                            data: data,
                            dataType: rule.dataType ? rule.dataType : 'json',
                            success: function (data) {
                                cache[dataKey] = data;

                                callback(data);
                            },
                            failure: function () {
                                H.log.error('hapj.ui.verifiable remote method called failed(' + rule.url + ')');
                            }
                        });
                    }
                },
                /**
                 * 日期验证
                 * @param {Object} val
                 * @param {Object} rule
                 * {
         *     min:最小日期。可以是多少s、或者具体的日期，如 6*3600*24，表示离现在至少6天，或者2012-02-24,表示选择的日期不能在这个日期之前
         *  max:最大日期。和min的格式一样
         * }
                 */
                date: function (val, rule) {
                    var date = _str2date(val);
                    if (!date) {
                        return false;
                    }
                    // 检查最小数
                    if (rule.min || rule.max) {
                        var now = new Date();
                        if (rule.min) {
                            if (!isNaN(rule.min)) {
                                if ((date.getTime() - now.getTime()) / 1000 < rule.min) {
                                    return false;
                                }
                            } else {
                                var min = _str2date(rule.min);
                                if (!min) {
                                    return hapj.log.error('hapj.ui.verifiable date format wrong');
                                }
                                if (date.getTime() < min.getTime()) {
                                    return false;
                                }
                            }
                        }
                        if (rule.max) {
                            if (!isNaN(rule.max)) {
                                if ((date.getTime() - now.getTime()) / 1000 > rule.max) {
                                    return false;
                                }
                            } else {
                                var max = _str2date(rule.max);
                                if (!max) {
                                    return hapj.log.error('hapj.ui.verifiable date format wrong');
                                }
                                if (date.getTime() > max.getTime()) {
                                    return false;
                                }
                            }
                        }
                    }
                    return true;
                },
                successMsg: function () {
                    return true;
                },
                textLong: function (val, rule) {
                    if (val.length > rule.length) {
                        return false;
                    }
                    return true;
                },
                selectRange: function (vals, rule) {
                    if (undefined === rule.min) {
                        rule.min = Number.MIN_VALUE;
                    }
                    if (undefined === rule.max) {
                        rule.max = Number.MAX_VALUE;
                    }
                    if (!$.isArray(vals)) {
                        vals = [vals];
                    }
                    return vals.length <= rule.max && vals.length >= rule.min;
                }
            });
        },
        VERIFY_KEY = 'verify-rule',
// 设置提示元素
        createHinter = function (elem) {
            var last;
            if (elem.nodeName == 'INPUT' && (elem.type == 'radio' || elem.type == 'checkbox') && elem.form[elem.name].length) {
                var elems = elem.form[elem.name];
                last = elems[elems.length - 1].nextSibling;
            } else {
                last = elem.nextSibling;
            }
            var d = document, node = d.createElement('span');

            while (last && (last.nodeType == 3 || /^(IMG|A|SPAN|EM|LABEL)$/.test(last.nodeName))) {
                last = last.nextSibling;
            }

            // 如果之后是文字节点
            if (last && last.nodeType == 3) {
                if (last.nextSibling) {
                    elem.parentNode.insertBefore(node, last.nextSibling);
                } else {
                    elem.parentNode.appendChild(node);
                }
            } else {
                if (last && last !== elem) {
                    elem.parentNode.insertBefore(node, last);
                } else {
                    elem.parentNode.appendChild(node);
                }
            }
            return node;
        },
        _formArray = [],
        _formCount = 1,
        /**
         * 得到验证表单
         * @param {Object} form
         */
        _getVForm = function (form, options) {
            if (!form || form.tagName != 'FORM') {
                return null;
            }

            // 检查form是否被验证过，如果验证过，则直接调出之前的
            var verfiedId = form.getAttribute('verfy-id'), vf;
            if (verfiedId && verfiedId >= 0) {
                vf = _formArray[verfiedId];
                vf.cleanVerify();
                return vf;
            }
            if (vf) {
                vf.bindSubmit();
                return vf;
            }

            if (undefined === options) {
                return H.log.error('hapj.ui.verifiable form is not init.');
            }

            // 对表单进行验证
            vf = new VerifiableForm(form, options);
            vf.bindSubmit();
            form.setAttribute('verfy-id', _formCount);
            _formArray[_formCount] = vf;
            _formCount++;
            return vf;
        }
        ;

    $.fn.verifiable = function (options) {
        if (this.length < 1) {
            return;
        }
        options = options || {};

        options = $.extend({
            success: null,
            failure: null,
            hint: null
        }, options);

        $.each(this, function () {
            var vf = _getVForm(this, options);
            if (vf) {
                vf.initElements();
            }
        });
        _init();

        var self = this;
        return {
            /**
             * 重做验证。当加入了新的验证规则时需要进行此项
             */
            redo: function () {
                $.each(self, function () {
                    var vf = _getVForm(this);
                    if (vf) {
                        vf.initElements();
                    }
                });
            },
            /**
             * 显示错误信息。
             * @param {Object} name 对应的表单元素的name
             * @param {Object} msg  显示的内容
             */
            error: function (name, msg) {
                $.each(self, function () {
                    var vf = _getVForm(this);
                    if (vf && vf.elemAttrs[name]) {
                        var attr = vf.elemAttrs[name];
                        attr.hinter.css('display', '').html(msg);
                        if (options.failure) {
                            options.failure.call(attr.elem, 'custom', null, attr.hinter);
                        }
                        attr.status = 'custom';
                    }
                });
            }
        };
    };

    /**
     * 表单验证的主要逻辑
     * @param {Object} form
     * @param {Object} options
     */
    function VerifiableForm(form, options) {
        this.form = form;
        this.options = options;
        this.elemAttrs = {};
        this.verifyFuncs = {};
    }

    VerifiableForm.prototype = {
        options: null,
        errNum: 0,//判断是否为表单中第一个报错，
        errElemId: '',
        /**
         * 进行验证
         * @param {HtmlElement} elem
         * @param {String} type
         * @param {Object} rule
         * @param {Boolean} required 是否必填
         */

        doVerify: function (elem, type, rule, required) {
            var self = this,
                name = elem.name,
                inputType = elem.type,
                inputDisplay = elem.style.display,
                attr = this.elemAttrs[name],
                ret = null,
                status = attr.status,
                failure,
                success,
                options = this.options,
                elemValue = getValue(elem),
                errNum = self.errNum;

            if (!required && !elemValue) {
                return;
            }
            // 如果已经是错误状态，则不继续验证
            if (status && status != 'hint' && status != type) {
                return;
            }

            failure = function () {
                if (!self.errElemId || attr.hinter.attr('id') != self.errElemId) {
                    if (attr.hinter.attr('id')) {
                        self.errElemId = attr.hinter.attr('id');
                    }
                }
                attr.hinter.css('display', '').html(rule.msg);

                if (self.errNum === 0 && inputType != 'hidden' && inputDisplay != 'none') {
                    elem.focus();//焦点到第一个报错的elem
                    attr.hinter.css('display', '');
                    self.errNum++;
                }
                if (!elem.className || elem.className.indexOf === -1) {
                    elem.className = elem.className + ' err';
                }
                if (options.failure) {
                    options.failure.call(elem, type, rule, attr.hinter);
                }
                attr.status = type;
            };

            success = function () {
                // 如果是下拉框，则不显示成功提示
                if (elem.nodeName == 'SELECT' || rule.successMsg) {
                    attr.hinter.hide();
                } else {
                    attr.hinter.css('display', '').html('');
                }
                if (elem.className.indexOf !== -1) {
                    elem.className = elem.className.replace('err', '');
                }
                if (options.success) {
                    options.success.call(elem, type, rule, attr.hinter);
                }
            };
            if (true === rule.async) {
                rule.success = success;
                rule.failure = function () {
                    failure.call();
                };
                verifyRules.verify(elemValue, type, rule);
            } else {
                ret = verifyRules.verify(elemValue, type, rule);
                if (true === ret) {
                    success();
                } else if (false === ret) {
                    failure();
                }
            }

            // 如果不是通过form进行的验证，则会调用trigger触发其他验证
            if (!rule.formSubmit && rule.trigger && rule.trigger in this.verifyFuncs) {
                this.verifyFuncs[rule.trigger].func.call();
            }

            return ret;
        },
        /**
         * 处理提示规则
         * @param {HtmlElement} el
         * @param {Object} rules
         */
        _handlerHintRule: function (el, rules) {
            // 处理hinter
            if (!('hint' in rules)) {
                rules.hint = {msg: ''};
            }
            if (typeof rules.hint == 'string') {
                rules.hint = {msg: rules.hint};
            }
            var self = this,
                name = el.name, attr = {
                    hintMsg: rules.hint.msg,
                    hinter: rules.hint.id ? $(rules.hint.id) : $(createHinter(el)),
                    status: '',
                    hint: function () {
                        if (this.hintMsg) {
                            this.hinter.css('display', '').html(this.hintMsg);
                        } else {
                            this.hinter.hide();
                        }
                        this.status = 'hint';
                        if (self.options.hint) {
                            self.options.hint.call(el, 'hint', rules.hint, this.hinter);
                        }
                    }
                };
            this.elemAttrs[name] = attr;

            delete rules.hint;
            attr.hint();
            $(el).on('focus', function () {
                attr.hint();
            });
        },
        /**
         * 处理其他规则
         * @param {Object} el
         * @param {Object} rules
         */
        _handlerRules: function (el, rules) {
            var required = 'required' in rules;
            for (var type in rules) {
                var rule = rules[type], name = (this.verifyCount++);
                if (typeof rule == 'string') {
                    rule = {msg: rule};
                }

                // 设置异步请求状态
                if (type == 'remote' && undefined === rule.async) {
                    rule.async = true;
                }

                if (!rule.event) {
                    rule.event = 'blur';
                }
                if (type == 'successMsg' && rules.successMsg == 'hide') {
                    rule.successMsg = true;
                }
                var self = this,
                    func = (function (el, type, rule, required) {
                        return function (e) {
                            if (self.formSubmit && e.target.nodeName != 'FORM') {
                                H.log.debug('from ' + e.target.nodeName);
                                return;
                            }
                            rule.formSubmit = self.formSubmit;
                            return self.doVerify.call(self, el, type, rule, required);
                        }
                            ;
                    })(el, type, rule, required);

                if (rule.name && isNaN(rule.name)) {
                    name = rule.name;
                }
                this.verifyFuncs[name] = {
                    'elem': el,
                    'func': func
                };
                // 修改规则的名称
                rule.name = name;

                if ($.isArray(rule.event)) {
                    $.each(rule.event, function (i, evt) {
                        $(el).on(evt, func);
                    });
                } else {
                    $(el).on(rule.event, func);
                }
            }
        },
        /**
         * 初始化表单元素的验证规则
         * @update 修改以name作为唯一验证标识，将验证标识加在每一个控件中。这样做的好处是，即便添加一个和已存在name相同的控件，新控件的验证规则也会及时生效
         */
        initElements: function () {
            // 必须有name才予以验证
            for (var i = 0, l = this.form.elements.length, el, ruleStr; i < l; i++) {
                if (!(el = this.form.elements[i]).name  || // 必须要有name属性
                    !(ruleStr = el.getAttribute(VERIFY_KEY)) || //必须要有验证规则
                    !$.trim(ruleStr) || // 验证规则不为空
//            || el.name in this.elemAttrs // 如果已经有过，就不再继续验证
                    el.tmp //判断当前控件验证是否已经存在，如果存在就不再继续验证
                ) {
                    continue;
                }
                el.tmp = true; //如果当前控件验证不存在则添加
                var name = el.name, rules;
                try {
                    /* jshint ignore:start */
                    rules = eval('(' + ruleStr + ')');
                    /* jshint ignore:end */
                } catch (e) {
                    return H.log.error(e.message);
                }
                if (/rr/.test(name)) {
                    rules.textLong = this.options.textLong;
                }
                this._handlerHintRule(el, rules);

                this._handlerRules(el, rules);
            }
        },
        /**
         * 清理无用的验证
         */
        cleanVerify: function () {
            var self = this;
            $.each(this.verifyFuncs, function (key) {
                if (!this.elem.form) {
                    delete self.verifyFuncs[key];
                    delete self.elemAttrs[key];
                }
            });
        },
        /**
         * 绑定提交事件
         */
        bindSubmit: function () {
            var self = this;
            //先将无用验证规则清楚
            // 提交表单时进行验证
            $(this.form).on('submit', function (e) {
                this._last_click_time = new Date();

                self.cleanVerify();
                self.errNum = 0;
                var pass = true, ret;
                self.formSubmit = true;
                for (var i in self.verifyFuncs) {
                    ret = self.verifyFuncs[i].func.call(self, e);
                    if (ret === false) {
                        pass = false;
                    }
                }
                self.formSubmit = false;
                self.options._submited_ = true; // 已经被提交
                if (pass) {
                    ret = true;
                    if (self.options.submit) {
                        ret = self.options.submit.call(this, e, self.options);
                    } else {
                        var f = hapj.hook.get('form.submit');
                        if (f) {
                            ret = f.call(this, e, self.options);
                        }
                    }
                    return ret !== false;
                }
                return false;
            });
        },
        verifyCount: 0,
        formSubmit: false
    };
})(hapj, jQuery);