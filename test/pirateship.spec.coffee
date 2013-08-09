expect = require('chai').expect
pirateship = require '../lib/pirateship'

describe 'pirateship', ->
    it 'should find query', (done) ->
        pirateship.find 'Lost', (err, torrents) ->
            console.log torrents
            expect(torrents.length > 0).to.be.true
            done()

