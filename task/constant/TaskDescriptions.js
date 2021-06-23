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

const Tasks = require('./Tasks.js');

const TaskDescriptions = Object.freeze({
  [Tasks.BUILD]: 'Performs project build, transpilation, and minification + uglification',
  [Tasks.CLEAN]: 'Clears files and directories for the project build caches, build distribution outputs and dependencies',
  [Tasks.DEPLOY]: 'deploy',
  [Tasks.LIST]: 'Displays this list of available commands and descriptions',
  [Tasks.START]: 'Starts the built-in development server',
  [Tasks.UPDATE]: 'Installs dependencies for the project, which are listed in package.json'
});

module.exports = TaskDescriptions;
