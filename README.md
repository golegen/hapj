# HapJ前端项目使用教程

## 源代码地址

* GIT仓库：[http://gitlab.hapn.cc/static/hapj.git](http://gitlab.hapn.cc/static/hapj.git)
* [反馈问题](http://gitlab.hapn.cc/static/hapj/issues/new?issue%5Bassignee_id%5D=&issue%5Bmilestone_id%5D=)


## 如何初始化项目

本项目依赖于`npm`、`gulp`、`bower`组件

由于npm网址被墙，需要改成使用国内镜像：

```shell
npm config set registry http://registry.npm.taobao.org
```

初始化
```
git clone http://gitlab.hapn.cc/static/hapj.git
# 安装gulp依赖工具
npm install
# 安装基础前端库
bower install
```

运行后会将依赖项放到node_modules目录和bower_modules目录

## gulp任务
 
```
gulp [taskname]
```

具体的任务，可以执行命令`gulp`即可查看。

### 任务列表
* doc 生成文档
* lint 代码检查，看js是否有错
* js js相关任务
* css css相关任务
* watch 监控js和css、less文件的变化

## 简单服务器

```
gulp server
  -p 端口号，默认为10050
  -h 显示本帮助文档
  -d 后台运行，默认不

```
启动以后，通过 http://192.168.3.20:10050/访问即可
