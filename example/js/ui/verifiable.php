<?php include '../../include/header.phtml' ?>
<script src="/src/js/ui/verifiable.js"></script>
<script src="/src/js/ui/ajaxable.js"></script>
<h1>表单校验(verifiable)</h1>

<form method="post" action="./_form.php" class="form-horizontal" data-hook="verifiable">
    <div class="form-group">
        <label class="col-sm-2 control-label">帐号</label>
        <div class="col-sm-8">
            <input type="text" class="form-control" name="username" placeholder="请输入帐号" verify-rule="{
                required: '不能为空'
            }"/>
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-2 control-label">身份证</label>
        <div class="col-sm-8">
            <input type="text" class="form-control" name="id" placeholder="请输入身份证" verify-rule="{
                required: '不能为空',
                ID: {
                    msg: '身份证格式不正确'
                }
            }"/>
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-2 control-label">密码</label>
        <div class="col-sm-8">
            <input type="password" class="form-control" name="password" placeholder="请输入密码" verify-rule="{
                required: '密码不能为空',
                range: {
                    type:'length',
                    min: 2,
                    max:20,
                    msg: '密码长度为2-20位'
                }
            }"/>
        </div>
    </div>
    <div>
        <div class="col-sm-8 col-sm-offset-2">
            <input type="submit" class="btn btn-lg btn-primary" value="提交"/>
        </div>
    </div>
</form>
<?php include '../../include/footer.phtml' ?>
