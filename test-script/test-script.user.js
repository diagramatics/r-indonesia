// ==UserScript==
// @name        r/indonesia v2 Loader
// @author      Steven Sinatra
// @description A loader for r/indonesia subreddit's new design (v2).
// @namespace   http://diagramatics.me
// @source      http://github.com/diagramatics/r-indonesia
// @include     https://bt.reddit.com/r/indonesia/*
// @version     1.0.0
// @grant       none
// ==/UserScript==

(function() {
  var version = '1.0.0';

  var checkScriptVersion = function(sha) {
    var request = new XMLHttpRequest();
    request.open('GET', 'https://cdn.rawgit.com/diagramatics/r-indonesia/'+ sha +'/test-script/version.json');

    request.onload = function() {
      var response = JSON.parse(this.response);
      if (response.version !== version) {
        alert('You\'re using an older version of the script. Please redownload it again at https://cdn.rawgit.com/diagramatics/r-indonesia/'+ sha +'/test-script/version.json');
      }
    };

    request.onerror = function() {
      // There was a connection error of some sort
      console.error('Seems like we cannot check the recent version of the script. We\'ll do it later.');
    };
  }

  var checkSha = function(cb) {
    var lastCheckDate = GM_getValue('lastCheckDate', null);
    var lastSha = GM_getValue('lastSha', null);
    // Check if last SHA check date was yesterday
    if (!lastSha || !lastCheckDate || lastCheckDate.setDate(lastCheckDate.getDate() + 1) > new Date()) {
      var request = new XMLHttpRequest();
      request.open('GET', 'https://api.github.com/repos/diagramatics/r-indonesia/git/refs/heads/dist', true);

      request.onload = function() {
        var response = JSON.parse(this.response);
        GM_setValue('lastCheckDate', new Date());
        GM_setValue('lastSha', response.object.sha);
        cb(response.object.sha);
      };

      request.onerror = function() {
        // There was a connection error of some sort
        console.error('Seems like we cannot check the recent version of the stylesheet. Reverting to saved SHA if there is any.')
        if (lastSha) {
          cb(lastSha);
        }
      };

      request.send();
    }
    else {
      if (lastSha) {
        cb(lastSha);
      }
      else {
        console.log('We don\'t have the latest version of stylesheet. Weird. Contact diagramatics for this.');
      }
    }
  }

  var injectStyle = function(sha) {
    var injectedStyle = '<link rel="stylesheet" href="https://cdn.rawgit.com/diagramatics/r-indonesia/'+ sha +'/css/style.css" title="applied_subreddit_stylesheet" type="text/css">';
    // Find the custom subreddit styling
    var style = document.querySelector('link[title="applied_subreddit_stylesheet"]');
    if (style !== null) {
      style.insertAdjacentHTML('afterend', injectedStyle);
      style.remove();
    }
    else {
      var head = document.querySelector('head');
      head.insertAdjacentHTML('beforeend', injectedStyle);
    }
  }

  checkSha(function(sha) {
    injectStyle(sha);
    checkScriptVersion(sha);
  });
}());
