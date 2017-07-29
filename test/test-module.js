module.exports = {
  fileList: 'dir_1/ dir_2/dir_1/ dir_2/file_1.js dir_2/file_2.js file_1.js file_2.js',

  ListComparer: function (expectedList) {

    this.expectedList = expectedList;

    this.compareTo = function (result) {
      var errors = [], expectedList = this.expectedList;
      expectedList.forEach(function (item) {
        if (result.indexOf(item) < 0) {
          errors.push(item + ' missing');
        }
      });
      result.forEach(function (item) {
        if (expectedList.indexOf(item) < 0) {
          errors.push(item + ' shouldn\'t be there');
        }
      });
      expect(errors.join(' -- ')).toBe('');
    };
  }

};