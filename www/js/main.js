$(function() {
    FastClick.attach(document.body);
    /*$( "[data-role='header'], [data-role='footer']" ).toolbar();

    var OfferModel = Backbone.Model.extend({
    });

    var OfferCollection = Backbone.Collection.extend({
        model: OfferModel
    });

    var OfferView = Backbone.View.extend({
        render: function(){
            var template = Handlebars.compile($('#offer-list-template').html());
            this.$el.html(template({offers: this.collection.toJSON()}));
            this.$el.listview("refresh");
        }
    });
    //CONTROLLER
    nearbyOfferCollection = new OfferCollection([
        new OfferModel({name: 'Offer 1'}),
        new OfferModel({name: 'Offer 2'})
    ]);

    myOfferCollection = new OfferCollection([
        new OfferModel({name: 'Offer 1'}),
        new OfferModel({name: 'Offer 2'}),
        new OfferModel({name: 'Offer 3'})
    ]);
    var nearbyOfferListView;
    function showNearbyOffers() {
        nearbyOfferListView = nearbyOfferListView || new OfferView({el: $('#offer-list'), collection: nearbyOfferCollection});
        nearbyOfferListView.render();
    }

    var myOfferListView;
    function showMyOffers() {
        myOfferListView = myOfferListView || new OfferView({el: $('#offer-list'), collection: myOfferCollection});
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
    });*/
});
