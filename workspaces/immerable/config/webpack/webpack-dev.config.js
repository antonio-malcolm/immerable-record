/**
 * Copyrighht 2021 to present, Antonio Malcolm.
 * All rights reserved.
 *
 * This source code file is a part of immerable-record
 * (A.K.A., "ImmerableRecord", "immerableRecord",  "Immerable Record", or "immerable record").
 *
 * This source code is licensed under the BSD 3-Clause license,
 * and is subject to the terms of the BSD 3-Clause license,
 * found in the LICENSE file, in the root directory of this project.
 * If a copy of the BSD 3-Clause license cannot be found,
 * as part of this project, you can obtain one, at:
 * https://opensource.org/licenses/BSD-3-Clause
 */

'use strict';

const Paths = require('../../../../constant/Paths');
const AppInfo = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/AppInfo`);
const CurrentVarValues = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/CurrentVarValues`);

const loaderConfig = require(`${Paths.CONFIG_APP_ROOT_ABSOLUTE}/webpack/loader.config.js`);
const performanceConfig = require(`${Paths.CONFIG_APP_ROOT_ABSOLUTE}/webpack/performance.config.js`);
const resolveConfig = require(`${Paths.CONFIG_APP_ROOT_ABSOLUTE}/webpack/resolve.config.js`);

module.exports = {
  name: AppInfo.CURRENT_WORKSPACE_APP_NAME,
  entry: {
    // Requires absolute paths...
    [AppInfo.CURRENT_WORKSPACE_APP_NAME]: `${Paths.SRC_CURRENT_WORKSPACE_ABSOLUTE}/index.js`
  },
  externals: [ 'immer' ],
  output: {
    // Requires an absolute path...
    path: Paths.BUILD_DIST_ABSOLUTE,
    filename: `${CurrentVarValues.WORKSPACE}.[name].${CurrentVarValues.ENVIRON}.js`,
    chunkFilename: `${CurrentVarValues.WORKSPACE}.[name].${CurrentVarValues.ENVIRON}.[id].chunk.js`,
    library: {
      type: 'umd2'
    }
  },
  mode: 'development',
  // Required for testing framework webpack integration...
  devtool: 'cheap-module-source-map',
  module: {
    rules: [ loaderConfig.rules.jsRule ]
  },
  performance: performanceConfig,
  resolve: {
    extensions: resolveConfig.extensions,
    modules: resolveConfig.modules,
    symlinks: resolveConfig.symlinks
  },
  plugins: [
    ...loaderConfig.plugins
  ]
};
