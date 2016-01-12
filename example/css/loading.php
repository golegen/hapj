<!doctype html>
<html lang="zh-cn">
<head>
    <meta charset="UTF-8">
    <title>loading</title>
    <link rel="stylesheet" href="/src/css/loading.css"/>
    <style>
        body {background:#0dcecb;}
    </style>
</head>
<body>

<ul>
    <?php for($i = 1; $i <= 8; $i++):?>
    <li>
        <div class="load<?=$i?>">
            <div class="loader"></div>
        </div>
    </li>
    <?php endfor?>
</ul>


</body>
</html>