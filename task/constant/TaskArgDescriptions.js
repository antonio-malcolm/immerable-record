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

const VarNames = require('../../constant/VarNames');

const Tasks = require('./Tasks.js');
const TaskVarNames = require('./TaskVarNames.js');

const TaskArgDescriptions = Object.freeze({
  [Tasks.BUILD]: {
    [`--${VarNames.WORKSPACE}`]: 'Limits build to the specified workspace',
    [`--${VarNames.ENVIRON}`]: 'Limits build to the specified environment'
  },
  [Tasks.CLEAN]: {
    [`--${VarNames.WORKSPACE}`]: 'Limits clean to the specified workspace',
    [`--${TaskVarNames.CLEAN_SCOPE}`]: 'Clear files and directories for the specified scope'
  },
  [Tasks.START]: {
    [`--${VarNames.WORKSPACE}`]: 'Serve a build from the specified workspace',
    [`--${VarNames.ENVIRON}`]: 'Serve a build for the specified environment',
    [`--${VarNames.SERVER_SHOULD_HOT_RELOAD}`]: 'Whether or not automated rebuild and reload should occur, upon code change',
    [`--${VarNames.SERVER_SHOULD_NETWORK}`]: 'Whether or not the build instance served should be available over a network'
  },
  [Tasks.UPDATE]: {
    [`--${VarNames.WORKSPACE}`]: 'Limits update to the specified workspace',
  }
});

module.exports = TaskArgDescriptions;
