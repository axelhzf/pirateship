(function() {
  var exec, fs, lib, path, pirateship, prompt;

  path = require('path');

  fs = require('fs');

  prompt = require('prompt');

  exec = require('child_process').exec;

  lib = path.join(path.dirname(fs.realpathSync(__filename)), '../lib');

  pirateship = require(lib + '/pirateship');

  exports.prompt = function() {
    var argv, exitIfError,
      _this = this;
    argv = require('optimist').usage('Usage: $0 -q [string]').demand(['q']).argv;
    exitIfError = function(error) {
      if (error) {
        console.log(error);
        return process.exit(1);
      }
    };
    return pirateship.find(argv.q, function(err, torrents) {
      exitIfError(err);
      torrents.forEach(function(torrent, index) {
        return console.log("" + index + ") [" + torrent.seeds + " / " + torrent.leechers + "] " + torrent.title);
      });
      prompt.start();
      return prompt.get(['index'], function(err, result) {
        if (!err) {
          return result.index.split(" ").forEach(function(index) {
            var cmd;
            cmd = 'ssh imac "open /Applications/uTorrent.app ' + torrents[index].link + '"';
            console.log(cmd);
            return exec(cmd);
          });
        }
      });
    });
  };

}).call(this);

/*
//@ sourceMappingURL=pirateship-cli.js.map
*/