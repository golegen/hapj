<?php include 'include/header.phtml' ?>
    <script src="../src/hook/hapj.hook.js"></script>
    <script src="../src/ui/hapj.ui.sortable.js"></script>
    <h1>hook</h1>

    <div id="hookDiv" data-hjhook="foo" data-hjoption="{
        'foo':'bar'
    }">
        dddff
    </div>

    <ul data-hjhook="sortable">
        <li>line 1</li>
        <li>line 2</li>
        <li>line 3</li>
    </ul>


    <script>
        jQuery.fn.foo1 = function(opt) {
            console.log(this);
        }
        hapj.hook.set('foo', function(elem, option) {
            console.log(elem);
        });

//        $('#hookDiv').foo();

    </script>
<?php include 'include/footer.phtml' ?>