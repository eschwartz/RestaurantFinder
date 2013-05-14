var App = _.isObject(App)? App :  {};

(function() {
  App.start = function(options) {
    App.setUIElements();
    App.bindGlobalEvents();

    $.publish("app:load:start");
    var locations = new App.LocationCollection(options.locations);
    locations.geocode(function() {
      console.log(locations);
      $.publish("app:load:complete")
    });
  }

  App.setUIElements = function() {
    App.ui = {
      'appLoading': $('.appLoading')
    };
  }

  App.bindGlobalEvents = function() {
    $.subscribe("app:load:start", App.showLoading);
    $.subscribe("app:load:complete", App.hideLoading);
  }

  App.showLoading = function() {
    App.ui.appLoading.show();
  }

  App.hideLoading = function() {
    App.ui.appLoading.hide();
  }
})();