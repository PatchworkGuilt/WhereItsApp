var ItemModel = Backbone.Model.extend({
    save: function(){
        //POST TO SERVER HERE
    }
});

var NearbyItemCollection = Backbone.Collection.extend({
    model: ItemModel,
    url: 'offers/nearby'
});

var MyItemCollection = Backbone.Collection.extend({
    model: ItemModel,
    url: 'offers/mine'
});

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
