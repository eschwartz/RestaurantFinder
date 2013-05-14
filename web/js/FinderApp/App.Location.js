(function(App) {
  App.Location = Backbone.GoogleMaps.Location.extend({
    defaults: {
      city: "Minneapolis",
      state: "Minnesota"
    },

    getFullAddress: function() {
      return [this.get('restaurant_name'), this.get('city'), this.get('state')].join(", ");
    },

    geocode: function(callback) {
      var self = this;
      callback = _.isFunction(callback)? callback: callback = function() {};

      $.ajax({
        url: "http://open.mapquestapi.com/geocoding/v1/address?key=Fmjtd%7Cluub2dubl9%2C2g%3Do5-9u2l5z&callback=?",
        dataType: "jsonp",
        data: {
          maxResults: 1,
          location: "Chipotle, Minneapolis, MN"
        },
        success: function(res) {
          var latLng = res.results[0].locations[0].latLng;
          self.set('lat', latLng.lat);
          self.set('lng', latLng.lng)

          callback.apply(self, arguments);
        },
        error: function() {
          throw new Error("Unable to connect to geocoding service");
        }
      });

      return this;
    }
  });
})(window.App);
