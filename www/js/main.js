$(function() {
    FastClick.attach(document.body);
    $( "[data-role='header'], [data-role='footer']" ).toolbar();

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

    var CreationFormView = Backbone.View.extend({
        initialize: function() {
            this.template = Handlebars.compile($("#item-creation-template").html());
        },
        events: {
            "keyup input,textarea": "onChange",
            "paste input,textarea": "onChange",
            "submit form": "onSubmit"
        },
        onSubmit: function() {
            //TODO: VALIDATION
            this.model.save();
            this.$('form').trigger('reset');
            return false;
        },
        onChange: function(e) {
            var $input = $(e.target);
            var key = $input.attr('name');
            var newValue = $input.val();
            this.model.set(key, newValue);
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            $("#content").trigger('create');
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
    var nearbyItemListView, myItemListView, creationFormView;
    var $activeLink;

    function showItemDetailView(itemModel) {
        var detailView = new ItemDetailView({model: itemModel, el: $('#item-detail-container')});
        detailView.render();
        $.mobile.pageContainer.pagecontainer("change", "#item-detail-page", {transition:'slidefade'});
    }

    function renderItemListView(view, $element, collection) {
        $(".nav-page-container").addClass('hide');
        if (!view) {
            listView = new ItemListView({el: $element, collection: collection});
            listView.on('itemClicked', function(itemModel){
                showItemDetailView(itemModel);
            });
        }
        listView.render();
        return listView;
    }

    function showNearbyItems() {
        nearbyItemListView = renderItemListView(nearbyItemListView, $('#nearby-item-list-container'), nearbyItemCollection);
    }

    function showMyItems() {
        myItemListView = renderItemListView(myItemListView, $('#mine-item-list-container'), myItemCollection);
    }

    function showCreationForm() {
        $(".nav-page-container").addClass('hide');
        creationFormView = creationFormView || new CreationFormView({el: $('#item-creation-container'), model: new ItemModel()});
        creationFormView.render();
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
                showCreationForm();
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
