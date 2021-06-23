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

const fs = require('fs');
const path = require('path');

const colors = require('colors');

const Paths = require('../../constant/Paths');
const CurrentVarValues = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/CurrentVarValues`);
const FileTypes = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/FileTypes`);

const CommonUtils = require(`${Paths.UTIL_APP_ROOT_ABSOLUTE}/CommonUtils`);

let modules = [ Paths.SRC_APP_ROOT_ABSOLUTE ];

// Get /src directory from the current workspace, if one exists...
if (
  fs.existsSync(Paths.SRC_CURRENT_WORKSPACE_ABSOLUTE)
  && fs.statSync(Paths.SRC_CURRENT_WORKSPACE_ABSOLUTE).isDirectory()
) {
  console.log(
    colors.blue(
      `resolve.config.js: Adding /${Paths.SRC_RELATIVE} directory, for workspace: ${CurrentVarValues.WORKSPACE}.`
    )
  );

  modules.push(Paths.SRC_CURRENT_WORKSPACE_ABSOLUTE);
}

if (CommonUtils.isNonEmptyString(process.env.NODE_PATH)) {
  const omissions = [ 'babel-watch' ];

  process.env.NODE_PATH.split(path.delimiter).forEach(function(modulePath) {

    // Filtering, to keep things tidy, for maintenance and debugging...
    // This also isolates module paths to only those within the project.

    if (modulePath.startsWith(Paths.NODE_MODULES_APP_ROOT_ABSOLUTE)
      || modulePath.startsWith(Paths.NODE_MODULES_CURRENT_WORKSPACE_ABSOLUTE)
    ) {
      // Additional filtering...
      omissions.forEach(function(omission) {
        if (!modulePath.includes(omission)) {
          modules.push(modulePath);
        }
      });
    }
  });
} else {
  modules.push(Paths.NODE_MODULES_APP_ROOT_ABSOLUTE);
  modules.push(Paths.NODE_MODULES_CURRENT_WORKSPACE_ABSOLUTE);
}

module.exports = {
  extensions: [
    `.${FileTypes.EXT_JS}`,
    `.${FileTypes.EXT_SCSS}`
  ],
  modules: modules,
  symlinks: false
};
