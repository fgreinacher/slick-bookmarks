/*jslint browser: true*/

(function () {
  "use strict";

  document.onmousemove = function () {
    var hoveredItem = document.querySelector(".item:hover");
    if (hoveredItem) {
      hoveredItem.focus();
    }
  };

  document.onkeydown = function (e) {
    var tab = 9,
      enter = 13,
      shift = 16,
      arrowLeft = 37,
      arrowUp = 38,
      arrowRight = 39,
      arrowDown = 40;

    switch (e.which) {
    case arrowUp:
      focusPreviousLink(e);
      break;

    case arrowDown:
      focusNextLink(e);
      break;

    case arrowLeft:
      focusFirstLink(e);
      break;

    case arrowRight:
      focusLastLink(e);
      break;

    case tab:
      if (e.shiftKey) {
        focusPreviousLink(e);
      } else {
        focusNextLink(e);
      }
      break;

    case shift:
    case enter:
      break;

    default:
      document.querySelector("#pattern").focus();
      setTimeout(focusFirstLink, 0);
      break;
    }
  };

  function focusFirstLink(e) {
    focusLink(function (links) {
      return links[0];
    }, e);
  }

  function focusLastLink(e) {
    focusLink(function (links) {
      return links[links.length - 1];
    }, e);
  }

  function focusPreviousLink(e) {
    focusLink(function (links) {
      var linkToFocus = links[links.length - 1];
      for (var i = 1; i < links.length; i++) {
        if (links[i] === document.activeElement) {
          linkToFocus = links[i - 1];
          break;
        }
      }
      return linkToFocus;
    }, e);
  }

  function focusNextLink(e) {
    focusLink(function (links) {
      var linkToFocus = links[0];
      for (var i = links.length - 2; i >= 0; i--) {
        if (links[i] === document.activeElement) {
          linkToFocus = links[i + 1];
          break;
        }
      }
      return linkToFocus;
    }, e);
  }

  function focusLink(getLinkToFocus, e) {
    var links = document.querySelectorAll(".item");
    if (links.lengths === 0) {
      return;
    }
    var linkToFocus = getLinkToFocus(links);
    if (linkToFocus) {
      linkToFocus.focus();
      if (e) {
        e.preventDefault();
      }
    }
  }
})();
