(function($) {
var loadingGif = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjKkPjxZOlJRWYBFrXf0d6j9tDMUtBBc3GICsvrmhdyO4z20OZt-jn_pPL1CJjgHLnj3hUCrijdVN_qJqZ0kwruVDFiEnZsOdx4m5XYWCahmFIHcNA4YCkzRPwbTufZp8xTzOozA4Qxly232C0VFPIiVy-dschAPOW-i4bQJEkYYy0D5PC78MsVrlnD5A/s1600/Spinner.gif';
var olderPostsLink = '';
var loadMoreDiv = null;
var postContainerSelector = 'div.blog-posts';
var loading = false;

var win = $(window);
var doc = $(document);
// Took from jQuery to avoid permission denied error in IE.
var rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

function loadDisqusScript(domain) {
  $.getScript('http://' + domain + '.disqus.com/blogger_index.js');
}

function loadMore() {
  if (loading) {
    return;
  }
  loading = true;

  if (!olderPostsLink) {
    loadMoreDiv.hide();
    return;
  }

  loadMoreDiv.find('a').hide();
  loadMoreDiv.find('img').show();
  $.ajax(olderPostsLink, {
    'dataType': 'html'
  }).done(function(html) {
    var newDom = $('<div></div>').append(html.replace(rscript, ''));
    var newLink = newDom.find('a.blog-pager-older-link');

    var newPosts = newDom.find(postContainerSelector).children();
    $(postContainerSelector).append(newPosts);

    // Loaded more posts successfully.  Register this pageview with
    // Google Analytics.
    if (window._gaq) {
      window._gaq.push(['_trackPageview', olderPostsLink]);
    }
    // Render +1 buttons.
    if (window.gapi && window.gapi.plusone && window.gapi.plusone.go) {
      window.gapi.plusone.go();
    }
    // Render Disqus comments.
    if (window.disqus_shortname) {
      loadDisqusScript(window.disqus_shortname);
    }
    // Render Facebook buttons.
    if (window.FB && window.FB.XFBML && window.FB.XFBML.parse) {
      window.FB.XFBML.parse();
    }
    // Render Twitter widgets.
    if (window.twttr && window.twttr.widgets && window.twttr.widgets.load) {
      window.twttr.widgets.load();
    }

    if (newLink) {
      olderPostsLink = newLink.attr('href');
    } else {
      olderPostsLink = '';
      loadMoreDiv.hide();
    }
    loadMoreDiv.find('img').hide();
    loadMoreDiv.find('a').show();

    loading = false;
  });
}

function getDocumentHeight() {
  return Math.max(
      win.height(),
      doc.height(),
      document.documentElement.clientHeight);
}

function handleScroll() {
  var height = getDocumentHeight();
  var pos = win.scrollTop() + win.height();
  if (height - pos < 150) {
    loadMore();
  }
}

function init() {
  if (_WidgetManager._GetAllData().blog.pageType == 'item') {
    return;
  }

  olderPostsLink = $('a.blog-pager-older-link').attr('href');
  if (!olderPostsLink) {
    return;
  }

  var link = $('<a class='load-more' href="javascript:;">Load More</a>');
  link.click(loadMore);
  var img = $('<img src="' + loadingGif + '" style="display: none;">');

  win.scroll(handleScroll);

  loadMoreDiv = $('<div id='dmlm'></div>');
  loadMoreDiv.append(link);
  loadMoreDiv.append(img);
  loadMoreDiv.insertBefore($('#blog-pager'));
  $('#blog-pager').hide();
}

$(document).ready(init);

})(jQuery);
