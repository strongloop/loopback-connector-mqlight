// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: loopback-connector-mqlight
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

'use strict';
var semver = require('semver');

// Skip all tests on Node 6 because MQLight does not support it
var runningOnNode6 = semver.satisfies(process.version, '^6.x.x');
module.exports = runningOnNode6 ? describe.skip.bind(describe) : describe;
