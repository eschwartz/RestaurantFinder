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

      expect(chipotle.get('lat')).toBeCloseTo(44.748016, 4);
      expect(chipotle.get('lng')).toBeCloseTo(-93.288055, 4);

      expect(latuff.get('lat')).toBeCloseTo(44.983334, 4);
      expect(latuff.get('lng')).toBeCloseTo(-93.26667, 4);

      expect(reds.get('lat')).toBeCloseTo(44.9833347, 4);
      expect(reds.get('lng')).toBeCloseTo(-93.26667, 4);
    });
  });
});