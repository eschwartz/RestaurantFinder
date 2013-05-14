var App = _.isObject(App)? App :  {};

(function() {
  var mapOptions = {
    center: new google.maps.LatLng(44.9796635, -93.2748776),
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }

  App.start = function(options) {
    App.setUIElements();
    App.bindGlobalEvents();

    $.publish("app:load:start");

    // Geocode app locations
    App.locations = new App.LocationCollection(options.locations);
    App.locations.geocode(function() {
      $.publish("app:load:complete")
    });

    // Create google map
    App.map = new google.maps.Map($('#map_canvas')[0], mapOptions);

    App.markersView = new Backbone.GoogleMaps.MarkerCollectionView({
      collection: App.locations,
      map: App.map
    });
  }

  App.setUIElements = function() {
    App.ui = {
      'appLoading': $('.appLoading')
    };
  }

  App.bindGlobalEvents = function() {
    $.subscribe("app:load:start", App.showLoading);
    $.subscribe("app:load:complete", App.renderMarkers);
    $.subscribe("app:load:complete", App.hideLoading);
  }

  App.showLoading = function() {
    App.ui.appLoading.show();
  }

  App.hideLoading = function() {
    App.ui.appLoading.hide();
  }

  App.renderMarkers = function() {
    App.markersView.render();
  }
})();