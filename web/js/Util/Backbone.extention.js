Backbone.View.prototype.getUI = function(name) {
  if(!this.ui || !this.ui[name]) {
    throw new Error("'" + name + "' is not a named ui element of this view.")
  }

  return this.$el.find(this.ui[name]);
}


/* Helper Functions required for delegateEvents */
// Helper function to get a value from a Backbone object as a property
// or as a function.
var getValue = function(object, prop) {
  if (!(object && object[prop])) return null;
  return _.isFunction(object[prop]) ? object[prop]() : object[prop];
};

var delegateEventSplitter = /^(\S+)\s*(.*)$/;

/**
 * Allows to use named UI elements in event object
 */
Backbone.View.prototype.delegateEvents = function(events) {
  if (!(events || (events = getValue(this, 'events')))) return;
  this.undelegateEvents();
  for (var key in events) {
    // Determine callback method
    var method = events[key];
    if (!_.isFunction(method)) method = this[events[key]];
    if (!method) throw new Error('Method "' + events[key] + '" does not exist');

    // Split up selector and event binding
    var match = key.match(delegateEventSplitter);
    var eventName = match[1];

    // Check for named selector
    var	selector = (this.ui && _.has(this.ui, match[2]))? this.ui[match[2]]: match[2];

    // Bind the event to the DOM object
    method = _.bind(method, this);
    eventName += '.delegateEvents' + this.cid;
    if (selector === '') {
      this.$el.bind(eventName, method);
    } else {
      this.$el.delegate(selector, eventName, method);
    }
  }
};

/**
 * This method binds the elements specified in the "ui" hash inside the view's code with
 * the associated jQuery selectors.
 * Stolen shamelessly from Backbone.Marionette
 */
Backbone.View.prototype.bindUIElements = function(){
  if (!this.ui) { return; }

  var that = this;

  if (!this.uiBindings) {
    // We want to store the ui hash in uiBindings, since afterwards the values in the ui hash
    // will be overridden with jQuery selectors.
    this.uiBindings = this.ui;
  }

  // refreshing the associated selectors since they should point to the newly rendered elements.
  this.ui = {};
  _.each(_.keys(this.uiBindings), function(key) {
    var selector = that.uiBindings[key];
    that.ui[key] = that.$el.find(selector);
  });
};