// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: loopback-connector-mqlight
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

/* eslint-env node, mocha */
process.env.NODE_ENV = 'test';
require('./init.js');
var assert = require('assert');
var loopback = require('loopback');

var config;

before(function() {
  config = global.config;
});

describe('testConnection', function() {
  it('should pass with valid settings', function(done) {
    var ds = loopback.createDataSource(
      {connector: require('../'), settings: config});

    ds.on('connected', function(err) {
      assert(!err, 'Should connect without err.');

      ds.on('disconnected', function() {
        done();
      });

      ds.disconnect();
    });
  });
});
