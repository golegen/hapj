<?php include 'include/header.phtml' ?>
    <script src="/src/ui/hapj.ui.sortable.js"></script>
    <h1>hook</h1>

    <h2>ui hook</h2>

    <ul data-hook="sortable">
        <li>line 1</li>
        <li>line 2</li>
        <li>line 3</li>
    </ul>
    <pre><code>
        <ul data-hook="sortable">
            <li>line 1</li>
            <li>line 2</li>
            <li>line 3</li>
        </ul></code>
    </pre>

    <h2>custom hook</h2>
    <div id="hookDiv" data-hook="foo" data-hook-option="{
        'foo':'bar'
    }">
        dddff
    </div>




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
