// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: loopback-connector-mqseries
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

module.exports = require('should');

var DataSource = require('loopback-datasource-juggler').DataSource;

var config = {
  user: process.env.MQ_USERNAME,
  password: process.env.MQ_PASSWORD,
  service: process.env.MQ_CONNECTION_URI,
};

global.config = config;

global.getDataSource = global.getSchema = function(options) {
  var db = new DataSource(require('../'), config);
  return db;
};

global.sinon = require('sinon');
