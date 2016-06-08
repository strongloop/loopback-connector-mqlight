// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: loopback-connector-mqlight
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

// Require the underlying MQLight driver
var mqlight = require('mqlight');

// Require the debug module with a pattern of loopback:connector:connectorName
var debug = require('debug')('loopback:connector:mqlight');

// Require events as this module will emit events on reception of messages
// from the Message Queue.
var EventEmitter = require('events');

// Require util so we can inherit the EventEmitter class
var util = require('util');

// Require MQLightResource model module
var MQLightResource = require('./mqlight-model.js');

/**
 * Initialize the  connector against the given data source
 *
 * @param {DataSource} dataSource The loopback-datasource-juggler dataSource
 * @param {Function} [callback] The callback function
 */
exports.initialize = function initializeDataSource(dataSource, callback) {
  // var self = this;
  if (!dataSource.settings) {
    return callback(new Error('Invalid settings object'));
  }

  var settings = dataSource.settings;
  var connector = new MQLightConnector(settings);

  dataSource.connector = connector;
  dataSource.connector.dataSource = dataSource;

  connector.connect();

  callback();
};

function MQLightConnector(config) {
  this.settings = config.settings;

  if (debug.enabled) {
    debug('Settings: %j', config.settings);
  }

  EventEmitter.call(this);

  this._models = {};
  this._resources = {};

  this.DataAccessObject = function() {
  };
};

util.inherits(MQLightConnector, EventEmitter);

MQLightConnector.prototype.setupDataAccessObject = function() {
  var self = this;
  this.DataAccessObject.create = MQLightResource.prototype.create.bind(self);
  this.DataAccessObject.update = MQLightResource.prototype.create.bind(self);
  this.DataAccessObject.delete = MQLightResource.prototype.create.bind(self);
  this.DataAccessObject.subscribe =
    MQLightResource.prototype.subscribe.bind(self);
  this.DataAccessObject.unsubscribe =
    MQLightResource.prototype.unsubscribe.bind(self);
  this.DataAccessObject.find = MQLightResource.prototype.find.bind(self);

  this.dataSource.DataAccessObject = this.DataAccessObject;
  for (var model in this._models) {
    if (debug.enabled) {
      debug('Mixing methods into : %s', model);
    }
    this.dataSource.mixin(this._models[model].model);
  }
  return this.DataAccessObject;
};

MQLightConnector.prototype.connect = function(cb) {
  var self = this;

  if (self.client) {
    process.nextTick(function() {
      cb && cb(null, self.client);
    });
    return;
  }

  if (debug.enabled) {
    debug('Connecting to MQ service: %s', self.settings.service);
  }

  mqlight.createClient(self.settings, function(err, client) {
    if (err) {
      return cb && cb(err);
    }

    client.connector = self;
    self.client = client;
    self.setupDataAccessObject();

    self.dataSource.connected = true;
    self.dataSource.emit('connected');
    self.dataSource.emit('started');

    return cb && cb(null, self.client);
  });
};

MQLightConnector.prototype.disconnect = function(cb) {
  var self = this;
  self.client.stop(function() {
    self.dataSource.connected = false;
    self.dataSource.emit('disconnected');
  });
};

MQLightConnector.prototype.ping = function(cb) {
  var self = this;
  self.connect(function(err) {
    if (err) {
      return cb && cb(err);
    }

    if (self.client.service) {
      return cb();
    }

    return cb(false);
  });
};

MQLightConnector.prototype.define = function defineModel(definition) {
  var m = definition.model.modelName;

  this._models[m] = definition;
  this._resources[m] = new MQLightResource(definition.settings.resourceName ||
                                           definition.model.pluralModelName);
  this._resources[m].connector = this;
};

MQLightConnector.prototype.start = function(cb) {
  var self = this;
  self.client.start(cb);
};

MQLightConnector.prototype.stop = function(cb) {
  var self = this;
  self.client.stop(cb);
};
