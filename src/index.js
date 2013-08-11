var getFoldersAndPages = function(id, callback) {
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

var createListItem = function(options) {
  
  var icon = $('<img>')
    .attr('class', 'bookmark-icon')
    .attr('src', options.icon);
    
  var span = $('<span>')
    .text(options.text);
  
  var link = $('<a>')
    .attr('href', '#')
    .data('bm-id', options.id)
    .data('bm-url', options.url)
    .attr('alt', options.text)
    .attr('title', options.description)
    .click(options.clickHandler)
    .append(icon)
    .append(span);
  return $('<li class="bookmark-list-item">')
    .append(link);
}

var createListItemForUpFolder = function(id) {
  return createListItem({
    'id': id,
    'text': '..',
    'icon': 'folder.png',
    'clickHandler': onFolderClick
  });
}

var createListItemForFolder = function(bookmark) {
  return createListItem({
    'id': bookmark.id,
    'text': bookmark.title,
    'description' : bookmark.title,
    'icon': 'folder.png',
    'clickHandler': onFolderClick
  });
}

var createListItemForPage = function(bookmark) {
  return createListItem({
    'id': bookmark.id,
    'url': bookmark.url,
    'text': bookmark.title,
    'description' : bookmark.title + ' (' + bookmark.url + ')',
    'icon': 'chrome://favicon/' + bookmark.url,
    'clickHandler': onPageClick
  });
}

var onFolderClick = function() {
  showBookmarksBelowId($(this).data('bm-id')); 
}

var onPageClick = function() {
  chrome.tabs.create({ url: $(this).data('bm-url') });
}

var showBookmarksBelowId = function(id) {
  chrome.storage.sync.set({ 'lastActiveId': id });
  
  getFoldersAndPages(id, function(bookmark, folders, pages) {
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
      showBookmarksBelowId(items['lastActiveId']);
    } else {
      showBookmarksBelowId('0');
    }
  });
});