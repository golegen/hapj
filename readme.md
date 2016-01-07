# hapj项目使用教程


# 如何初始化项目

本项目依赖于npm、gulp组件

由于npm网址被墙，需要改成使用国内镜像：

```shell
echo "registry = https://registry.npm.taobao.org" >> ~/.npmrc
```

使用npm初始化
```
npm install
```

运行后会将依赖项放到node_modules目录

## gulp任务

```shell
gulp [taskname]
```

### 任务列表
* doc 生成文档
* lint 代码检查，看js是否有错

## 简单服务器

```shell
php ./start.php
  -p 端口号，默认为10050
  -h 显示本帮助文档
  -d 后台运行，默认不

```
启动以后，通过 http://192.168.3.20:10050/访问即可