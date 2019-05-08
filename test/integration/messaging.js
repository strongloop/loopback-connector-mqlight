// Copyright IBM Corp. 2016,2017. All Rights Reserved.
// Node module: loopback-connector-mqlight
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

'use strict';
var connector = require('../..');
var DataSource = require('loopback-datasource-juggler').DataSource;
var describe = require('../describe');

var timeout = 5000;

describe('messaging', function() {
  var sender, receiver, senderModel, receiverModel;
  beforeEach(setupSender);
  beforeEach(setupReceiver);
  afterEach(teardownSender);
  afterEach(teardownReceiver);

  it('creates a message', function(done) {
    senderModel.create({topic: 'public', message: 'A create message'},
    function(err) {
      if (err) return done(err);
      receiverModel.find(0, function(msg) {
        expect(msg).to.equal('A create message');
        done();
      });
    });
  });

  it('updates a message', function(done) {
    setTimeout(function() {
      senderModel.update({topic: 'public', message: 'An update message'},
        function(err) {
          if (err) return done(err);
          receiverModel.find(0, function(msg) {
            expect(msg).to.equal('An update message');
            done();
          });
        });
    }, timeout);
  });

  it('deletes a message', function(done) {
    setTimeout(function() {
      senderModel.delete({topic: 'public', message: 'A delete message'},
        function(err) {
          if (err) return done(err);
          receiverModel.find(0, function(msg) {
            expect(msg).to.equal('A delete message');
            done();
          });
        });
    }, timeout);
  });

  function setupSender(done) {
    sender = new DataSource(connector, config);
    sender.on('started', function() {
      senderModel = sender.createModel('senderModel', {});
      done();
    });
  }
  function setupReceiver(done) {
    receiver = new DataSource(connector, config);
    receiver.on('started', function() {
      receiverModel = receiver.createModel('receiverModel', {});
      receiverModel.subscribe('public');
      done();
    });
  }
  function teardownSender() {
    if (sender.connected)
      sender.disconnect();
  }
  function teardownReceiver() {
    if (receiver.connected)
      receiver.disconnect();
  }
});
