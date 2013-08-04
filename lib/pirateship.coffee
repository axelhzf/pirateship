_ = require 'underscore'
request = require 'request'
cheerio = require 'cheerio'

exports.find = (q, cb) ->
    encodeQuery = encodeURIComponent(q)
    url = 'http://thepiratebay.sx/search/' + encodeQuery + '/0/7/0'
    options =
        url: url,
        headers:
            'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13'
    request options, (error, response, body) ->
        if (error)
            cb(error)
        else
            $ = cheerio.load(body)

            titles = $('.detName a').map (i, a) -> a.attribs.title

            links = $('#searchResult a[title="Download this torrent using magnet"]')
                .map (i, magnet) ->
                    magnet.attribs.href

            torrents = for title, index in titles
                {title: title, link: links[index]}

            cb(undefined, torrents)