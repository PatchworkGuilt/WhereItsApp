
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
        this.fetchItems();
    },
    events: {
        "click .list-item a": "itemClicked"
    },
    fetchItems: function(){
        this.collection.fetch({success: this.onFetchSuccess, error: this.onFetchFailure});
    },
    itemClicked: function(event){
        var itemId = $(event.target).closest('a').data('id');
        var selectedItem = this.collection.findWhere({id: itemId});
        if (selectedItem) {
            this.trigger("itemClicked", selectedItem);
        }
    },
    onFetchSuccess: function(collection, response, options) {
        hideLoadingSpinner();
    },
    onFetchFailure: function(collection, response, options) {
        console.error(response)
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
        if(! this.model.get('start-time')) {
            this.model.set('start-time', new Date())
        }
    },
    events: {
        "keyup input,textarea": "onChange",
        "paste input,textarea": "onChange",
        "submit form": "onSubmit"
    },
    onSubmit: function() {
        //TODO: VALIDATION
        this.model.save(null, {success: this.onSuccess, error: this.onError});
        return false;
    },
    onSuccess: function(model, response, options) {
        this.$('form').trigger('reset');
    },
    onError: function(model, response, options) {
        console.error(response);
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
