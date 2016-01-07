var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jsdoc = require('gulp-jsdoc');

gulp.task('default', function() {
    console.log('hello,hapj!');
});

// js代码编译
gulp.task('lint', function() {
    return gulp.src('./src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default', { verbose: true }));
        ;
});

// 文档
gulp.task('doc', function() {
    return gulp.src('./src/')
        .pipe(jsdoc('./doc/'))
        ;
});
