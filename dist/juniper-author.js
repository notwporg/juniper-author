/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/juniper-author.js":
/*!**********************************!*\
  !*** ./src/js/juniper-author.js ***!
  \**********************************/
/***/ (() => {

function juniperAjax(specificAction, additionalParams, callback) {
  var data = {
    'action': 'handle_ajax',
    'juniper_action': specificAction,
    'juniper_nonce': Juniper.nonce
  };

  // Add our parameters to the primary AJAX ones
  for (var key in additionalParams) {
    if (additionalParams.hasOwnProperty(key)) {
      data[key] = additionalParams[key];
    }
  }

  // We can also pass the url value separately from ajaxurl for front end AJAX implementations
  jQuery.post(Juniper.ajax_url, data, function (response) {
    callback(response);
  });
}
function hideSigningForm() {
  jQuery('.sign-form').css('display', 'none');
}
function showSigningForm() {
  jQuery('.sign-form').css('display', 'block');
}
function showProgressBar() {
  jQuery('.progress').css('display', 'block');
}
function hideProgressBar() {
  jQuery('.progress').css('display', 'none');
}
function setProgressBarPercent(percent) {
  jQuery('.juniper .bar').css('width', percent + '%').html(percent.toFixed(0) + '%');
}
function juniperUpdateDebugBox(newText) {
  var oldText = jQuery('#repo_debug').val();
  oldText = oldText + newText + "\n";
  jQuery('#repo_debug').val(oldText);
}
function juniperAjaxRefreshDone() {
  juniperUpdateDebugBox('Update process finished, refreshing page in 2 second');
  setTimeout(function () {
    location.href = location.href;
  }, 2000);
}
function handleAjaxRefreshResponse(response) {
  var decodedResponse = jQuery.parseJSON(response);
  juniperUpdateDebugBox(decodedResponse.result.msg);
  if (decodedResponse.result.pass) {
    if (decodedResponse.result.done) {
      juniperAjaxRefreshDone();
    } else {
      var params = {
        stage: decodedResponse.result.next_stage
      };
      juniperAjax('ajax_refresh', params, handleAjaxRefreshResponse);
    }
  }
}
function juniperAjaxRefreshRepos(startStage) {
  jQuery("#debug-area").show();
  jQuery('#repo_debug').val('');
  juniperUpdateDebugBox('Starting update process');
  juniperUpdateDebugBox('...this may take a while so please do not refresh the page until finished');
  var params = {
    // we will break up the update process ito stages
    stage: startStage
  };
  juniperAjax('ajax_refresh', params, handleAjaxRefreshResponse);
}
function juniperBegin() {
  jQuery('a.digitally-sign').click(function (e) {
    e.preventDefault();
    var params = {
      pw: jQuery('#juniper_private_pw_1').val()
    };
    var button = jQuery(this);
    juniperAjax('test_key', params, function (response) {
      var decodedResponse = jQuery.parseJSON(response);
      if (!decodedResponse.key_valid) {
        alert('Unable to load private key - possible passphrase error');
      } else {
        var allReleases;
        if (button.attr('data-type') == 'new') {
          allReleases = jQuery('tr.one-release.unsigned');
        } else if (button.attr('data-type') == 'all') {
          allReleases = jQuery('tr.one-release');
          allReleases.find('.yesno').html('');
        }
        var releaseCount = allReleases.size();
        var currentItem = 0;
        if (releaseCount) {
          setProgressBarPercent(0);
          showProgressBar();
          hideSigningForm();
          allReleases.each(function () {
            var thisItem = jQuery(this);
            params = {
              repo: jQuery(this).attr('data-repo'),
              tag: jQuery(this).attr('data-tag'),
              pw: jQuery('#juniper_private_pw_1').val()
            };
            juniperAjax('sign_release', params, function (response) {
              //alert( response );
              decodedResponse = jQuery.parseJSON(response);
              currentItem++;
              thisItem.find('td.yesno').html('<span class="green">' + decodedResponse.signed_text + '</span>');
              thisItem.find('td.package').html(decodedResponse["package"]);
              setProgressBarPercent(currentItem * 100 / releaseCount);
              if (currentItem == releaseCount) {
                setTimeout(function () {
                  hideProgressBar();
                  setProgressBarPercent(0);
                  showSigningForm();
                }, 1000);
              }
            });
          });
        }
      }
    });
  });
  jQuery('a.verify').click(function (e) {
    e.preventDefault();
    var params = {
      "package": jQuery(this).attr('data-package')
    };
    juniperAjax('verify_package', params, function (response) {
      var decodedResponse = jQuery.parseJSON(response);
      var str = "Package: " + decodedResponse.verify["package"] + "\n\n";
      if (decodedResponse.verify.signature_valid == 1) {
        str = str + "Signature: VALID\n";
      } else {
        str = str + "Signature: INVALID\n";
      }
      if (decodedResponse.verify.file_valid == 1) {
        str = str + "File Integrity: VALID\n";
      } else {
        str = str + "File Integrity: INVALID\n";
      }
      alert(str);
    });
  });
  jQuery('a.do-ajax').click(function (e) {
    e.preventDefault();
    var stage = jQuery(this).attr('data-stage');
    juniperAjaxRefreshRepos(stage);
  });
  jQuery('.setting a.remove').click(function (e) {
    var params = {
      image: jQuery(this).attr('data-image')
    };
    if (confirm('This will delete this banner image permanently, are you sure?')) {
      var thisLink = jQuery(this);
      juniperAjax('remove_image', params, function (response) {
        location.href = location.href;
      });
    }
    e.preventDefault();
  });
  jQuery('a.remove-repo').click(function (e) {
    e.preventDefault();
    var params = {
      'repo': jQuery(this).attr('data-repo')
    };
    var item = jQuery(this);
    juniperAjax('remove_repo', params, function (response) {
      item.parent().parent().remove();
    });
  });
  jQuery('a.restore-repo').click(function (e) {
    e.preventDefault();
    var params = {
      'repo': jQuery(this).attr('data-repo')
    };
    var item = jQuery(this);
    juniperAjax('restore_repo', params, function (response) {
      location.href = location.href;
    });
  });
}
jQuery(document).ready(function () {
  juniperBegin();
});

/***/ }),

/***/ "./src/scss/juniper-author.scss":
/*!**************************************!*\
  !*** ./src/scss/juniper-author.scss ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"/juniper-author": 0,
/******/ 			"juniper-author": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunkjuniper_author"] = globalThis["webpackChunkjuniper_author"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["juniper-author"], () => (__webpack_require__("./src/js/juniper-author.js")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["juniper-author"], () => (__webpack_require__("./src/scss/juniper-author.scss")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;