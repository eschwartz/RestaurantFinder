describe("Restaurant Finder App LocationCollection", function() {
  var self = this;

  beforeEach(function() {
    self.locationCollection = new App.LocationCollection(
      [
        {"restaurant_name":"Fogo de Chao","cuisine_type":"Brazilian"},
        {"restaurant_name":"Chipotle","cuisine_type":"Mexican"},
        {"restaurant_name":"Jimmy John's","cuisine_type":"Sandwiches"},
        {"restaurant_name":"Broadway Pizza","cuisine_type":"Pizza"},
        {"restaurant_name":"Smashburger","cuisine_type":"Burgers"},
        {"restaurant_name":"Leeann Chin","cuisine_type":"Chinese"},
        {"restaurant_name":"Hoban","cuisine_type":"Korean"},
        {"restaurant_name":"Red's Savoy Pizza","cuisine_type":"Pizza"},
        {"restaurant_name":"Holy Land","cuisine_type":"Middle Eastern"},
        {"restaurant_name":"Manny's Steakhouse","cuisine_type":"Steakhouse"},
        {"restaurant_name":"Latuff's Pizzeria","cuisine_type":"Pizza"},
        {"restaurant_name":"Lindey's Steakhouse","cuisine_type":"Steakhouse"},
        {"restaurant_name":"Dong Yang","cuisine_type":"Korean"},
        {"restaurant_name":"White Castle","cuisine_type":"Burgers"},
        {"restaurant_name":"Famous Dave's","cuisine_type":"Barbeque"},
        {"restaurant_name":"Vincent's","cuisine_type":"French"}
      ]
    );
  });

  afterEach(function() {
    delete self.locationCollection;
  });

  it("should geocode all child models, in one fell swoop.", function() {
    var geocodeComplete = false;

    // Remove the limit, so I have access to all original models
    self.locationCollection.removeLimit();
    self.locationCollection.revert();

    runs(function() {
      self.locationCollection.geocode(function() {
        geocodeComplete = true;
      });
    });

    waitsFor(function() {
      return geocodeComplete;
    },15000);

    runs(function() {
      var chipotle = self.locationCollection.at(1);
      var latuff = self.locationCollection.at(10);
      var reds = self.locationCollection.at(7);

      expect(chipotle.get('lat')).toBeCloseTo(44.748016, 0);
      expect(chipotle.get('lng')).toBeCloseTo(-93.288055, 0);

      expect(latuff.get('lat')).toBeCloseTo(44.983334, 0);
      expect(latuff.get('lng')).toBeCloseTo(-93.26667, 0);

      expect(reds.get('lat')).toBeCloseTo(44.9833347, 0);
      expect(reds.get('lng')).toBeCloseTo(-93.26667, 0);
    });
  });

  it("should search by matching first letters of restaurant name", function() {
    self.locationCollection.filterByRestaurant("ch");

    expect(self.locationCollection.length).toEqual(1);
    expect(self.locationCollection.at(0).get('restaurant_name')).toBe("Chipotle");
  });

  it("should search by cuisine", function() {
    self.locationCollection.filterByCuisine("pizza");

    expect(self.locationCollection.length).toEqual(3);
    expect(self.locationCollection.at(0).get('restaurant_name')).toBe("Broadway Pizza");
  });

  it("should search for matches in cuisine OR restaurant name", function() {
    self.locationCollection.filterByAny("pizza");

    expect(self.locationCollection.length).toEqual(3);
    expect(self.locationCollection.at(0).get('restaurant_name')).toBe("Broadway Pizza");

    self.locationCollection.revert();

    self.locationCollection.filterByAny("ch");

    expect(self.locationCollection.length).toEqual(2);
    expect(self.locationCollection.at(0).get('restaurant_name')).toBe("Chipotle");
  });

  describe("Limiting results", function () {

    it("should be able to revert to original collection after filtering", function() {
      var collection_orig = _.extend({}, self.locationCollection);
      self.locationCollection.filterByRestaurant("ch");
      self.locationCollection.revert();
      expect(self.locationCollection.length).toEqual(collection_orig.models.length);
      expect(_.isEqual(self.locationCollection.models, collection_orig.models)).toBe(true);

      // Run twice, to make sure we're saving the original-original colelction
      self.locationCollection.filterByRestaurant("ch");
      self.locationCollection.revert();
      expect(self.locationCollection.length).toEqual(collection_orig.models.length);
      expect(_.isEqual(self.locationCollection.models, collection_orig.models)).toBe(true);
    });

    it("should limit search results to a defined max number", function() {
      // Search by any
      self.locationCollection.filterByAny("b", 2);
      expect(self.locationCollection.length).toBe(2);
      self.locationCollection.revert();

      // Search by cuisine
      self.locationCollection.filterByCuisine("pizza", 1);
      expect(self.locationCollection.length).toBe(1);
      self.locationCollection.revert();

      // Search by restaurant name
      self.locationCollection.filterByRestaurant("f", 1);
      expect(self.locationCollection.length).toBe(1);
    });

    it("should set a default results limit, or default to 6", function() {
      // Should start out at limit
      expect(self.locationCollection.length).toEqual(6);

      // Search should default to limit of 6
      self.locationCollection.filterByAny("");
      expect(self.locationCollection.length).toEqual(6);
      self.locationCollection.revert();

      self.locationCollection.setLimit(2);
      self.locationCollection.filterByAny("");
      expect(self.locationCollection.length).toEqual(2);
    });

    it("should be able to remove the results limit", function() {
      self.locationCollection.setLimit(2);
      self.locationCollection.removeLimit();
      expect(self.locationCollection.length).toBeGreaterThan(2);
    });

    it("should have option to ignore results limit on reset", function() {
      var models = self.locationCollection.models;
      self.locationCollection.setLimit(1);

      // On reset
      self.locationCollection.reset(models, { useLimit: false });
      expect(self.locationCollection.length).toBe(models.length);
    });

    it("should have option to ignore results limit on revert", function() {
      self.locationCollection.setLimit(1);

      // On revert
      self.locationCollection.revert({ useLimit: false });
      expect(self.locationCollection.length).toBeGreaterThan(1);
    });

    it("should have option to ignore results limit on search by cuisine", function() {
      self.locationCollection.setLimit(1);

      // On search: cuisine
      self.locationCollection.filterByCuisine("pizza", { useLimit: false });
      expect(self.locationCollection.length).toBeGreaterThan(1);
    });

    it("should have option to ignore results limit on search by restaurant name", function() {
      self.locationCollection.setLimit(1);

      // On search: restaurant
      self.locationCollection.filterByRestaurant("h", { useLimit: false });
      expect(self.locationCollection.length).toBeGreaterThan(1);
    });

    it("should have option to ignore results limit on search by any", function() {
      self.locationCollection.setLimit(1);

      // On search: any
      self.locationCollection.filterByAny("b", { useLimit: false });
      expect(self.locationCollection.length).toBeGreaterThan(1);
    });
  });
});