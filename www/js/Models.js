//Workaround for CORS
(function() {
  var proxiedSync = Backbone.sync;

  Backbone.sync = function(method, model, options) {
    options || (options = {});

    if (!options.crossDomain) {
      options.crossDomain = true;
    }

    return proxiedSync(method, model, options);
  };
})();

var ItemModel = Backbone.Model.extend({
    urlRoot: config.baseURL() + '/offers',

});

var ItemCollection = Backbone.Collection.extend({
    model: ItemModel
});

var NearbyItemCollection = ItemCollection.extend({
    url: function(){
        return config.baseURL() + '/offers/nearby';
    }
});

var MyItemCollection = ItemCollection.extend({
    url: function(){
        return config.baseURL() + '/offers/mine';
    }
});

/*
$.mockjax({
    url: 'offers/nearby',
    responseText: [{id: 'abc123', description: 'If one is good then two is at least twice as good', venue: 'Shots on Rocks', title: "Two for one drinks"}]
});
$.mockjax({
    url: 'offers/mine',
    responseText: [
        new ItemModel({id: 'mine1', description: 'If one is good then two is at least twice as good', venue: 'Shots on Rocks', title: "Two for one drinks"}),
        new ItemModel({id: 'mine2', description: "It's Rick.  Literally just show up.", venue: 'Megaladon', title: "10% off for people that know my name"}),
        new ItemModel({id: 'mine3', description: 'If you could only see what our chef is cooking right now.', venue: 'The Duchess', title: "Free appetizer with purchase of a drink"})
    ]
});
*/
