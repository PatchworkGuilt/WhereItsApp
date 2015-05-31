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

        showMyItems();

        $(".nav-link").click(function (e) {
            var action = $(this).data('action');
            switch(action) {
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

        $("a.nav-link").click(function(){
            $activeLink = $(this);
        });

        $(".sync-button").click(function(){
            if (nearbyItemListView)
                nearbyItemListView.fetchItems();
            if (myItemListView)
                myItemListView.fetchItems();
        });

        $(document).on('pagebeforeshow', function(){
            if ($activeLink) {
                $activeLink.addClass($.mobile.activeBtnClass);
            }
        })
    }
}
