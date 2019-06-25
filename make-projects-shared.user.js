// ==UserScript==
// @name Make Scratch Projects Shared
// @description Allows you to view any Scratch project as if it was shared.
// @version 1.1.3
// @namespace https://github.com/forkphorus/cat-plus
// @homepageURL https://github.com/forkphorus/cat-plus#readme
// @match https://scratch.mit.edu/projects/*
// @run-at document-start
// ==/UserScript==

(function() {
  'use strict';

  var magic = '#_bypasssharerestrictions_';

  function patch() {
    var nativeMethod = unsafeWindow.XMLHttpRequest.prototype.open;
    unsafeWindow.XMLHttpRequest.prototype.open = function(method, url) {
      if (!method || !url) {
        return nativeMethod.apply(this, arguments);
      }
      var re = /^https:\/\/api\.scratch\.mit\.edu\/projects\/(\d+)$/;
      var match = url.match(re);
      if (match) {
        var id = match[1];
        var time = Date.now() / 1000 | 0;
        // Replace the URL with our own data: URI that has some dummy data
        // See: https://api.scratch.mit.edu/projects/285708713
        arguments[1] = 'data:application/json;base64,' + btoa(JSON.stringify({
          id: id,
          title: '(unshared project)',
          description: 'Description is unavailable.',
          instructions: '',
          visibility: 'visible',
          public: true,
          is_published: true,
          comments_allowed: true,
          author: {
            id: 1,
            username: 'unknown',
            scratchteam: false,
            history: {
              joined: '1900-01-01T00:00:00.000Z',
            },
            profile: {
              id: null,
              images: {
                '90x90': 'https://cdn2.scratch.mit.edu/get_image/user/default_90x90.png?v=',
                '60x60': 'https://cdn2.scratch.mit.edu/get_image/user/default_60x60.png?v=',
                '55x55': 'https://cdn2.scratch.mit.edu/get_image/user/default_55x55.png?v=',
                '50x50': 'https://cdn2.scratch.mit.edu/get_image/user/default_50x50.png?v=',
                '32x32': 'https://cdn2.scratch.mit.edu/get_image/user/default_32x32.png?v=',
              },
            },
          },
          image: 'https://cdn2.scratch.mit.edu/get_image/project/' + id + '_480x360.png',
          images: {
            '282x218': 'https://cdn2.scratch.mit.edu/get_image/project/' + id + '_282x218.png?v=' + time,
            '216x163': 'https://cdn2.scratch.mit.edu/get_image/project/' + id + '_216x163.png?v=' + time,
            '200x200': 'https://cdn2.scratch.mit.edu/get_image/project/' + id + '_200x200.png?v=' + time,
            '144x108': 'https://cdn2.scratch.mit.edu/get_image/project/' + id + '_144x108.png?v=' + time,
            '135x102': 'https://cdn2.scratch.mit.edu/get_image/project/' + id + '_135x102.png?v=' + time,
            '100x80': 'https://cdn2.scratch.mit.edu/get_image/project/' + id + '_100x80.png?v=' + time,
          },
          history: {
            created: '1900-01-01T00:00:00.000Z',
            modified: '1900-01-01T00:00:00.000Z',
            shared: '1900-01-01T00:00:00.000Z',
          },
          stats: {
            views: 0,
            loves: 0,
            favorites: 0,
            comments: 0,
            remixes: 0,
          },
          remix: {
            parent: null,
            root: null,
          },
        }));
      }
      return nativeMethod.apply(this, arguments);
    };

    // Prevent visiting the user page of "unknown" because we use that but its a real user
    window.addEventListener('load', function(e) {
      var els = document.querySelectorAll('a[href="/users/unknown"]');
      for (var i = 0; i < els.length; i++) {
        var element = els[i];
        element.addEventListener('click', function(e) {
          e.preventDefault();
        });
      }
    });
  }

  function monitor() {
    var hasRun = false;
    function run() {
      if (hasRun) return;
      hasRun = true;
      if (document.querySelector('.not-available-image')) {
        var a = document.createElement('a');
        a.innerText = 'Bypass?';
        a.style.marginLeft = '5px';
        a.onclick = function() {
          location.hash = magic;
          location.reload();
        };
        document.querySelector('.not-available-outer .inner p span').appendChild(a);
      }
      observer.disconnect();
    }
    // Use a mutation observer to find out when the page element is added
    var observer = new MutationObserver(function(mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var mutation = mutations[i];
        if (mutation.type !== 'childList') continue;
        for (var j = 0; j < mutation.addedNodes.length; j++) {
          if (mutation.addedNodes[j].className === 'page') {
            run();
          }
        }
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    run();
    // kill the observer after 30 seconds because it's not going to be doing very much at that point
    // it does get killed in run() as well
    setTimeout(function() { observer.disconnect() }, 30000);
  }

  if (location.hash === magic) {
    patch();
  } else {
    if (document.body) {
      monitor();
    } else {
      window.addEventListener('load', monitor);
    }
  }

})();
