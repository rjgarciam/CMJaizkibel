/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["/app/app.js","31f2a25c6a01253e78d9b788ff0719c1"],["/app/app.routes.js","05f804eabac4c876f719985986c79e7e"],["/app/controllers/booksController.js","52ef9b0dd47aa1ef0d7232ef994e323f"],["/app/controllers/eventsController.js","d8482b325c73dba8a319c73175d77f35"],["/app/controllers/mainController.js","d5309767d03b0d27b97444a64e09aefc"],["/app/controllers/mealController.js","c52561a32f239f07bb0492899b860f37"],["/app/controllers/settingsController.js","532c623a3c074daf24ca8d45729886e0"],["/app/controllers/sportsController.js","a5c7ac64474a0cc1ffd6d7302a5bf18b"],["/app/services/authService.js","a3887b00b5c729c8948227d2b4644044"],["/app/services/bookService.js","6ac3524286dc082979ac57b672fb9375"],["/app/services/eventsService.js","9785fc4b644cd5fe0dad8715b7700d02"],["/app/services/mealService.js","4ecdc3ab3e820bd324eeba8d27889fff"],["/app/services/settingsService.js","0d52957d695638266769f47c24d2120f"],["/app/services/sportsService.js","25a6fc9c543134809e7e5c477af921e1"],["/app/views/index.html","ca358b9b092c2df78fe5edd22f9fea5e"],["/app/views/pages/books.html","77aa030e365c769f7a29eda5ad8cbcab"],["/app/views/pages/booksTaken.html","62bf3035ad811ceb5e1c975c9e8aa8cd"],["/app/views/pages/cs18.html","9641397ebca8eea15eabc5f8c23a184f"],["/app/views/pages/events.html","57d9696d7c361ce4549b331aeeaea50c"],["/app/views/pages/login.html","3da97a514ea428c7e5f4a5595f0887e7"],["/app/views/pages/mealRequests.html","099ea7a2410f7796d1574affc854f557"],["/app/views/pages/meals.html","49766026d3f2c6c7ab2a35829edbc1fd"],["/app/views/pages/myBooks.html","9a2de41efa8e4267990426e4ce602435"],["/app/views/pages/newBook.html","6b9ca02f4f38663db67e0694d91e4b75"],["/app/views/pages/newSport.html","f16e1fa6cd3fbfd6d782c18605340631"],["/app/views/pages/newUser.html","6f13efb5ac76a239ee40c2c2b3f721c4"],["/app/views/pages/offline.html","41332f1593a21aa0b143c0f7eb713e23"],["/app/views/pages/settings.html","28e88d3e38dbf75e2eff32a9fc0f6616"],["/app/views/pages/sports.html","af826054f9bafb3bc0185cf949e093aa"],["/app/views/pages/usersList.html","a30dcba341c98fc3416efedce84410cd"],["/assets/css/style.min.css","c8b25ba5456d1eb8df009810d50117b3"],["/assets/img/bgl.jpg","6185409d38062e72fbb7677c994fd8f8"],["/assets/img/cs18.jpg","a7ec9eb621446054044dc683c10cc4ff"],["/assets/img/goimendi_bg.jpg","e17ba4e6441fa334222af639f3c1010e"],["/assets/img/logoBN.jpg","eaf72bdeb0b719eb3df76bb21817a99d"],["/assets/libs/angular-animate/angular-animate.min.js","769824f432861032136fd2b30e030446"],["/assets/libs/angular-aria/angular-aria.min.js","ae0ea951149b333407f37b42eb627bb4"],["/assets/libs/angular-cookies/angular-cookies.min.js","35d5aed78cd486034ab0c23a2ec4500a"],["/assets/libs/angular-filter/dist/angular-filter.min.js","90eedac7a84538e0651f78e96723bf98"],["/assets/libs/angular-jwt/dist/angular-jwt.min.js","5593482e06c53e92cfe7ff98fde492a6"],["/assets/libs/angular-material/angular-material.min.css","06d4a45783f8ec3d08888d57a208decd"],["/assets/libs/angular-material/angular-material.min.js","df4f4753b13c2c1223787fc732e599d7"],["/assets/libs/angular-messages/angular-messages.min.js","3a9f7c531e42e5562b0a853ea72fa02a"],["/assets/libs/angular-route/angular-route.min.js","1e0fb866bf0d7dc17922e7400e345e20"],["/assets/libs/angular/angular.min.js","a66e673119c25eed3f5a3144345988bc"],["/assets/libs/moment/min/moment.min.js","aeb7908241d9f6d5a45e504cc4f2ec15"],["/assets/libs/papaparse/papaparse.min.js","dae1bd5ad6ff8d99016b1c63a519b6d3"],["/assets/svg-assets-cache.js","0fd8f50db11f6eb435bc658f3936f0be"],["/dist/app.js","18fea6006448ccd91afc1a9ec494a987"],["/offline","2d77545c40388070023870541f0be209"]];
var cacheName = 'sw-precache-v2--' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/.*\/api.*/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var createCacheKey = function (originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.toString().match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              return cache.add(new Request(cacheKey, {
                credentials: 'same-origin',
                redirect: 'follow'
              }));
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameter and see if we have that URL
    // in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







