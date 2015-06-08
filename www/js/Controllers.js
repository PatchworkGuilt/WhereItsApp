var MainController = function(){

    this.run = function(){
        $( "[data-role='header'], [data-role='footer']" ).toolbar();

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

        function renderItemListView(listView, $element, collection) {
            $(".nav-page-container").addClass('hide');
            if (!listView) {
                listView = new ItemListView({el: $element, collection: collection});
                listView.on('itemClicked', function(itemModel){
                    showItemDetailView(itemModel);
                });
            }
            listView.render();
            return listView;
        }

        function makeNavLinkActive(action) {
            $('.nav-link').removeClass($.mobile.activeBtnClass)
            $('.nav-link[data-action="' + action + '"]').addClass($.mobile.activeBtnClass);
        }

        function showNearbyItems() {
            makeNavLinkActive('nearby');
            nearbyItemListView = renderItemListView(nearbyItemListView, $('#nearby-item-list-container'), nearbyItemCollection);
        }

        function showMyItems() {
            makeNavLinkActive('mine');
            myItemListView = renderItemListView(myItemListView, $('#mine-item-list-container'), myItemCollection);
        }

        function showCreationForm() {
            $(".nav-page-container").addClass('hide');
            newItem = new ItemModel();
            creationFormView = creationFormView || new CreationFormView({el: $('#item-creation-container'), model: newItem});
            creationFormView.render();
            newItem.on('sync', function(){
                showMyItems();
                myItemListView.fetchItems();
            })
        }

        showMyItems();

        $(".nav-link").click(function (e) {
            var $activeLink = $(this).data('action');
            switch($activeLink) {
                case 'mine':
                    showMyItems();
                    break;
                case 'nearby':
                    showNearbyItems();
                    break;
                case 'create':
                    showCreationForm();
                    break;
            }
        });

        $(".sync-button").click(function(){
            if (nearbyItemListView)
                nearbyItemListView.fetchItems();
            if (myItemListView)
                myItemListView.fetchItems();
        });

        $("#environment-select input").click(function(event, other){
            $('environment-option').removeAttr('selected');
            environment = $(this).val();
            switch(environment) {
                case 'local':
                    config = localConfig;
                    break;
                case 'staging':
                    config = stagingConfig;
                    break;
                case 'prod':
                    config = prodConfig;
                    break;
            }
            $(this).attr('selected', 'selected')
        });

        $(document).on('pagebeforeshow', function(){
            if ($activeLink) {
                makeNavLinkActive($activeLink);
            }
        })
    }
}
