<?php include dirname(__DIR__) . '/include/header.phtml'?>
<h1>浮动元素定位(floatable)</h1>
<script src="/src/ui/switchable.js"></script>

<style>
body,h1,h2,h3,h4,h5,h6,hr,blockquote,dl,dt,dd,ul,ol,li,pre,form,fieldset,legend,button,input,textarea,th,td{margin:0;padding:0}
li{list-style:none;}

.profocus{width:460px;height:350px;overflow:hidden;position:relative; float:left;}
.profocus  ul{margin:0;padding: 0;word-spacing:normal; overflow:hidden; position:relative;}
.profocus  li{width:460px;height:350px; text-align:right; float:left;}
.profocus  li img{margin:0;display:block; width:460px; height:350px;}
.profocus .num{position:absolute; bottom:20px; left:50%; margin-left:-150px; z-index:10;  text-align:center; width:300px;}
.profocus .num span{ cursor:pointer; display:inline-block;width:12px;height:12px;border-radius: 50%;background: #e7e7e7;margin:13px 7px 0 0;}
.profocus .num span.on{background:#ff4466;}	
</style>

<?php
$imgs = array(
    'http://3.tthunbohui.cn/n/00400gUC00150kM9x0sM5u8.jpg',
    'http://1.tthunbohui.cn/n/00800gZo00170nlkDMsM5u8.jpg',
    'http://4.tthunbohui.cn/n/00800gS700160iL7b0sM5u8.jpg',
);
?>

<div id="productfocus" class="profocus">
	<ul class="g">
	   <?php foreach ($imgs as $img):?>
		<li style="background-color: #d0e1f2"><img src="<?=$img?>"></li>
	   <?php endforeach;?>
	</ul>
	<div class="num">
	   <?php foreach ($imgs as $img):?>
		<span></span>
	   <?php endforeach;?>
	</div>
</div>

<script>
    var banner = $('#productfocus'), oUl = banner.find('ul');
	var aLi = oUl.find('li'),w = aLi[0].offsetWidth,len = aLi.length,

	sw = banner.find('.num').switchable({
		tag:'span',
		method:'hover',
		map:function(i) {
			return aLi[i];
		},
		cycleTime: 2000,
		trigger: function(tr) {
			tr.removeClass('on');
			this.className = ' on';
		},
		target: function(ts, i) {
			$(oUl).animate({'left':-w*i}, 300);
		}
	});
	$('#productfocus').find('ul').width(len*w);
	if(len>=2){
		sw.first();
	}else{
		$('#productfocus .num').hide();
	}
</script>

<?php include dirname(__DIR__) . '/include/footer.phtml' ?>