function AppViewModel(bookmarks, storage, tabs) {
  var bookmarks = bookmarks;
  var storage = storage;
  var tabs = tabs;
  var activeFolder = ko.observable();
  var viewModels = [];

  var setAndStoreActiveFolder = function(folder) {
    activeFolder(folder);
    storeActiveFolder();
  }
  
  var storeActiveFolder = function() {
    storage.set({
      'lastActiveFolderId': activeFolder()
        .id
    });
  }

  var restoreActiveFolder = function() {
    storage.get('lastActiveFolderId', function(items) {
      var lastActiveFolderId = items['lastActiveFolderId'];
      if (lastActiveFolderId) {
        activeFolder(viewModels[lastActiveFolderId]);
      }
    });
  }

  var createAndRegisterViewModel = function(parentViewModel, bookmark) {

    var setCommonProperties = function(viewModel, parentViewModel, bookmark) {
      viewModel.parent = parentViewModel;
      viewModel.parentsAndSelf = ko.computed(function() {
        var parentsAndSelf = [];
        var current = viewModel;
        do {
          parentsAndSelf.push(current);
          current = current.parent;
        } while (current);
        parentsAndSelf.reverse();
        return parentsAndSelf;
      });
      viewModel.id = bookmark.id;
      viewModel.title = parentViewModel ? bookmark.title : "Bookmarks";
    }

    var setFolderProperties = function(viewModel, bookmark) {
      viewModel.icon = "folder.png";
      viewModel.canActivate = true;
      viewModel.activate = function() {
        setAndStoreActiveFolder(viewModel);
      }
      viewModel.children = (bookmark.children || [])
        .map(function(x) {
        return createAndRegisterViewModel(viewModel, x);
      });
    }

    var setPageProperties = function(viewModel, bookmark) {
      viewModel.icon = "chrome://favicon/" + bookmark.url;
      viewModel.canActivate = true;
      viewModel.activate = function() {
        tabs.create({
          url: bookmark.url
        });
      }
      viewModel.url = bookmark.url;
      viewModel.children = [];
    }

    var createAndSetProperties = function(parentViewModel, bookmark) {
      var viewModel = {};
      setCommonProperties(viewModel, parentViewModel, bookmark);
      if (bookmark.url) {
        setPageProperties(viewModel, bookmark);
      } else {
        setFolderProperties(viewModel, bookmark);
      }
      return viewModel;
    }

    var viewModel = createAndSetProperties(parentViewModel, bookmark);
    viewModels[bookmark.id] = viewModel;
    return viewModel;
  }

  var init = function(doneCallback) {
    bookmarks.getSubTree("0", function(tree) {
      var root = createAndRegisterViewModel(null, tree[0]);

      activeFolder(root);
      restoreActiveFolder();

      doneCallback();
    });
  }

  return {
    init: init,
    activeFolder: activeFolder,
    setAndStoreActiveFolder: setAndStoreActiveFolder,
  }
}

var appViewModel = new AppViewModel(chrome.bookmarks, chrome.storage.sync, chrome.tabs);
appViewModel.init(function() {
  ko.applyBindings(appViewModel);
});