/**
 * @author Bilal Cinarli
 */

var expect = chai.expect;

describe('Testing UX Rocket Textlimit', function() {
    describe('Properties', function() {
        it('should have version property', function() {
            expect($.uxrtextlimit).to.have.property('version');
        });
    });
});