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
});