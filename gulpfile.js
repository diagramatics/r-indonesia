// Note: edit this according to the Reddit subreddit to test
var subreddit = "indoclone"
var bsPort = 3500;
// --------

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
// Two instances of BrowserSync — one for Reddit, the other for the local server
// for the stylesheet
var browserSync = require('browser-sync');
var util = require('util');
var runSequence = require('run-sequence');

gulp.task('reddit-proxy', function() {
  var runSnippetOnce = 0;
  var timesRun = 0;
  browserSync({
    proxy: "http://www.reddit.com/r/" + subreddit,
    port: bsPort + 1,

    // Use the snippetOptions to find the current subreddit CSS if any
    // and remove that along with putting the new CSS <link>
    snippetOptions: {
      rule: {
        // Matches the correct custom reddit stylesheet
        // If there's none, just match it with the </head>
        match: new RegExp('<link rel="stylesheet" href="[^"]*" title="applied_subreddit_stylesheet" type="text/css">|</head>', 'i'),
        fn: function(snippet, match) {
          // Since there's 2 matches on the snippet injection, check if the snippet
          // has been injected or not
          if (timesRun < 2 && runSnippetOnce === 0) {
            runSnippetOnce = 1;
            timesRun++;
            return snippet + '<link rel="stylesheet" href="http://localhost:'+bsPort+'/css/style.css" title="applied_subreddit_stylesheet" type="text/css">' + (match === '</head>' ? match : '');
          }
          // If both <link> and <head> has been checked, reset the counter for
          // when the page is reloaded
          else if (timesRun === 1) {
            timesRun = 0;
          }
          else {
            timesRun++;
          }
          return match;
        }
      }
    }
  })
})

gulp.task('setup-servers', function() {
  // Run the local server first
  browserSync({
    server: {
      baseDir: './',
      directory: true,
    },
    files: "",
    open: false,
    codeSync: false,
    ghostMode: false,
    port: bsPort

  }, function(err, bs) {
    if (!err) {
      console.log('Local server running. Initializing Reddit proxy server now.');
      gulp.start('reddit-proxy');
      // TODO: This whole method is buggish. Needs to be updated when BrowserSync
      // supports multiple instances.
      // See https://github.com/shakyShane/browser-sync/issues/172
    }
  })
});

gulp.task('styles', function() {
  return gulp.src('scss/style.scss')
    .pipe($.sass({
      outputStyle: 'nested',
      precision: 3,
      onError: console.error.bind(console, 'Sass error:')
    }))
    // TODO: For some reason not working properly. Use $.autoprefixer fallback
    // .pipe($.postcss([
    //   require('autoprefixer-core')({browsers: ['last 2 version']})
    // ]))
    .pipe($.autoprefixer({browsers: 'last 2 version'}))
    .pipe(gulp.dest('css/'));
});

gulp.task('post-style-dev', function() {
  var fs = require('fs');
  var postcss = require('postcss');
  var url = require('postcss-url');
  var result = postcss()
    .use(url({
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
  return gulp.src('css/style.css').pipe(browserSync.reload({stream: true}));
});

gulp.task('style-dev', function() {
  runSequence('styles', 'post-style-dev');
});

gulp.task('build', function() {
  gulp.src('css/style.css')
    .pipe($.csso())
    .pipe(gulp.dest('dist/css/'));
});


gulp.task('dev', ['setup-servers', 'style-dev'], function() {
  gulp.watch('scss/**/*.scss', ['style-dev'])
});
