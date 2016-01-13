<?php
$showType = 'example';
include '../../include/header.phtml';
?>
<script src="/src/js/ui/suggestable.js"></script>
<style>
    ul,li{list-style:none;}
    h1{font-size:30px;}
    button{width:120px; height:26px; line-height:24px; background:#e02020; color:#fff; border:none; font-size:14px; border-radius:3px;}
    .menu{display:none;border:solid 2px #CCC;width:200px;height:200px;}
	.suggestion ul,.suggestion li{list-style:none;padding:0;margin:0;}
	.suggestion li{background:#DDD;}
	.suggestion li.on{background:#CCC;}

</style>
<h1>提供建议(suggestable)</h1>
<div class="codewrap">
    <label class="label label-primary">Javascript:</label>
    <pre><code class="javascript">
$('#txtEmail').suggestable({
  items:['qq.com', 'hotmail.com', '163.com', '126.com','hotmail.com','foxmail.com','sina.com','sohu.com','gmail.com'],
  onSelect: function(text) {
    this.value = text;
  },
  autoSearch:true,
  searchPrefix: '@'
});
    </code></pre>
    
    <label class="label label-primary">Html:</label>
    <pre><code class="html">
&lt;label&gt;请输入您的邮箱地址：&lt;/label&gt;&lt;input type="text" id="txtEmail"/&gt;
    </code></pre>
</div>
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

<?php include '../../include/footer.phtml' ?>