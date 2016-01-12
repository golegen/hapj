<?php include 'include/header.phtml' ?>
    <script src="/src/ui/sortable.js"></script>
    <h1>hook</h1>

    <h2>ui hook</h2>

    <ul data-hook="sortable">
        <li>line 1</li>
        <li>line 2</li>
        <li>line 3</li>
    </ul>
    <pre><code class="html">
        &lt;ul data-hook="sortable">
            &lt;li>line 1&lt;/li>
            &lt;li>line 2&lt;/li>
            &lt;li>line 3&lt;/li>
        &lt;/ul></code>
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

        $.ajax({
            url:'ui/lazyload.php',
            data: {'a':'b'}
        });

    </script>
<?php include 'include/footer.phtml' ?>
