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

const Paths = require('../../../../constant/Paths');
const rootBabelConfig = require(`${Paths.CONFIG_APP_ROOT_ABSOLUTE}/babel/babel.config.js`);

module.exports = {
  presets: rootBabelConfig.presets,
  plugins: [
    ...rootBabelConfig.plugins,
    [
      '@babel/plugin-transform-react-jsx',
      {
        runtime: 'automatic',
        importSource: 'preact'
      }
    ]
  ],
  exclude: [
    ...rootBabelConfig.exclude,
    new RegExp(
      /[\\/]node_modules[\\/](?!()[\\/])/
    )
  ]
}
