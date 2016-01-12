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
			
			
			<li>
				<h2>远程</h2> 
 				<label>城市</label><input type="text" id="txtCities"/>
				
 				<script>
					$('#txtCities').suggestable({
						items:'./cities.json',
						onWrapperData:function(ret){
							return ret.cities;
						},
						getItem:function(city) {
							return city.name;
						},
						onSelect: function(city) {
							this.value = city.name;
						},
						autoSearch:true
					});
				</script>
			</li>
		</ol>

<?php include dirname(__DIR__) . '/include/footer.phtml' ?>