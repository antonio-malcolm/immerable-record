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

const Paths = require('../../constant/Paths');
const AppInfo = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/AppInfo`);
const CurrentVarValues = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/CurrentVarValues`);
const FileTypes = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/FileTypes`);
const VarNames = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/VarNames`);

const CommonUtils = require(`${Paths.UTIL_APP_ROOT_ABSOLUTE}/CommonUtils`);
const FileSystemUtils = require(`${Paths.UTIL_APP_ROOT_ABSOLUTE}/FileSystemUtils`);

let reportDir = `${Paths.TEST_OUTPUT_ABSOLUTE}/${Paths.REPORT_RELATIVE}`;

if (CommonUtils.isNonEmptyString(CurrentVarValues.WORKSPACE, true)) {
  reportDir = `${reportDir}/${CurrentVarValues.WORKSPACE}`;
}

reportDir = `${reportDir}/mochawesome`;

/**
 * Lots of logic, just to squelch Mocha's console noise,
 * when a test directory is empty.
 *
 * Check the test directories first.
 * Add only those which contain test testFilesDescriptorData to the config.
 *
 * Test directories:
 *
 * Spec directory in the root test directory:
 * /[APP-ROOT]/test/spec
 *
 * Any test directory in the source code directory:
 * /[APP-ROOT]/src/../test
 *
 * Test file names, ending with one of the following:
 * .spec.js
 * Spec.js
 * Test.js
 * Tests.js
 *
 * Additionally, if a test type is defined, by the TEST_TYPE variable,
 * loaded tests will be narrowed, to those with file names ending with
 * one of the following (matching the value of the TEST_TYPE variable):
 *
 * Functional.spec.js
 * Functionals.spec.js
 * FunctionalTest.spec.js
 * FunctionalTests.spec.js
 * FunctionalSpec.js
 * FunctionalsSpec.js
 * FunctionalTestSpec.js
 * FunctionalTestsSpec.js
 * FunctionalTest.js
 * FunctionalTests.js
 *
 * Integration.spec.js
 * Integrations.spec.js
 * IntegrationTest.spec.js
 * IntegrationTests.spec.js
 * IntegrationSpec.js
 * IntegrationsSpec.js
 * IntegrationTestSpec.js
 * IntegrationTestsSpec.js
 * IntegrationTest.js
 * IntegrationTests.js 
 *
 * Unit.spec.js
 * Units.spec.js
 * UnitTest.spec.js
 * UnitTests.spec.js
 * UnitSpec.js
 * UnitsSpec.js
 * UnitTestSpec.js
 * UnitTestsSpec.js
 * UnitTest.js
 * UnitTests.js
 */

const testFilePaths = [];
const watchTestFilePaths = [];

const testFileNameSuffixes = [
  '.spec',
  'Spec',
  'Test',
  'Tests'
];

let currentTestType = CurrentVarValues.TEST_TYPE;

try {
  if (CommonUtils.isNonEmptyString(currentTestType, true)) {
    currentTestType = CommonUtils.convertFirstStringCharToUpperCase(
        currentTestType
      );
  
    testFileNameSuffixes.forEach((suffix, idx, suffixes) => {
      switch (suffix) {
        case '.spec':
          suffixes[idx] = `${currentTestType}${suffix}`;
          suffixes.push(`${currentTestType}s${suffix}`);
          suffixes.push(`${currentTestType}Test${suffix}`);
          suffixes.push(`${currentTestType}Tests${suffix}`);
          break;
  
        case 'Spec':
          suffixes[idx] = `${currentTestType}${suffix}`;
          suffixes.push(`${currentTestType}${suffix}s`);
          suffixes.push(`${currentTestType}s${suffix}`);
          suffixes.push(`${currentTestType}Test${suffix}`);
          suffixes.push(`${currentTestType}Tests${suffix}`);
          break;
  
        default:
          suffixes[idx] = `${currentTestType}${suffix}`;
          break;
      }
    });
  }
  
  testFileNameSuffixes.forEach((suffix) => {
    const specFileFilters = { endsWith: suffix };

    if (CurrentVarValues.SHOULD_CONFINE_TO_CURRENT_WORKSPACE) {
      specFileFilters.includes = [ `${CurrentVarValues.WORKSPACE}/` ];
    }

    const rootTestSpecFilePaths = FileSystemUtils.getAllPathNamesInDirectoryTree(
        Paths.TEST_SPEC_ABSOLUTE,
        'file',
        [ FileTypes.EXT_JS ],
        specFileFilters
      );

    specFileFilters.includes = [ `/${Paths.TEST_RELATIVE}/` ];

    if (CurrentVarValues.SHOULD_CONFINE_TO_CURRENT_WORKSPACE) {
      specFileFilters.includes.push(`${CurrentVarValues.WORKSPACE}/`);
    }
  
    const rootSrcTestSpecFilePaths = FileSystemUtils.getAllPathNamesInDirectoryTree(
        Paths.SRC_APP_ROOT_ABSOLUTE,
        'file',
        [ FileTypes.EXT_JS ],
        specFileFilters
      );

    specFileFilters.includes = [ `/${Paths.SRC_RELATIVE}/`, `/${Paths.TEST_RELATIVE}/` ];

    if (CurrentVarValues.SHOULD_CONFINE_TO_CURRENT_WORKSPACE) {
      specFileFilters.includes.push(`${CurrentVarValues.WORKSPACE}/`);
    }

    const workspaceSrcTestSpecFilePaths = FileSystemUtils.getAllPathNamesInDirectoryTree(
        Paths.WORKSPACES_ABSOLUTE,
        'file',
        [ FileTypes.EXT_JS ],
        specFileFilters
      );

    rootTestSpecFilePaths.forEach((filePath) => {
      let pathPrefix = filePath.slice(0, filePath.lastIndexOf('/'));
      let testFilePath;

      if (CurrentVarValues.SHOULD_CONFINE_TO_CURRENT_WORKSPACE) {
        if (pathPrefix === Paths.TEST_SPEC_ABSOLUTE) {
          testFilePath = `${Paths.TEST_SPEC_ABSOLUTE}/${CurrentVarValues.WORKSPACE}/*${suffix}.${FileTypes.EXT_JS}`;
          watchTestFilePaths.push(`${Paths.TEST_SPEC_ABSOLUTE}/${CurrentVarValues.WORKSPACE}/*`);
        } else {
          testFilePath = `${Paths.TEST_SPEC_ABSOLUTE}/${CurrentVarValues.WORKSPACE}/**/*${suffix}.${FileTypes.EXT_JS}`;
          watchTestFilePaths.push(`${Paths.TEST_SPEC_ABSOLUTE}/${CurrentVarValues.WORKSPACE}/**/*`);
        }
      } else {
        if (pathPrefix === Paths.TEST_SPEC_ABSOLUTE) {
          testFilePath = `${Paths.TEST_SPEC_ABSOLUTE}/*${suffix}.${FileTypes.EXT_JS}`;
          watchTestFilePaths.push(`${Paths.TEST_SPEC_ABSOLUTE}/*`);
        } else {
          testFilePath = `${Paths.TEST_SPEC_ABSOLUTE}/**/*${suffix}.${FileTypes.EXT_JS}`;
          watchTestFilePaths.push(`${Paths.TEST_SPEC_ABSOLUTE}/**/*`);
        }
      }

      if (!testFilePaths.includes(testFilePath)) {
        testFilePaths.push(testFilePath);
      }
    });
  
    rootSrcTestSpecFilePaths.forEach((filePath) => {
      let pathPrefix = filePath.slice(0, filePath.lastIndexOf('/'));
      let testFilePath;

      if (CurrentVarValues.SHOULD_CONFINE_TO_CURRENT_WORKSPACE) {
        if (pathPrefix === Paths.TEST_RELATIVE) {
          testFilePath = `${Paths.SRC_APP_ROOT_ABSOLUTE}/${CurrentVarValues.WORKSPACE}/**/${Paths.TEST_RELATIVE}/*${suffix}.${FileTypes.EXT_JS}`;
          watchTestFilePaths.push(`${Paths.SRC_APP_ROOT_ABSOLUTE}/${CurrentVarValues.WORKSPACE}/**/${Paths.TEST_RELATIVE}/*`);
        } else {
          testFilePath = `${Paths.SRC_APP_ROOT_ABSOLUTE}/${CurrentVarValues.WORKSPACE}/**/${Paths.TEST_RELATIVE}/**/*${suffix}.${FileTypes.EXT_JS}`;
          watchTestFilePaths.push(`${Paths.SRC_APP_ROOT_ABSOLUTE}/${CurrentVarValues.WORKSPACE}/**/${Paths.TEST_RELATIVE}/**/*`);
        }
      } else {
        if (pathPrefix === Paths.TEST_RELATIVE) {
          testFilePath = `${Paths.SRC_APP_ROOT_ABSOLUTE}/**/${Paths.TEST_RELATIVE}/*${suffix}.${FileTypes.EXT_JS}`;
          watchTestFilePaths.push(`${Paths.SRC_APP_ROOT_ABSOLUTE}/**/${Paths.TEST_RELATIVE}/*`);
        } else {
          testFilePath = `${Paths.SRC_APP_ROOT_ABSOLUTE}/**/${Paths.TEST_RELATIVE}/**/*${suffix}.${FileTypes.EXT_JS}`;
          watchTestFilePaths.push(`${Paths.SRC_APP_ROOT_ABSOLUTE}/**/${Paths.TEST_RELATIVE}/**/*`);
        } 
      }
  
      if (!testFilePaths.includes(testFilePath)) {
        testFilePaths.push(testFilePath);
      }
    });

    workspaceSrcTestSpecFilePaths.forEach((filePath) => {
      let pathPrefix = filePath.slice(0, filePath.lastIndexOf('/'));
      let testFilePath;

      if (CurrentVarValues.SHOULD_CONFINE_TO_CURRENT_WORKSPACE) {
        if (pathPrefix === Paths.TEST_RELATIVE) {
          testFilePath = `${Paths.WORKSPACES_ABSOLUTE}/${CurrentVarValues.WORKSPACE}/**/${Paths.SRC_RELATIVE}/**/${Paths.TEST_RELATIVE}/*${suffix}.${FileTypes.EXT_JS}`;
          watchTestFilePaths.push(`${Paths.WORKSPACES_ABSOLUTE}/${CurrentVarValues.WORKSPACE}/**/${Paths.SRC_RELATIVE}/**/${Paths.TEST_RELATIVE}/*`);
        } else {
          testFilePath = `${Paths.WORKSPACES_ABSOLUTE}/**/${Paths.SRC_RELATIVE}/**/${Paths.TEST_RELATIVE}/**/*${suffix}.${FileTypes.EXT_JS}`;
          watchTestFilePaths.push(`${Paths.WORKSPACES_ABSOLUTE}/**/${Paths.SRC_RELATIVE}/**/${Paths.TEST_RELATIVE}/**/*`);
        }
      } else {
        if (pathPrefix === Paths.TEST_RELATIVE) {
          testFilePath = `${Paths.WORKSPACES_ABSOLUTE}/**/${Paths.SRC_RELATIVE}/**/${Paths.TEST_RELATIVE}/*${suffix}.${FileTypes.EXT_JS}`;
          watchTestFilePaths.push(`${Paths.WORKSPACES_ABSOLUTE}/**/${Paths.SRC_RELATIVE}/**/${Paths.TEST_RELATIVE}/*`);
        } else {
          testFilePath = `${Paths.WORKSPACES_ABSOLUTE}/**/${Paths.SRC_RELATIVE}/**/${Paths.TEST_RELATIVE}/**/*${suffix}.${FileTypes.EXT_JS}`;
          watchTestFilePaths.push(`${Paths.WORKSPACES_ABSOLUTE}/**/${Paths.SRC_RELATIVE}/**/${Paths.TEST_RELATIVE}/**/*`);
        }
      }
  
      if (!testFilePaths.includes(testFilePath)) {
        testFilePaths.push(testFilePath);
      }
    });
  });
} catch (err) {
  console.error(
    colors.red.bold(
      'ERROR! An Error occurred, while attempting to parse file path data, for the Mocha test config.'
    )
  );

  console.log(
    colors.magenta(err)
  );

  return;
}

console.log(
  colors.blue.bold.underline(
    'Hallo! Mocha jsdom tests are running, for:'
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

if (testFilePaths.length > 0) {
  console.log(
    colors.blue.bold(
      'With File Patterns:'
    )
  );

  testFilePaths.forEach((filePath) => {
    console.log(
      colors.green(filePath)
    );
  });

  console.log(
    colors.blue.bold(
      'Reports will be written to: '
    )
  );
  
  console.log(
    colors.green(reportDir)
  );
} else {
  console.warn(
    colors.yellow.bold(
      'WARNING! There are no test files present, for the application.'
    )
  );

  console.warn(
    colors.magenta(
      `Test file directories are the root /${Paths.TEST_SPEC_RELATIVE}`
      + ` and /${Paths.TEST_RELATIVE} directories inside: ${Paths.SRC_APP_ROOT_ABSOLUTE}`
    )
  );

  console.warn(
    colors.magenta(
      `Test files are *.${FileTypes.EXT_JS} files with names ending in one of:`
      + ` ${CommonUtils.convertArrayToCommaDelimitedStringWithAndOr(testFileNameSuffixes, true)}`
    )
  );

  console.warn(
    colors.yellow.bold('Exiting...')
  );

  return;
}

process.env[VarNames.APP_NAME] = AppInfo.CURRENT_WORKSPACE_APP_NAME;
process.env[VarNames.ENVIRON] = CurrentVarValues.ENVIRON;
process.env[VarNames.WORKSPACE] = CurrentVarValues.WORKSPACE;
process.env.TEST_CALLER = 'mocha';

module.exports = {
  colors: true,
  diff: true,
  extension: [ 'js', 'jsx' ],
  growl: true,
  opts: false,
  recursive: true,
  reporter: 'mochawesome',

  'reporter-options': [
    'overwrite=true',
    `reportDir=${reportDir}`,
    `reportFilename=Test_Report_${AppInfo.APP_NAME}`,
    `reportTitle=Test\ Report:\ ${AppInfo.APP_NAME}`
  ],

  require: [
    'chai',
    `${Paths.CONFIG_APP_ROOT_ABSOLUTE}/test/mocha-enzyme.config.js`,
    `${Paths.CONFIG_APP_ROOT_ABSOLUTE}/test/jsdom.config.js`
  ],

  spec: testFilePaths,
  ui: 'bdd',
  'watch-files': watchTestFilePaths,
  'watch-ignore': [ 'node_modules' ]
};
