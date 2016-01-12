<?php
$examples = array(
    array('name' => 'Lazyload', 'url' => './js/ui/lazyload.php'),
    array('name' => 'Verifiable', 'url' => './js/ui/verifiable.php'),
    array('name' => 'Lazyload', 'url' => './ui/lazyload.php'),
    array('name' => 'floatable', 'url' => './ui/floatable.php'),
    array('name' => 'switchable', 'url' => './ui/switchable.php'),
    array('name' => 'progressable', 'url' => './ui/progressable.php'),
);
?>
<!doctype html>
<html lang="zh-cn">
<head>
    <meta charset="UTF-8">
    <title>hapj example</title>
    <link href="//cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.min.css" rel="stylesheet">
    <script src="//cdn.bootcss.com/jquery/1.11.3/jquery.min.js"></script>
    <script src="../src/hapj.js"></script>
</head>
<body>
<div class="container">
    <h1>Hapj Example List</h1>

    <h3>Js例子</h3>
    <ul>
        <?php foreach ($examples as $ex): ?>
        <li><a href="<?= $ex['url'] ?>"><?= $ex['name']?></a></li>
        <?php endforeach; ?>
    </ul>

    <h3>Css例子</h3>
</div>
</body>
</html>
