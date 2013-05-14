(function(App) {

  App.LocationCollection = Backbone.GoogleMaps.LocationCollection.extend({
    model: App.Location,

    reset: function() {
      // Save original collection
      Backbone.GoogleMaps.LocationCollection.prototype.reset.apply(this, arguments);
      if(!this.collection_orig) {
        this.collection_orig = _.extend({}, this);
      }

      return this;
    },

    revert: function() {
      this.reset(this.collection_orig.models);

      return this;
    },

    filterByRestaurant: function(term) {
      var matches = this.filter(function(model) {
        var pattern = new RegExp("^" + term, "i");
        return pattern.test(model.get("restaurant_name"));
      });

      this.reset(matches);
    },

    filterByCuisine: function(term) {
      var matches = this.filter(function(model) {
        var pattern = new RegExp("^" + term, "i");
        return pattern.test(model.get("cuisine_type"));
      });

      this.reset(matches);
    },

    filterByAny: function(term) {
      var matches = this.filter(function(model) {
        var pattern = new RegExp("^" + term, "i");
        return pattern.test(model.get("cuisine_type")) || pattern.test(model.get("restaurant_name"));
      });

      this.reset(matches);
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
