<?php include dirname(__DIR__) . '/include/header.phtml'?>
<h1>浮动元素定位(floatable)</h1>
<script src="/src/ui/progressable.js"></script>

<style>
body,h1,h2,h3,h4,h5,h6,hr,blockquote,dl,dt,dd,ul,ol,li,pre,form,fieldset,legend,button,input,textarea,th,td{margin:0;padding:0}
li{list-style:none;}
		body{background:#FCFCFC;}
		#top_panel{position:fixed;left:0;top:0;width:1003px;margin:0 auto;}
		#top_panel .container{position:relative;width:1003px;}
		#top_panel .container .left{width:820px;padding:0 10px;position:absolute;left:0;top:0;}
		#top_panel .container .right{width:150px;position:absolute;right:0;top:0;}
		
		.progressbar{width:800px;margin:0 auto;background:#0CF;padding:0 10px;}
		.progressbar ul{position:relative;list-style:none;padding:0;margin:0;opacity:0.85;height:40px;width:100%}
		.progressbar li{position:absolute;list-style:none;padding:0;}
		.progressbar li a{display:block;width:20px;height:20px;}
		.progressbar li a em{position:absolute;cursor:pointer;left:0;top:6px;width:10px;height:10px;border-radius:10px;background:#F00;display:block;z-index:1000;}
		.progressbar li a h4{position:absolute;top:10px;height:10px;margin:0;padding:0;display:none;}
		.progressbar li.on a em,.progressbar li a:hover em{background-color:#FF0;}
		.progressbar li.on a h4,.progressbar li a:hover h4{display:block;left:0;width:100px;text-align:center;margin-left:-45px;top:20px;font-size:12px;font-weight:normal;}
		.progressbar li .front{position:absolute;background:#FF0;height:2px;width:0;top:10px;}
		.progressbar li .back{position:absolute;background:#CCC;height:2px;width:0;width:100%;top:10px;}
		
		ol,ol li,h4{list-style:none;padding:0;margin:0;}
</style>


	<div style="height:400px"></div>
	<ol id="list1">
		<?php for($i = 0; $i < 10; $i++):
				$height = rand(10, 600);
		?>
		<li style="height:<?=$height?>px;background:#<?=sprintf('%02x%02x%02x', rand(1, 255), rand(1, 255), rand(1, 255))?>">
			<h4>第<?=$i+1?>章</h4>
		</li>
		<?php endfor?>
	</ol>

	<h3>sdfdf</h3>
	<div style="height:400px"></div>
	<ol id="list2">
       	<?php for($i = 10; $i < 20; $i++):
			$height = rand(10, 600);
		?>
		<li style="height:<?=$height?>px;background:#<?=sprintf('%02x%02x%02x', rand(1, 255), rand(1, 255), rand(1, 255))?>">
			<h4>第<?=$i+1?>章</h4>
		</li>
		<?php endfor?>
	</ol>

	<div style="height:1000px" id="list3"></div>

<script type="text/javascript">
		var pe = $('#top_panel');
		$('#list1').find('li').progressable({
			title:'h4',
			maxWidth:800,
			getTitle:function(i){
				return '第' + (i + 1) + '章';
			},
			offsetTop:40,
			parent:pe.find('left')[0],
			onShow:function() {
				pe.show();
			},
			onHide:function() {
				pe.hide();
			},
			onProgress:function(i) {
				
			}
		});
</script>

<?php include dirname(__DIR__) . '/include/footer.phtml' ?>