_ = require 'underscore'
request = require 'request'
cheerio = require 'cheerio'
zlib = require 'zlib'

TITLE_PREFIX = 'Details for '

exports.find = (q, cb) ->
  encodeQuery = encodeURIComponent(q)
  url = 'http://thepiratebay.se/search/' + encodeQuery + '/0/7/0'
  options =
    url: url,
    encoding: null,
    headers:
      'Accept-Encoding': 'gzip',
      'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13'

  request options, (err, response, body) ->
    return cb(err) if err

    zlib.unzip body, (err, buffer) ->
      return cb(err) if err

      $ = cheerio.load(buffer.toString())

      titles = $('.detName a').map (i, a) -> a.attribs.title.substring(TITLE_PREFIX.length)
      links = $('#searchResult a[title="Download this torrent using magnet"]')
      .map (i, magnet) ->
        magnet.attribs.href

      parseTd = (i, td) ->
        td.children[0].data

      seeds = $('#searchResult tr td:nth-child(3)').map parseTd
      leechers = $('#searchResult tr td:nth-child(4)').map parseTd

      torrents = for title, index in titles
          {title: title, link: links[index], seeds: seeds[index], leechers: leechers[index]}

      cb(undefined, torrents)
