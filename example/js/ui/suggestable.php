<?php include '../../include/header.phtml' ?>
<script src="/src/js/ui/suggestable.js"></script>
<style>
	.suggestion ul,.suggestion li{list-style:none;padding:0;margin:0;}
	.suggestion li{background:#DDD;}
	.suggestion li.on{background:#CCC;}
</style>
<h1>提供建议(suggestable)</h1>
<label>请输入您的邮箱地址：</label><input type="text" id="txtEmail"/>
<script>
	$('#txtEmail').suggestable({
		items:['qq.com', 'hotmail.com', '163.com', '126.com','hotmail.com','foxmail.com','sina.com','sohu.com','gmail.com'],
		onSelect: function(text) {
			this.value = text;
		},
		autoSearch:true,
		searchPrefix: '@'
	});
</script>

<?php include dirname(__DIR__) . '/include/footer.phtml' ?>