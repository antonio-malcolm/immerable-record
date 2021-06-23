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

const APP_NAME_SUBSTRING = 'application';

const templated = Object.freeze({
  STATUS_SUCCESS: (subject, task) => `SUCCESS! ${subject} task: ${task} completed successfully!`,
  STATUS_ERROR: (subject, task, message) => `FAILURE! ${subject} task: ${task} ended with an error!
    Error: ${message}`
});

const preset = Object.freeze({
  BUILD_DESC: `Build the ${APP_NAME_SUBSTRING}.`,
  BUILD_STATUS_IN_PROCESS: `Building the ${APP_NAME_SUBSTRING}...`,
  BUILD_STATUS_SUCCESS: templated.STATUS_SUCCESS(APP_NAME_SUBSTRING, 'build'),
  
  CLEAN_DESC: `Clean the ${APP_NAME_SUBSTRING} build directory, dependencies, and dependency lock files.`,
  CLEAN_STATUS_IN_PROCESS: `Cleaning the ${APP_NAME_SUBSTRING}...`,
  CLEAN_STATUS_SUCCESS: templated.STATUS_SUCCESS(APP_NAME_SUBSTRING, 'clean'),
  
  LINT_DESC: `Lint the contents of the ${APP_NAME_SUBSTRING} src directory.`,
  LINT_STATUS_IN_PROCESS: `Linting the contents of the  ${APP_NAME_SUBSTRING} src directory...`,
  LINT_STATUS_SUCCESS: templated.STATUS_SUCCESS(APP_NAME_SUBSTRING, 'lint'),

  START_SERVER_DESC: `Start the ${APP_NAME_SUBSTRING} dev server.`,
  START_SERVER_STATUS_IN_PROCESS: `Starting the ${APP_NAME_SUBSTRING} dev server...`,
  START_SERVER_STATUS_SUCCESS: templated.STATUS_SUCCESS(APP_NAME_SUBSTRING, 'start'),

  UPDATE_DESC: `Update the dependencies for the ${APP_NAME_SUBSTRING}`,
  UPDATE_STATUS_IN_PROCESS: `Updating dependencies for the ${APP_NAME_SUBSTRING}...`,
  UPDATE_STATUS_SUCCESS: templated.STATUS_SUCCESS(APP_NAME_SUBSTRING, 'update')
});

module.exports = Object.freeze({
  APP_NAME_SUBSTRING,
  preset,
  templated
});
