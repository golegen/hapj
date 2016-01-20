// 浏览器
(function (H) {
    'use strict';
    /**
     * 用户浏览器的属性
     * @namespace hapj.browser
     *
     * @property {string} type 浏览器类型
     * @property {string} version 版本号
     * @property {boolean} mobile 是否为移动设备访问
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