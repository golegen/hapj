var gulp = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('default', function() {
    console.log('hello,hapj!');
});

// js代码编译
gulp.task('lint', function() {
    return gulp.src('./src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default', { verbose: true }));
        ;
})