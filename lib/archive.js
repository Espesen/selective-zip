var Q = require('q')
  , archiver = require('archiver')
  , selectFiles = require('./select-files').selectFiles
  , fs = require('fs');

module.exports = {
  zipPath: function (srcPath, destinationPath) {

    var fileCounter = 0;

    destinationPath = destinationPath || './';
    if (destinationPath.charAt(destinationPath.length - 1) !== '/') {
      throw new Error('Please specify destination path with a trailing slash');
    }

    if (srcPath.charAt(srcPath.length - 1) !== '/') {
      srcPath += '/';
    }

    var deferred = Q.defer();

    var output = fs.createWriteStream(destinationPath + 'archive.zip')
      , archive = archiver('zip');

    function stripSrcPath(path) {
      return path.replace(srcPath, '');
    }

    output.on('close', function() {
      console.log(archive.pointer() + ' total bytes');
      console.log('archiver has been finalized and the output file descriptor has closed.');
      deferred.resolve();
    });

    archive.on('error', function(err) {
      throw err;
    });

    archive.on('entry', function (entry) {
      fileCounter++;
      if (fileCounter % 100 === 0) {
        console.log(fileCounter + ' files added...');
      }
    });

    archive.pipe(output);

    selectFiles(srcPath)
      .then(function (list) {
        var archiveChain = archive;
        list.forEach(function (item) {
          if (item.charAt(item.length - 1) === '/') {
            archiveChain = archiveChain.directory(item, stripSrcPath(item));
          }
          else {
            archiveChain = archiveChain.append(fs.createReadStream(item), { name: stripSrcPath(item) });
          }
        });
        archiveChain.finalize();
      })
      .catch(deferred.reject)
      .done();

    return deferred.promise;

  }
};