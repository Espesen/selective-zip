var archive = require('./lib/archive');

var srcPath = process.argv[2]
  , destPath = process.argv[3];

if (!destPath) { destPath = './'; }

archive.zipPath(srcPath, destPath)
  .then(function () {
    console.log('Finished!');
  })
  .catch(console.error)
  .done();