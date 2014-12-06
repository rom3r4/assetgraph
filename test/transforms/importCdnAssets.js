/*global describe, it*/
var expect = require('../unexpected-with-plugins'),
    AssetGraph = require('../../lib'),
    query = AssetGraph.query;

describe('transforms/importCdnAssets', function () {
    it('should populate external CDN assets and move them into the assetGraph root', function (done) {
        new AssetGraph({root: __dirname + '/../../testdata/transforms/importCdnAssets/'})
            .loadAssets('index.html')
            .populate({
                followRelations: {
                    hrefType: ['relative', 'rootRelative']
                }
            })
            .queue(function setup(assetGraph) {
                expect(assetGraph, 'to contain relations including unresolved', 'HtmlScript', 2);
                expect(assetGraph, 'to contain relations including unresolved', 'HtmlStyle', 1);

                expect(assetGraph, 'to contain no assets', 'JavaScript');
                expect(assetGraph, 'to contain no assets', 'Css');
            })
            .importCdnAssets()
            .queue(function verification(assetGraph) {
                expect(assetGraph, 'to contain assets', 'JavaScript', 2);
                expect(assetGraph, 'to contain assets', 'Css', 1);

                expect(assetGraph, 'to contain relations', { hrefType: 'relative' }, 3);

                expect(assetGraph.findAssets(query.not({ type: 'Html' })), 'to be an array whose items satisfy', function (asset) {
                    expect(asset.url, 'to contain', assetGraph.root);
                });
            })
            .run(done);
    });
});
