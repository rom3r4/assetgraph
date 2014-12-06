module.exports = function () {
    return function importCdnAssets(assetGraph, cb) {
        assetGraph
            .queue(function populateCdnAssets(assetgraph, cb) {
                assetGraph.populate({
                    followRelations: {
                        hrefType: ['absolute', 'protocolRelative'],
                        type: ['HtmlScript', 'HtmlStyle']
                    }
                }).run(cb);
            })

            .queue(function moveVendorScriptsInternally(assetGraph) {
                assetGraph.findRelations({
                    hrefType: ['absolute', 'protocolRelative']
                }).forEach(function (relation) {
                    var from = relation.from,
                        to = relation.to;

                    if (to.url) {
                        relation.hrefType = 'relative';
                        to.url = from.url.replace(from.fileName, to.id + '-' + to.fileName);
                    }
                });
            })

            .run(cb);
    };
};
