var testModule = require('./test-module')
  , archive = require('../lib/archive')
  , selectFiles = require('../lib/select-files').selectFiles
  , fileList = 'dir_1/ dir_2/ file_1.js file_2.js'
  , ListComparer = testModule.ListComparer
  , rimraf = require('rimraf')
  , Q = require('q')
  , fs = require('fs')
  , unzip = require('unzip');

var unzipFiles = function () {
  var deferred = Q.defer();

  fs.createReadStream('test/archive.zip')
    .pipe(unzip.Extract({ path: 'test/extract-output' }))
    .on('close', function () {
      deferred.resolve();
    })
    .on('error', function (error) {
      console.log(error);
      deferred.reject(error);
    });

  return deferred.promise;
};

describe('Module archive', function () {

  describe('method zipPath', function () {

    var expectedList = fileList
        .split(' ')
        .map(function (item) {
          return 'test/extract-output/' + item;
        })
      , listComparer = new ListComparer(expectedList);

    beforeEach(function (done) {
      Q.nfbind(rimraf)('test/extract-output')
        .then(function () {
          return Q.nfbind(fs.mkdir)('test/extract-output');
        })
        .then(done)
        .catch(done)
        .done();
    });

    it('should zip all files within a path, expect in node_modules directories', function (done) {
      archive.zipPath('test/sample-dir/', 'test/')
        .then(unzipFiles)
        .then(function () {
          return selectFiles('test/extract-output/');
        })
        .then(function (result) {
          listComparer.compareTo(result);
          return done();
        })
        .catch(done)
        .done();
    });
    
  });
  
});