/*
describe("App Search View", function() {
  var self = {};

  var ui = {
    region: $('<div id="#searchView">'),
    search: $('<input type="text" id="search" />'),
    results: $('<div id="searchResults"></div>')
  };

  beforeEach(function() {
    for(el in ui) {
      ui[el].appendTo('body');
    }
    self.searchView = new App.SearchView({
      el: ui.region
    });
  });

  afterEach(function() {
    for(el in ui) {
      ui[el].remove();
    }
  });

  it("should trigger search event on keypress with search term", function() {
    var triggered = false;
    $.subscribe("search:term", function() {
      triggered = true;
    });
  });
});
*/
