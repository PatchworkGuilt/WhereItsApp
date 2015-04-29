$(function() {
    FastClick.attach(document.body);
    $( "[data-role='header'], [data-role='footer']" ).toolbar();

    var OfferModel = Backbone.Model.extend({
    });

    var NearbyOfferCollection = Backbone.Collection.extend({
        model: OfferModel,
        url: 'offers/nearby'
    });

    var MyOfferCollection = Backbone.Collection.extend({
        model: OfferModel,
        url: 'offers/mine'
    });

    $.mockjax({
        url: 'offers/nearby',
        responseText: [{name: 'Two for one drinks'}]
    });
    $.mockjax({
        url: 'offers/mine',
        responseText: [
            new OfferModel({name: 'Offer 1'}),
            new OfferModel({name: 'Offer 2'}),
            new OfferModel({name: 'Offer 3'})
        ]
    });
    var OfferListView = Backbone.View.extend({
        initialize: function(options){
            this.collection.on('add', this.render, this);
            this.collection.fetch();
        },
        render: function(){
            var template = Handlebars.compile($('#offer-list-template').html());
            this.$el.html(template({offers: this.collection.toJSON()}));
            this.$el.listview("refresh");
        }
    });

    //CONTROLLER
    var nearbyOfferCollection = new NearbyOfferCollection;

    var myOfferCollection = new MyOfferCollection();
    var nearbyOfferListView;
    function showNearbyOffers() {
        nearbyOfferListView = nearbyOfferListView || new OfferListView({el: $('#offer-list'), collection: nearbyOfferCollection});
        nearbyOfferListView.render();
    }

    var myOfferListView;
    function showMyOffers() {
        myOfferListView = myOfferListView || new OfferListView({el: $('#offer-list'), collection: myOfferCollection});
        myOfferListView.render();
    }


    showNearbyOffers();

    $(".nav-link").click(function (e) {
        var action = $(this).data('action');
        switch(action) {
            case 'mine':
                showNearbyOffers();
                break;
            case 'nearby':
                showMyOffers();
                break;
            case 'create':
                break;
        }
    });
});
