var defaultId = '0';
var lastActiveIdKey = 'lastActiveId';

var getSubTree = function(id, callback) {
  chrome.bookmarks.getSubTree(id, function(tree) {
    var bookmark = tree[0];
    var folders = [];
    var pages = [];
    $(bookmark.children).each(function(i, x) {
      if(x.url) {
          pages.push(x);
      } else {
          folders.push(x);
      }
    });
    callback(bookmark, folders, pages);
  });
}

var createListItemForUpFolder = function(id) {
  var link = $('<a>')
    .data('bm-id', id)
    .text('..')
    .attr('href', '#')
    .click(onFolderClick);
  return $('<li class="bookmark-list-item">').append(link);
}

var createListItemForFolder = function(bookmark) {
  var link = $('<a>')
    .data('bm-id', bookmark.id)
    .text(bookmark.title)
    .attr('alt', bookmark.title)
    .attr('title', bookmark.title)
    .attr('href', '#')
    .click(onFolderClick);
  return $('<li class="bookmark-list-item">').append(link);
}

var onFolderClick = function() {
  setActiveId($(this).data('bm-id')); 
}

var onPageClick = function() {
  chrome.tabs.create({ url: $(this).data('bm-url') });
}

var createListItemForPage = function(bookmark) {
  var link = $('<a>')
    .data('bm-url', bookmark.url)
    .attr('href', '#')
    .attr('alt', bookmark.title)
    .attr('title', bookmark.title)
    .click(onPageClick);
  var icon = $('<img>')
    .attr('class', 'bookmark-icon')
    .attr('src', 'chrome://favicon/' + bookmark.url);
  link.append(icon);
  link.append($('<span>').text(bookmark.title));
  return $('<li class="bookmark-list-item">')
    .append(link);
}

var setActiveId = function(id) {
  chrome.storage.sync.set({ 'lastActiveId': id });
  
  getSubTree(id, function(bookmark, folders, pages) {
    var list = $('<ul class="bookmark-list">');
    
    if(bookmark.parentId) {
      list.append(createListItemForUpFolder(bookmark.parentId));
    }
    
    $(folders).each(function(i, x) {
      list.append(createListItemForFolder(x));
    }); 
    
    $(pages).each(function(i, x) {
      list.append(createListItemForPage(x));
    }); 
    
    $('#content').html(list);
  });
}

$(document).ready(function() {
  chrome.storage.sync.get('lastActiveId', function(items) {
    if(items['lastActiveId']) {
      setActiveId(items['lastActiveId']);
    } else {
      setActiveId(defaultId);
    }
  });
});