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

const TerserPlugin = require('terser-webpack-plugin');

const Paths = require('../../constant/Paths');

module.exports = {
  minimize: true,
  minimizer: [
    new TerserPlugin({
      test: /\.js(\?.*)?$/i,
      parallel: true,
      terserOptions: {
        keep_fnames: /./,
        mangle: true
      }
    })
  ],
  runtimeChunk: 'single',
  splitChunks: {
    cacheGroups: {
      dependencies: {
        test: Paths.REGEX_DIRECTORY_NAME_NODE_MODULES,
        chunks: 'all',
        enforce: true,
        name(module) {
          let pkgName = module.context.match(
            Paths.REGEX_DIRECTORY_NAME_NODE_MODULES_PKG
          )[1].replace('@', '');

          return `dependency.${pkgName}`;
        }
      },
      styles: {
        test: /\.s?css$/,
        chunks: 'all',
        name: 'styles',
        enforce: true
      }
    }
  }
};
