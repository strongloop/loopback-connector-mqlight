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
  user: process.env.MQ_USERNAME,
  password: process.env.MQ_PASSWORD,
  service: process.env.MQ_CONNECTION_URI || 'amqp://localhost:5672',
  host: 'localhost',
  port: '5672',
};

console.error('config:', config);
// allow disabled username/password authentication
if (!config.user)
  delete config.user;
if (!config.password)
  delete config.password;
global.config = config;
