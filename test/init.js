//// Copyright IBM Corp. 2016. All Rights Reserved.
//// Node module: loopback-connector-mqlight
//// This file is licensed under the Artistic License 2.0.
//// License text available at https://opensource.org/licenses/Artistic-2.0
//
//'use strict';
//
//module.exports = require('should');
//
//var config = {
//  user: process.env.MQ_USERNAME,
//  password: process.env.MQ_PASSWORD,
//  service: process.env.MQ_CONNECTION_URI || 'amqp://localhost:5672',
//};
//// allow disabled username/password authentication
//if (!config.user)
//  delete config.user;
//if (!config.password)
//  delete config.password;
//
//global.config = config;
//
//// global.getDataSource = global.getSchema = function(options) {
////   var db = new DataSource(require('../'), config);
////   return db;
//// };
//
//global.sinon = require('sinon');
