//casperjs test www/test/browser_tests.js
casper.options.clientScripts =  ['www/test/sinon.js'];
casper.options.timeout = 15000;
casper.options.verbose = true;

var sizes = [
    {'name': 'mobile-portrait', 'width': 320, 'height': 480},
    {'name': 'mobile-landscape', 'width': 480, 'height': 320},
    {'name': 'ipad-portrait', 'width': 768, 'height': 1024},
    {'name': 'ipad-landscape', 'width': 1024, 'height': 768}
];

casper.test.begin('Test phone/tablet layouts', sizes.length * 3, function suite(test) {
    casper.start().each(sizes, function(self, size){
        self.then(function(){
            self.viewport(size.width, size.height);
        });
        self.thenOpen("file:///Users/Scott/Documents/WhereItsApp/www/index.html",
            function then(){
                this.capture('www/test/images/index:' + size.name +'.png');
                test.assertVisible('#page-header', 'Page Header is visible - ' + size.name);
                test.assertVisible('#page-footer', 'Page Footer is visible - ' + size.name);
                test.assertElementCount('.nav-link.ui-btn-active', 1, "Exactly one nav-link is active");
                test.assertSelectorHasText('.nav-link.ui-btn-active', 'Mine', "'Mine' is first active link");
            }
        );
    });
    casper.run(function() {
        test.done();
    });
});
