<?php
$showType = 'example';
include '../../include/header.phtml';
?>
<script src="/src/js/ui/menuable.js"></script>
<style>
body{font-family:"微软雅黑";}
h1{font-size:30px;}
.codewrap{margin:20px 0;}
button{width:120px; height:26px; line-height:24px; background:#e02020; color:#fff; border:none; font-size:14px; border-radius:3px;}
.menu{display:none;border:solid 2px #CCC;width:200px;height:200px;}
ul,li{list-style:none;}
li span{cursor:pointer;}
</style>

<h1>模拟菜单(menuable)</h1>
<div class="codewrap">
    <label class="label label-primary">Javascript:</label>
    <pre><code class="javascript">
  var menu = $('.menu').menuable();
  $('#btn').bind('click', function(e){
      menu.show(e);
      return false;
  });
    </code></pre>
    
    <label class="label label-primary">Html:</label>
    <pre><code class="html">
  &lt;button id="btn"&gt;点我抽大奖&lt;/button&gt;
  &lt;div class="menu"&gt;menu&lt;/div&gt;
    </code></pre>
</div>
<button id="btn">点我抽大奖</button>
<ul class="menu">
    <li><span>菜单项1</span></li>
    <li><span>菜单项2</span></li>
    <li><span>菜单项3</span></li>
    <li><span>菜单项4</span></li>
    <li><span>菜单项5</span></li>
    <li><span>菜单项6</span></li>
</ul>
<script>
var menu = $('.menu').menuable();
$('#btn').bind('click', function(e){
	menu.show(e);
	return false;
});
</script>
<?php include '../../include/footer.phtml' ?>
