(function() {
  var TITLE_PREFIX, cheerio, request, zlib, _;

  _ = require('underscore');

  request = require('request');

  cheerio = require('cheerio');

  zlib = require('zlib');

  TITLE_PREFIX = 'Details for ';

  exports.find = function(q, cb) {
    var encodeQuery, options, url;
    encodeQuery = encodeURIComponent(q);
    url = 'http://thepiratebay.se/search/' + encodeQuery + '/0/7/0';
    options = {
      url: url,
      encoding: null,
      headers: {
        'Accept-Encoding': 'gzip',
        'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13'
      }
    };
    return request(options, function(err, response, body) {
      if (err) {
        return cb(err);
      }
      return zlib.unzip(body, function(err, buffer) {
        var $, index, leechers, links, parseTd, seeds, title, titles, torrents;
        if (err) {
          return cb(err);
        }
        $ = cheerio.load(buffer.toString());
        titles = $('.detName a').map(function(i, a) {
          return a.attribs.title.substring(TITLE_PREFIX.length);
        });
        links = $('#searchResult a[title="Download this torrent using magnet"]').map(function(i, magnet) {
          return magnet.attribs.href;
        });
        parseTd = function(i, td) {
          return td.children[0].data;
        };
        seeds = $('#searchResult tr td:nth-child(3)').map(parseTd);
        leechers = $('#searchResult tr td:nth-child(4)').map(parseTd);
        torrents = (function() {
          var _i, _len, _results;
          _results = [];
          for (index = _i = 0, _len = titles.length; _i < _len; index = ++_i) {
            title = titles[index];
            _results.push({
              title: title,
              link: links[index],
              seeds: seeds[index],
              leechers: leechers[index]
            });
          }
          return _results;
        })();
        return cb(void 0, torrents);
      });
    });
  };

}).call(this);

/*
//@ sourceMappingURL=pirateship.js.map
*/