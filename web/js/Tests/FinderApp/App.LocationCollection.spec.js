describe("Restaurant Finder App LocationCollection", function() {
  var self = this;

  beforeEach(function() {
    self.locationCollection = new App.LocationCollection([
      {
        restaurant_name: "Chipotle",
        cuisine_type: "Mexican",
        city: "Minneapolis",
        state: "Minnesota"
      },
      {
        restaurant_name: "Latuff's Pizzeria",
        cuisine_type: "Pizza",
        city: "Minneapolis",
        state: "Minnesota"
      },
      {
        restaurant_name: "Red's Savoy Pizza",
        cuisine_type: "Pizza",
        city: "Minneapolis",
        state: "Minnesota"
      }
    ]);
  });

  afterEach(function() {
    delete self.locationCollection;
  });

  it("should geocode all child models, in one fell swoop.", function() {
    var geocodeComplete = false;
    runs(function() {
      self.locationCollection.geocode(function() {
        geocodeComplete = true;
      });
    });

    waitsFor(function() {
      return geocodeComplete;
    },15000);

    runs(function() {
      var chipotle = self.locationCollection.at(0);
      var latuff = self.locationCollection.at(1);
      var reds = self.locationCollection.at(2);

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

    expect(self.locationCollection.length).toEqual(2);
    expect(self.locationCollection.at(0).get('restaurant_name')).toBe("Latuff's Pizzeria");
  });

  it("should search for matches in cuisine OR restaurant name", function() {
    self.locationCollection.filterByAny("pizza");

    expect(self.locationCollection.length).toEqual(2);
    expect(self.locationCollection.at(0).get('restaurant_name')).toBe("Latuff's Pizzeria");

    self.locationCollection.revert();

    self.locationCollection.filterByAny("ch");

    expect(self.locationCollection.length).toEqual(1);
    expect(self.locationCollection.at(0).get('restaurant_name')).toBe("Chipotle");
  });

  it("should be able to revert to original collection after filtering", function() {
    var collection_orig = _.extend({}, self.locationCollection);
    self.locationCollection.filterByRestaurant("ch");
    self.locationCollection.revert();
    expect(self.locationCollection.length).toEqual(3);
    expect(_.isEqual(self.locationCollection.models, collection_orig.models)).toBe(true);

    // Run twice, to make sure we're saving the original-original colelction
    self.locationCollection.filterByRestaurant("ch");
    self.locationCollection.revert();
    expect(self.locationCollection.length).toEqual(3);
    expect(_.isEqual(self.locationCollection.models, collection_orig.models)).toBe(true);
  });
});