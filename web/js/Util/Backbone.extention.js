Backbone.View.prototype.getUI = function(name) {
  if(!this.ui || !this.ui[name]) {
    throw new Error("'" + name + "' is not a named ui element of this view.")
  }

  return this.$el.find(this.ui[name]);
}