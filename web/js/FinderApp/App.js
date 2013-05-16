

var AppView = (function() {
  var mapOptions = {
    center: new google.maps.LatLng(44.9796635, -93.2748776),
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }

  var View = Backbone.View.extend({

    ui: {
      'appLoading'    : '.appLoading',
      'searchRegion'  : '#searchRegion'
    },

    initialize: function() {
      _.bindAll(this);
    },

    start: function(options) {
      this.bindGlobalEvents();

      $.publish("app:load:start");

      // Geocode app locations
      this.locations = new this.LocationCollection(options.locations);
      this.locations.geocode(function() {
        $.publish("app:load:complete")
      });

      // Create google map
      this.map = new google.maps.Map($('#map_canvas')[0], mapOptions);

      this.markersView = new this.MarkerCollectionView({
        collection: this.locations,
        map: this.map
      });

      // Create search view
      this.searchView = new this.SearchView({
        el: this.getUI('searchRegion')
      });
    },



    bindGlobalEvents: function() {
      $.subscribe("app:load:start", this.showLoading);
      $.subscribe("app:load:complete", this.renderMarkers);
      $.subscribe("app:load:complete", this.hideLoading);
      $.subscribe("search:term", this.search);
    },

    showLoading: function() {
      this.getUI('appLoading').fadeIn();
    },

    hideLoading: function() {
      this.getUI('appLoading').delay(1000).fadeOut();
    },

    renderMarkers: function() {
    this.markersView.render();
    },

    search: function(term) {
      this.locations.revert();
      if($.trim(term) !== "") {
        this.locations.filterByAny(term);
      }
    }
  });

  return View;
})();

var App = (App instanceof AppView) ? App :  new AppView({
  el: $(document)
});