/**
 * 用来实现各种元素的异步化请求
 * @copyright Copyright (c) 2016, Jiehun.com.cn Inc. All Rights Reserved
 * @author dengxiaolong@jiehun.com.cn
 * @since 2016-01-13
 * @version ${VERSION}
 * @namespace jQuery.fn.ajaxable
 * @see jQuery.ajaxable
 * @tutorial jQuery.fn.ajaxable
 * @example 详见：{@link /example/js/ui/ajaxable.php|Ajaxable实例}
 **/

/**
 * 确认的回调函数
 * @memberof jQuery.ajaxable
 * @callback ~okCallback
 * @param {Object} data JSON数据
 */

/**
 * 错误的回调函数
 * @memberof jQuery.ajaxable
 * @callback ~errorCallback
 * @param {String} code 错误状态
 * @param {String} desc 错误详细描述
 */

/**
 * 封装数据的回调函数
 * @memberof jQuery.ajaxable
 * @callback ~packCallback
 * @param {{string:string}} options 表单元素构建的键值对
 */

/**
 * 提交前的回调函数
 * @memberof jQuery.ajaxable
 * @callback ~submitCallback
 * @param {Event} e
 * @param {jQuery.fn.ajaxable.formOptions} options 配置参数
 */

(function ($) {
    "use strict";

    var _d = decodeURIComponent;

    function getKeyValue(from, kvTag, key) {
        var arr = from.split('&'), i, l, ret = {};
        for (i = 0, l = arr.length; i < l; i++) {
            var tmp = arr[i].split(kvTag), k = _d($.trim(tmp[0]));
            if (!k) continue;
            if (k in ret) {
                if (!$.isArray(ret[k])) {
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

    var submitHandler = function (form, options) {
            if (typeof options.beforeSubmit == 'function') {
                options.beforeSubmit.call(form);
            }

            if (options.confirm) {
                switch (typeof options.confirm) {
                    case 'string':
                        if (window.confirm(options.confirm) === false) {
                            return false;
                        }
                        break;
                    case 'function':
                        var ret = options.confirm.call(form);
                        if (ret === false) {
                            return false;
                        } else if (typeof ret == 'string') {
                            if (window.confirm(ret) === false) {
                                return false;
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
            var action = options.action || form.action || document.URL,
                data = $(form).serializeArray();

            if (options.pack) {
                options.pack.call(null, data);
            }
            data = $.param(data);

            $.ajax({
                type: form.method ? form.method : 'POST',
                url: action,
                dataType: 'json',
                data: data,
                success: function (data) {
                    if (typeof options.afterSubmit == 'function') {
                        options.afterSubmit.call(form);
                    }
                    successHandler.call(form, data, options);
                }
            });
        },
        successHandler = function (data, options) {
            console.log(arguments);
            if (!data.err || data.err.indexOf('.ok') >= 0) {
                if (options.ok) {
                    options.ok.call(this, data.data);
                }
            } else {
                if (options.error) {
                    options.error.call(this, data.err);
                }
            }
        },
        /**
         * 发一个ajax请求
         * @param {Object} elem
         * @param {Object} options
         */
        ajaxPost = function (elem, options) {
            var href = options.href || elem.href;
            var func = function () {
                if (typeof href == 'function') {
                    href = href.call(elem);
                }
                $.ajax({
                    url: href,
                    type: 'POST',
                    dataType: 'json',
                    success: function (data) {
                        successHandler.call(elem, data, options);
                    }
                });
            };

            var cfStr = options.confirm ? options.confirm : (elem.getAttribute('confirm') ? elem.getAttribute('confirm') : '');
            if (typeof cfStr == 'function') {
                if (cfStr.call(elem) === false) {
                    return false;
                }
                cfStr = cfStr.call(elem);
            }
            if (cfStr) {
                if (window.confirm(cfStr)) {
                    func(elem, options);
                }
            } else {
                func(elem, options);
            }
        };

    /**
     * @namespace jQuery.ajaxable
     */
    var ajaxable = {
        /**
         * ajaxable初始化表单
         *
         * 表单的异步请求也非常多，在我们的体系下，所有的请求都是基于ajax请求发出的。这里我们有一些假设的前提：
         * 1. 数据都是以json格式返回来。
         * 2. 数据返回的是一个对象。有err和data两个键。
         * 3. 如果err为空或者err中包含ok字符串，认为这个表单提交动作是成功的，否则为失败。
         * @memberof jQuery.ajaxable
         * @function ajaxForm
         * @param {HTMLElement} form 表单
         * @param {{}} options 选项，默认可以不传入任何值。
         * @param {jQuery.ajaxable~okCallback} options.ok 表单提交成功时调用的函数。
         * @param {jQuery.ajaxable~errorCallback} options.error 表单提交失败时调用的函数。
         * @param {jQuery.ajaxable~packCallback} options.pack 提交数据前对表单的数据进行整理和封装。
         * @param {string|function} options.confirm 确认字符串。
         * @param {jQuery.ajaxable~submitCallback} options.beforeSubmit 在提交之前进行的处理
         *
         */
        ajaxForm: function (form, options) {
            options = options || {};
            if (!options._submited_) {
                var f = hapj.hook.get('form.submit');
                $(form).submit(f ? function (e) {
                    options._submited_ = true; // 已经被提交了
                    return options.beforeSubmit.call(form, e, options);
                } : function () {
                    options._submited_ = true;
                    submitHandler(form, options); // 已经被提交了
                    return false;
                });
            } else {
                submitHandler(form, options);
            }
        },

        /**
         * 实现图片的异步化加载
         * @memberof jQuery.ajaxable
         * @function ajaxImg
         * @param {HTMLElement} img 图片DOM节点
         * @param {{}} options 配置参数
         * @param {boolean} options.cache 是否缓存，默认为false
         * @param {string} [options.timeKey=t] 用来表示时间的key，默认为t
         * @example 这部分最典型的应用场景就是解决图片验证码的更新问题。
<img id="vCode" src="/util/vcode.jpg"><a href="" id="refreshVCode">Refresh<a>
<script>
    var vCode = $('#vCode');
    $('#refreshVCode').click(function() {
        vCode.ajaxable();
    });
</script>
         */
        ajaxImg: function (img, options) {
            var o = {
                cache: false,
                timeKey: 't'
            };
            $.extend(o, options);
            var src = img.src;

            if (!o.cache) {
                var pos = src.indexOf('?'),
                    params = pos >= 0 ? getKeyValue(src.substr(pos + 1)) : {};
                if (o.timeKey in params) {
                    $.each(params, function (i) {
                        if (i == o.timeKey) {
                            params[i] = new Date().getTime();
                        }
                    });
                    src = (pos > 0 ? src.substr(0, pos) + '?' : src) + $.params(params);
                } else {
                    src = src + (pos > 0 ? '&' : '?') + o.timeKey + '=' + new Date().getTime();
                }
                img.src = src;
            } else {
                img.src = '';
                img.src = src;
            }
        },
        /**
         * 下拉框ajaxable初始化参数
         * @memberof jQuery.ajaxable
         * @typedef ~selectOptions
         * @property {string} [url] 切换下拉框选项后，需要访问的url。<br/>
         * 可以传入一个变量{value}，异步请求时会将其替换为下拉框当前选中的值。另外，也可以直接给下拉框顶一个属性ajax-url来定义异步请求的url。
         * @property {string} [dataType=json] 返回返回数据的格式，默认为json
         * @property {HTMLElement} [target] 返回数据后用来处理数据的对象，默认会使用当前对象的下一个DOM节点。
         * @property {jQuery.ajaxable~packCallback} [pack] 对返回数据进行处理的函数。
         * @property {jQuery.ajaxable~successCallback} [success] 将返回数据进行处理的函数。默认已经有一个处理函数，其逻辑如下：<br/>
         * 如果返回数据被处理成[{name:'name1', value:'value1']}的形式，并且dataType为json格式，target也是一个下拉框，那么会将数据自动加载到target作为选项；<br/>
         * 如果dataType为html，会自动将target的innerHTML设置为返回的数据。
         * @property {jQuery.ajaxable~okCallback} [ok] 表单提交成功时调用的函数。
         * @property {jQuery.ajaxable~errorCallback} [error] 表单提交失败是调用的函数。
         */

        /**
         * ajax化一个select控件
         * @memberof jQuery.ajaxable
         * @function ajaxSelect
         * @param {jQuery.ajaxable~selectOptions} options 默认可以不传入任何值。
         * @example
         <select id="selCity" ajax-url="/static/test/cities.html?pid={value}">
         <option value="110000">北京市</option>
         <option value="210000">上海市</option>
         </select><select name="city_id"></select>
         <script>
         $('#cities').ajaxable({
            pack: function(data) {
                var ret = [];
                $.each(data.cities, function(id) {
                    ret.push({name:data.cities[id], value:id});
                };
                return ret;
            }
        });
         </script>

         */
        ajaxSelect: function (select, options) {
            var o = {
                url: select.getAttribute('ajax-url'),
                dataType: 'json',
                pack: null,
                type: 'get',
                success: function (ret) {
                    if (o.dataType == 'json' && o.target && o.target.nodeName == 'SELECT') {
                        var target = o.target;
                        if (ret.data) {
                            var data = ret.data;
                            if (typeof o.pack == 'function') {
                                data = o.pack(data);
                            }
                            target.options.length = 0;
                            $.each(data, function (k, v) {
                                if (!!this.selected) {
                                    target.options[target.options.length] = new Option(v.name, v.value, v.selected);
                                } else {
                                    target.options[target.options.length] = new Option(v.name, v.value);
                                }
                            });
                        }
                    } else {
                        if (o.dataType == 'html' && o.target) {
                            $(o.target).html(ret);
                        }
                    }
                    successHandler.call(select, ret, options);
                }
            };
            $.extend(o, options);
            if (!o.target) {
                o.target = $(select).next('select')[0];
            }
            var fn = function () {
                $.ajax({
                    url: o.url.replace('{value}', select.value),
                    type: o.type,
                    dataType: o.dataType,
                    success: o.success
                });
            };
            $(select).on('change', fn);
            if (select.value && select.value > 0) {
                fn();
            }
        },
        /**
         * 面板ajaxable初始化参数
         * @memberof jQuery.ajaxable
         * @typedef ~panelOptions
         * @property {string} [area] 需要使链接ajax化区域的选择器。默认使用div.pager，用来针对分页区域。
         * @property {string} [dataType=html] 返回返回数据的格式，默认为html
         * @property {function(html:string)} [success] 返回数据后的处理函数。默认为更新整个面板的内容。
         */

        /**
         * ajax化一个面板
         * @memberof jQuery.ajaxable
         * @function ajaxPanel
         * @param {jQuery.ajaxable~panelOptions} options 初始化参数
         * @example
         <div id="cityList">
         <div class="pager">
         <ul>
         <li><a href="/static/test/cities.html?page=1">1</a></li>
         <li><a href="/static/test/cities.html?page=2">2</a></li>
         </ul>
         </div>
         </div>
         <script>
         $('#cityList').ajaxable();
         </script>
         */
        ajaxPanel: function (pnl, options) {
            var o = {
                area: 'div.pager', dataType: 'html', succss: function (html) {
                    $(pnl).html(html);
                }
            };
            $.extend(o, options);
            $(pnl).on('click', function (e, t) {
                if ((t = e.target).nodeName != 'A' || (o.area && !$(t).parents(o.area).length)) {
                    return;
                }
                $.ajax({
                    url: t.href,
                    type: 'GET',
                    dataType: o.dataType,
                    success: o.succss
                });
                return false;
            });
        },
        /**
         * 表格ajaxable初始化参数
         * @memberof jQuery.ajaxable
         * @typedef tableOptions
         * @property {(string|function)} [href] 动态获取连接的href，如果不指定，则使用链接自己的href。可以是字符串或函数。如果是函数，当前指针指向对应的元素。
         * @property {jQuery.ajaxable~okCallback} 表单提交成功时调用的函数。
         * @property {jQuery.ajaxable~errorCallback} 表单提交失败是调用的函数。
         * @property {(string|function)} confirm 确认字符串，当要执行之前会调用弹出确认框，用户确认了才继续执行。<br/>
         * 如果confirm是函数，则会将当前点击的元素作为this指针执行此confirm函数并执行，将返回的结果作为确认字符串。另外，该确认字符串可以通过元素设定confirm属性来设置。
         * @property {RegExp} [rule] 链接的url规则，必须是正则表达式，当链接符合此表达式，才会执行ajax异步请求。默认规则为：/\/_[^\/]\w+($|\?.*)/
         */

        /**
         * 表格的异步请求
         * 因为所有对数据的修改都是需要用到post方法的，有些操作是通过链接去执行，这就要求我们将链接转化为post请求，最终完成这个操作。表格的异步请求处理流程是：如果点击了链接，链接的href最后一个斜杠后面的字符串如果是以_开始的，那么这个请求就会转化为一个POST的ajax请求。
         * @memberof jQuery.ajaxable
         * @function ajaxTable
         * @param {jQuery.ajaxable.tableOptions} options 默认可以不传入任何值。具有如下参数：
         * @example
         如果有一块区域的链接需要进行同样的异步请求，但是这个区域不是用table来构造的，那么，可以通过如下的方法直接对其他类型的DOM节点（如div）进行异步请求处理。

         <table id="cateList">
         <thead>
         <tr>
         <th>ID</th>
         <th>名称</th>
         <th>英文名称</th>
         <th>是否使用</th>
         <th>操作</th>
         </tr>
         </thead>
         <tbody>
         …
         <script>
         $('#cateList').ajaxable({
            ok: function(data) {
                location.reload();
            },
            confirm: function(){
                if (this.className == 'del') {
                    return '你确定要删除吗？'；
                } else {
                    return '你确定要设为禁用吗？';
                }
            }
        });
         </script>

         */
        ajaxTable: function (table, options) {
            var rule = options.rule ? options.rule : '';
            if (rule.constructor !== RegExp) {
                rule = /\/_[^\/]\w+($|\/?\?.*)/;
            }
            $(table).on('click', function (e, t) {
                if ((t = e.target).nodeName != 'A' || !rule.test(t.href)) {
                    return;
                }
                ajaxPost(t, options);

                return false;
            });
        },
        /**
         * 链接ajaxable初始化参数
         * @memberof jQuery.ajaxable
         * @typedef ~linkOptions
         * @property {(string|function)} [href] 动态获取连接的href，如果不指定，则使用链接自己的href。可以是字符串或函数。如果是函数，当前指针指向对应的元素。
         * @property {jQuery.fn.ajaxable~okCallback} 表单提交成功时调用的函数。
         * @property {jQuery.fn.ajaxable~errorCallback} 表单提交失败是调用的函数。
         * @property {(string|function)} confirm 确认字符串，当要执行之前会调用弹出确认框，用户确认了才继续执行。<br/>
         * 如果confirm是函数，则会将当前点击的元素作为this指针执行此confirm函数并执行，将返回的结果作为确认字符串。另外，该确认字符串可以通过元素设定confirm属性来设置。
         */

        /**
         * ajax化一个链接
         * 有一些单独出来的链接也是需要异步化成post请求提交的。因此单独链接也提供了ajaxable的方法，不同的是，这里不会对链接的格式进行检查。
         * @memberof jQuery.ajaxable
         * @function ajaxLink
         * @param {jQuery.ajaxable~linkOptions} options 默认可以不传入任何值。具有如下参数：
         * @example
         也可以通过如下的方法直接对一个链接进行异步请求处理。

         <a href="/unlock" id="linkPost">解除绑定</a>
         <script>
         $('#linkPost').ajaxable({
            ok: function(data) {
                location.reload();
            }
        });
         </script>
         */
        ajaxLink: function (link, options) {
            $(link).on('click', function () {
                ajaxPost(this, options);
                return false;
            });
        }
    };

    /**
     * 初始化参数
     * @memberof jQuery.fn.ajaxable
     * @typedef ~options
     * @property {jQuery.ajaxable~okCallback} ok 调用成功后执行的回调函数
     * @property {string|function} confirm 确认字符串
     */


    /**
     * 初始化函数
     * 让元素支持一些异步请求的操作。由于async这个单词比较生僻，故使用ajax来替代。目前支持四种方式的异步请求方式。分别为：图片、表单、下拉框、表格、面板。
     * @memberof jQuery.fn.ajaxable
     * @function constructor
     * @param {jQuery.fn.ajaxable~options} options 选项
     * @example
     * 支持如下几种元素的ajaxable：
     * 1. {@link jQuery.ajaxable.ajaxImg} 图片(img)
     * 2. {@link jQuery.ajaxable.ajaxForm} 表单(form)
     * 3. {@link jQuery.ajaxable.ajaxSelect} 下拉框(select)
     * 4. {@link jQuery.ajaxable.ajaxTable} 表格(table)
     * 5. {@link jQuery.ajaxable.ajaxPanel} 面板(div)
     * 6. {@link jQuery.ajaxable.ajaxLink} 链接(a)
     * 针对各种元素的使用方法参见 {DOCHOST}/example/js/ui/ajaxable.php|例子}
     */
    $.fn.ajaxable = function (options) {
        options = options || {};
        this.each(function (k, v) {
            switch (v.tagName) {
                case 'FORM':
                    ajaxable.ajaxForm(v, options);
                    break;
                case 'IMG':
                    ajaxable.ajaxImg(v, options);
                    break;
                case 'SELECT':
                    ajaxable.ajaxSelect(v, options);
                    break;
                case 'TABLE':
                    ajaxable.ajaxTable(v, options);
                    break;
                case 'A':
                    ajaxable.ajaxLink(v, options);
                    break;
                default:
                    ajaxable.ajaxPanel(v, options);
                    break;
            }
        });
        return this;
    };
    $.ajaxable = ajaxable;
})(jQuery);