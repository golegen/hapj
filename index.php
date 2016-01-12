<?php include 'example/include/header.phtml'?>

<?php
$path = './doc/readme.html';
if (!is_readable($path)) {
    ob_start();
    system('gulp markdown', $code);
    ob_get_clean();
}
if (is_readable($path)):
    $content = file_get_contents($path);
    echo $content;
else :
?>

<h1>Hapj 前端框架</h1>

<blockquote>
    HapJ 框架是一个基于jQuery的框架。
</blockquote>

<p>
    HapJ试图以简洁的方式解决前端的交互问题，只需要简单的配置，即可实现复杂的交互效果。
</p>
<?php endif?>
<?php include 'example/include/footer.phtml'?>
