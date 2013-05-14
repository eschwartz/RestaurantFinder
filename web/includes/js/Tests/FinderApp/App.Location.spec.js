describe("Restaurant Finder App Locations", function() {
  var self = {};
  beforeEach(function() {
    self.location = new App.Location({
      restaurant_name: "Chipotle",
      cuisine_type: "Mexican",
      city: "Minneapolis",
      state: "Minnesota"
    });
  });

  afterEach(function() {
    delete self.location;
  });

  it("geocodes the location, setting lat/lng attributes", function() {
    var geocodeComplete = false;

    runs(function() {
      self.location.geocode(function() {
        geocodeComplete = true;
      });
    });

    waitsFor(function() {
      return geocodeComplete;
    }, 5000);

    runs(function() {
      expect(self.location.get("lat")).toBeCloseTo(44.748016, 0);
      expect(self.location.get("lng")).toBeCloseTo(-93.288055, 0);
    });
  });

  it("returns a full address, ready for human-reading and geocoding", function() {
    expect(self.location.getFullAddress()).toBe("Chipotle, Minneapolis, Minnesota");
  });
});
