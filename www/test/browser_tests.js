//casperjs test www/test/browser_tests.js
casper.options.clientScripts =  ['www/test/sinon.js'];
casper.options.verbose = true;
casper.options.logLevel = "warning"

var config = {
    filepath: "file:///Users/Scott/Documents/WhereItsApp/www/"
}
var viewportSizes = [
    {'name': 'mobile-portrait', 'width': 320, 'height': 480},
    {'name': 'mobile-landscape', 'width': 480, 'height': 320},
    {'name': 'ipad-portrait', 'width': 768, 'height': 1024},
    {'name': 'ipad-landscape', 'width': 1024, 'height': 768}
];

casper.on('remote.message', function(msg){
    this.log(msg);
});
casper.on('url.changed', function (resource) {
    casper.evaluate(function(){
        $.mockjax({
            url: 'offers/nearby',
            responseText: [{name: 'Two for one drinksss'}]
        });
    });
});

casper.test.begin('Test phone/tablet layouts', function suite(test) {
    casper.start().each(viewportSizes, function(self, viewportSize){
        self.then(function(){
            self.viewport(viewportSize.width, viewportSize.height);
        });
        self.thenOpen(config.filepath + "index.html");
        self.then(
            function then(){
                test.assertVisible('#page-header', 'Page Header is visible - ' + viewportSize.name);
                test.assertVisible('#page-footer', 'Page Footer is visible - ' + viewportSize.name);
                test.assertVisible('#loading-gif', 'Showing loading spinner');
                test.assertElementCount('.nav-link.ui-btn-active', 1, "Exactly one nav-link is active");
                test.assertSelectorHasText('.nav-link.ui-btn-active', 'Mine', "'Mine' is first active link");
            }
        );
        casper.waitForSelector('li.list-item');
        self.then(function check() {
            this.capture('www/test/images/index Nearby:' + viewportSize.name +'.png');
            test.assertExists('.list-item', 'Has a nearby offer');
            test.assertNotVisible('#loading-gif', 'Stopped showing loading spinner');
        });
        self.thenClick('.nav-link[data-action="nearby"]');
        casper.waitForSelector('li.list-item');
        self.then(function(){
            this.capture('www/test/images/index Mine:' + viewportSize.name +'.png');
            test.assertExists('.list-item', 'Has a Mine offer');
        });
    });
    casper.run(function() {
        test.done();
    });
});

casper.test.begin('Test navigation to item detail page', function (test) {
    casper.start(config.filepath + "index.html");
    casper.then(function(){
        casper.waitForSelector("li.list-item a");
    });
    var title;
    casper.then(function(){
        title = casper.getHTML('li.list-item .list-item-title');
    });
    casper.thenClick('li.list-item a');
    casper.waitUntilVisible("#item-detail-header", function(){
        test.assertSelectorHasText('#item-detail-title', title, 'Detail page has correct title');
    });
    casper.thenClick('a[data-rel="back"]');
    casper.waitUntilVisible("li.list-item a", function(){
        test.assertExists("li.list-item a", "And we can go back to main page");
    });
    casper.run(function() {
        test.done();
    });
});

casper.test.begin("Test navigation to item detail page from 'Nearby'", function (test) {
    casper.start(config.filepath + "index.html");
    casper.then(function(){
        casper.waitForSelector("li.list-item a");
    });
    casper.thenClick('a[data-action="nearby"]');
    casper.waitWhileVisible("li.list-item a");
    var title;
    casper.waitUntilVisible("li.list-item a", function(){
        title = casper.getHTML('li.list-item .list-item-title');
    });
    casper.thenClick('li.list-item a');
    casper.waitUntilVisible("#item-detail-header", function(){
        test.assertSelectorHasText('#item-detail-title', title, 'Detail page has correct title');
    });
    casper.thenClick('a[data-rel="back"]');
    casper.waitUntilVisible("li.list-item a", function(){
        test.assertExists("li.list-item a", "And we can go back to main page");
    });
    casper.run(function() {
        casper.capture("aandback.png");
        test.done();
    });
});
