<?php
$showType = 'example';
include '../../include/header.phtml';
?>
<script src="/src/js/ui/ajaxable.js"></script>
<script src="/src/js/ui/dialog.js"></script>
<h1>Ajaxable</h1>

<h2>链接</h2>
<a href="./_form.php" data-hook="ajaxable" data-hook-id="ajaxLink">ajax请求</a>
<script>
    hapj.conf.set('hook.ajaxLink', {
        ok: function(ret) {
            console.log(ret);
        }
    })
</script>
<?php include '../../include/footer.phtml';?>
