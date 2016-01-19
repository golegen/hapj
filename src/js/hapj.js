/**
 * Copyright (c) 2016, Jiehun.com.cn Inc. All Rights Reserved
 * @namespace hapj
 * @author <ronnie>dengxiaolong@jiehun.com.cn
 * @date 2016-01-07
 * @version ${VERSION}
 * @description hapj 1.6.1版本，去掉基础ui功能，完全依赖jQuery作为UI底层。增加全新的hook机制
 **/
window.hapj = {
    __version: '${VERSION}',
    /**
     * @descript 官方类库
     */
    lib: {},
    /**
     * @description 第三方扩展
     */
    ext: {}
};

(function(H) {
    'use strict';

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
