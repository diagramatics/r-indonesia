// Note: BrowserSync port must be specified
var bsPort = 3500;
// --------

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var util = require('util');
var fs = require('fs');
var postcss = require('postcss');
var browserSync = require('browser-sync');

gulp.task('setup-servers', function() {
  // Run the server hosting the files
  browserSync({
    server: {
      baseDir: ['./', '.tmp'],
      directory: true,
    },
    socket: {
      domain: 'localhost:' + bsPort
    },
    open: false,
    ghostMode: false,
    port: bsPort,
    https: {
      key: 'example.key',
      cert: 'example.crt'
    }
  });
});

gulp.task('sass', function () {
  return gulp.src('scss/style.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }))
    .on('error', $.sass.logError)
    .pipe($.postcss([
      require('autoprefixer-core')({browsers: ['last 1 version', 'ie 8']})
    ]))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/css'));
});

gulp.task('styles:dev', ['sass'], function() {
  fs.writeFile('.tmp/css/style.css', postcss()
    .use(require('postcss-url')({
      url: function(url) {
        var name = url.substring(2, url.length - 2);
        if (fs.existsSync('images/' + name + '.jpg')) {
          return '"//localhost:' + bsPort + '/images/' + name + '.jpg"';
        }
        else if (fs.existsSync('images/' + name + '.png')) {
          return '"//localhost:' + bsPort + '/images/' + name + '.png"';
        }
      }
    }))
    .process(fs.readFileSync('.tmp/css/style.css'))
    .css
  );
  return gulp.src('.tmp/css/style.css')
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('parse', function() {
  console.log(function() {
    var selector = [];
    postcss().use(function(css) {
      css.eachRule(function(rule) {
        rule.eachDecl(function(decl) {
          if (decl.value.match(/^small$/i)) {
            selector.push(rule.selector);
          }
        });
      });
    }).process(fs.readFileSync('reddit.css')).css;
    return selector;
  }());
});

gulp.task('styles:build', ['sass'], function() {
  fs.writeFile('.tmp/css/style.css', postcss()
    .use(function(css) {
      // Remove the charset rule so it will be allowed to be used on Reddit
      // Adapted from postcss-single-charset that removes all but the first one
      // specified in the CSS file
      // (https://github.com/hail2u/postcss-single-charset/blob/master/index.js)
      css.eachAtRule('charset', function (atRule) {
        atRule.removeSelf();
      });
    })
    .process(fs.readFileSync('.tmp/css/style.css'))
    .css
  );

  // Now minify and send it to the dist folder
  return gulp.src('.tmp/css/style.css')
    .pipe($.csso())
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('build', ['styles:build'], function() {
  return gulp.src('dist/css/style.css').pipe($.size());
});


gulp.task('dev', ['setup-servers', 'styles:dev'], function() {
  gulp.watch('scss/**/*.scss', ['styles:dev']);
});
gulp.task('serve', ['dev']);
gulp.task('develop', ['dev']);
