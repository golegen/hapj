var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jsSrc = [
    './src/js/**/*.js'
];
var helps = [
    ['js', 'js生成、压缩'],
    ['css', 'css生成、压缩'],
    ['lint', 'js代码检查'],
    ['watch', '监控文件变化，并自动生成和压缩文件'],
    ['mardown', '生成markdown对应的html文件'],
    ['doc', '生成doc文档'],
];

gulp.task('default', function () {
    var codes = [];
    codes.push("帮助：");
    helps.forEach(function(v, k) {
        codes.push('  gulp ' + v[0]);
        codes.push('    ' + v[1]);
        codes.push("\n");
    });
    console.log(codes.join("\n"));
});

// js代码编译
gulp.task('lint', function () {
    var jshint = require('gulp-jshint');
    return gulp.src(jsSrc)
        .pipe(jshint())
        .pipe(jshint.reporter('default', {verbose: true}));
    ;
});

// 生成markdown
gulp.task('markdown', function (fb) {
    var md = require('markdown').markdown;
    var fs = require('fs');
    var content = fs.readFileSync('./readme.md', 'utf-8');
    var html = md.toHTML(content);
    return fs.writeFile('./doc/readme.html', html, {
        encoding: 'utf-8',
        flag: 'w'
    }, fb);
});

// 文档
gulp.task('doc', function () {
    var jsdoc = require('gulp-jsdoc');

    return gulp.src(jsSrc)
        .pipe(jsdoc.parser())
        .pipe(jsdoc.generator('./doc/'))
        ;
});

// 压缩代码
gulp.task('min', function () {
    var rename = require('gulp-rename');
    var del = require('del');
    var cssmin = require('gulp-cssmin');

    del.sync('./dist/js/');

    // jquery
    gulp.src('./bower_components/jquery/dist/jquery.min.js')
        .pipe(gulp.dest('./dist/js/jquery/'));

    gulp.src('./bower_components/jquery.lazyload/jquery.lazyload.js')
        .pipe(uglify())
        .pipe(rename('jquery.lazyload.min.js'))
        .pipe(gulp.dest('./dist/js/jquery/'));

    // bootstrap
    gulp.src('./bower_components/bootstrap/dist/fonts/*')
        .pipe(gulp.dest('./dist/js/bootstrap/fonts/'));

    gulp.src('./bower_components/bootstrap/dist/js/bootstrap.min.js')
        .pipe(gulp.dest('./dist/js/bootstrap/js/'));

    gulp.src('./bower_components/bootstrap/dist/css/bootstrap.min.css')
        .pipe(gulp.dest('./dist/js/bootstrap/css/'));

    // highlightjs
    gulp.src('./bower_components/highlightjs/highlight.pack.min.js')
        .pipe(rename('highlightjs.min.js'))
        .pipe(gulp.dest('./dist/js/highlightjs/'));

    gulp.src('./bower_components/highlightjs/styles/*.css')
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/js/highlightjs/css/'));

    gulp.src('./bower_components/highlightjs/styles/*.png')
        .pipe(gulp.dest('./dist/js/highlightjs/css/'));

    return gulp.src(jsSrc)
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist/js/hapj/'));
});

gulp.task('js', ['min'], function () {
    var concat = require('gulp-concat');
    return gulp.src([
            './dist/js/jquery/jquery.min.js',
            './dist/js/hapj/hapj.min.js',
            './dist/js/hapj/hapj.hook.min.js',
            './dist/js/highlightjs/highlightjs.min.js'
        ])
        .pipe(concat('hapj.example.js', {newLine: ';'}))
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('watch', function () {
    var path = require('path');
    gulp.watch([
        './src/js/**/*.js',
        './src/css/**/*.css',
        './src/css/**/*.less'
    ], function(evt) {
        console.log(evt.type + ' ' + evt.path);
        var ext = path.extname(evt.path);
        switch(ext) {
            case '.js':
                gulp.run(['js']);
                break;
            case '.css':
            case '.less':
                gulp.run(['css']);
                break;
        }
    });

});

// less任务
gulp.task('css', function () {
    var del = require('del');
    var less = require('gulp-less');
    var rename = require('gulp-rename');
    del.sync('/dist/css');

    return gulp.src(
        './src/css/**/*.less'
        )
        .pipe(less())
        .pipe(uglify())
        .pipe(rename({
            suffix:'.min'
        }))
        .pipe(gulp.dest('./dist/css/'))
    ;
});

