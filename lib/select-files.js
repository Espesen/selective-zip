var dir = require("node-dir")
  , Q = require('q');

function collectAllDirs(list) {
  var result = [];
  list.forEach(function (item) {
    var path;
    if (item.indexOf('/') > -1) {
      path = item.match(/(.+)\/[^\/]+$/)[1];
      if (result.indexOf(path) < 0) {
        result.push(path);
      }
    }
  });
  return result;
}

// get all directories which don't have node_modules as descendant directory, parent directory or self
// takes input from function collectAllDirs

function getDirsWithoutModules(list) {

  //return list;

  list = list.filter(function (item) {
    var foundSubDir = false;
    list.forEach(function (entry) {
      if (entry.indexOf(item) === 0 && entry.indexOf('node_modules') > -1) {
        foundSubDir = true;
      }
    });
    return !foundSubDir;
  });

  return list.filter(function (item) {
    var path = item.match(/(.+\/)[^\/]+\/$/)[1];
    return list.indexOf(path) < 0;
  });
}


module.exports = {

  // Recurses all subdirectories and excludes all node_modules directories.
  // Returns a promise of a list of directories and files to send to zip

  selectFiles: function (path) {

    return Q.nfbind(dir.paths)(path)
      .then(function (paths) {
        var files = paths.files.map(function (item) {
              return item.replace(/\\/g, '/');
            })
          , dirs = paths.dirs.map(function (item) {
            return item.replace(/\\/g, '/') + '/';
          })
          , cleanDirs = getDirsWithoutModules(dirs)
          , list = files.concat(dirs);

        return list.filter(function (item) {
          var isDir = item.charAt(item.length - 1) === '/'
            , inCleanDir = false;

          if (item.match(/node_modules/)) {
            return false;
          }

          if (isDir) {
            return cleanDirs.indexOf(item) > -1;
          }
          else {
            cleanDirs.forEach(function (dir) {
              if (item.indexOf(dir) === 0) {
                inCleanDir = true;
              }
            });
            return !inCleanDir;
          }
        });
      });
  }
};
