<script src="/dist/jquery/jquery.min.js"></script>
<script src="/dist/hapj/js/hapj.min.js"></script>
<script src="/dist/hapj/js/hapj.ui.min.js"></script>

#### ajax链接

<a href="./_form.php" data-hook="ajaxable">链接</a>
```html
<a href="./_form.php" data-hook="ajaxable">链接</a>
```

#### ajax表格

<table data-hook="ajaxable" data-hook-option="{
    confirm: '你确定要删除吗？'
}">
    <tr>
        <th>ID</th>
        <th>操作</th>
    </tr>
    <tr>
        <td>1</td>
        <td><a href="./_del.php">删除</a></td>
    </tr>
</table>

```html
<table data-hook="ajaxable" data-hook-option="{
    confirm: '你确定要删除吗？'
}">
    <tr>
        <th>ID</th>
        <th>操作</th>
    </tr>
    <tr>
        <td>1</td>
        <td><a href="./_del.php">删除</a></td>
    </tr>
</table>
```

#### ajax下拉框
