<?php
$showType = 'example';
include '../../include/header.phtml';
?>
    <script src="/src/js/ui/selectable.js"></script>
<style>

    label{
        cursor: pointer;
        border:1px solid transparent;
        padding:3px;
        border-radius: 5px;
    }
    label:hover{
        color:#0078d6;
        border:1px solid #aaa;
    }
    
    .on{
        cursor: pointer;
        background:#0078d6;
        color:#fff;
    }

</style>
<h1>selectable使用方法</h1>
<h3>1.html写法</h3>
<p>主要用来将普通的下拉框组件(或ul)转化为可以自定义样式的下拉框组件。绑定到原有下拉框的事件也会起作用。原理是隐藏原生的下拉列表，用dt等元素模拟显示下拉效果</p>
    <label class="label label-primary">html:</label>
<pre><code class="html">&lt;select&gt;
    &lt;option value="0"&gt;婚芭莎-婚纱照&lt;/option&gt;
    &lt;option value="1"&gt;婴芭莎-童车、奶粉&lt;/option&gt;
    &lt;option value="2"&gt;家芭莎-沙发、彩电&lt;/option&gt;
    &lt;option value="3"&gt;车芭莎-兰博基尼&lt;/option&gt;
&lt;/select&gt;
&lt;ul&gt;
    &lt;li class="on">婚芭莎-婚纱照&lt;/li&gt;    <i>如果使用ul则必须设置一个默认值</i>
    &lt;li>婴芭莎-童车、奶粉&lt;/li&gt;
    &lt;li>家芭莎-沙发、彩电&lt;/li&gt;
    &lt;li>车芭莎-兰博基尼&lt;/li&gt;
&lt;/ul&gt;</code></pre>
<h3>2.css写法</h3>
<p>css样式自定义，不做要求</p>
    <label class="label label-primary">css:</label>
<pre><code class="css">
ul {
    list-style: none;
}
li{
    width:200px;
    padding:5px 10px;
    border-radius: 5px;
}
.on{
    cursor: pointer;
    background:#0078d6;
    color:#fff;
}</code>
</pre>
<h3>3.js写法</h3>
     param options 配置参数，目前支持的有：
     <dl>
      <dt>selectedClassName:<em>string</em></dt>
      <dd>表示选中时的样式名称，默认为on</dd>
      <dt>showEvent:<em>string</em></dt>
      <dd>用来显示菜单的事件，可选值为mouseover、mouseenter、click，默认为click。</dd>
      <dt>pack:<em>function(o)</em></dt>
      <dd>用来设定选择选项后显示的文字<br/><label>o</label>被选中的option或被选中的li</dd>
      <dt>hideDelayTime:<em>Int</em></dt>
      <dd>隐藏延迟的时间，只有showEvent为mouseover或mouseenter才有效，如果该值小于0，则不会自动掩藏</dd>
      <dt>onShow:<em>function()</em></dt>
      <dd>显示时调用的事件</dd>
      <dt>onHide:<em>function()</em></dt>
      <dd>隐藏时调用的方法</dd>
      <dt>onChange:<em>function()</em></dt>
      <dd>更改时调用的方法</dd>
     </dl>
    <label class="label label-primary">javascript:</label>
<pre><code class="javascript">
$('select').selectable({
    showEvent:'mouseenter',
    pack:function(o) {
        return '搜索' + o.text;
    }
});
</code>
</pre>
<h3>4.效果展示</h3>
    <select class="select2">
        <option value="0">婚芭莎-婚纱照2</option>
        <option value="1">婴芭莎-童车、奶粉2</option>
        <option value="2">家芭莎-沙发、彩电2</option>
        <option value="3">车芭莎-兰博基尼2</option>
    </select>
<script>
    $('select').selectable({
        showEvent:'mouseenter',
        pack:function(o) {
            return '搜索' + o.text;
        }
    });
</script>

<?php include '../../include/footer.phtml'; ?>