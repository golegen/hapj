<?php
$showType = 'example';
include '../../include/header.phtml';
?>
<script src="/src/js/ui/cal.js"></script>
<link rel="stylesheet" type="text/css" href="/src/css/cal.css"/>
<style>
    a{cursor:pointer;}
    #list dl, #list dd, #list dt, #list ul,#list ul li{list-style:none;padding:0;margin:0;}
</style>

<ol id="list">
    <li>
        <h2>绑定到input控件的日历</h2>
        <div id="calendar"></div>
        <label>日期：</label><input type="text" name="start_date" id="txtStartDate"/>
        <br>
        <script>
            var cal = $('#calendar').calendar({
                input: $('#txtStartDate'),
                format:'Y/m/d'
            });
        </script>
        <label class="label label-primary">Html:</label>
        <pre><code class="html">
         &lt;div id="calendar"&gt;&lt;/div&gt;
         &lt;label>日期：&lt;/label&gt; &lt;input type="text" name="start_date" id="txtStartDate"/&gt;
         </code></pre>

        <label class="label label-primary">Javascript:</label>
        <pre><code class="javascript">
         var cal = $('#calendar').calendar({
            input: $('#txtStartDate'),
            format:'Y/m/d'
         });
        </code></pre>
    </li>
    <li>
        <h2>绑定到input控件的日历（有默认时间）</h2>
        <div id="calendar6"></div>

        <label>日期：</label><input type="text" name="start_date" id="txtStartDate2" value="2014/08/25 23:22"/>
        <script>
            var cal = $('#calendar6').calendar({
                input: $('#txtStartDate2'),
                timeType:2,
                format:'Y/m/d H:i'
            });
        </script>
        <br>
        <label class="label label-primary">Html:</label>
        <pre><code class="html">
            &lt;div id="calendar6"&gt;&lt;/div&gt;
            &lt;label>日期：&lt;/label&gt;&lt;input type="text" name="start_date" id="txtStartDate2" value="2014/08/25 23:22"/&gt;
        </code></pre>

        <label class="label label-primary">Javascript:</label>
        <pre><code class="javascript">
        var cal = $('#calendar6').calendar({
            input: $('#txtStartDate2'),
            timeType:2,
            format:'Y/m/d H:i'
        });
        </code></pre>
    </li>

    <li>
        <h2>直接显示的日历(不含时间)</h2>
        <div id="calendar3"></div>

        <script>
            $('#calendar3').calendar({
                onSelect:function(y, m, d) {
                    alert(y + '-' + m + '-' + d);
                }
            });
        </script>
        <br>
        <label class="label label-primary">Html:</label>
        <pre><code class="html">
            &lt;div id="calendar3"&gt; &lt;/div&gt;
        </code></pre>

        <label class="label label-primary">Javascript:</label>
        <pre><code class="javascript">
         $('#calendar3').calendar({
            onSelect:function(y, m, d) {
            alert(y + '-' + m + '-' + d);
            }
         });
        </code></pre>
    </li>
    <li>
        <h2>直接显示的日历(含时间)</h2>
        <div id="calendar2"></div>

        <script>
            $('#calendar2').calendar({
                startDate:'2014-09-25',
                endDate:'2014-09-30',
                timeType:3,
                onSelect:function(y, m, d, h, i, s) {
                    alert(y + '-' + m + '-' + d + ' ' + h + ':' + i + ':' + s);
                }
            });
        </script>
        <br>
        <label class="label label-primary">Html:</label>
        <pre><code class="html">
            &lt;div id="calendar2"&gt; &lt;/div&gt;
        </code></pre>

        <label class="label label-primary">Javascript:</label>
        <pre><code class="javascript">
        $('#calendar2').calendar({
            startDate:'2014-09-25',
            endDate:'2014-09-30',
            timeType:3,
            onSelect:function(y, m, d, h, i, s) {
            alert(y + '-' + m + '-' + d + ' ' + h + ':' + i + ':' + s);
            }
        });
        </code></pre>
    </li>
</ol>
<?php include '../../include/footer.phtml' ?>