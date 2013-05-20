

var AppView = (function() {
  var mapOptions = {
    center: new google.maps.LatLng(44.9796635, -93.2748776),
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }

  var View = Backbone.View.extend({

    ui: {
      'appLoading'    : '.appLoading',
      'loadingText'   : '.appLoading .loadingText',
      'searchRegion'  : '#searchRegion'
    },

    initialize: function() {
      _.bindAll(this);
    },

    start: function(options) {
      var geocodeDeferred = $.Deferred();
      var gMapsDeferred = $.Deferred();
      var self = this;

      this.bindGlobalEvents();

      $.publish("app:load:start");

      // Geocode app locations
      this.locations = new this.LocationCollection(options.locations);
      this.locations.geocode(function() {
        geocodeDeferred.resolve();
      });

      // Create google map
      this.map = new google.maps.Map($('#map_canvas')[0], mapOptions);

      this.markersView = new this.MarkerCollectionView({
        collection: this.locations,
        map: this.map
      });

      // Map is done loading
      google.maps.event.addListenerOnce(this.map, 'tilesloaded', function(){
        gMapsDeferred.resolve();
      });

      // When geocoding is done, show "Rendering map"
      // Map generally takes longer, so this is functional,
      // But for a more robust loading component, I would
      // recommend creating an ordered stack of deferreds,
      // each tied to their own message
      $.when(geocodeDeferred).done(function() {
        // delay - so it's not too choppy
        window.setTimeout(function() {
          self.setLoadingText("Drawing map...");
        }, 1000);
      });

      // All loading-related deferreds are resolved --> let's rock and roll
      $.when.apply($, [geocodeDeferred, gMapsDeferred]).done(function() {
        // The loading UI is just so pretty -- I want to show it off a little more :)
        window.setTimeout(function() {
          $.publish("app:load:complete");
        }, 1000);
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
      this.getUI('searchRegion').hide();
    },

    setLoadingText: function(text) {
      if(!_.isString(text)) { throw Error("Unable to set loading text: not a string"); }

      this.getUI("loadingText").text(text);
    },

    hideLoading: function() {
      this.getUI('appLoading').delay(1000).fadeOut();
      this.getUI('searchRegion').delay(1500).fadeIn();
    },

    renderMarkers: function() {
      this.markersView.render();
    },

    search: function(term) {
      // Trim term
      term = $.trim(term);

      this.locations.filterByAny(term);

      $.publish("search:complete", { term: term, count: this.locations.getResultsCount() })
    }
  });

  return View;
})();

var App = (App instanceof AppView) ? App :  new AppView({
  el: $(document)
});