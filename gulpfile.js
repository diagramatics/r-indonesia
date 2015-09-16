// Note: BrowserSync port must be specified
var bsPort = 3500;
// --------

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var util = require('util');
var fs = require('fs');
var postcss = require('postcss');
var browserSync = require('browser-sync');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// Configurations
var config = {
  style: 'scss/style.scss',
  tmpStyle: '.tmp/css/style.css',
  distStyle: 'dist/css/style.css'
}

var betaConfig = {
  style: 'scss/beta-test.scss',
  tmpStyle: '.tmp/css/beta-test.css',
  distStyle: 'dist/css/beta-test.css'
}

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
  return gulp.src(config.style)
  .pipe($.sourcemaps.init())
  .pipe($.sass({
    outputStyle: 'expanded',
    precision: 10,
    includePaths: ['.']
  }).on('error', $.sass.logError))
  .pipe($.postcss([
    require('autoprefixer-core')({browsers: ['last 1 version', 'ie 8']})
  ]))
  .pipe($.sourcemaps.write())
  .pipe(gulp.dest('.tmp/css'));
});

gulp.task('styles:dev', ['sass'], function() {
  fs.writeFile(config.tmpStyle, postcss()
  .use(require('postcss-url')({
    url: function(url) {
      // Check if the URL is using the Reddit image URL format
      if (url.match(/^%%.+%%{0}/i)) {
        var name = url.substring(2, url.length - 2);
        if (fs.existsSync('images/' + name + '.jpg')) {
          return '"//localhost:' + bsPort + '/images/' + name + '.jpg"';
        }
        else if (fs.existsSync('images/' + name + '.png')) {
          return '"//localhost:' + bsPort + '/images/' + name + '.png"';
        }
      }
    }
  }))
  .process(fs.readFileSync(config.tmpStyle))
  .css
);
return gulp.src(config.tmpStyle)
.pipe(browserSync.stream());
});

gulp.task('parse', function() {
  console.log(function() {
    var selector = [];
    postcss().use(function(css) {
      css.eachRule(function(rule) {
        rule.walkDecls(function(decl) {
          if (decl.value.match(/^larger$/i)) {
            selector.push(rule.selector);
          }
        });
      });
    }).process(fs.readFileSync('reddit.css')).css;
    return selector;
  }());
});

gulp.task('process-svg', function(cb) {
  gulp.src('images/sprites/*.svg')
  .pipe($.svgSprite({
    // Configuration is to generate an SCSS file in the appropriate directory
    // and the sprites in the images for PNG conversion
    mode: {
      css: {
        dest: '.',
        sprite: './images/icon-sprites.png', // Use .png immediately since we're working on converting it to PNG anyway
        bust: false, // No need for cache busting
        render: {
          scss: {
            template: 'build/svg-sprite-template.scss',
            dest: 'scss/sprites/_sprites.scss'
          }
        },
        mixin: 'icon-sprite',
        dimensions: true
      }
    }
  }))
  .pipe(gulp.dest('.'))
  .pipe($.filter('**/*.png'))
  .pipe($.svg2png())
  .pipe(gulp.dest('.'))
  .on('end', function() {
    fs.writeFile('scss/sprites/_sprites.scss', postcss()
    // Change the URL format to Reddit's image URL format.
    .use(require('postcss-url')({
      url: function(url) {
        if (url.match(/^images\//i)) {
          var name = url.substring('images/'.length, url.length - '.png'.length);
          return '%%' + name + '%%';
        }

        return url;
      }
    }))
    .process(fs.readFileSync('scss/sprites/_sprites.scss'))
    .css
  );

  browserSync.reload();
  cb();
});
});

gulp.task('styles:build', ['sass'], function() {
  fs.writeFile(config.tmpStyle, postcss()
    .use(function(css) {
      // Remove the charset rule so it will be allowed to be used on Reddit
      // Adapted from postcss-single-charset that removes all but the first one
      // specified in the CSS file
      // (https://github.com/hail2u/postcss-single-charset/blob/master/index.js)
      css.walkAtRules('charset', function (atRule) {
        atRule.removeSelf();
      });
    })
    // Double check if there's any URLs not using the Reddit image URL format
    // As an example, the svg-process task will output the normal URL (but has been changed on build).
    .use(require('postcss-url')({
      url: function(url) {
        if (url.match(/^images\//i)) {
          var name = url.substring('images/'.length, url.length - '.png'.length);
          return '%%' + name + '%%';
        }

        return url;
      }
    }))
    .process(fs.readFileSync(config.tmpStyle))
    .css
  );

  // Now minify and send it to the dist folder
  return gulp.src(config.tmpStyle)
  .pipe($.csso())
  .pipe(gulp.dest('dist/css/'));
});

gulp.task('test-script', function() {
  var versionJSON = require('./test-script/version.json');

  gulp.src('test-script/version.json')
    .pipe(gulp.dest('dist/test-script'));
    
  return gulp.src('test-script/test-script.user.js')
  .pipe($.insert.transform(function(contents, file) {
    return contents.replace(/\{\{version\}\}/g, versionJSON.version);
  }))
  .pipe(gulp.dest('dist/test-script'));
});

gulp.task('images', function() {
  return gulp.src('images/*.{png,jpg}')
  .pipe(gulp.dest('dist/images'));
});

gulp.task('build', ['styles:build', 'test-script'], function() {

  return gulp.src(config.distStyle).pipe($.size());
});

gulp.task('build:open-beta', ['build', 'images'], function() {
  fs.writeFile(config.distStyle, postcss()
  .use(require('postcss-url')({
    url: function(url) {
      // Check if the URL is using the Reddit image URL format
      if (url.match(/^%%.+%%{0}/i)) {
        var name = url.substring(2, url.length - 2);
        if (fs.existsSync('images/' + name + '.jpg')) {
          return '"../images/' + name + '.jpg"';
        }
        else if (fs.existsSync('images/' + name + '.png')) {
          return '"../images/' + name + '.png"';
        }
      }
    }
  }))
  .process(fs.readFileSync(config.distStyle))
  .css
);

return gulp.src(config.distStyle).pipe($.size());
});

gulp.task('prebuild:beta-test', function() {
  // Set the configuration to the beta one
  config = betaConfig;
  return;
});
gulp.task('build:beta-test', ['prebuild:beta-test', 'build'], function() {
  fs.writeFile(config.distStyle, postcss()
  .use(function(css) {
    css.walkRules(function(rule) {
      // TODO: Put this on a separate config file
      // Because we're using html selector and body selectors, merge together if there's a child element with the same name in the selector
      rule.selector = rule.selector.replace(/^body\.post-linkflair-beta:lang\(bt\) body/ig, 'body.post-linkflair-beta:lang(bt)');
      rule.selector = rule.selector.replace(/^html:not\(:lang\(bt\)\) html/ig, 'html:not(:lang(bt))');
      // Also use the beta linkflair selector and merge it with the longpost for testing
      rule.selector = rule.selector.replace(/ \.comments-page/ig, '.comments-page');
      rule.selector = rule.selector.replace(/\.post-linkflair-longpost/ig, '.post-linkflair-beta');
    });
  })
  .process(fs.readFileSync(config.distStyle))
  .css
);
});


gulp.task('dev', ['setup-servers', 'styles:dev', 'process-svg'], function() {
  gulp.watch('scss/**/*.scss', ['styles:dev']);
  gulp.watch('images/sprites/*.svg', ['process-svg']);
});
gulp.task('serve', ['dev']);
gulp.task('develop', ['dev']);
