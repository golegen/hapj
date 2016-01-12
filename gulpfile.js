var gulp = require('gulp');
var jsSrc = [
    './src/js/*.js',
    './src/js/ui/*.js'
];

gulp.task('default', function () {
    console.log('hello,hapj!');
});

// js代码编译
gulp.task('lint', function () {
    var jshint = require('gulp-jshint');
    return gulp.src(jsSrc)
        .pipe(jshint())
        .pipe(jshint.reporter('default', {verbose: true}));
    ;
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
    var uglify = require('gulp-uglify');
    var rename = require('gulp-rename');
    var del = require('del');
    var cssmin = require('gulp-cssmin');

    del.sync('./dist/');

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

    return gulp.src('./src/js/*.js')
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist/js/hapj/'));

});

gulp.task('concat', ['min'], function () {
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

