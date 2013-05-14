(function() {
  App.SearchView = Backbone.View.extend({
    events: {
      'keypress #search'   : 'handleSearch'
    },

    initialize: function() {
      this.setUIElements();
    },

    setUIElements: function() {
      this.ui = {
        'search'    : $('#search'),
        'results'   : $('#searchResults')
      }
    },

    handleSearch: function() {
      $.publish("search:term", this.ui.search.val());
    }
  });
})();
