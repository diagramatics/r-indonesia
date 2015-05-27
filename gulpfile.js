// Note: edit this according to the Reddit subreddit to test
var subreddit = "indoclone"
var bsPort = 3500;
// --------

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var util = require('util');
var fs = require('fs');
var postcss = require('postcss');

// Two instances of BrowserSync — one for Reddit, the other for the local server
// for the stylesheet
var browserSync = require('browser-sync');
var bs1 = browserSync.create('local');
var bs2 = browserSync.create('proxy');

gulp.task('setup-servers', function() {
  // Run the local server first
  bs1.init({
    server: {
      baseDir: './',
      directory: true,
    },
    open: false,
    codeSync: false,
    ghostMode: false,
    port: bsPort
  }, function(err, bs) {
    if (!err) {
      console.log('Local server running. Initializing Reddit proxy server now.');

      var runSnippetOnce = 0;
      var timesRun = 0;
      bs2.init({
        proxy: "http://www.reddit.com/r/" + subreddit,
        port: bsPort + 1,

        // Use the snippetOptions to find the current subreddit CSS if any
        // and remove that along with putting the new CSS <link>
        snippetOptions: {
          rule: {
            // Matches the correct custom reddit stylesheet
            // Note: this configuration assumes that the subreddit you're
            // testing on has a custom stylesheet installed. If it doesn't then
            // this doesn't work.
            match: /<link rel="stylesheet" href="[^"]*" title="applied_subreddit_stylesheet" type="text\/css">/i,
            fn: function(snippet, match) {
              return ret = snippet + '<link rel="stylesheet" href="http://localhost:'+bsPort+'/css/style.css" title="applied_subreddit_stylesheet" type="text/css">';
            }
          }
        }
      })
    }
  })
});

gulp.task('sass', function () {
  return gulp.src('scss/style.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'nested', // libsass doesn't support expanded yet
      precision: 10,
      includePaths: ['.'],
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe($.postcss([
      require('autoprefixer-core')({browsers: ['last 1 version', 'ie 8']})
    ]))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/css'))
    .pipe(bs2.reload({stream: true}));
});

gulp.task('styles:dev', ['sass'], function() {
  fs.writeFile('.tmp/css/style.css', postcss()
    .use(require('postcss-url')({
      url: function(url) {
        var name = url.substring(2, url.length - 2);
        if (fs.existsSync('images/' + name + '.jpg')) {
          return '"http://localhost:' + bsPort + '/images/' + name + '.jpg"';
        }
        else return '"http://localhost:' + bsPort + '/images/' + name + '.png"';
      }
    }))
    .process(fs.readFileSync('.tmp/css/style.css'))
    .css
  );
  return gulp.src('.tmp/css/style.css')
    .pipe(bs2.reload({stream: true}));
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
