(function() {
  App.InfoWindow = Backbone.GoogleMaps.InfoWindow.extend({
    template: $('#template-infoWindow'),

    initialize: function() {
      this.template = $('#template-infoWindow');
    }
  });
})();