<?php
$showType = 'example';
$examples = array(
    array('name' => 'ajaxable', 'url' => './js/ui/ajaxable.php'),
    array('name' => 'dialog', 'url' => './js/ui/dialog.php'),
    array('name' => 'floatable', 'url' => './js/ui/floatable.php'),
    array('name' => 'Lazyload', 'url' => './js/ui/lazyload.php'),
    array('name' => 'menuable', 'url' => './js/ui/menuable.php'),
    array('name' => 'progressable', 'url' => './js/ui/progressable.php'),
    array('name' => 'radioable', 'url' => './js/ui/radioable.php'),
    array('name' => 'selectable', 'url' => './js/ui/selectable.php'),
    array('name' => 'suggestable', 'url' => './js/ui/suggestable.php'),
    array('name' => 'switchable', 'url' => './js/ui/switchable.php'),
    array('name' => 'Verifiable', 'url' => './js/ui/verifiable.php'),
    array('name' => 'calendar', 'url' => './js/ui/calendar.php'),
);
?>
<?php include 'include/header.phtml'?>
    <h1>Hapj Example List</h1>

    <h3>Js例子</h3>
    <ul>
        <?php foreach ($examples as $ex): ?>
        <li><a href="<?= $ex['url'] ?>"><?= $ex['name']?></a></li>
        <?php endforeach; ?>
    </ul>
    <h3>Css例子</h3>

<?php include 'include/footer.phtml'?>