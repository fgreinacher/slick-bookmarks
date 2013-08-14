(function(bookmarks, storage, tabs, $) {
  
  var restoreLastShownId = function(callback) {
    storage.sync.get('lastShownId', function(items) {
      if(items['lastShownId']) {
        callback(items['lastShownId']);
      } else {
        callback('0');
      }
    });
  }
  
  var saveLastShownId = function(id) {
    storage.sync.set({ 'lastShownId': id });
  }
  
  var getBookmarks = function(id, callback) {
    bookmarks.getSubTree(id, function(tree) {
      var bookmark = tree[0];
      var bookmarks = [];
      $(bookmark.children).each(function(i, x) {
        if(x.url) {
            x.isFolder = false;
        } else {
            x.isFolder = true;
        }
        bookmarks.push(x);
      });
      callback(bookmark, bookmarks);
    });
  }
  
  var createListItem = function(options) {
    var icon = $('<img>')
      .attr('class', 'bookmark-icon')
      .attr('src', options.icon);
      
    var span = $('<span>')
      .text(options.text);
      
    var link = $('<a>')
      .attr('href', options.action ? '#' : '')
      .attr('alt', options.text)
      .attr('title', options.description)
      .click(options.action)
      .append(icon)
      .append(span);
    
    var listItem = $('<li class="bookmark-list-item">')
      .append(link);
      
    return listItem;
  }
  
  var createListItemForUpFolder = function(id) {
    return createListItem({
      id: id,
      text: '..',
      icon: 'folder.png',
      action: function() { showId(id); }
    });
  }
  
  var createListItemForFolder = function(bookmark) {
    return createListItem({
      id: bookmark.id,
      text: bookmark.title,
      description: bookmark.title,
      icon: 'folder.png',
      action: function() { showId(bookmark.id); }
    });
  }
  
  var createListItemForPage = function(bookmark) {
    return createListItem({
      id: bookmark.id,
      url: bookmark.url,
      text: bookmark.title,
      description : bookmark.title + ' (' + bookmark.url + ')',
      icon: 'chrome://favicon/' + bookmark.url,
      action: function() { tabs.create({ url: bookmark.url }); }
    });
  }
  
  var showId = function(id) {
    saveLastShownId(id);
    
    getBookmarks(id, function(rootBookmark, bookmarks) {
      var list = $('<ul class="bookmark-list">');
      
      if(rootBookmark.parentId) {
        list.append(createListItemForUpFolder(rootBookmark.parentId));
      }
      
      $(bookmarks).each(function(i, x) {
        if(x.isFolder) {
          list.append(createListItemForFolder(x));
        } else {
          list.append(createListItemForPage(x));
        }
      }); 
      
      $('#content').html(list);
    });
  }
  
  $(document).ready(function() {
    restoreLastShownId(showId);
  });
})(chrome.bookmarks, chrome.storage, chrome.tabs, jQuery);