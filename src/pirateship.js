var request = require('request');
var cheerio = require('cheerio');
var zlib = require('zlib');

var TITLE_PREFIX = 'Details for ';

exports.find = function (q, cb) {
  var encodeQuery = encodeURIComponent(q);

  var url = 'https://pirateproxy.sx/search/' + encodeQuery + '/0/7/0';

  var options = {
    url: url,
    encoding: null,
    headers: {
      'Accept-Encoding': 'gzip',
      'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13'
    }
  };

  request(options, function (err, response, body) {
    if (err) {
      return cb(err);
    }

    zlib.unzip(body, function (err, buffer) {
      if (err) {
        return cb(err);
      }

      var $ = cheerio.load(buffer.toString());

      var titles = $('.detName a').map(function (i, a) {
        return a.attribs.title.substring(TITLE_PREFIX.length);
      }).get();

      var links = $('#searchResult a[title="Download this torrent using magnet"]').map(function (i, magnet) {
        return magnet.attribs.href;
      }).get();

      var parseTd = function (i, td) {
        return td.children[0].data;
      };

      var seeds = $('#searchResult tr td:nth-child(3)').map(parseTd);
      var leechers = $('#searchResult tr td:nth-child(4)').map(parseTd);

      var torrents = titles.map(function (title, index) {
        return {title: title, link: links[index], seeds: seeds[index], leechers: leechers[index]};
      });

      cb(null, torrents);
    })
  });

};
