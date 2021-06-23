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

const child_process = require('child_process');

const Paths = require('../../constant/Paths');
const AppInfo = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/AppInfo`);
const Environs = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/Environs`);
const Workspaces = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/Workspaces`);

const CommonUtils = require(`${Paths.UTIL_APP_ROOT_ABSOLUTE}/CommonUtils`);

const CleanTaskScopes = require('../constant/CleanTaskScopes');
const TaskMessages = require('../constant/TaskMessages');
const Tasks = require('../constant/Tasks');

const TaskWorkerException = require('./TaskWorkerException');

const build = function(workspace, environ) {
  console.log(`Running task: ${Tasks.BUILD}...`);

  let cmd = `cd workspaces/${workspace} && pnpm run build:${environ}`;

  console.log(`Executing generated command: ${cmd}`);

  try {
    child_process.execSync(
      cmd,
      { stdio: 'inherit' }
    );
  
    console.log(
      TaskMessages.preset.BUILD_STATUS_SUCCESS
    );
  } catch (err) {
    throw new TaskWorkerException(
      TaskMessages.templated.STATUS_ERROR(
        AppInfo.APP_NAME,
        Tasks.BUILD,
        `${err.name}: ${err.message}`
      ),
      Tasks.BUILD
    );
  }
};

const clean = function(workspace, cleanTaskScope) {
  console.log(`Running task: ${Tasks.CLEAN}...`);

  let cmd;
  
  if (CommonUtils.isNonEmptyString(workspace)) {
    cmd = `cd workspaces/${workspace} && pnpm run clean:${cleanTaskScope}`;
  } else if (cleanTaskScope === CleanTaskScopes.TEST) {
    cmd = `rimraf ${Paths.TEST_OUTPUT_RELATIVE}`;
  } else {
    // If no workspace is provided, we are cleaning ALL TEH THINGZ...
    for (let WORKSPACE in Workspaces) {
      cmd = `${cmd ? `${cmd} && ` : ''}cd workspaces/${Workspaces[WORKSPACE]} && pnpm run clean:${cleanTaskScope} && cd .. && cd ..`;
    }

    // Parent is cleaned LAST, due to use of tool: rimraf...
    switch (cleanTaskScope) {
      case CleanTaskScopes.ALL:
        cmd = ` ${cmd} && rimraf ${Paths.TEST_OUTPUT_RELATIVE} && rimraf ${Paths.TEST_CACHE_RELATIVE} && rimraf npm-debug.log`;
        cmd = ` ${cmd} && rimraf pnpm-debug.log && rimraf .pnpm-debug.log && rimraf ${Paths.NODE_MODULES_RELATIVE}`;
        break;
        
      case CleanTaskScopes.DEPENDENCIES:
        cmd = ` ${cmd} && rimraf npm-debug.log && rimraf pnpm-debug.log && rimraf .pnpm-debug.log && rimraf ${Paths.NODE_MODULES_RELATIVE}`;
        break;
        
      case CleanTaskScopes.DEPENDENCY_LOCKS:
        cmd = ` ${cmd} && rimraf package-lock.json && rimraf pnpm-lock.yaml`;
        break;
        
      case CleanTaskScopes.TEST:
        cmd = ` ${cmd} && rimraf ${Paths.TEST_OUTPUT_RELATIVE} && rimraf ${Paths.TEST_CACHE_RELATIVE}`;
        break;
    }
  }

  console.log(`Executing generated command: ${cmd}`);
  
  try {
    child_process.execSync(
      cmd,
      { stdio: 'inherit' }
    );

    console.log(
      TaskMessages.preset.CLEAN_STATUS_SUCCESS
    );
  } catch (err) {
    throw new TaskWorkerException(
      TaskMessages.templated.STATUS_ERROR(
        AppInfo.APP_NAME,
        Tasks.CLEAN,
        `${err.name}: ${err.message}`
      ),
      Tasks.CLEAN
    );
  }
};

const lint = function(workspace, shouldDebug) {
  if (shouldDebug !== true) {
    shouldDebug = false;
  }

  console.log(`Running task: ${Tasks.LINT}...`);

  let cmd = `cd workspaces/${workspace} && pnpm run lint`;

  if (shouldDebug) {
    cmd = `${cmd}:debug`;
  }

  console.log(`Executing generated command: ${cmd}`);

  try {
    child_process.execSync(
      cmd,
      { stdio: 'inherit' }
    );
  
    console.log(
      TaskMessages.preset.LINT_STATUS_SUCCESS
    );
  } catch (err) {
    throw new TaskWorkerException(
      TaskMessages.templated.STATUS_ERROR(
        AppInfo.APP_NAME,
        Tasks.LINT,
        `${err.name}: ${err.message}`
      ),
      Tasks.LINT
    );
  }
};

const start = function(
  workspace,
  environ,
  shouldHotReload,
  shouldNetwork
) {
  if (shouldHotReload !== true) {
    shouldHotReload = false;
  }

  if (shouldNetwork !== true) {
    shouldNetwork = false;
  }

  console.log(`Running task: ${Tasks.START}...`);

  let cmd = `cd workspaces/${workspace} && pnpm run start`;

  if (CommonUtils.isNonEmptyString(environ)) {
    cmd = `${cmd}:${environ}`;

    if ((environ === Environs.DEV) || (environ === Environs.PROD_DEV)) {
      // Support page hot-reloading ONLY on dev and prod-dev...
      cmd = `${cmd}${!shouldHotReload ? ':no-reload' : ''}`;
    }
  }

  if (shouldNetwork) {
    cmd = `${cmd}:network`
  }

  console.log(`Executing generated command: ${cmd}`);    

  try {
    child_process.execSync(
      cmd,
      { stdio: 'inherit' }
    );

    console.log(
      TaskMessages.preset.START_STATUS_SUCCESS
    );
  } catch (err) {
    throw new TaskWorkerException(
      TaskMessages.templated.STATUS_ERROR(
        AppInfo.APP_NAME,
        Tasks.START,
        `${err.name}: ${err.message}`
      ),
      Tasks.START
    );
  }
};

const update = function(workspace) {
  console.log(`Running task: ${Tasks.UPDATE}...`);

  let cmd = `pnpm install`;

  if (CommonUtils.isNonEmptyString(workspace)) {
    cmd = `${cmd} && cd workspaces/${workspace} && ${cmd}`;
  }

  console.log(`Executing generated command: ${cmd}`);

  try {
    child_process.execSync(
      cmd,
      { stdio: 'inherit' }
    );

    console.log(
      TaskMessages.preset.UPDATE_STATUS_SUCCESS
    );
  } catch (err) {
    throw new TaskWorkerException(
      TaskMessages.templated.STATUS_ERROR(
        AppInfo.APP_NAME,
        Tasks.UPDATE,
        `${err.name}: ${err.message}`
      ),
      Tasks.UPDATE
    );
  }
};

module.exports = Object.freeze({
  build,
  clean,
  lint,
  start,
  update
});
