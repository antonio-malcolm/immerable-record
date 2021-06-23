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

const Paths = require(`../../constant/Paths`);
const AppInfo = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/AppInfo`);
const CurrentVarValues = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/CurrentVarValues`);
const Environs = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/Environs`);

const CommonUtils = require(`${Paths.UTIL_APP_ROOT_ABSOLUTE}/CommonUtils`);

let title = AppInfo.APP_NAME;

if (CommonUtils.isNonEmptyString(AppInfo.CURRENT_WORKSPACE_APP_NAME)) {
  title = AppInfo.CURRENT_WORKSPACE_APP_NAME;
}

module.exports = {
  inject: true,
  minify: {
    minifyCSS: (CurrentVarValues.ENVIRON === Environs.PROD),
    minifyJS: (CurrentVarValues.ENVIRON === Environs.PROD),
    minifyURLs: (CurrentVarValues.ENVIRON === Environs.PROD),
    collapseWhitespace: (CurrentVarValues.ENVIRON === Environs.PROD),
    removeComments: (CurrentVarValues.ENVIRON === Environs.PROD)
  },
  template: `${Paths.TEMPLATE_HTML_APP_ROOT_ABSOLUTE}/index.html`,
  title
};
