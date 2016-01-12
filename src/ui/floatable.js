/** 
 * Copyright (c) 2016, Jiehun.com.cn Inc. All Rights Reserved
 * @class jQuery.fn.floatable
 * @author dengxiaolong@jiehun.com.cn  liuxiaoyan@hunbasha.com
 * @date 2016-01-11
 * @version 1.6
 * @description 使元素能相对另一个元素浮动起来。此代码可以使元素在整个页面居中、或浮动在页面左上角，右上角等
 * @example
		// 设置divMenu元素处于linkMenu元素的左上角
		$('#divMenu').floatable($('#linkMenu')).left().top();
 **/
!function($, undefined){
	"use strict";
	/**
	 * 元素浮动
	 * @param {Element} elem 作为当前元素浮动位置的参考元素 没有指定则为自己
	 */
	$.fn.floatable = function(elem){
		if (undefined === elem) {
			elem = document;
		}
		var isWnd = (elem === window);
		elem = $(elem);
		
		this.css('position', 'absolute');
	
		var pos, me = new Me();
		if (isWnd) {
			pos = {left:0, top:0};
		} else {
			pos = elem.offset();
		}
		if (pos === undefined) {
			pos = {left:0, top:0};
		}
		me.position = {
			width: elem.outerWidth(),
			height: elem.outerHeight()
		};
		
		$.extend(me.position, pos);
		me.ui = this;
		return me;
	};
	var Me = function(){};
	Me.prototype = {
		/**
		 * 在指定位置显示
		 * @param {Number} left 左边距
		 * @param {Number} top 顶边距
		 * 
		 */
		to: function(left, top) {
			var css = {};
			if (left === 0 || left) {
				css['left'] = (this.position.left + left) + 'px';
			} 
			if (top === 0 || top) {
				css['top'] = (this.position.top + top) + 'px';
			}
			this.ui.css(css);
			return this;
		},
		/**
		 * 顶部对齐
		 * @param {Number} offset 
		 */
		top:function(offset, out){
			offset = offset || 0;
			out = undefined === out ? false : out;
			this.ui.css('top', (this.position.top + offset - (out ? this.ui.height(true) : 0)) + 'px');
			return this;
		},
		/**
		 * 底部对齐
		 * @param {Number} offset 
		 */
		bottom:function(offset, out){
			var ui = this.ui, pos = this.position, height;
			offset = offset || 0;
			out = undefined === out ? false : out;
			ui.each(function(){
				if (!out) {
					height = $(this).height(true);
				} else {
					height = 0;
				}
				ui.css('top', (pos.top + pos.height - height + offset) + 'px');
			});
			return this;
		},
		/**
		 * 垂直居中
		 * @param {Number} offset 
		 */
		middle:function(offset){
			var ui = this.ui, pos = this.position;
			offset = offset || 0;
			ui.each(function(){
				var height = $(this).height(true);
				ui.css('top', parseInt(pos.top + (pos.height - height)/2 + offset) + 'px');
			});
			return this;
		},
		/**
		 * 左边对齐
		 * @param {Number} offset 
		 */
		left: function(offset, out) {
			var ui = this.ui, pos = this.position;
			offset = offset || 0;
			out = undefined === out ? false : out;
			ui.each(function(){
				ui.css('left', (pos.left + offset - (out ? $(this).width() : 0)) + 'px');
			});
			return this;
		},
		/**
		 * 右边对齐
		 * @param {Number} offset 
		 */
		right: function(offset, out) {
			var ui = this.ui, pos = this.position,width;
			offset = offset || 0;
			out = undefined === out ? false : out;
			ui.each(function(){
				if (!out) {
					width = $(this).width();
				} else {
					width = 0;
				}
				ui.css('left', (pos.left + pos.width - width + offset) + 'px');
			});
			return this;
		},
		/**
		 * 左右居中
		 * @param {Number} offset 
		 */
		center: function(offset) {
			var ui = this.ui, pos = this.position;
			offset = offset || 0;
			ui.each(function(){
				var width = $(this).width();
				ui.css('left', parseInt((pos.left + pos.width - width)/2 + offset) + 'px');
			});
			return this;
		}
	};
}(jQuery);
