// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: loopback-connector-mqlight
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

'use strict';
var connector = require('../..');
var DataSource = require('loopback-datasource-juggler').DataSource;
var describe = require('../describe');

describe('connection', function() {
  it('connects with valid settings', function(done) {
    var ds = new DataSource(connector, config);
    ds.on('started', function() {
      expect(ds.connected).to.be.true();
      ds.disconnect();
      done();
    });
  });
});
