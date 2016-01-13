<?php
$showType = 'example';
include '../../include/header.phtml';
?>
<script src="../../../src/js/ui/radioable.js"></script>
<h2>radioable插件使用方法发</h2>
<p>该插件主要功能是将多选框转化成评分小星星。原理是隐藏原生的多选框，根据多选框的个数均分外层背景图片容器的宽度，当鼠标移入或者点击的时候，
    判断事件触发的坐标在哪个对应的input中，将外层容器的类名改成对应的class，切换背景图的定位。从而展现出不同的星星</p>
<h3>1.css写法</h3>
<p>根据星星个数，来定位position位置</p>
<pre>
    <code class="html">
     .star,.star-1,.star-2,.star-3,.star-4,.star-5{
        cursor:pointer;
        width:115px;
        height:27px;
        overflow:hidden;
        margin:0;
        padding:0;
        display:inline-block;
        background:url(img/stars_sprite.gif) 0 top;
    }
    .star-1{background-position:0 -56px}
    .star-2{background-position:0 -112px}
    .star-3{background-position:0 -168px}
    .star-4{background-position:0 -224px}
    .star-5{background-position:0 -280px}
    </code>
</pre>
<h3>2.html写法</h3>
<pre>
    <code class="html">
        &lt;p id="radio"&gt;
         &lt;input type="radio" name="star" value="1" id="star-1"/&gt;&lt;label for="star-1"&gt;一星级&lt;/label&gt;
         &lt;input type="radio" name="star" value="2" id="star-2"/&gt;&lt;label for="star-2"&gt;二星级&lt;/label&gt;
         &lt;input type="radio" name="star" value="3" id="star-3"/&gt;&lt;label for="star-3"&gt;三星级&lt;/label&gt;
         &lt;input type="radio" name="star" value="4" id="star-4"/&gt;&lt;label for="star-4"&gt;四星级&lt;/label&gt;
         &lt;input type="radio" name="star" value="5" id="star-5"/&gt;&lt;label for="star-5"&gt;五星级&lt;/label&gt;
        &lt;/p&gt;
     &lt;span id="hint"&gt;&lt;/span&gt;
    </code>
</pre>
<h3>3.js写法</h3>
<h3>找到input的容器，执行radioable方法,radioable方法中穿入的参数option中有一下几种：</h3>
<ol>
    <li><i>name:</i>input的name(必填参数)</li>
    <li><i>width:</i>宽度为背景图的容器的宽度(必填参数)</li>
    <li><i>onHover:</i>控制鼠标移入时执行的函数</li>
    <li><i>onchange:</i>函数点击时执行的函数</li>
    <li><i>defaultClass:</i> input的默认样式，默认值为：'star'</li>
    <li><i>hoverClass:</i>鼠标移入时的类名，默认值为：'star-{value}'</li>
    <li><i>selectedClass:</i>点击时的类名，默认值为：'star-{value}'</li>
</ol>
<pre>
    <code class="html">
    $('#radio').radioable({
        name:'star',                     <i>//input的name(必填参数)</i>
        width:115,                       <i>//宽度为背景图的容器的宽度(必填参数)</i>
        onHover:function(i, t){          <i>//onHover函数控制鼠标移入时执行的函数</i>
            $('#hint').html(' &lt;span style="color:#FCC"&gt' + t + '&lt/span&gt');
        },
        onChange:function(i, t) {        <i>//onchange函数点击时执行的函数</i>
            $('#hint').html(' &lt;span style="color:#F00"&gt' + t + '&ltspan&gt');
        }
    });
    </code>
</pre>
<h3>4.效果展示</h3>
<style>
    pre{
        font-size: 18px;
    }
    pre i{
        color:#00CED1;
    }
    body{
        font-size: 20px;
        background-color: #eee!important;
        padding-bottom: 50px;
    }
    .star,.star-1,.star-2,.star-3,.star-4,.star-5{
        cursor:pointer;
        width:115px;
        height:27px;
        overflow:hidden;
        margin:0;
        padding:0;
        display:inline-block;
        background:url(img/stars_sprite.gif) 0 top;
    }
    .star-1{background-position:0 -56px}
    .star-2{background-position:0 -112px}
    .star-3{background-position:0 -168px}
    .star-4{background-position:0 -224px}
    .star-5{background-position:0 -280px}
</style>

    <p id="radio">
        <input type="radio" name="star" value="1" id="star-1"/><label for="star-1">一星级</label>
        <input type="radio" name="star" value="2" id="star-2"/><label for="star-2">二星级</label>
        <input type="radio" name="star" value="3" id="star-3"/><label for="star-3">三星级</label>
        <input type="radio" name="star" value="4" id="star-4"/><label for="star-4">四星级</label>
        <input type="radio" name="star" value="5" id="star-5"/><label for="star-5">五星级</label>
    </p>
    <span id="hint"></span>
<script>
    $('#radio').radioable({
        name:'star',
        width:115,
        onHover:function(i, t){
            $('#hint').html('<span style="color:#FCC">' + t + '</span>');
        },
        onChange:function(i, t) {
            $('#hint').html('<span style="color:#F00">' + t + '</span>');
        }
    });
</script>

<?php include '../../include/footer.phtml' ?>