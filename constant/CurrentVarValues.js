/**
 * Copyrighht 2021 to present, Antonio Malcolm.
 * All rights reserved.
 *
 * This source code file is a part of protoreaction (A.K.A., "protoReaction").
 *
 * This source code is licensed under the BSD 3-Clause license,
 * and is subject to the terms of the BSD 3-Clause license,
 * found in the LICENSE file, in the root directory of this project.
 * If a copy of the BSD 3-Clause license cannot be found,
 * as part of this project, you can obtain one, at:
 * https://opensource.org/licenses/BSD-3-Clause
 */

'use strict';

const Environs = require('./Environs');
const TestTypes = require('./TestTypes');
const VarNames = require('./VarNames');
const Workspaces = require('./Workspaces');

let APP_NAME = process.env[VarNames.APP_NAME];

let ENVIRON = process.env[VarNames.ENVIRON];

if (!Environs.hasOwnProperty(
  String(ENVIRON).toUpperCase().replace(/-/g, '_')
)) {
  ENVIRON = Environs.DEV;
}

let SERVER_SHOULD_HOT_RELOAD = String(
    process.env[VarNames.SERVER_SHOULD_HOT_RELOAD]
  );

if (SERVER_SHOULD_HOT_RELOAD === 'true') {
  SERVER_SHOULD_HOT_RELOAD = true;
} else {
  if (SERVER_SHOULD_HOT_RELOAD !== true) {
    SERVER_SHOULD_HOT_RELOAD = false;
  }
}

let SERVER_SHOULD_NETWORK = String(
    process.env[VarNames.SERVER_SHOULD_NETWORK]
  );

if (SERVER_SHOULD_NETWORK === 'true') {
  SERVER_SHOULD_NETWORK = true;
} else {
  if (SERVER_SHOULD_NETWORK !== true) {
    SERVER_SHOULD_NETWORK = false;
  }
}

let SHOULD_CONFINE_TO_CURRENT_WORKSPACE = String(
    process.env[VarNames.SHOULD_CONFINE_TO_CURRENT_WORKSPACE]
  );

if (SHOULD_CONFINE_TO_CURRENT_WORKSPACE === 'true') {
  SHOULD_CONFINE_TO_CURRENT_WORKSPACE = true;
} else {
  if (SHOULD_CONFINE_TO_CURRENT_WORKSPACE !== true) {
    SHOULD_CONFINE_TO_CURRENT_WORKSPACE = false;
  }
}

let SHOULD_GENERATE_BUNDLE_METRICS_VIEW = String(
    process.env[VarNames.SHOULD_GENERATE_BUNDLE_METRICS_VIEW]
  );

if (SHOULD_GENERATE_BUNDLE_METRICS_VIEW === 'true') {
  SHOULD_GENERATE_BUNDLE_METRICS_VIEW = true;
} else {
  if (SHOULD_GENERATE_BUNDLE_METRICS_VIEW !== true) {
    SHOULD_GENERATE_BUNDLE_METRICS_VIEW = false;
  }
}

let TEST_TYPE = process.env[VarNames.TEST_TYPE];

if (!TestTypes.hasOwnProperty(
  String(TEST_TYPE).toUpperCase()
)) {
  TEST_TYPE = undefined;
}

let WORKSPACE = process.env[VarNames.WORKSPACE];

if (!Workspaces.hasOwnProperty(
  String(WORKSPACE).toUpperCase()
)) {
  WORKSPACE = Workspaces.REACT;
}

module.exports = Object.freeze({
  APP_NAME,
  ENVIRON,
  SERVER_SHOULD_HOT_RELOAD,
  SERVER_SHOULD_NETWORK,
  SHOULD_CONFINE_TO_CURRENT_WORKSPACE,
  SHOULD_GENERATE_BUNDLE_METRICS_VIEW,
  TEST_TYPE,
  WORKSPACE
});
