(function(App) {

  App.LocationCollection = Backbone.GoogleMaps.LocationCollection.extend({
    model: App.Location,

    initialize: function() {
      this.geocoder = new google.maps.Geocoder();
    },

    geocode: function(callback) {
      var self = this;
      var geocodeReqs = [];
      callback = _.isFunction(callback)? callback : function() {};

      this.each(function(location) {
        var req = new $.Deferred();
        geocodeReqs.push(req)

        location.geocode(function() {
          // Mark this geocode request as complete
          req.resolve();
        }, self.geocoder);
      });

      // Run callback when all requests are complete
      $.when.apply($, geocodeReqs).then(function() {
        callback.apply(self);
      });
    }
  });

})(window.App);
