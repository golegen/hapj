var gulp = require('gulp');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var del = require('del');
var concat = require('gulp-concat');
var jsSrc = [
    'src/js/**/*.js'
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
    var content = fs.readFileSync('readme.md', 'utf-8');
    var html = md.toHTML(content);
    return fs.writeFile('doc/readme.html', html, {
        encoding: 'utf-8',
        flag: 'w'
    }, fb);
});

// 文档
gulp.task('doc', ['js'], function () {
    var jsdoc = require('gulp-jsdoc3');

    del.sync('doc/');

    // @see https://github.com/mlucool/gulp-jsdoc3/blob/master/src/jsdocConfig.json
    // @see http://usejsdoc.org/about-configuring-jsdoc.html
    /*
     + [Cerulean](http://docstrap.github.io/docstrap/themes/cerulean)
     + [Cosmo](http://docstrap.github.io/docstrap/themes/cosmo)
     + [Cyborg](http://docstrap.github.io/docstrap/themes/cyborg)
     + [Flatly](http://docstrap.github.io/docstrap/themes/flatly)
     + [Journal](http://docstrap.github.io/docstrap/themes/journal)
     + [Lumen](http://docstrap.github.io/docstrap/themes/lumen)
     + [Paper](http://docstrap.github.io/docstrap/themes/paper)
     + [Readable](http://docstrap.github.io/docstrap/themes/readable)
     + [Sandstone](http://docstrap.github.io/docstrap/themes/sandstone)
     + [Simplex](http://docstrap.github.io/docstrap/themes/simplex)
     + [Slate](http://docstrap.github.io/docstrap/themes/slate)
     + [Spacelab](http://docstrap.github.io/docstrap/themes/spacelab)
     + [Superhero](http://docstrap.github.io/docstrap/themes/superhero)
     + [United](http://docstrap.github.io/docstrap/themes/united)
     + [Yeti](http://docstrap.github.io/docstrap/themes/yeti)
    */

    return gulp.src(['tmp/js/**/*.js', './README.md'])
        .pipe(jsdoc({
            tags: {
                "allowUnknownTags": true
            },
            opts: {
                "destination": "doc/",
                "tutorials": "tutoria/js/"
            },
            "plugins": [
                "plugins/markdown"
            ],
            templates: {
                "cleverLinks": true,
                "monospaceLinks": false,
                "default": {
                    "outputSourceFiles": true
                },
                "path": "ink-docstrap",
                "theme": "united",
                "navType": "inline",
                "systemName": "HapJ前端框架文档",
                "copyright": '@hunbasha.com',
                "inverseNav": true,
                "linenums": true,
                "dateFormat": "YYYY/mm/dd hh:mm:ss",
            }
        }))
        ;
});

// 压缩代码
gulp.task('min', ['move'], function () {
    var cssmin = require('gulp-cssmin');

    del.sync('dist/jquery');
    del.sync('dist/bootstrap');
    del.sync('dist/hightlightjs');

    // jquery
    gulp.src('bower_components/jquery/dist/jquery.min.*')
        .pipe(gulp.dest('dist/jquery/'));

    gulp.src('bower_components/jquery.lazyload/jquery.lazyload.js')
        .pipe(uglify())
        .pipe(rename('jquery.lazyload.min.js'))
        .pipe(gulp.dest('dist/jquery/'));

    // bootstrap
    gulp.src('bower_components/bootstrap/dist/fonts/*')
        .pipe(gulp.dest('dist/bootstrap/fonts/'));

    gulp.src('bower_components/bootstrap/dist/js/bootstrap.min.js*')
        .pipe(gulp.dest('dist/bootstrap/js/'));

    gulp.src('bower_components/bootstrap/dist/css/bootstrap.min.css*')
        .pipe(gulp.dest('dist/bootstrap/css/'));

    // highlightjs
    gulp.src('bower_components/highlightjs/highlight.pack.min.js')
        .pipe(rename('highlightjs.min.js'))
        .pipe(gulp.dest('dist/highlightjs/'));

    gulp.src('bower_components/highlightjs/styles/*.css')
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/highlightjs/css/'));

    gulp.src('bower_components/highlightjs/styles/*.png')
        .pipe(gulp.dest('dist/highlightjs/css/'));

    return gulp.src(['/dist/hapj/js/**/*.js'])
        .pipe(gulp.dest('dist/hapj/js/'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/hapj/js/'));
});

gulp.task('js', ['min'], function () {
    return gulp.src([
            'dist/jquery/jquery.min.js',
            'dist/hapj/js/hapj.min.js',
            'dist/hapj/js/hapj.hook.min.js',
            'dist/highlightjs/highlightjs.min.js'
        ])
        .pipe(concat('hapj.example.js'))
        .pipe(gulp.dest('dist/hapj/js/'));
});

gulp.task('watch', function () {
    var path = require('path');
    gulp.watch([
        'src/js/**/*.js',
        'src/css/**/*.css',
        'src/css/**/*.less'
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

gulp.task('less', function () {
    var less = require('gulp-less');

    return gulp.src(
        'src/css/**/*.less'
        )
        .pipe(less())
        .pipe(rename(function (path) {
            path.extname = '.css';
        }))
        .pipe(gulp.dest('tmp/css/'))
        ;
});

gulp.task('css', ['less'], function () {
    var base64 = require('gulp-base64');
    var sourcemap = require('gulp-sourcemaps');

    del.sync('tmp/css/**/*.css');
    del.sync('dist/hapj/css');

    return gulp.src(['tmp/css/**/*.css', 'src/css/**/*.css'])
        .pipe(sourcemap.init({
            charset:'utf8'
        }))
        .pipe(base64({
            extensions: [/\.(jpg|png|gif)\?__INLINE__/],
            maxImageSize: 8 * 1024,
            debug: true
        }))
        .pipe(rename(function (path) {
            path.extname = '.css';
        }))
        .pipe(sourcemap.write('./'))
        .pipe(gulp.dest('dist/hapj/css/'))
        ;
});

gulp.task('replace', function () {
    var fs = require('fs');
    var content = fs.readFileSync('package.json');
    var config = JSON.parse(content);

    del.sync('tmp/js');
    var replace = require('gulp-replace');

    return gulp.src(['src/js/**/*.js'])
        .pipe(replace(/\$\{(VERSION|DOCHOST)\}/g, function (args, arg) {
            return config[arg.toLowerCase()];
        }))
        .pipe(gulp.dest('tmp/js/'));
});

gulp.task('move', ['replace'], function () {
    var sourcemap = require('gulp-sourcemaps');

    del.sync('dist/hapj/js');

    gulp.src(['tmp/js/ui/*.js'])
        .pipe(sourcemap.init({
            charset:'utf8'
        }))
        .pipe(uglify())
        .pipe(concat('hapj.ui.min.js'))
        .pipe(sourcemap.write('./'))
        .pipe(gulp.dest('dist/hapj/js/'));

    return gulp.src([
            'tmp/js/hapj.js',
            'tmp/js/lib/md5.js',
            'tmp/js/lib/serial.js',
            'tmp/js/core/hook.js',
            'tmp/js/core/conf.js',
            'tmp/js/core/browser.js',
            'tmp/js/core/string.js',
            'tmp/js/core/array.js',
            'tmp/js/core/object.js',
            'tmp/js/core/date.js',
            'tmp/js/core/json.js',
            'tmp/js/core/log.js',
            'tmp/js/core/page.js',
            'tmp/js/core/cache.js',
            'tmp/js/core/hook.js',
            'tmp/js/hapj.hook.js',
        ])
        .pipe(sourcemap.init({
            charset:'utf8'
        }))
        .pipe(uglify())
        .pipe(concat('hapj.min.js'))
        .pipe(sourcemap.write('./'))
        .pipe(gulp.dest('dist/hapj/js'));


});



gulp.task('font', function () {
    var iconfont = require('gulp-iconfont');
    del.sync('dist/font');
    var runTimestamp = Math.round(Date.now() / 1000);
    return gulp.src('src/font/*.svg')
        .pipe(iconfont({
            fontName: 'hapj', // required
            appendUnicode: true, // recommended option
            formats: ['ttf', 'eot', 'woff'], // default, 'woff2' and 'svg' are available
            timestamp: runTimestamp, // recommended to get consistent builds when watching files
        }))
        .on('glyphs', function (glyphs, options) {
            // CSS templating, e.g.
            console.log(glyphs, options);
        })
        .pipe(gulp.dest('dist/hapj/font/'));
});
