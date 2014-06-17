/*jslint browser: true*/
/*globals ko, chrome*/

(function () {
  "use strict";

  String.prototype.contains = function (needle) {
    var self = this;

    return self.toLowerCase().indexOf(needle.toLowerCase()) != -1;
  };

  function BookmarkViewModel(title, path, url) {
    var self = this;

    self.title = ko.observable(title);
    self.path = ko.observable(path);
    self.url = ko.observable(url);
    self.icon = ko.computed(function () {
      return "chrome://favicon/" + self.url();
    });
    self.titleAndPath = ko.computed(function () {
      return self.title() + " - " + self.url() + " - " + self.path();
    });
  }

  BookmarkViewModel.prototype.open = function (_, event) {
    var self = this;
    var opts = {
      url: self.url()
    };

    if (event.metaKey) {
      chrome.tabs.create(opts);
    } else {
      chrome.tabs.update(null, opts);
    }
  };

  function AppViewModel(root) {
    var self = this;

    self.pattern = ko.observable("");
    self.bookmarks = ko.computed(function () {
      var result = [];
      self.explore(result, root, self.pattern(), []);
      return result;
    });
  }

  AppViewModel.prototype.exploreFolder = function (result, folder, pattern, pathParts) {
    var self = this;

    if (folder.title) {
      pathParts.push(folder.title);
    }
    for (var i = 0; i < folder.children.length; i++) {
      self.explore(result, folder.children[i], pattern, pathParts.slice(0));
    }
  };

  AppViewModel.prototype.bookmarkMatchesPattern = function (bookmark, pattern) {
    return bookmark.title.contains(pattern) ||
      bookmark.url.contains(pattern);
  };

  AppViewModel.prototype.exploreBookmark = function (result, bookmark, pattern, pathParts) {
    var self = this;

    if (self.bookmarkMatchesPattern(bookmark, pattern)) {
      result.push(
        new BookmarkViewModel(
          bookmark.title || bookmark.url,
          pathParts.join("/"),
          bookmark.url));
    }
  };

  AppViewModel.prototype.explore = function (result, bookmarkOrFolder, pattern, pathParts) {
    var self = this;

    if (bookmarkOrFolder.children) {
      self.exploreFolder(result, bookmarkOrFolder, pattern, pathParts);
    } else {
      self.exploreBookmark(result, bookmarkOrFolder, pattern, pathParts);
    }
  };

  chrome.bookmarks.getSubTree("0", function (tree) {
    var appViewModel = new AppViewModel(tree[0]);
    ko.applyBindings(appViewModel);
  });
})();
