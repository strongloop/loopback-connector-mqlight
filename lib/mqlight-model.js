// Copyright IBM Corp. 2013,2016. All Rights Reserved.
// Node module: loopback-connector-rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

var debug = require('debug')('loopback:connector:mqlight');

module.exports = MQLightResource;

// This module contains the Model specific logic for the MQLight
// connector.
function MQLightResource(modelName) {
  if (debug.enabled) {
    debug('Creating Model: %s', modelName);
  }

  if (!this instanceof MQLightResource) {
    return new MQLightResource(modelName);
  }
};

MQLightResource.prototype.subscribe = function(topic, share, options, cb) {
  if (debug.enabled) {
    debug('Subscribing to: %s', topic);
  }

  var self = this;
  self._topic = topic;

  if (typeof share === 'function') {
    cb = share;
    share = undefined;
  } else if (typeof options === 'function') {
    cb = options;
    options = undefined;
  }

  self.client.subscribe(topic, share, options, function(error) {
    if (error) {
      return cb && cb(error);
    };

    if (debug.enabled) {
      debug('Subscribed to: %s', topic);
    }

    return cb && cb();
  });
};

MQLightResource.prototype.unsubscribe = function(topic, share, options, cb) {
  if (debug.enabled) {
    debug('Unsubscribing from: %s', topic);
  }

  var self = this;
  self._topic = null;

  self.client.unsubscribe(topic, share, options, cb);

  if (debug.enabled) {
    debug('Unsubscribed from: %s', topic);
  }
};

MQLightResource.prototype.create = function(data, cb) {
  if (debug.enabled) {
    debug('Creating message: %j', data);
  }

  var self = this;

  self.client.send(data.topic, data.message, self._options, cb);
};

MQLightResource.prototype.update = function(data, cb) {
  if (debug.enabled) {
    debug('Updating message: %j', data);
  }

  var self = this;
  self.client.send(data.topic, data.message, self._options, cb);
};

MQLightResource.prototype.find = function(id, cb) {
  if (debug.enabled) {
    debug('Get message from %s', this._topic);
  }

  var self = this;
  self.client.on('message', function(data) {
    cb(data);
  });
};

// For now findAll just points to find.  A case can be made for this function
// to never exit but instead continuously call the callback with new messages
// that come in from the message queue.
MQLightResource.prototype.findAll = function(cb) {
  var self = this;
  self.find(0, cb);
};
