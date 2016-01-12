<?php include dirname(__DIR__) . '/include/header.phtml' ?>
    <script src="/src/ui/suggestable.js"></script>
    <style>
    	.suggestion ul,.suggestion li{list-style:none;padding:0;margin:0;}
    	.suggestion li{background:#DDD;}
    	.suggestion li.on{background:#CCC;}
    </style>
    <h1>提供建议(suggestable)</h1>
        <ol>
			<li>
				<h2>数组</h2>
				
				<label>Email</label><input type="text" id="txtEmail"/>
				
				<script>
					$('#txtEmail').suggestable({
						items:['qq.com', 'hotmail.com', '163.com', '126.com'],
						onSelect: function(text) {
							this.value = text;
						},
						autoSearch:true,
						searchPrefix: '@'
					});
				</script>
			</li>
		</ol>

<?php include dirname(__DIR__) . '/include/footer.phtml' ?>