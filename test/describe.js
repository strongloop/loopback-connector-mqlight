'use strict';
var semver = require('semver');

// Skip all tests on Node 6 because MQLight does not support it
var runningOnNode6 = semver.satisfies(process.version, '^6.x.x');
module.exports = runningOnNode6 ? describe.skip.bind(describe) : describe;
