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
            responseText: [{name: 'Two for one drinks'}]
        });
    });
});
casper.test.begin('Test phone/tablet layouts', function suite(test) {
    casper.start().each(viewportSizes, function(self, viewportSize){
        self.then(function(){
            self.viewport(viewportSize.width, viewportSize.height);
            console.log(viewportSize.name);
        });
        self.thenOpen(config.filepath + "index.html");
        self.then(
            function then(){
                test.assertVisible('#page-header', 'Page Header is visible - ' + viewportSize.name);
                test.assertVisible('#page-footer', 'Page Footer is visible - ' + viewportSize.name);
                test.assertElementCount('.nav-link.ui-btn-active', 1, "Exactly one nav-link is active");
                test.assertSelectorHasText('.nav-link.ui-btn-active', 'Mine', "'Mine' is first active link");
            }
        );
        casper.waitForSelector('li.offer-item');
        self.then(function check() {
            this.capture('www/test/images/index Nearby:' + viewportSize.name +'.png');
            test.assertExists('.offer-item', 'Has a nearby offer');
        });
        self.thenClick('.nav-link[data-action="nearby"]');
        casper.waitForSelector('li.offer-item');
        self.then(function(){
            this.capture('www/test/images/index Mine:' + viewportSize.name +'.png');
            test.assertExists('.offer-item', 'Has a Mine offer');
        });
    });
    casper.run(function() {
        test.done();
    });
});
