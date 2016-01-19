(function (H) {
    'use strict';

    /**
     * 日期相关函数
     * @namespace hapj.date
     */
    H.date = {
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
})(hapj);