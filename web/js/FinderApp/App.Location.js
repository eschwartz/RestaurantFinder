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
          location: this.getFullAddress()
        },
        success: function(res) {
          if(res.results[0].locations.length) {
            var latLng = res.results[0].locations[0].latLng;
            self.set('lat', latLng.lat);
            self.set('lng', latLng.lng);
          }
          // We have a problem if MapQuest can't find the restaurant
          // I would need to go back to the client/end-user
          // and reevaluate the business requirements
          // For now, will set a static location
          else {
            self.set('lat', 44.98 + Math.random()/10);
            self.set('lng', -93.27 + Math.random()/10);
          }

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
