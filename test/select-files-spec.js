var selectFiles = require('../lib/select-files').selectFiles
  , testModule = require('./test-module');

var fileList = testModule.fileList
  , ListComparer = testModule.ListComparer;

describe('Module select-files', function () {

  describe('method selectFiles', function () {

    it('should return files and paths not containing node_modules', function (done) {

      var expectedList = fileList
            .split(' ')
            .map(function (item) {
              return 'test/sample-dir/' + item;
            })
        , listComparer = new ListComparer(expectedList);


      selectFiles('test/sample-dir/')
        .then(function (result) {
          return listComparer.compareTo(result);
        })
        .catch(done)
        .done(done);
    });

  });

});