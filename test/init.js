// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: loopback-connector-mqlight
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

'use strict';

// assertion lib
var chai = require('chai');
var dirtyChai = require('dirty-chai');
chai.use(dirtyChai);
global.expect = chai.expect;

// database configs
var config = {
  user: process.env.MQLIGHT_USER,
  password: process.env.MQLIGHT_PASSWORD,
  host: process.env.MQLIGHT_HOST,
  port: process.env.MQLIGHT_PORT,
  service: process.env.MQLIGHT_CONNECTION_URI || 'amqp://' + process.env.MQLIGHT_USER + ':' + process.env.MQLIGHT_PASSWORD + '@' + 'localhost:5672',
};
// allow disabled username/password authentication
if (!config.user)
  delete config.user;
if (!config.password)
  delete config.password;
global.config = config;
