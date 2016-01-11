<?php include dirname(__DIR__) . '/include/header.phtml' ?>
    <h1>延迟加载(lazyload)</h1>
    <script src="/dist/jquery/jquery.lazyload.min.js"></script>

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

    <pre>
        <code class="html">
            $('.lazy').lazyload({
                effect : 'fadeIn'
            });
        </code>
    </pre>
            <style>
                ul > li > .lazy {
                    width: 460px;
                    height: 350px;
                }
            </style>
            <ul>
                <?php foreach ($imgs as $img): ?>
                    <li><div class="lazy" data-original="<?= $img ?>"></div></li>
                <?php endforeach ?>
            </ul>
            <script>
                $('img.lazy').lazyload({
                    effect: "fadeIn"
                });
            </script>
        </li>
        <li>
            <h2>水平方向的延迟加载</h2>
    <pre>
        <code class="html">
            $('img.lazy1').lazyload({
                effect : 'fadeIn',
                container: $('#container')
            });
        </code>
    </pre>
            <style>
                #container {
                    width: 500px;
                    overflow-x: scroll;;
                }

                #horizontal {
                    width: 10000px;
                }

                #horizontal li {
                    display: inline-block;
                }
            </style>
            <div id="container">
                <ul id="horizontal">
                    <?php foreach ($imgs as $img): ?>
                        <li><img class="lazy1" data-original="<?= $img ?>"/></li>
                    <?php endforeach ?>
                </ul>
            </div>
            <script>
                $('img.lazy1').lazyload({
                    effect: 'fadeIn',
                    container: $('#container')
                });
            </script>
        </li>
    </ol>


<?php include dirname(__DIR__) . '/include/footer.phtml' ?>