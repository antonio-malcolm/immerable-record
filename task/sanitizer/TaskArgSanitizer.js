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

const Paths = require('../../constant/Paths');
const AppInfo = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/AppInfo`);
const Environs = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/Environs`);
const Workspaces = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/Workspaces`);

const CommonUtils = require(`${Paths.UTIL_APP_ROOT_ABSOLUTE}/CommonUtils`);

const CleanTaskScopes = require('../constant/CleanTaskScopes');
const TaskMessages = require('../constant/TaskMessages');

const TaskArgSanitizerException = require('./TaskArgSanitizerException');

const validateArgDefinedNonEmpty = function(
  arg,
  argName,
  callerName = 'validateArgDefinedNonEmpty'
) { 
  if (!CommonUtils.isNonEmptyString(callerName)) {
    callerName = 'validateArgDefinedNonEmpty';
  }

  if (!CommonUtils.isNonEmptyString(argName)) {
    argName = 'argument';
  }

 if (!CommonUtils.isNonEmptyString(arg, true)) {
    throw new TaskArgSanitizerException(
      `No ${argName} provided, for argument sanitation!`,
      callerName
    );
  }
};

const sanitizeCleanTaskScopeArg = function(cleanTaskScopeArg, taskName) {
  validateArgDefinedNonEmpty(
    taskName,
    'task name',
    'santizeCleanTaskArg'
  );

  if (!CommonUtils.isNonEmptyString(cleanTaskScopeArg, true)) {
    console.log(
      `No clean task arg provided, for task "${taskName}" - defaulting, to "${CleanTaskScopes.ALL}".`
    );

    return CleanTaskScopes.ALL;
  }
  
  const cleanTaskScopeKey = cleanTaskScopeArg.toUpperCase().replace(/-/g, '_');
  
  if (!CleanTaskScopes.hasOwnProperty(cleanTaskScopeKey)) {
    throw new TaskArgSanitizerException(
      TaskMessages.templated.STATUS_ERROR(
        AppInfo.APP_NAME,
        taskName,
        (
          `No clean scope associated with arg: "${cleanTaskScopeArg}"! `
          + `Options are: ${CommonUtils.convertArrayToCommaDelimitedStringWithAndOr(Object.values(CleanTaskScopes))}.`
        )
      ),
      'santizeCleanTask',
    );
  }

  return CleanTaskScopes[cleanTaskScopeKey];
};

const sanitizeEnvironArg = function(environArg, taskName) {
  validateArgDefinedNonEmpty(
    taskName,
    'task name',
    'sanitizeEnvironArg'
  );

  if (!CommonUtils.isNonEmptyString(environArg)) {
    console.log(
      `No environ arg provided, for task "${taskName}" - defaulting, to "${Environs.DEV}".`
    );

    return Environs.DEV;
  }

  const environKey = environArg.toUpperCase().replace(/-/g, '_');

  if (!Environs.hasOwnProperty(environKey)) {
    throw new TaskArgSanitizerException(
      TaskMessages.templated.STATUS_ERROR(
        AppInfo.APP_NAME,
        taskName,
        (
         `No environ associated with arg: "${environArg}"! `
         + `Options are: ${CommonUtils.convertArrayToCommaDelimitedStringWithAndOr(Object.values(Environs))}.`
        )
      ),
      'sanitizeEnvironment'
    );
  }

  return Environs[environKey];
};

const sanitizeShouldHotReloadArg = function(shouldHotReloadArg, taskName) {
  validateArgDefinedNonEmpty(
    taskName,
    'task name',
    'sanitizeShouldHotReloadArg'
  );

  if (typeof shouldHotReloadArg === 'boolean') {
    return shouldHotReloadArg;
  }

  if (shouldHotReloadArg === 'true') {
    return true;
  }

  console.log(
    `No shouldHotReload arg provided, for task "${taskName}" - defaulting, to false.`
  );

  return false;
};

const sanitizeShouldNetworkArg = function(shouldNetworkArg, taskName) {
  validateArgDefinedNonEmpty(
    taskName,
    'task name',
    'sanitizeShouldNetworkArg'
  );

  if (typeof shouldNetworkArg === 'boolean') {
    return shouldNetworkArg;
  }

  if (shouldNetworkArg === 'true') {
    return true;
  }

  console.log(
    `No shouldNetwork arg provided, for task "${taskName}" - defaulting, to false.`
  );

  return false;
};

const sanitizeWorkspaceArg = function(workspaceArg, taskName) {
  validateArgDefinedNonEmpty(
    taskName,
    'task name',
    'sanitizeWorkspaceArg'
  );

  if (CommonUtils.isNonEmptyString(workspaceArg)) {
    const workspaceKey = workspaceArg.toUpperCase();
  
    if (!Workspaces.hasOwnProperty(workspaceKey)) {
      throw new TaskArgSanitizerException(
        TaskMessages.templated.STATUS_ERROR(
          AppInfo.APP_NAME,
          taskName,
          (
           `No workspace associated with arg: "${workspaceArg}"! `
           + `Options are: ${CommonUtils.convertArrayToCommaDelimitedStringWithAndOr(Object.values(Workspaces))}.`
          )
        ),
        'sanitizeWorkspaceArg'
      );
    }
  
    return Workspaces[workspaceKey];
  }

  return undefined;
};

module.exports = Object.freeze({
  sanitizeCleanTaskScopeArg,
  sanitizeEnvironArg,
  sanitizeShouldHotReloadArg,
  sanitizeShouldNetworkArg,
  sanitizeWorkspaceArg,
  validateArgDefinedNonEmpty
});
