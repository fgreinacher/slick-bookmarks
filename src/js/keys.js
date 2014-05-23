(function () {
  document.onkeypress = function(e) {
    document.querySelector("#pattern").focus();
  };

  function focusLink(algo, e) {
    var links = document.querySelectorAll(".item");
    if (links.lengths === 0) {
      return;
    }
    var linkToFocus = algo(links);
    if(linkToFocus) {
      linkToFocus.focus();
      e.preventDefault();
    }
  }

  document.onkeydown = function(e) {
    e = e || window.event;
    e.which = e.keyCode || e.which;

    var arrowLeft = 37,
        arrowUp = 38,
        arrowRight = 39,
        arrowDown = 40;

    switch (e.which) {
      case arrowUp:
        focusLink(function(links) {
          var linkToFocus = links[links.length - 1];
          for(var i = 1; i < links.length; i++) {
            if(links[i] === document.activeElement) {
              linkToFocus = links[i - 1];
              break;
            }
          }
          return linkToFocus;
        }, e);
        break;

      case arrowDown:
        focusLink(function(links) {
          var linkToFocus = links[0];
          for(var i = links.length - 2; i >= 0; i--) {
            if(links[i] === document.activeElement) {
              linkToFocus = links[i + 1];
              break;
            }
          }
          return linkToFocus;
        }, e);
        break;

      case arrowLeft:
        focusLink(function(links) {
          return links[0];
        }, e);
        break;

      case arrowRight:
        focusLink(function(links) {
          return links[links.length - 1];
        }, e);
        break;
    }
  };
})();
