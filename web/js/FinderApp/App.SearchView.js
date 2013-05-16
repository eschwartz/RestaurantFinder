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
    template: "#template-resultsList",
    children: [],

    ui: {
      resultsRegion   : '.resultsRegion',
      showMoreBtn     : '.moreBtn'
    },

    events: {
      'click showMoreBtn': 'handleShowMoreBtn'
    },

    initialize: function() {
      _.bindAll(this);
      this.collection.on("reset", this.refresh, this);

      this.$el.append($(this.template).html());

      $.subscribe("search:complete", this.showOrHideSearchMoreBtn);
    },

    refresh: function() {
      this.empty();
      this.render();
    },

    render: function() {
      var self = this;
      var resultsRegion = this.getUI('resultsRegion');

      this.empty();

      this.collection.each(function(model) {
        var view = new self.itemView({
          model: model
        });


        view.render().$el.appendTo(resultsRegion);
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
    },

    // Shows or hides the search more button
    // Depending on whether or not there are more
    // results to show
    showOrHideSearchMoreBtn: function() {
      if(this.collection.length >= this.collection.getResultsCount()) {
        this.getUI('showMoreBtn').hide();
      }
      else {
        this.getUI('showMoreBtn').show();
      }
    },

    handleShowMoreBtn: function(evt) {
      $.publish("search:more");

      evt.preventDefault();
      return false;
    }
  });

  App.SearchView = Backbone.View.extend({
    ui: {
      'search'    : '#search',
      'results'   : '#searchResults'
    },

    events: {
      'keyup search'   : 'handleSearch'
    },

    initialize: function() {
      _.bindAll(this);

      this.defaultLimit = App.locations.getLimit();

      this.resultsView = new ResultListView({
        el: this.getUI('results'),
        collection: App.locations
      });

      this.$el.append(this.resultsView.render().$el);

      $.subscribe("search:more", this.handleSearchMore);
    },

    search: function() {
      $.publish("search:term", this.getUI('search').val());
    },

    handleSearch: function() {
      App.locations.setLimit(this.defaultLimit);
      this.search();
    },

    handleSearchMore: function() {
      App.locations.setLimit(App.locations.getLimit() + 2);
      this.search();
    }
  });
})();
