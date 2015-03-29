var path = require('path');
var fs = require('fs');
var prompt = require('prompt');
var exec = require('child_process').exec;
var lib = path.join(path.dirname(fs.realpathSync(__filename)), '../src');

var pirateship = require(lib + '/pirateship');

exports.prompt = function () {
  argv = require('optimist')
    .usage('Usage: $0 -q [string]')
    .demand(['q'])
    .argv;

  var exitIfError = function (error) {
    if (error) {
      console.log(error);
      process.exit(1);
    }
  };

  pirateship.find(argv.q, function (err, torrents) {
    exitIfError(err);

    torrents.forEach(function (torrent, index) {
      console.log("%d) [%d / %d] %s", index, torrent.seeds, torrent.leechers, torrent.title);
    });

    prompt.start();
    prompt.get(['index'], function (err, result) {
      if (!err) {
        result.index.split(" ").forEach(function (index) {
          var cmd = 'ssh imac "open /Applications/uTorrent.app ' + torrents[index].link + '"';
          console.log(cmd);
          exec(cmd);
        })
      }
    });
  });

};


