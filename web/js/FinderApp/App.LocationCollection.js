(function(App) {
  var priv = {

    getNormalizedSearchOptions: function(arg) {
      var opts = {};
      if(_.isUndefined(arg)) {
        return opts;
      }
      else if(_.isObject(arg)) {
        _.extend(opts, arg);
      }
      else if(_.isNumber(arg)) {
        // argument is search limit
        opts['limit'] = arg;
      }

      return opts;
    }
  };

  App.LocationCollection = Backbone.GoogleMaps.LocationCollection.extend({
    model: App.Location,

    limit: 6,

    resultsCount: 0,

    setLimit: function(limit) {
      if(
        !_.isNumber(limit) ||
        limit % 1 !== 0 ||          // Check for integer
        limit < 1                  // Check for positive number
      ) {
        throw new Error("LocationCollection limit must be a positive integer.");
      }
      this.limit = limit;
    },

    getLimit: function() {
      return this.limit;
    },

    removeLimit: function() {
      this.limit = -1;
    },

    getResultsCount: function() {
      return this.resultsCount;
    },

    reset: function(models, options) {
      var defaultOptions = {
        useLimit: true
      };

      options = _.extend({}, defaultOptions, options);

      Backbone.GoogleMaps.LocationCollection.prototype.reset.apply(this, [ models, options ]);

      // Save original collection
      if(!this.collection_orig) {
        this.collection_orig = _.extend({}, this);
        this.resultsCount = this.length;
      }

      // Set limit
      if(options.limit) {
        this.setLimit(options.limit);
      }

      // Apply limit
      if(options.useLimit && this.limit > 0 && this.length > this.limit) {
        this.reset(this.slice(0, this.limit));
      }

      return this;
    },

    revert: function(options) {
      this.reset(this.collection_orig.models, options);

      return this;
    },

    /**
     *
     * @param term      Search term. Case insensitive
     * @param options   Options are the same as for reset. As a number, argument will be set to results limit.
     */
    filterByRestaurant: function(term, options) {
      options = priv.getNormalizedSearchOptions(options);

      var matches = this.collection_orig.filter(function(model) {
        var pattern = new RegExp("^" + term, "i");
        return pattern.test(model.get("restaurant_name"));
      });

      this.resultsCount = matches.length;

      this.reset(matches, options);
    },

    /**
     *
     * @param term      Search term. Case insensitive
     * @param options   Options are the same as for reset. As a number, argument will be set to results limit.
     */
    filterByCuisine: function(term, options) {
      options = priv.getNormalizedSearchOptions(options);

      var matches = this.collection_orig.filter(function(model) {
        var pattern = new RegExp("^" + term, "i");
        return pattern.test(model.get("cuisine_type"));
      });

      this.resultsCount = matches.length;

      this.reset(matches, options);
    },

    /**
     *
     * @param term      Search term. Case insensitive
     * @param options   Options are the same as for reset. As a number, argument will be set to results limit.
     */
    filterByAny: function(term, options) {
      options = priv.getNormalizedSearchOptions(options);

      var matches = this.collection_orig.filter(function(model) {
        var pattern = new RegExp("^" + term, "i");
        return pattern.test(model.get("cuisine_type")) || pattern.test(model.get("restaurant_name"));
      });

      this.resultsCount = matches.length;

      this.reset(matches, options);
    },

    geocode: function(callback) {
      var self = this;
      var geocodeReqs = [];
      var collection = this.collection_orig || this;

      callback = _.isFunction(callback)? callback : function() {};

      collection.each(function(location) {
        var req = new $.Deferred();
        geocodeReqs.push(req);

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
