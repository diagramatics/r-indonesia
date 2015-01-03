// Note: edit this according to the Reddit subreddit to test
var subreddit = "indoclone"
var bsPort = 3500;

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
// Two instances of BrowserSync — one for Reddit, the other for the local server
// for the stylesheet
var browserSync = require('browser-sync');
var util = require('util');

gulp.task('sass', function() {

});

gulp.task('reddit-proxy', function() {
  browserSync({
    proxy: "http://www.reddit.com/r/" + subreddit,
    files: "style.css",
    port: bsPort + 1,

    // Use the snippetOptions to find the current subreddit CSS if any
    // and remove that along with putting the new CSS <link>
    snippetOptions: {
      rule: {
        // Matches the correct custom reddit stylesheet
        // If there's none, just match it with the </head>
        match: new RegExp('<link rel="stylesheet" href="[^"]*" title="applied_subreddit_stylesheet" type="text/css">|</head>', 'i'),
        fn: function(snippet, match) {
          return snippet + '<link rel="stylesheet" href="http://localhost:'+bsPort+'/style.css" title="applied_subreddit_stylesheet" type="text/css">' + (match === '</head>' ? match : '');
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

gulp.task('dev', ['setup-servers']);
