// Note: edit this according to the Reddit subreddit to test
var subreddit = "indoclone"
var bsPort = 3500;
// --------

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var util = require('util');
var runSequence = require('run-sequence');
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

gulp.task('styles', function() {
  return $.rubySass('scss/style.scss', {
    style: 'nested',
    precision: 3,
    defaultEncoding: 'UTF-8'
  })
  .on('error', function (err) {
    console.error('Error: ', err.message);
  })
  // TODO: For some reason not working properly. Use $.autoprefixer fallback
  // .pipe($.postcss([
  //   require('autoprefixer-core')({browsers: ['last 2 version']})
  // ]))
  .pipe($.autoprefixer({browsers: ['last 2 version', 'ie 8', 'ie 9']}))
  .pipe(gulp.dest('css/'));
});

gulp.task('post-style-dev', function() {
  var result = postcss()
    .use(require('postcss-url')({
      url: function(url) {
        var name = url.substring(2, url.length - 2);
        if (fs.existsSync('images/' + name + '.jpg')) {
          return '"http://localhost:' + bsPort + '/images/' + name + '.jpg"';
        }
        else return '"http://localhost:' + bsPort + '/images/' + name + '.png"';
      }
    }))
    .process(fs.readFileSync('css/style.css'))
    .css;
  fs.writeFile('css/style.css', result);
  return gulp.src('css/style.css').pipe(bs2.reload({stream: true}));
});

gulp.task('post-style-build', function() {
  var result = postcss()
    .use(function(css) {
      // Remove the charset rule so it will be allowed to be used on Reddit
      // Adapted from postcss-single-charset that removes all but the first one
      // specified in the CSS file
      // (https://github.com/hail2u/postcss-single-charset/blob/master/index.js)
      css.eachAtRule('charset', function (atRule) {
        atRule.removeSelf();
      });
    })
    .process(fs.readFileSync('css/style.css'))
    .css;
  fs.writeFile('css/style.css', result);

  // Now minify and send it to the dist folder
  gulp.src('css/style.css')
    .pipe($.csso())
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('style-dev', function() {
  runSequence('styles', 'post-style-dev');
});

gulp.task('build', function() {
  runSequence('styles', 'post-style-build');
});


gulp.task('dev', ['setup-servers', 'style-dev'], function() {
  gulp.watch('scss/**/*.scss', ['style-dev']);
});
