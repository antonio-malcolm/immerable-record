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

const CurrentVarValues = require('./CurrentVarValues');
const FileSystemUtils = require('../util/FileSystemUtils');

const currentWorkspace = CurrentVarValues.WORKSPACE;
const packageJsonFileName = 'package.json';
const packageJsonCaret = '^';

const rootPackageJsonFilePath = FileSystemUtils.findFilePathsByNameInDirectoryTree(
    packageJsonFileName,
     __dirname,
    2,
    1
  )[0];

const currentWorkspacePackageJsonFilePath = rootPackageJsonFilePath.replace(
    packageJsonFileName,
    `workspaces/${currentWorkspace}/${packageJsonFileName}`
  );

const rootPackageJson = require(rootPackageJsonFilePath);
const currentWorkspacePackageJson = require(currentWorkspacePackageJsonFilePath);

const APP_NAME = rootPackageJson.name;
const APP_PACKAGE_JSON_LOCATION = rootPackageJsonFilePath;
const CURRENT_WORKSPACE_APP_NAME = currentWorkspacePackageJson.name;
const NODE_VERSION = rootPackageJson.engines.node.replace(packageJsonCaret, '');
const NPM_VERSION = rootPackageJson.engines.npm.replace(packageJsonCaret, '');
const PNPM_VERSION = rootPackageJson.engines.pnpm.replace(packageJsonCaret, '');

module.exports = Object.freeze({
  APP_NAME,
  APP_PACKAGE_JSON_LOCATION,
  CURRENT_WORKSPACE_APP_NAME,
  NODE_VERSION,
  NPM_VERSION,
  PNPM_VERSION
});
