/**
 * Copyright (c) 2014, Jiehun.com.cn Inc. All Rights Reserved
 * @author dengxiaolong@jiehun.com.cn
 * @date 2014-08-03
 * @version 1.0
 * @module hapj/ui/progressbar
 * @brief 使节点能够根据所在屏幕位置变成一个进度条的节点，根据屏幕位置来提示进度
 * @example
 hapj(function(H){
	H.ui('#list1').tag('li')
	.progressable({
		title:'h4',
		maxWidth:1500,
		getTitle:function(i){
			return '第' + (i + 1) + '章';
		},
		offsetTop:40
	});
});
 **/
!function($, d){
	var defaults = {
		minOffset:20,  // 进度条两点最短距离
		maxWidth:1000, // 进度条最长宽度
		dotWidth:10,   // 每个点的宽度
		offsetTop:20,   // 距离顶部多远开始计算
		parent:null,		// 进度条放置到哪个容器，默认放到body
		onHide:null,
		onShow:null
	};

	/**
	 * @constructor
	 * @param {object} options 配置参数
	 *
	 */
	$.fn.progressable = function(options) {
		var offset = this.offset();
		var height = this.height(true);
		var o = $.extend({}, defaults);
		$.extend(o, options);
		var offsets = [];

		// 计算好各个节点的位置
		var len = this.length;
		for(var i = len - 1; i >= 0; i--) {
			var el = $(this[i]);
			offsets[i] = [el.offset().top, el.height(true)];
		}
		// 生成好对应的进度条面板
		var height = offsets[len - 1][0] + offsets[len - 1][0] - offsets[0][0];
		var ratio = o.maxWidth/height;

		// 生成一个进度条元素
		var div = $('<div>');
		div.addClass('progressbar');
		var htmls = [];
		htmls.push('<ul>');

		// 计算好进度条的左边距及宽度
		offsets[0][2] = 0;
		var startLeft = offsets[0][0] * ratio;
		for (var i = 1; i < len; i++) {
			var left = ratio * offsets[i][0] - startLeft;
			var offset = left - offsets[i - 1][2];
			if (offset < o.minOffset) {
				left = offsets[i - 1][2] + o.minOffset;
				//console.log(offset, left);
			}
			left = parseInt(left);
			offsets[i][2] = left;
		}
		for(var i = 0; i < len; i++) {
			if (i == len - 1) {
				offsets[i][3] = o.maxWidth - offsets[i][2];
			} else {
				offsets[i][3] = offsets[i + 1][2] - offsets[i][2];
			}
		}
		//console.log(offsets);
		// 调整好每个进度的宽度
		for(var i = 0; i < len; i++) {
			var html = '<li style="left:' + offsets[i][2] + 'px;width:' + offsets[i][3] + 'px;"><a><em index="' + i + '"></em><i><b></b><span></span></i><h4>';
			if (options.getTitle) {
				var title = options.getTitle.call(this[i], i);
				if (title) {
					html += title;
				}
			}
			html += '</h4></a><div class="back"></div><div class="front"></div></li>';
			htmls.push(html);
		}
		htmls.push('</ul>');
		div.html(htmls.join(''));
		if (!o.parent) {
			document.body.appendChild(div[0]);
		} else {
			o.parent.appendChild(div[0]);
		}

		// 初始化点击事件
		var self = this;
		div.on('click', function(e){
			if (e.target.nodeName == 'EM') {
				var i = e.target.getAttribute('index');
				var of = $(self[i]).offset();
				window.scrollTo(of.left, of.top - o.offsetTop + 2);
			}
		});

		// 初始化显示和隐藏
		if (!o.parent) {
			if (!o.onHide) {
				o.onHide = function() {
					div.hide();
				};
			}
			if (!o.onShow) {
				o.onShow = function() {
					div.show();
				};
			}
		}

		var lis = div.find('li');

		var doc = $(d);
		$(window).on('scroll', function(e) {
			onResize(div, doc, lis, offsets, height, o);
		});
		$(window).on('resize', function(e) {
			onResize(div, doc, lis, offsets, height, o);
		});
		onResize(div, doc, lis, offsets, height, o);

		return this;
	};

	var lastTop = null;
	function onResize(div, self, lis, offsets, height, options)
	{
		var startY = options.offsetTop
			, top = $(window).scrollTop() + startY
			, min = null
			, len = offsets.length;

		for(var i = 0; i < len; i++) {
			var delta = top - offsets[i][0];
			if (min === null) {
				min = [delta, i];
			} else {
				if (delta > 0 && delta < min[0]) {
					min = [delta, i];
				}
				if (delta < 0) {
					break;
				}
			}
		}
		if (min !== null) {
			if (min[0] > offsets[min[1]][1]) {
				min[0] = offsets[min[1]][1];
				if (min[1] == len - 1) {
					options.onHide && options.onHide.call(null, div);
					return;
				}
			}

			if (min[1] in lis) {
				lis.removeClass('on');
				lis[min[1]].className = 'on';
			}

			if (lastTop != null) {
				var _delta = min[0];
				var index = min[1];
				if (index < 0 || $(window).scrollTop() == 0) {
					options.onHide && options.onHide.call(null, div);
					return;
				}
				options.onShow && options.onShow.call(null, div);
				var ratio = offsets[index][3]/offsets[index][1];
				var width = _delta * ratio;
				if (width < options.minOffset) {
					// 如果只有一个节点，则移动点
					width = 0;
				}

				if (offsets.length == 1) {
					lis[index].getElementsByTagName('em')[0].style.left = (width - options.dotWidth/2) + 'px';
					return;
				}


				if (index in lis) {
					lis[index].getElementsByTagName('div')[1].style.width = width + 'px';
				}
				for(var i = 0; i < index; i++) {
					lis[i].getElementsByTagName('div')[1].style.width = offsets[i][3] + 'px';
				}
				for(var i = index + 1; i < len; i++) {
					lis[i].getElementsByTagName('div')[1].style.width = '0px';
				}
			}
		}

		// 调整进度条位置
		lastTop = top;
	}
}(jQuery, document);