/**
 * Copyright (c) 2012, Jiehun.com.cn Inc. All Rights Reserved
 * @author dengxiaolong@jiehun.com.cn
 * @date 2011-12-30
 * @version 1.0
 * @brief 使元素可排序
 * @example
 * hapj.ui.tag('ul').sortable({
 * 	dragClass // 被选中的行追加的class名称
 *  noDragClass 不希望用来排序的行的class名称
 *  onDrop:function(elem, a, b){ // 调整排序后的回调函数 elem 根元素，a，拖动的元素 b，替换的元素
 *  }
 *  relate: hapj.ui.id('ulList') // 关联拖动的对象
 * });
 **/
(function(H){
    var inited = false,dragElem, defaults = {
        dragClass:'sort_drag',
        noDragClass:'nodrag',
        onDrop:null,
        relate:null, // 与拖动元素匹配的关联对象，拖动时关联对象将做相同的移动
        cssCursor:'move'
    };
    H.ui.fn.sortable = function(options) {
        options = H.extend(H.extend({}, defaults), options);
        this.each(function(){
            var self = this;
            if (this.nodeName == 'TABLE') {
                self = self.getElementsByTagName('tbody')[0];
            }
            if (options.relate && options.relate[0].tagName == 'TABLE') {
                options.relate = options.relate.tag('tbody');
            }

            var ec = new ElemCordinate(self, options);
            // 必须有多余1个节点才需要排序
            if (ec.childs.length < 2) {
                return;
            }
            ec.childs.css('cursor', options.cssCursor);
            self.eCordinate = ec;
            if (H.browser.type == 'msie') {
                H.ui(self).on('selectstart',function(){return false;})
            }

            hapj.ui(self).on('mousedown', function(e){
                if(/^(INPUT|TEXTAREA|OBJECT|EMBED|LABEL|BUTTON|SELECT|A)$/.test(e.target.nodeName)){
                    return;
                }
                if (!dragElem && H.ui.contains(self, e.target)) {
                    var tn = e.target;
                    while (tn.parentNode !== self ) {
                        tn = tn.parentNode;
                    }
                    if (H.ui(tn).hasClass(options.noDragClass)) {
                        return;
                    }
                    dragElem = tn;
                    H.ui(tn).addClass(options.dragClass);

                    // 初始化子节点的位置
                    self.eCordinate.getChildCordinates();

                    // 初始化document的拖放事件
                    initDoc();
                }
                return false;
            });
        });
        return this;
    }

    var ElemCordinate = function(elem, options){
        this.elem = H.ui(elem);
        this.options = options;
        this.loadChilds();
    };

    ElemCordinate.prototype = {
        options:{},
        cordinates:[],
        childs:[],
        loadChilds:function(){
            var childs = this.elem.childs(),ret = new H.ui.node(),self = this, num = 0;
            childs.each(function(){
                if (!H.ui(this).hasClass(self.options.noDragClass)) {
                    ret.push(this);
                    this.sortIndex = num;
                    num++;
                }
            });
            this.childs = ret;
            // 检查关联对象数量和子节点数量是否一致
            var self = this;
            if (this.options.relate) {
                if (this.options.relate.childs(this.relateChildTag).length != this.childs.length) {
                    throw new Error('sortable.u_relateChildCountNotMatch');
                }
            }
        },
        getChildCordinates:function(){
            var self = this;
            this.loadChilds();

            this.childs.each(function(i){
                var e = H.ui(this),pos = e.offset();
                self.cordinates[i] = {
                    left:pos.left,
                    top:pos.top,
                    right:pos.left + e.width(),
                    bottom:pos.top + e.height()
                };

                if (dragElem && dragElem === this) {
                    self.dragCordinate = self.cordinates[i];
                }
            });
        },
        getChildByCordinate:function(x, y){
            var dc = this.dragCordinate, down = dc.top < y;
            for(var i = 0,l = this.cordinates.length; i < l; i++) {
                var c = this.cordinates[i];

                if (c.left < x && c.right > x) {
                    if (down) {
                        if (y > c.bottom - (dc.bottom - dc.top) && y < c.bottom) {
                            return this.childs[i];
                        }
                    } else {
                        if (y > c.top  && y < c.top + (dc.bottom - dc.top)) {
                            return this.childs[i];
                        }
                    }
                }
            }
            return null;
        },
        exchangeChilds:function(a, b) {
            var an = H.ui(a).next()[0],bn = H.ui(b).next()[0], bp = b.parentNode;

            if (an === b) {
                bp.insertBefore(b, a);
                if (this.options.relate) {
                    var childs = this.options.relate.childs();
                    var br = childs[b.sortIndex],ar = childs[a.sortIndex];
                    br.parentNode.insertBefore(br, ar);
                    var tmp = b.sortIndex;
                    b.sortIndex = a.sortIndex;
                    a.sortIndex = tmp;
                }
            } else {
                bp.insertBefore(a, b);
                if (this.options.relate) {
                    var childs = this.options.relate.childs();
                    var br = childs[b.sortIndex],ar = childs[a.sortIndex];
                    br.parentNode.insertBefore(ar, br);
                    var tmp = b.sortIndex;
                    b.sortIndex = a.sortIndex;
                    a.sortIndex = tmp;
                }
            }
            if (this.options.onDrop) {
                this.options.onDrop.call(null, this.elem[0], a, b);
            }
        }
    };

    function initDoc()
    {
        if (inited) return;
        inited = true;
        H.ui(document)
            .on('mousemove', doDocMouseMove)
            .on('mouseup', doDocMouseUp)
            .on('mouseleave', doDocMouseUp);
    }

    function doDocMouseUp(e) {
        if (dragElem) {
            H.ui(dragElem).removeClass(dragElem.parentNode.eCordinate.options.dragClass);
        }
        dragElem = null;
        inited = false;
        H.ui(document)
            .un('mousemove', doDocMouseMove)
            .un('mouseup', doDocMouseUp)
            .un('mouseleave', doDocMouseUp);
    }

    var curDragNode;
    function doDocMouseMove(e)
    {
        if (!dragElem) return;

        // 将dragElem做适当的效果，使得用户能感知该元素正在被拖动
        var ec = dragElem.parentNode.eCordinate;
        if (!ec) return;
        var child = ec.getChildByCordinate(e.pageX, e.pageY);
        if (child && child !== dragElem) {
            curDragNode = child;
            ec.exchangeChilds(dragElem, child);
            ec.getChildCordinates();
        }
        e.preventDefault();
    }
})(hapj);

/*
 * 兼容之前的H.com('sort')的调用方法
 */
(function(H, undefined){
    var cfg,
        me = {
            init: function(configs) {
                cfg = configs;
            },
            active: function(id) {
                if (typeof id == 'string') {
                    id = '#' + id;
                }
                H.ui(id).sortable(cfg);
            }
        };
    H.lib.sort = me;
})(hapj);