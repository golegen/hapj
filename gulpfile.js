var gulp = require('gulp');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var del = require('del');
var jsSrc = [
    './src/js/**/*.js'
];
var args = process.argv.splice(2);

var helps = [
    ['js', 'js生成、压缩'],
    ['css', 'css生成、压缩'],
    ['lint', 'js代码检查'],
    ['watch', '监控文件变化，并自动生成和压缩文件'],
    ['mardown', '生成markdown对应的html文件'],
    ['doc', '生成doc文档'],
    ['server', '启动微型服务器'],
];

gulp.task('default', function () {
    var codes = ["\n"];
    codes.push("帮助：");
    helps.forEach(function (v, k) {
        if (k % 2 == 0) {
            codes.push(gutil.colors.red('  gulp ' + v[0] + "\t" + v[1]));
        } else {
            codes.push(gutil.colors.magenta('  gulp ' + v[0] + "\t" + v[1]));
        }
    });
    codes.push("\n");
    gutil.log(codes.join("\n"));
});

// 运行服务器
gulp.task('server', function () {
    args.shift();
    var spawn = require('child_process').spawn;

    args.unshift('start.php');
    var process = spawn('php', args);
    process.stdout.on('data', function (data) {
        console.log(gutil.colors.green(data));
    });

    process.stderr.on('data', function (data) {
        console.log(gutil.colors.red(data));
    });

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
    var cssmin = require('gulp-cssmin');
    var deleteLines = require('gulp-delete-lines');

    del.sync('./dist/jquery');
    del.sync('./dist/bootstrap');
    del.sync('./dist/hightlightjs');

    // jquery
    gulp.src('./bower_components/jquery/dist/jquery.min.js')
        .pipe(gulp.dest('./dist/jquery/'));

    gulp.src('./bower_components/jquery.lazyload/jquery.lazyload.js')
        .pipe(uglify())
        .pipe(rename('jquery.lazyload.min.js'))
        .pipe(gulp.dest('./dist/jquery/'));

    // bootstrap
    gulp.src('./bower_components/bootstrap/dist/fonts/*')
        .pipe(gulp.dest('./dist/bootstrap/fonts/'));

    gulp.src('./bower_components/bootstrap/dist/js/bootstrap.min.js')
        .pipe(gulp.dest('./dist/bootstrap/js/'));

    gulp.src('./bower_components/bootstrap/dist/css/bootstrap.min.css')
        .pipe(deleteLines({
            filters: [/\/\*# sourceMappingURL/i]
        }))
        .pipe(gulp.dest('./dist/bootstrap/css/'));

    // highlightjs
    gulp.src('./bower_components/highlightjs/highlight.pack.min.js')
        .pipe(rename('highlightjs.min.js'))
        .pipe(gulp.dest('./dist/highlightjs/'));

    gulp.src('./bower_components/highlightjs/styles/*.css')
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/highlightjs/css/'));

    gulp.src('./bower_components/highlightjs/styles/*.png')
        .pipe(gulp.dest('./dist/highlightjs/css/'));

    return gulp.src(jsSrc)
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist/hapj/js/'));
});

gulp.task('js', ['min'], function () {
    var concat = require('gulp-concat');
    return gulp.src([
            './dist/jquery/jquery.min.js',
            './dist/hapj/js/hapj.min.js',
            './dist/hapj/js/hapj.hook.min.js',
            './dist/highlightjs/highlightjs.min.js'
        ])
        .pipe(concat('hapj.example.js', {newLine: ';'}))
        .pipe(gulp.dest('./dist/hapj/js/'));
});

gulp.task('watch', function () {
    var path = require('path');
    gulp.watch([
        './src/js/**/*.js',
        './src/css/**/*.css',
        './src/css/**/*.less'
    ], function (evt) {
        console.log(evt.type + ' ' + evt.path);
        var ext = path.extname(evt.path);
        switch (ext) {
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

gulp.task('less', function() {
    var less = require('gulp-less');

    return gulp.src(
        './src/css/**/*.less'
        )
        .pipe(less())
        .pipe(rename(function(path) {
            path.extname = '.lesscss';
        }))
        .pipe(gulp.dest('./src/css/'))
        ;
});

gulp.task('parsecss', function() {
    var base64 = require('gulp-base64');

    //del.sync('./src/css/**/*.lesscss');
    del.sync('./dist/hapj/css');

    gulp.src(['./src/css/**/*.lesscss', './src/css/**/*.css'])
        .pipe(base64({
            extensions: [/\.(jpg|png|gif)\?__INLINE__/],
            maxImageSize: 8 * 1024,
            debug: true
        }))
        .pipe(rename(function(path) {
            path.extname = '.css';
        }))
        .pipe(gulp.dest('./dist/hapj/css/'))
    ;
});

// less任务
gulp.task('css', ['less', 'parsecss'], function () {
    del.sync('./src/css/**/*.lesscss');
});




