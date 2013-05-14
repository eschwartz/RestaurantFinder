(function() {
  var ResultView = Backbone.View.extend({
    className: 'result',
    template: "<h4><%=restaurant_name %></h4><small><%=cuisine_type %></small>" ,

    events: {
      'mouseenter': 'handleMouseEnter',
      'mouseleave': 'handleMouseLeave'
    },

    initialize: function() {
      _.bindAll(this);
    },

    render: function() {
      var html = _.template(this.template, this.model.toJSON());
      this.$el.html(html);

      return this;
    },

    close: function() {
      this.$el.remove();
      this.model.off();
    },

    handleMouseEnter: function() {
      this.model.select();
    },

    handleMouseLeave: function() {
      this.model.deselect();
    }
  });

  var ResultListView = Backbone.View.extend({
    itemView: ResultView,
    className: "resultList",
    children: [],

    initialize: function() {
      _.bindAll(this);
      this.collection.on("reset", this.refresh, this);
    },

    refresh: function() {
      this.empty();
      this.render();
    },

    render: function() {
      var self = this;

      this.empty();

      this.collection.each(function(model) {
        var view = new self.itemView({
          model: model
        });
        view.render().$el.appendTo(self.$el);
        self.children.push(view);
      });

      return this;
    },

    /**
     * Remove all child views
     * but leave this one in the DOM
     */
    empty: function() {
      _.each(this.children, function(child) {
        child.close();
      });
    },

    close: function() {
      this.empty();
      this.$el.remove();

      this.collection.off();
    }
  });

  App.SearchView = Backbone.View.extend({
    events: {
      'keyup #search'   : 'handleSearch'
    },

    initialize: function() {
      this.setUIElements();

      this.resultsView = new ResultListView({
        el: this.ui.results,
        collection: App.locations
      });

      this.$el.append(this.resultsView.render().$el);
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
