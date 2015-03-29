var expect = require("chai").expect;
var pirateship = require("../src/pirateship");

describe("pirateship", function () {

  it('should find query', function (done) {
    this.timeout(5000);

    pirateship.find('Lost', function (err, torrents) {
      console.log(err, torrents);
      expect(torrents.length > 0).to.be.true;
      done()
    });
  });

});


