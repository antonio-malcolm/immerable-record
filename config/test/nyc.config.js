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

const CommonUtils = require(`${Paths.UTIL_APP_ROOT_ABSOLUTE}/CommonUtils`);

let reportDir = `${Paths.TEST_OUTPUT_ABSOLUTE}/${Paths.REPORT_RELATIVE}`;
let tempDir = Paths.TEST_CACHE_ABSOLUTE;

if (CommonUtils.isNonEmptyString(CurrentVarValues.WORKSPACE, true)) {
  reportDir = `${reportDir}/${CurrentVarValues.WORKSPACE}`;
  tempDir =  `${tempDir}/${CurrentVarValues.WORKSPACE}`;
}

reportDir = `${reportDir}/nyc`;
tempDir = `${tempDir}/nyc`;

let currentTestType = CurrentVarValues.TEST_TYPE;
let include = [
    `${Paths.SRC_RELATIVE}/*.js`,
    `${Paths.SRC_RELATIVE}/*.jsx`,
    `${Paths.SRC_RELATIVE}/**/*.js`,
    `${Paths.SRC_RELATIVE}/**/*.jsx`
  ];

// Get /src directory from the current workspace, if one exists...
if (
  fs.existsSync(Paths.SRC_CURRENT_WORKSPACE_ABSOLUTE)
  && fs.statSync(Paths.SRC_CURRENT_WORKSPACE_ABSOLUTE).isDirectory()
) {
  console.log(
    colors.blue(
      `nyc.config.js: Adding /${Paths.SRC_RELATIVE} directory, for workspace: ${CurrentVarValues.WORKSPACE}.`
    )
  );

  include.push(`${Paths.SRC_CURRENT_WORKSPACE_RELATIVE}/*.js`);
  include.push(`${Paths.SRC_CURRENT_WORKSPACE_RELATIVE}/*.jsx`);
  include.push(`${Paths.SRC_CURRENT_WORKSPACE_RELATIVE}/**/*.js`);
  include.push(`${Paths.SRC_CURRENT_WORKSPACE_RELATIVE}/**/*.jsx`);
}

console.log(
  colors.blue.bold.underline(
    'Hallo! nyc is providing test coverage, for:'
  )
);

if (CommonUtils.isNonEmptyString(currentTestType)) {
  currentTestType = CommonUtils.convertFirstStringCharToUpperCase(
      currentTestType
    );

  if (CommonUtils.isNonEmptyString(CurrentVarValues.WORKSPACE)) {
    console.log(
      colors.blue.bold(
        `Workspace: ${CurrentVarValues.WORKSPACE}`
      )
    );
  }

  console.log(
    colors.blue.bold(
      `Test Type: ${currentTestType}`
    )
  );
} else {
  if (CommonUtils.isNonEmptyString(CurrentVarValues.WORKSPACE)) {
    console.log(
      colors.blue.bold(
        `Workspace: ${CurrentVarValues.WORKSPACE}`
      )
    );
  }

  console.log(
    colors.blue.bold(
      'Test Type: All Available'
    )
  );
}

console.log(
  colors.blue.bold(
    'Reports will be written to: '
  )
);

console.log(
  colors.green(reportDir)
);

module.exports = {
  cwd: Paths.APP_ROOT,
  include,
  exclude: [
    `**/${Paths.TEST_RELATIVE}/**`,
    '**/*.spec.js'
  ],

  excludeNodeModules: true,
  extension: [ '.js', '.jsx' ],
  reportDir: reportDir,
  tempDir: tempDir,

  reporter: [
    'cobertura',
    'html',
    'lcovonly',
    'text',
  ],
  
  branches: 65,
  functions: 80,
  lines: 65,
  statements: 80,

  watermarks: {
    branches: [ 65, 75 ],
    functions: [ 82, 92 ],
    lines: [ 65, 75 ],
    statements: [ 82, 92 ]
  },

  checkCoverage: true
}
