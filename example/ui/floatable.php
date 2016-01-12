<?php include dirname(__DIR__) . '/include/header.phtml'?>
<h1>浮动元素定位(floatable)</h1>
<script src="/src/ui/floatable.js"></script>

<style>
#container {
	border: solid 2px #CCC;
	width: 600px;
	height: 400px;
}
.float {
	background: #FCC;
	width: 200px;
	height: 200px;
}
</style>

<div id="container">
	<div id="floatDiv" class="float"></div>
</div>
<div id="floatDiv2" class="float"></div>

<script>
   //设置divMenu元素处于linkMenu元素的右上角
   $('#floatDiv').floatable($('#container')).right().top();
</script>

<?php include dirname(__DIR__) . '/include/footer.phtml' ?>