/*global module:false*/
/*jslint node: true */
module.exports = function(grunt) {

  // load tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %> */\n',

    // Task configuration.
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: false,
        boss: true,
        eqnull: true,
        browser: true,
        laxcomma: true,
        globals: {
          'angular': false,
          'console': false,
          'module': false,
          'require': false,
          'process': false,
          'describe': true,
          'xdescribe': true,
          'beforeEach': true,
          'afterEach': true,
          'it': true,
          'expect': true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: 'lib/**/*.js'
      },
      test: {
        src: 'test/**/*.js'
      }
    },
    jasmine_node: {
      options: {
        forceExit: true,
        match: '.',
        matchall: false,
        extensions: 'js',
        specNameMatcher: 'spec',
        verbose: true,
        jUnit: {
          report: true,
          savePath: "./build/reports/jasmine/",
          useDotNotation: true,
          consolidate: true
        }
      },
      all: ['test/']
    },


    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      "jshint": {
        files: ['lib/**/*.js', 'test/**/*.js'],
        tasks: ['jshint:lib', 'jshint:test']
      },
      "jasmine_node": {
        files: ['lib/**/*.js', 'test/**/*.js'],
        tasks: ['jasmine_node']
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint', 'jasmine_node']);



};
