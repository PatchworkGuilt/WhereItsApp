$(function() {
    FastClick.attach(document.body);

    var OfferModel = Backbone.Model.extend({
        initialize: function() {
            this.set('name', 'An Offer');
        };
    });

    var OfferCollection = Backbone.Collection.extend({

    });
});
