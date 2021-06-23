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

const colors = require('colors');
const { configure } = require('enzyme');

const Paths = require('../../constant/Paths');
const CurrentVarValues = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/CurrentVarValues`);
const Workspaces = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/Workspaces`);

const CommonUtils = require(`${Paths.UTIL_APP_ROOT_ABSOLUTE}/CommonUtils`);

let Adapter;
let currentWorkspace = CurrentVarValues.WORKSPACE;

if (currentWorkspace === Workspaces.PREACT) {
  Adapter = require('enzyme-adapter-preact-pure');
} else {
  Adapter = require('@wojtekmaj/enzyme-adapter-react-17');
}

if (CommonUtils.isAssignedNotNull(Adapter.default)) {
  Adapter = Adapter.default;
}

currentWorkspace = CommonUtils.convertFirstStringCharToUpperCase(
    currentWorkspace
  );

if (CommonUtils.isAssignedNotNull(Adapter)) {
  console.log(
    colors.blue.bold(`Using enzyme adapter for: ${currentWorkspace}`)
  );

  configure({
    adapter: new Adapter()
  });
} else {
  console.error(
    colors.red.bold(`ERROR! No enzyme adapter found for: ${currentWorkspace}`)
  );
}
