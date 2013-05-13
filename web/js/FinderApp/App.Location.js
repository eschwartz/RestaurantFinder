var App = (function() {
  var ThisApp = {};

  ThisApp.Location = Backbone.GoogleMaps.Location.extend({
    defaults: {
      city: "Minneapolis",
      state: "Minnesota"
    },

    initialize: function() {
      this.geocoder = new google.maps.Geocoder();
    },

    getFullAddress: function() {
      return [this.get('restaurant_name'), this.get('city'), this.get('state')].join(", ");
    },

    geocode: function(callback) {
      var self = this;
      callback = _.isFunction(callback)? callback: callback = function() {};

      this.geocoder.geocode({ address: this.getFullAddress() }, function(res) {
        var latLng = res[0].geometry.location;
        self.set('lat', latLng.lat());
        self.set('lng', latLng.lng())

        callback.apply(self, arguments);
      });

      return this;
    }
  });

  return ThisApp;
})();