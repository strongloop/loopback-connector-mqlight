// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: loopback-connector-db2
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

// Require the debug module with a pattern of loopback:connector:connectorName
var debug = require('debug')('loopback:connector:mqlight');

// Require events as this module will emit events on reception of messages
// from the Message Queue.
var EventEmitter = require('events');

// Require util so we can inherit the EventEmitter class
// var util = require('util');

module.exports = MQLightConnector;

/**
 * Initialize the  connector against the given data source
 *
 * @param {DataSource} dataSource The loopback-datasource-juggler dataSource
 * @param {Function} [callback] The callback function
 */
exports.initialize = function initializeDataSource(dataSource, callback) {
  // var settings = dataSource.settings || {};
  // // var connector = new MQLight(settings);
  // // dataSource.connector = new MQLight(dataSource.settings);
  // dataSource.connector = this;
  // dataSource.connector.ds = dataSource;

  // connector.mqlight = mqlight;
  // connector.mqlight.connect();

  console.log('<<< CALLED >>>');
};

function MQLightConnector(settings) {
  this.settings = settings;

  var connector = this;

  if (debug.enabled) {
    debug('Settings: %j', settings);
  }

  connector.mqlight = require('mqlight');

  EventEmitter.call(this);

  this._models = {};
};

MQLightConnector.initialize = function(dataSource, callback) {
  dataSource.connector = new MQLightConnector(dataSource.settings);
  callback();
};

MQLightConnector.prototype.DataAccessObject = MQLight;

function MQLight() {
};

// util.inherits(MQLight, EventEmitter);

MQLightConnector.prototype.connect = function(cb) {
  var self = this;

  if (self.mqlight) {
    process.nextTick(function() {
      cb && cb(null, self.mqlight);
    });
    return;
  }

  if (debug.enabled) {
    debug('Connecting to MQ service: %s', self.connectionLookupURI);
  }

  self.client = self.mqlight.createClient(self.settings, function(err) {
    if (err) {
      return cb && cb(err);
    }

    return cb && cb(null, self.client);
  });

  // client.on('message', function(data, delivery) {
  //   var self = this;
  //   if (debug.enabled) {
  //     debug('Message: %s', data);
  //   }

  //   self.emit('message', data);
  // });

  // client.on('started', function() {
  //   console.log('Started');
  // });

  // client.on('stopped', function() {
  //   console.log('Stopped');
  // });

  // client.on('error', function(error) {
  //   var self = this;
  //   console.log(error);
  //   self.stop();
  // });
};

MQLightConnector.prototype.disconnect = function(cb) {
  var self = this;
  self.mqlight.stop(cb);
};

MQLightConnector.prototype.ping = function(cb) {
  var self = this;
  self.connect(function(err) {
    if (err) {
      return cb && cb(err);
    }

    console.log(self.mqlight.service);

    if (self.mqlight.service) {
      return cb();
    }

    return cb(false);
  });
};

MQLight.subscribe = function(topic, share, options, cb) {
};

MQLight.unsubscribe = function(topic, share, options, cb) {
};

MQLight.start = function(cb) {
  var self = this;
  self.mqlight.start(cb);
};

MQLight.stop = function(cb) {
  var self = this;
  self.mqlight.stop(cb);
};

MQLight.prototype.send = function(topic, data, options, cb) {
  var self = this;
  self.mqlight.send(topic, data, options, cb);
};
