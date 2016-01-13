<?php
$showType = 'example';
include '../../include/header.phtml';
?>

<script src="img/hapj.js"></script>

<script src="../../../src/js/ui/dialog.js"></script>
<h2>dialog插件使用方法</h2>
    <style>
        body{
            font-size: 20px;
        }
        pre{
            font-size: 18px;
        }
        .dialog{
            border-radius:5px;
            /*overflow: hidden;*/
        }
        .hd{
            text-align: center;
            height:40px;
            line-height: 40px;
            background-color:#eee;
            border-bottom: 1px dotted #999;
            border-radius:5px 5px 0 0 ;
        }
        .bd{
            text-align: center;
            height:300px;
            background-color:#fff;

        }
        .ft {
            text-align: center;
            border-radius: 0 0 5px 5px;
            height: 40px;
            background-color: #eee;
            border-top: 1px dotted #999;
        }
        li{
            font-size: 20px;
        }
    </style>
<h3>1.css写法</h3>
<p>样式自定义，无要求</p>
    <label class="label label-primary">css:</label>
<pre>
    <code class="html">
        .dialog{
        border-radius:5px;
        }
        .hd{
        text-align: center;
        height:40px;
        line-height: 40px;
        background-color:#eee;
        border-bottom: 1px dotted #999;
        border-radius:5px 5px 0 0 ;
        }
        .bd{
        text-align: center;
        height:300px;
        background-color:#fff;

        }
        .ft{
        text-align: center;
        border-radius:0 0 5px 5px;
        height:40px;
        background-color:#eee;
        border-top: 1px dotted #999;
        }
    </code>
</pre>
<h3>2.html写法</h3>
    <label class="label label-primary">html:</label>
<pre>
    <code class="html">
        &lt;button id="uploadLink1"&gt;iframe弹窗&lt;/button&gt;
        &lt;button id="uploadLink2"&gt;ok弹窗&lt;/button&gt;
        &lt;button id="uploadLink3"&gt;error弹窗&lt;/button&gt;
        &lt;button id="uploadLink4"&gt;ajax弹窗&lt;/button&gt;
    </code>
</pre>
    <h3>3.js写法</h3>
    <h3></h3>
  <div>
方法
    <ul>
        <li> title(title): 设置对话框标题   </li>
        <li> content(content): 设置对话框内容，可以是html</li>
        <li>
            size(width, height): 设置对话框的大小。这个方法需要在显示内容之前就调用
            width: 宽度
            height: 高度
        </li>
        <li>ok(msg, callback):确认对话框
            msg: 消息内容
            callback 点击确定按钮后执行的回调函数
        </li>
        <li>
            hide(hideMask):隐藏对话框
            hideMask: 是否隐藏遮罩层。默认为true。
        </li>
        <li>
            error(msg, callback):错误对话框
            msg 消息内容
            callback 点击确定按钮后执行的回调函数
        </li>
        <li>
            iframe(url):显示一个iframe框到对话框内部，iframe的src为url
            url iframe的网址
        </li>
        <li>
            ajax(url,callback):加载一个ajax页面后将内容设置到对话框内部
            url 访问的url
            callback 加载后执行的函数
        </li>
        <li>
            mask():显示一个遮罩层。默认ok和error方法会使用遮罩。
        </li>
        <li>
            drag():执行该方法允许窗口被拽
        </li>
    </ul>
  </div>
  <label class="label label-primary">javascript:</label>
<pre>
    <code class="html">
        $("#uploadLink").css("z-index",999);
        var dlg =$.dialog;
        $('.uploadLink4').on('click', function(){
            dlg.size(500,500).ajax('/',function(data){
            console.log(data)
        });
        })
        $('.uploadLink3').on('click', function(){
            dlg.size(500,500).error('错误信息', function() {
             alert("执行错误的函数");
        }).title("错误的提示信息")
        })
        $('#uploadLink2').on('click', function(){
             dlg.size(500,500).ok('添加成功', function() {
             alert("执行添加成功的函数");
        })
        })
        $('#uploadLink1').on('click', function(){
            dlg.size(500, 600).iframe('/image/multi').title('上传文件').drag();
            return false;
        });
    </code>
</pre>
    <h3>4.效果展示</h3>

    <button id="uploadLink1">iframe弹窗</button>
    <button id="uploadLink2">ok弹窗</button>
    <button  class="uploadLink3">error弹窗 </button>
    <button class="uploadLink4">ajax弹窗  </button>
    <script>
        $("#uploadLink").css("z-index",999);
            var dlg =$.dialog;
        $('.uploadLink4').on('click', function(){
            dlg.size(500,500).ajax('/',function(data){
                console.log(data)
            });
        })
       $('.uploadLink3').on('click', function(){
            dlg.size(500,500).error('错误信息', function() {
                alert("执行错误的函数");
            }).title("错误的提示信息")
        })
       $('#uploadLink2').on('click', function(){
            dlg.size(500,500).ok('添加成功', function() {
                alert("执行添加成功的函数");
            })
        })
        $('#uploadLink1').on('click', function(){
            dlg.size(500, 600).iframe('/image/multi').title('上传文件').drag();
            setTimeout(function(){
                console.log("time")
                $(document).click(function(){
                    console.log(123)
                    dlg.hide();
                })
            },500)

        });

    </script>

<?php include '../../include/footer.phtml' ?>