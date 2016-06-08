// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: loopback-connector-mqlight
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

/* eslint-env node, mocha */

process.env.NODE_ENV = 'test';
require('./init.js');
var loopback = require('loopback');
var assert = require('assert');

var config;
var sender;
var receiver;

var receiverModel;
var senderModel;

before(function(done) {
  config = global.config;

  sender = loopback.createDataSource('mqlight',
                {connector: require('../'), settings: config});

  sender.on('connected', function(err) {
    if (err) {
      return done(new Error('Failed to connect to MQ Service to send'));
    }

    receiver = loopback.createDataSource('mqlight',
                    {connector: require('../'), settings: config});

    receiver.on('connected', function(err) {
      if (err) {
        return done(new Error('Failed to connect to MQ Service to receive'));
      }

      done();
    });
  });
});

after(function(done) {
  receiver.disconnect();
  done();
});

describe('testMessages', function() {
  before(function(done) {
    receiverModel = receiver.createModel('receiverModel', {});

    receiverModel.subscribe('public', function(error) {
      if (error) {
        return done(error);
      }

      done();
    });

    senderModel = sender.createModel('senderModel', {});
  });

  after(function(done) {
    receiverModel.unsubscribe('public');
    sender.disconnect();
    done();
  });

  it('test create function', function(done) {
    receiverModel.find(0, function(data) {
      assert.equal(data, 'Create Message');
      done();
    });

    senderModel.create({topic: 'public', message: 'Create Message'},
      function(error) {
        assert(!error, 'Should not error on sending a message');
        done(error);
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
