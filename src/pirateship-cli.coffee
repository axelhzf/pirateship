path = require 'path'
fs = require 'fs'
prompt = require 'prompt'
exec = require('child_process').exec
lib = path.join(path.dirname(fs.realpathSync(__filename)), '../lib')

pirateship = require(lib + '/pirateship')

exports.prompt = () ->
    argv = require('optimist')
        .usage('Usage: $0 -q [string]')
        .demand(['q'])
        .argv

    exitIfError = (error) =>
        if (error)
            console.log error
            process.exit(1);

    pirateship.find argv.q, (err, torrents) ->
        exitIfError(err)

        torrents.forEach (torrent, index) ->
            console.log("#{index}) [#{torrent.seeds} / #{torrent.leechers}] #{torrent.title}")

        prompt.start()
        prompt.get ['index'], (err, result) ->
            if(!err)
                result.index.split(" ").forEach (index) ->
                    cmd = 'ssh imac "open /Applications/uTorrent.app ' + torrents[index].link + '"'
                    console.log cmd
                    exec cmd