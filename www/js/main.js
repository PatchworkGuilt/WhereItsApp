$(function() {
    FastClick.attach(document.body);
    $( "[data-role='header'], [data-role='footer']" ).toolbar();

    var ItemModel = Backbone.Model.extend();

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

    function showLoadingSpinner() {
        $('#loading-gif').removeClass('hide');
    }

    function hideLoadingSpinner() {
        $('#loading-gif').addClass('hide');
    }

    var ItemListView = Backbone.View.extend({
        initialize: function(options){
            this.template = Handlebars.compile($('#list-template').html());
            this.collection.on('add', this.render, this);
            showLoadingSpinner();
            this.collection.fetch({success: this.onFetchSuccess, failure: this.onFetchFailure});
        },
        events: {
            "click .list-item a": "renderDetailPage"
        },
        renderDetailPage: function(event){
            var itemId = $(event.target).data('id');
            var selectedItem = this.collection.findWhere({id: itemId});
            var detailView = new ItemDetailView({model: selectedItem, el: $('#item-detail-container')});
            detailView.render();
            //$('#item-detail-venue').html(selectedItem.get('venue'));
            //$('#item-detail-title').html(selectedItem.get('title'));
            //$('#item-detail-description').html(selectedItem.get('description'));
            $.mobile.pageContainer.pagecontainer("change", "#item-detail-page", {transition:'slidefade'});
        },
        onFetchSuccess: function(data) {
            hideLoadingSpinner();
        },
        onFetchFailure: function(data) {
            hideLoadingSpinner();
        },
        render: function(){
            this.$el.html(this.template({
                items: this.collection.toJSON()
            }));
            this.$('#item-list').listview().listview("refresh");
            this.$el.removeClass('hide');
        }
    });

    var ItemDetailView = Backbone.View.extend({
        initialize: function(){
            this.template = Handlebars.compile($('#item-detail-template').html());
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.$("div[data-role='header']").toolbar();
        }
    });

    //CONTROLLER
    var nearbyItemCollection = new NearbyItemCollection();
    var myItemCollection = new MyItemCollection();
    var nearbyItemListView, myItemListView, currentView;
    var $activeLink;

    function showNearbyItems() {
        $(".list-container").addClass('hide');
        nearbyItemListView = nearbyItemListView || new ItemListView({el: $('#nearby-item-list-container'), collection: nearbyItemCollection});
        nearbyItemListView.render();
        currentView = nearbyItemListView;
    }

    function showMyItems() {
        $(".list-container").addClass('hide');
        myItemListView = myItemListView || new ItemListView({el: $('#mine-item-list-container'), collection: myItemCollection});
        myItemListView.render();
        currentView = myItemListView;
    }

    showNearbyItems();

    $(".nav-link").click(function (e) {
        var action = $(this).data('action');
        switch(action) {
            case 'mine':
                showNearbyItems();
                break;
            case 'nearby':
                showMyItems();
                break;
            case 'create':
                break;
        }
    });

    $("a.nav-link").click(function(){
        $activeLink = $(this);
    });

    $(document).on('pagebeforeshow', function(){
        if ($activeLink) {
            $activeLink.addClass($.mobile.activeBtnClass);
        }
    })
});
