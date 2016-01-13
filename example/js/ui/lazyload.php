<?php
$showType = 'example';
include '../../include/header.phtml';
?>
    <script src="/dist/jquery/jquery.lazyload.min.js"></script>

    <h1>延迟加载(lazyload)</h1>
    <label class="label label-default"> 项目主页：</label>http://www.appelsiini.net/projects/lazyload<br/>
    <a href="http://www.appelsiini.net/projects/lazyload" target="_blank">官方文档</a>

<?php
$imgs = array(
    'http://3.tthunbohui.cn/n/00400gUC00150kM9x0sM5u8.jpg',
    'http://4.tthunbohui.cn/n/00800gS700160iL7b0sM5u8.jpg',
    'http://4.tthunbohui.cn/n/00800gTr00120kn94wsM5u8.jpg',
    'http://1.tthunbohui.cn/n/00400gSo00170j!WjgsM5u8.jpg',
    'http://4.tthunbohui.cn/n/00800gHT00160ehlgMsM5u8.jpg',
);
?>
    <ol>
        <li>
            <h2>常规的延迟加载</h2>

            <label class="label label-primary">Javascript:</label>
        <pre><code class="javascript">
$('.lazy').lazyload({
    effect : 'fadeIn'
});
        </code></pre>
            <label class="label label-primary">Html:</label>
            <pre><code class="html">
&lt;ul data-hook="lazyload" data-hook-selector=".lazy" data-hook-option="{effect:'fadeIn'}"&gt;
    &lt;img class="lazy" data-original="..."/&gt;
&lt;/ul&gt;</code> </pre>
            <style>
                ul > li > .lazy {
                    width: 460px;
                    height: 350px;
                }
            </style>
            <ul data-hook="lazyload" data-hook-selector=".lazy" data-hook-option="{
                effect:'fadeIn'
            }">
                <?php foreach ($imgs as $img): ?>
                    <li><div class="lazy" data-original="<?= $img ?>"></div></li>
                <?php endforeach ?>
            </ul>
        </li>
        <li>
            <h2>水平方向的延迟加载</h2>
        <pre><code class="javascript">
$('img.lazy1').lazyload({
    effect : 'fadeIn',
    container: $('#container')
});
        </code></pre>
            <style>
                #container {
                    width: 600px;
                    overflow-x: scroll;;
                }

                #horizontal {
                    width: 10000px;
                    height:350px;
                }

                #horizontal li {
                    display: inline-block;
                    width: 460px;
                    height:350px;
                }
            </style>
            <div id="container">
                <ul id="horizontal">
                    <?php foreach ($imgs as $img): ?>
                        <li><img class="lazy1" data-original="<?= $img ?>?v=2"/></li>
                    <?php endforeach ?>
                </ul>
            </div>
            <script>
                $('img.lazy1').lazyload({
                    container: $('#container')
                });
            </script>
        </li>
    </ol>


<?php include '../../include/footer.phtml' ?>