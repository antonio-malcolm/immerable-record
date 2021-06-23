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

const colors = require('colors');

const Paths = require('../../constant/Paths');
const CurrentVarValues = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/CurrentVarValues`);
const Workspaces = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/Workspaces`);

const CommonUtils = require(`${Paths.UTIL_APP_ROOT_ABSOLUTE}/CommonUtils`);
const SimpleBuildTimeException = require(`${Paths.EXCEPTION_APP_ROOT_ABSOLUTE}/SimpleBuildTimeException`);

let babelConfigPathAbsolute = `${Paths.CONFIG_APP_ROOT_ABSOLUTE}/babel/babel.config.js`;
let babelConfig;

// Get babel config from the current workspace, if one exists...
if (
  fs.existsSync(`${Paths.CONFIG_CURRENT_WORKSPACE_ABSOLUTE}/babel/babel.config.js`)
  && fs.statSync(`${Paths.CONFIG_CURRENT_WORKSPACE_ABSOLUTE}/babel/babel.config.js`).isFile()
) {
  babelConfigPathAbsolute = `${Paths.CONFIG_CURRENT_WORKSPACE_ABSOLUTE}/babel/babel.config.js`;

  console.log(
    colors.blue.bold(
      `Configuring @babel/register, with configuration for workspace: ${CurrentVarValues.WORKSPACE}, at path: `
    ) + colors.green(
      babelConfigPathAbsolute
    )
  );
} else {
  console.log(
    colors.blue.bold(
      `Configuring @babel/register, with base configuration, at path: `
    ) + colors.green(
      babelConfigPathAbsolute
    )
  );
}

if (!(fs.existsSync(babelConfigPathAbsolute) && fs.statSync(babelConfigPathAbsolute).isFile())) {
  throw new SimpleBuildTimeException(
      `No babel configuration file found at: ${babelConfigPathAbsolute}`,
      './config/test/babel-register.config.js'
    );
}

try {
  babelConfig = require(babelConfigPathAbsolute);
} catch (err) {
  throw new SimpleBuildTimeException(
      `Could not parse babel configuration file, found at: ${babelConfigPathAbsolute}`,
      './config/test/babel-register.config.js',
      err
    );
}

if (!CommonUtils.isNonEmptyObject(babelConfig)) {
  throw new SimpleBuildTimeException(
      `No babel configuration data, in file, found at: ${babelConfigPathAbsolute}`,
      './config/test/babel-register.config.js'
    );
}

const babelModuleResolverRoot = [
    Paths.SRC_APP_ROOT_ABSOLUTE,
    Paths.TEST_SPEC_ABSOLUTE
  ];

// Get /src directory from the workspaces, if they exist...
if (CurrentVarValues.SHOULD_CONFINE_TO_CURRENT_WORKSPACE) {
  if (
    fs.existsSync(Paths.SRC_CURRENT_WORKSPACE_ABSOLUTE)
    && fs.statSync(Paths.SRC_CURRENT_WORKSPACE_ABSOLUTE).isDirectory()
  ) {
    console.log(
      colors.blue.bold(
        `babel-register.config.js: Adding /${Paths.SRC_RELATIVE} directory, for workspace: ${CurrentVarValues.WORKSPACE}.`
      )
    );
  
    babelModuleResolverRoot.push(Paths.SRC_CURRENT_WORKSPACE_ABSOLUTE);
  }
} else {
  if (
    fs.existsSync(Paths.WORKSPACES_ABSOLUTE)
    && fs.statSync(Paths.WORKSPACES_ABSOLUTE).isDirectory()
  ) {
    try {
      const workspacesDirents = fs.readdirSync(
        Paths.WORKSPACES_ABSOLUTE,
        { withFileTypes: true }
      );

      workspacesDirents.forEach((workspaceDirent) => {
        if (Object.values(Workspaces).includes(workspaceDirent.name)) {
          if (workspaceDirent.isDirectory()) {
            fs.readdirSync(
              `${Paths.WORKSPACES_ABSOLUTE}/${workspaceDirent.name}`,
              { withFileTypes: true }
            ).forEach((dirent) => {
              if (dirent.isDirectory()) {
                if (dirent.name === Paths.SRC_RELATIVE) {
                  babelModuleResolverRoot.push(
                    `${Paths.WORKSPACES_ABSOLUTE}/${workspaceDirent.name}/${Paths.SRC_RELATIVE}`
                  );
                }
              }
            });
          }
        }
      });
    } catch (err) {
      throw new SimpleBuildTimeException(
          `Could not add workspace /${Paths.SRC_RELATIVE} directories, found at: ${Paths.WORKSPACES_ABSOLUTE}`,
          './config/test/babel-register.config.js',
          err
        );
    }
  }
}

require('@babel/register')({
  plugins: [
      ...babelConfig.plugins,
    [
      'babel-plugin-module-resolver',
      {
        'root': babelModuleResolverRoot
      }
    ]
  ],
  presets: babelConfig.presets,
  ignore: babelConfig.ignore
});
