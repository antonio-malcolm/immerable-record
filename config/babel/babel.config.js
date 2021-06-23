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

const CurrentVarValues = require('../../constant/CurrentVarValues');
const Environs = require('../../constant/Environs');
const Workspaces = require('../../constant/Workspaces');

const supportedBrowsers = require('../supported-browsers.js');

const plugins = [
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-proposal-private-methods',
  '@babel/plugin-proposal-throw-expressions',
  '@babel/plugin-syntax-dynamic-import',
  '@babel/plugin-transform-modules-commonjs',
  '@babel/plugin-transform-runtime',
  [
    '@babel/plugin-proposal-decorators',
    { decoratorsBeforeExport: true }
  ]
];

const presetEnvConfig = {
  useBuiltIns: 'usage',
  corejs: {
    version: 3,
    proposals: true
  },
  modules: 'amd',
  targets: {
    browsers: supportedBrowsers
  }
};

if (CurrentVarValues.WORKSPACE !== Workspaces.IMMERABLE) {
  if (CurrentVarValues.ENVRION === Environs.DEV) {
    plugins.push(
      '@babel/plugin-transform-react-jsx-source'
    );
  }
  
  if (CurrentVarValues.ENVRION === Environs.PROD_DEV) {
    plugins.push(
      '@babel/plugin-transform-react-jsx-source'
    );
  }
}

module.exports = {
  exclude: [
    new RegExp(
      /[\\/]node_modules[\\/](?!()[\\/])/
    )
  ],

  presets: [
    [
      '@babel/preset-env',
      presetEnvConfig
    ],
    '@babel/preset-react'
  ],

  plugins: plugins
}
