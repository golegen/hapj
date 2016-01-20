/**
 *
 * 使几组相互联动的元素能互相切换
 * @copyright Copyright (c) 2016, Jiehun.com.cn Inc. All Rights Reserved
 * @namespace jQuery.fn.switchable
 * @author dengxiaolong@jiehun.com.cn  liuxiaoyan@hunbasha.com
 * @date 2016-01-11
 * @version ${VERSION}
 * @example
 var sw = $('#cycle').switchable({
        method:'hover',
        cycleTime: 2000,
        map:function(){
            return ui._id(this.getAttribute('href').substr(1) + 'List');
        },
        trigger: function(triggers) {
            triggers.css('color', '');
            this.style.color = 'red';
        },
        target: function(targets) {
            targets.css('display', 'none');
            this.style.display = 'block';
        }
    });
 sw.rand();

 $('#sortUl').switchable({
        tag:'li',
        method:'scroll',
        map:hapj.ui('#relateUl').childs('div'),
        trigger:function(ts) {
            ts.removeClass('on');
            this.className = 'on';
        },
        stopTop:-20, // 停留在顶部时的上边距，仅在scroll模式下启用
        disableClick:false, // 是否禁用click，默认为false，表示点击trigger的时候会自动滚动到对应位置
        pausedArea:true // 鼠标悬停在target的时候会是否暂停自动轮播，前提是要先设置cycleTime>0;
    });
 **/
(function ($, undefined) {
    'use strict';

    var METHOD_CLICK = 'click', METHOD_HOVER = 'hover', MOTHOD_SCROLL = 'scroll',
        _getTarget = function (trigger, options, i) {
            if (options.map) {
                var target = null;
                switch (typeof options.map) {
                    case 'string':
                        target = $(options.map)[0];
                        break;
                    case 'function':
                        target = options.map.call(trigger, i);
                        break;
                    default:
                        target = options.map;
                        break;
                }
                if (!target) {
                    throw new Error('jquery.switchable the target is not found.');
                }
                return target;
            }
            return null;
        },
        _switch = function (trigger, options, i) {
            var target = _getTarget(trigger, options, i);
            if (target) {
                if (options.trigger) {
                    options.trigger.call(trigger, options.triggers, i);
                }
                if (options.target) {
                    options.target.call(target, options.targets, i, trigger);
                }
            }
        };
    /**
     * @description switchable的构造函数
     * @memberof jQuery.fn.switchable
     * @function ~__constructor
     * @param {Object} opt 选项
     * @param {string} opt.method 触发的方法 可选值为hover、click、scroll，默认为click
     * @param {function} opt.map 实现将触发元素关联到目标元素的映射函数
     * @param {function} opt.trigger 触发后触发元素做出的响应函数
     * @param {function} opt.target 触发后目标元素做出的响应函数
     * @param {number} opt.cycleTime 自动循环的时间，默认为0
     * @param {string} opt.tag 使用当前元素的指定标签的元素作为触发元素
     * @param {number} opt.stopTop 停留在顶部时的上边距，仅在scroll模式下启用
     * @param {number} opt.endTop 点击后定位到触发元素时偏移的距离，仅在scroll模式下启用
     * @param {boolean} opt.disableClick 是否禁用click，默认为false，表示点击trigger的时候会自动滚动到对应位置
     */
    $.fn.switchable = function (opt) {
        var self = this,
            triggers = $(''),
            options = {
                method: METHOD_CLICK,
                map: null,
                trigger: null,
                target: null,
                cycleTime: 0,
                tag: '',
                stopTop: 0,
                endTop: 0,
                noSwitchClass: '',
                pausedArea: false,//确定是大区域hover暂停，还是控制区域hover暂停，默认是小区域hover暂停
                disableClick: false, // 只有在scroll方式下才有用
            };
        $.extend(options, opt);

        var me = new Me();
        me.ui = this;
        var tag = options.tag ? options.tag.toUpperCase() : '';

        function initTriggers() {
            if (tag) {
                if (options.noSwitchClass) {
                    var node = $('');
                    me.ui.find(tag).each(function () {
                        if (this.className != options.noSwitchClass) {
                            node.push(this);
                        }
                    });
                    triggers = node;
                } else {
                    triggers = me.ui.find(tag);
                }
            } else {
                triggers = me.ui;
            }

            if (typeof options.map == 'function') {
                targets = $('');
                triggers.each(function (i) {
                    var node = $(options.map.call(this, i));
                    targets.push(node[0]);
                    if (options.method == MOTHOD_SCROLL) {
                        var p = node.offset();
                        node[0]._pos = {
                            'top': p.top,
                            'height': node.height(true)
                        };
                    }
                });
            }
        }

        initTriggers();

        if (typeof options.map == 'function') {
            triggers.each(function (i) {
                targets.push(options.map.call(this, i));
            });
        } else {
            targets = $(options.map);
        }

        $.extend(options, {triggers: triggers, targets: targets});

        me.initTriggers = function () {
            initTriggers();
            this.options.triggers = triggers;
            this.options.targets = targets;
        };
        switch (options.method) {
            case METHOD_CLICK:
                triggers.on('click', function (e, i) {
                    me.current = i;
                    _switch(triggers[i], options, i);
                    me.stopCycle();
                    return false;
                });

                break;
            case METHOD_HOVER:
                triggers.on('mouseenter', function (e, i) {
                    if (!options.pausedArea) {
                        if (tag && e.target.tagName != tag) {
                            return;
                        }
                    }
                    me.current = i;
                    _switch(triggers[i], options, i);

                    return false;
                });
                this.on('mouseenter', function (e, i) {
                    me.stopCycle();
                });
                targets.on('mouseenter', function (e, i) {
                    if (!options.pausedArea) {
                        if (targets.length > 1 && me.current != i) {
                            return;
                        }
                    } else {
                        me.stopCycle();
                    }
                });
                break;
            case MOTHOD_SCROLL: // 滚动时触发对应事件
                var tpos = this.offset(), h = this.height(true), _d = $(document), keepTop = false, curTarget = null;
                var clone = $('<div>');
                clone.css({
                    width: this.width() + 'px',
                    height: h + 'px',
                    display: 'none'
                });

                var nx = self.next();
                if (nx.length) {
                    self[0].parentNode.insertBefore(clone[0], nx[0]);
                } else {
                    self[0].parentNode.appendChild(clone[0]);
                }


                if (options.tag) {
                    if (!options.disableClick) {
                        this.each(function () {
                            var arr = $(this).find(options.tag);
                            for (var i = 0, len = arr.length; i < len; i++) {
                                $(arr[i]).on('click', (function (i) {
                                    return function () {
                                        var target = _getTarget(this, options, i);
                                        if (!target) return false;

                                        var top = $(target).offset().top;
                                        window.scrollTo(0, top - options.endTop);
                                        return false;
                                    };
                                })(i));
                            }
                        });
                    }
                } else {
                    triggers.on('click', function (e, i) {
                        // 调整target位置
                        var top = targets[i].offset().top;
                        window.scrollTo(0, top - 10);
                        return false;
                    });
                }


                // 通过屏幕的滚动来触发各种事件
                var dh = _d.height(), oldPosition = this.css('position');
                if (!oldPosition) {
                    oldPosition = 'static';
                }
                H.ui(window).on('scroll', function () {
                    var dpos = _d.offset();
                    if (!keepTop && dpos.top > tpos.top) {
                        keepTop = true;
                        clone.show();
                    }
                    if (keepTop && dpos.top < tpos.top + h) {
                        keepTop = false;
                        clone.hide();
                    }
                    me.initTriggers();
                    targets.each(function (i) {
                        var basePos = dpos.top + dh / 2;
                        if (curTarget !== this && basePos > this._pos.top && basePos < this._pos.top + this._pos.height) {
                            curTarget = this;
                            me.current = i;
                            _switch(triggers[i], options, i);

                            // 替换clone对象的html
                            clone.html(self[0].innerHTML);

                            me.stopCycle();
                            return false;
                        }
                    });
                });
                break;
        }
        if (options.cycleTime > 0) {
            this.on('mouseleave', function (e, i) {
                me.startCycle();
            });
            targets.on('mouseleave', function (e, i) {
                if (!options.pausedArea) {
                    if (targets.length > 1 && me.current != i) {
                        return;
                    }
                } else {
                    me.startCycle();
                }
            });
            setTimeout(function () {
                me.startCycle();
            }, 0);
        }


        me.options = options;
        me.total = options.triggers.length;

        return me;
    };

    var Me = function () {
    };
    Me.prototype = {
        // 元素总数
        total: 0,
        // 当前所在元素数
        current: 0,
        // 轮播顺序 1:正序；0:倒序
        order: 1,
        /**
         * 切换到下一组元素
         * @function jQuery.fn.switchable#next
         * @param {Function} onLast 如果传入一个函数，当轮换到最后一张时会调用此函数，如果返回false，则不会继续切换
         * @return this
         */
        next: function (onLast) {
            if (typeof onLast == 'function' && this.current + 1 == this.total) {
                var ret = onLast.call(null);
                if (false === ret) {
                    return;
                }
            }
            this.current++;
            this.order = 1;
            if (this.current >= this.total) {
                this.current = 0;
            }
            return this.to(this.current);
        },
        /**
         * 切换到上一组元素
         * @function jQuery.fn.switchable#prev
         * @param {Function} onFirst 如果传入一个函数，当轮换到第一张时会调用此函数，如果返回false，则不会继续切换
         * @return this
         */
        prev: function (onFirst) {
            if (typeof onFirst == 'function' && this.current === 0) {
                var ret = onFirst.call(null, this.current);
                if (false === ret) {
                    return;
                }
            }

            this.current--;
            this.order = 0;
            if (this.current < 0) {
                this.current = this.total - 1;
            }
            return this.to(this.current);
        },
        /**
         * 随机切换到一个触发器
         * @function jQuery.fn.switchable#rand
         * @return this
         */
        rand: function () {
            var i = Math.ceil(Math.random() * this.total) - 1;
            return this.to(i);
        },
        /**
         * 切换到指定的位置
         * @function jQuery.fn.switchable#to
         * @param {Number} index
         * @return this
         */
        to: function (index) {
            if (index < 0 || index >= this.total) {
                H.log.error('hapj.ui.switchable wrong index');
            }
            this.current = index;
            var trigger = this.options.triggers[index];
            _switch(trigger, this.options, this.current);
            return this;
        },
        /**
         * 移动到第一个元素
         * @function jQuery.fn.switchable#first
         * @return this
         */
        first: function () {
            return this.to(0);
        },
        /**
         * 移动到最后一个元素
         * @function @function jQuery.fn.switchable#last
         * @return this
         */
        last: function () {
            return this.to(this.total);
        },
        __interval: null,
        /**
         * 开始轮播
         * @function jQuery.fn.switchable#startCycle
         * @param {Number} ms 毫秒
         * @return this
         */
        startCycle: function (ms) {
            var self = this;
            if (undefined === ms) {
                if (this.options.cycleTime <= 0) {
                    return;
                }

                ms = this.options.cycleTime;
            }
            this.stopCycle();
            this.__interval = setInterval(function () {
                if (self.order == 1) {
                    self.next();
                } else {
                    self.prev();
                }
            }, ms);
        },
        /**
         * 停止轮播
         * @function jQuery.fn.switchable#stopCycle
         * @return this
         */
        stopCycle: function () {
            if (this.__interval) {
                clearInterval(this.__interval);
                this.__interval = null;
            }
        }
    };
})(jQuery);