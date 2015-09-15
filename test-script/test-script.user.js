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
  var injectedStyle = '<link rel="stylesheet" href="https://cdn.rawgit.com/diagramatics/r-indonesia/dist/css/style.css" title="applied_subreddit_stylesheet" type="text/css">';
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
}());
