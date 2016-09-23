// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: loopback-connector-mqlight
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

'use strict';

var describe = require('./describe');

/* eslint-env node, mocha */

process.env.NODE_ENV = 'test';
require('./init.js');
var connector = require('..');
var DataSource = require('loopback-datasource-juggler').DataSource;
var assert = require('assert');

var config, sender, receiver, receiverModel, senderModel;

before(function() {
  config = global.config;

  sender = new DataSource(connector, config);
  receiver = new DataSource(connector, config);
});

after(function() {
  receiver.disconnect();
});

describe('testMessages', function() {
  before(function(done) {
    receiverModel = receiver.createModel('receiverModel', {});
    receiverModel.subscribe('public', function(err) {
      if (err) return done(err);
      done();
    });
    senderModel = sender.createModel('senderModel', {});
  });

  after(function() {
    receiverModel.unsubscribe('public');
    sender.disconnect();
  });

  it('test create function', function(done) {
    senderModel.create({
      topic: 'public',
      message: 'Create Message',
    }, function(err) {
      if (err) return done(err);
      receiverModel.find(0, function(data) {
        assert.equal(data, 'Create Message');
        done();
      });
    });
  });

  it('test update function', function(done) {
    receiverModel.find(0, function(data) {
      assert.equal(data, 'Update Message');
      done();
    });

    senderModel.update({topic: 'public', message: 'Update Message'},
      function(error) {
        assert(!error, 'Should not error on sending a message');
        done(error);
      });
  });

  it('test delete function', function(done) {
    receiverModel.find(0, function(data) {
      assert.equal(data, 'Delete Message');
      done();
    });

    senderModel.delete({topic: 'public', message: 'Delete Message'},
      function(error) {
        assert(!error, 'Should not error on sending a message');
        done(error);
      });
  });
});
