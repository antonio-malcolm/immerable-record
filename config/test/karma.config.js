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
const Webpack = require('webpack');

const Paths = require('../../constant/Paths');
const AppInfo = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/AppInfo`);
const CurrentVarValues = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/CurrentVarValues`);
const Environs = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/Environs`);
const FileTypes = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/FileTypes`);
const VarNames = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/VarNames`);

const CommonUtils = require(`${Paths.UTIL_APP_ROOT_ABSOLUTE}/CommonUtils`);
const FileSystemUtils = require(`${Paths.UTIL_APP_ROOT_ABSOLUTE}/FileSystemUtils`);

const loaderConfig = require(`${Paths.CONFIG_APP_ROOT_ABSOLUTE}/webpack/loader.config.js`);

const webpackConfig = require(
    `${Paths.CONFIG_CURRENT_WORKSPACE_ABSOLUTE}/webpack/webpack-${CurrentVarValues.ENVIRON}.config.js`
  );

loaderConfig.rules.jsRule.include.push(Paths.TEST_SPEC_ABSOLUTE);

delete webpackConfig.entry;
delete webpackConfig.output;

webpackConfig.module.rules = Object.values(loaderConfig.rules);
webpackConfig.performance = { hints: false };

/**
 * Karma uses Webpack + Babel preprocessing,
 * so, after transipilation, process#env is a string,
 * not an object, so cannot be set, in Karma's browser testing.
 *
 * We're setting a process#env property, here, 
 * and can check for it, in test code,
 * to omit test cases which shouldn't be transpiled,
 * based on the above limitation (the poison is the cure)...
 */
webpackConfig.plugins.push(
  new Webpack.EnvironmentPlugin({
    TEST_CALLER: 'karma',
    [VarNames.ENVIRON]: CurrentVarValues.ENVIRON,
    [VarNames.WORKSPACE]: CurrentVarValues.WORKSPACE,
    [VarNames.APP_NAME]: AppInfo.CURRENT_WORKSPACE_APP_NAME
  })
);

webpackConfig.resolve.modules.push(Paths.TEST_SPEC_ABSOLUTE);

webpackConfig.resolve = {
  ...webpackConfig.resolve,
  fallback: {
    ...webpackConfig.resolve.fallback,
    // This is for Sinon...
    util: false
  }
};


let reportDir = `${Paths.TEST_OUTPUT_ABSOLUTE}/${Paths.REPORT_RELATIVE}`;
let currentEnvironMessageSubstring;

if (CommonUtils.isNonEmptyString(CurrentVarValues.WORKSPACE, true)) {
  reportDir = `${reportDir}/${CurrentVarValues.WORKSPACE}`;
}

if (CommonUtils.isNonEmptyString(CurrentVarValues.ENVIRON, true)) {
  reportDir = `${reportDir}/${CurrentVarValues.ENVIRON}`;

  switch (CurrentVarValues.ENVIRON) {
    case Environs.DEV:
      currentEnvironMessageSubstring = 'development';
      break;

    case Environs.PROD:
      currentEnvironMessageSubstring = 'production';
      break;
  }
}

reportDir = `${reportDir}/karma`;

/**
 * Lots of logic, just to squelch Karma's console noise,
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

const testFilesDescriptorDataByPattern = {
  [`${Paths.CONFIG_APP_ROOT_ABSOLUTE}/${Paths.TEST_RELATIVE}/karma-enzyme.config.js`]: {
    pattern: `${Paths.CONFIG_APP_ROOT_ABSOLUTE}/${Paths.TEST_RELATIVE}/karma-enzyme.config.js`,
    inlcuded: true
  },
  [`${Paths.SRC_APP_ROOT_ABSOLUTE}/!(index|index-dev).js`]: {
    pattern: `${Paths.SRC_APP_ROOT_ABSOLUTE}/!(index|index-dev).js`,
    watched: true
  },
  [`${Paths.SRC_APP_ROOT_ABSOLUTE}/**/!(index|index-dev).js`]: {
    pattern: `${Paths.SRC_APP_ROOT_ABSOLUTE}/**/!(index|index-dev).js`,
    watched: true
  },
  [`${Paths.WORKSPACES_ABSOLUTE}/**/${Paths.SRC_RELATIVE}/!(index|index-dev).js`]: {
    pattern: `${Paths.WORKSPACES_ABSOLUTE}/**/${Paths.SRC_RELATIVE}/!(index|index-dev).js`,
    watched: true
  },
  [`${Paths.WORKSPACES_ABSOLUTE}/**/${Paths.SRC_RELATIVE}/**/!(index|index-dev).js`]: {
    pattern: `${Paths.WORKSPACES_ABSOLUTE}/**/${Paths.SRC_RELATIVE}/**/!(index|index-dev).js`,
    watched: true
  }
};

const preprocessors = {
  [`${Paths.CONFIG_APP_ROOT_ABSOLUTE}/${Paths.TEST_RELATIVE}/karma-enzyme.config.js`]: [  'sourcemap', 'webpack' ],
  [`${Paths.SRC_APP_ROOT_ABSOLUTE}/!(index|index-dev).js`]: [  'sourcemap', 'webpack', 'coverage' ],
  [`${Paths.SRC_APP_ROOT_ABSOLUTE}/**/!(index|index-dev).js`]: [  'sourcemap', 'webpack', 'coverage' ],
  [`${Paths.WORKSPACES_ABSOLUTE}/**/${Paths.SRC_RELATIVE}/!(index|index-dev).js`]: [  'sourcemap', 'webpack', 'coverage' ],
  [`${Paths.WORKSPACES_ABSOLUTE}/**/${Paths.SRC_RELATIVE}/**/!(index|index-dev).js`]: [  'sourcemap', 'webpack', 'coverage' ]
};

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
      let fileDescriptorData

      if (CurrentVarValues.SHOULD_CONFINE_TO_CURRENT_WORKSPACE) {
        if (pathPrefix === Paths.TEST_SPEC_ABSOLUTE) {
          fileDescriptorData = {
              pattern: `${Paths.TEST_SPEC_ABSOLUTE}/${CurrentVarValues.WORKSPACE}/*${suffix}.${FileTypes.EXT_JS}`,
              watched: true
            };
    
          preprocessors[`${Paths.TEST_SPEC_ABSOLUTE}/${CurrentVarValues.WORKSPACE}/*${suffix}.${FileTypes.EXT_JS}`] = [
               'sourcemap', 'webpack'
            ];
        } else {
          fileDescriptorData = {
              pattern: `${Paths.TEST_SPEC_ABSOLUTE}/${CurrentVarValues.WORKSPACE}/**/*${suffix}.${FileTypes.EXT_JS}`,
              watched: true
            };
    
          preprocessors[`${Paths.TEST_SPEC_ABSOLUTE}/${CurrentVarValues.WORKSPACE}/**/*${suffix}.${FileTypes.EXT_JS}`] = [
               'sourcemap', 'webpack'
            ];
        }
      } else {
        if (pathPrefix === Paths.TEST_SPEC_ABSOLUTE) {
          fileDescriptorData = {
              pattern: `${Paths.TEST_SPEC_ABSOLUTE}/*${suffix}.${FileTypes.EXT_JS}`,
              watched: true
            };
    
          preprocessors[`${Paths.TEST_SPEC_ABSOLUTE}/*${suffix}.${FileTypes.EXT_JS}`] = [
               'sourcemap', 'webpack'
            ];
        } else {
          fileDescriptorData = {
              pattern: `${Paths.TEST_SPEC_ABSOLUTE}/**/*${suffix}.${FileTypes.EXT_JS}`,
              watched: true
            };
    
          preprocessors[`${Paths.TEST_SPEC_ABSOLUTE}/**/*${suffix}.${FileTypes.EXT_JS}`] = [
               'sourcemap', 'webpack'
            ];
        }
      }
  
      testFilesDescriptorDataByPattern[fileDescriptorData.pattern] = fileDescriptorData;
    });
  
    rootSrcTestSpecFilePaths.forEach((filePath) => {
      let pathPrefix = filePath.slice(0, filePath.lastIndexOf('/'));
      let fileDescriptorData;

      if (CurrentVarValues.SHOULD_CONFINE_TO_CURRENT_WORKSPACE) {
        if (pathPrefix === Paths.SRC_APP_ROOT_ABSOLUTE) {
          fileDescriptorData = {
              pattern: `${Paths.SRC_APP_ROOT_ABSOLUTE}/${CurrentVarValues.WORKSPACE}/**/${Paths.TEST_RELATIVE}/*${suffix}.${FileTypes.EXT_JS}`,
              watched: true
            };
    
          preprocessors[`${Paths.SRC_APP_ROOT_ABSOLUTE}/${CurrentVarValues.WORKSPACE}/**/${Paths.TEST_RELATIVE}/*${suffix}.${FileTypes.EXT_JS}`] = [
               'sourcemap', 'webpack'
            ];
        } else {
          fileDescriptorData = {
              pattern: `${Paths.SRC_APP_ROOT_ABSOLUTE}/${CurrentVarValues.WORKSPACE}/**/${Paths.TEST_RELATIVE}/**/*${suffix}.${FileTypes.EXT_JS}`,
              watched: true
            };
    
          preprocessors[`${Paths.SRC_APP_ROOT_ABSOLUTE}/${CurrentVarValues.WORKSPACE}/**/${Paths.TEST_RELATIVE}/**/*${suffix}.${FileTypes.EXT_JS}`] = [
               'sourcemap', 'webpack'
             ];
        }
      } else {
        if (pathPrefix === Paths.SRC_APP_ROOT_ABSOLUTE) {
          fileDescriptorData = {
              pattern: `${Paths.SRC_APP_ROOT_ABSOLUTE}/**/${Paths.TEST_RELATIVE}/*${suffix}.${FileTypes.EXT_JS}`,
              watched: true
            };
    
          preprocessors[`${Paths.SRC_APP_ROOT_ABSOLUTE}/**/${Paths.TEST_RELATIVE}/*${suffix}.${FileTypes.EXT_JS}`] = [
               'sourcemap', 'webpack'
            ];
        } else {
          fileDescriptorData = {
              pattern: `${Paths.SRC_APP_ROOT_ABSOLUTE}/**/${Paths.TEST_RELATIVE}/**/*${suffix}.${FileTypes.EXT_JS}`,
              watched: true
            };
    
          preprocessors[`${Paths.SRC_APP_ROOT_ABSOLUTE}/**/${Paths.TEST_RELATIVE}/**/*${suffix}.${FileTypes.EXT_JS}`] = [
               'sourcemap', 'webpack'
             ];
        } 
      }

      testFilesDescriptorDataByPattern[fileDescriptorData.pattern] = fileDescriptorData;
    });

    workspaceSrcTestSpecFilePaths.forEach((filePath) => {
      let pathPrefix = filePath.slice(0, filePath.lastIndexOf('/'));
      let fileDescriptorData;

      if (CurrentVarValues.SHOULD_CONFINE_TO_CURRENT_WORKSPACE) {
        if (pathPrefix === Paths.WORKSPACES_ABSOLUTE) {
          fileDescriptorData = {
              pattern: `${Paths.WORKSPACES_ABSOLUTE}/${CurrentVarValues.WORKSPACE}/**/${Paths.SRC_RELATIVE}/**/${Paths.TEST_RELATIVE}/*${suffix}.${FileTypes.EXT_JS}`,
              watched: true
            };
    
          preprocessors[`${Paths.WORKSPACES_ABSOLUTE}/${CurrentVarValues.WORKSPACE}/**/${Paths.SRC_RELATIVE}/**/${Paths.TEST_RELATIVE}/*${suffix}.${FileTypes.EXT_JS}`] = [
               'sourcemap', 'webpack'
            ];
        } else {
          fileDescriptorData = {
              pattern: `${Paths.WORKSPACES_ABSOLUTE}/${CurrentVarValues.WORKSPACE}/**/${Paths.SRC_RELATIVE}/**/${Paths.TEST_RELATIVE}/**/*${suffix}.${FileTypes.EXT_JS}`,
              watched: true
            };
    
          preprocessors[`${Paths.WORKSPACES_ABSOLUTE}/${CurrentVarValues.WORKSPACE}/**/${Paths.SRC_RELATIVE}/**/${Paths.TEST_RELATIVE}/**/*${suffix}.${FileTypes.EXT_JS}`] = [
               'sourcemap', 'webpack'
             ];
        }
      } else {
        if (pathPrefix === Paths.WORKSPACES_ABSOLUTE) {
          fileDescriptorData = {
              pattern: `${Paths.WORKSPACES_ABSOLUTE}/**/${Paths.SRC_RELATIVE}/**/${Paths.TEST_RELATIVE}/*${suffix}.${FileTypes.EXT_JS}`,
              watched: true
            };
    
          preprocessors[`${Paths.WORKSPACES_ABSOLUTE}/**/${Paths.SRC_RELATIVE}/**/${Paths.TEST_RELATIVE}/*${suffix}.${FileTypes.EXT_JS}`] = [
               'sourcemap', 'webpack'
            ];
        } else {
          fileDescriptorData = {
              pattern: `${Paths.WORKSPACES_ABSOLUTE}/**/${Paths.SRC_RELATIVE}/**/${Paths.TEST_RELATIVE}/**/*${suffix}.${FileTypes.EXT_JS}`,
              watched: true
            };
    
          preprocessors[`${Paths.WORKSPACES_ABSOLUTE}/**/${Paths.SRC_RELATIVE}/**/${Paths.TEST_RELATIVE}/**/*${suffix}.${FileTypes.EXT_JS}`] = [
               'sourcemap', 'webpack'
             ];
        }
      }

      testFilesDescriptorDataByPattern[fileDescriptorData.pattern] = fileDescriptorData;
    });
  });
} catch (err) {
  console.error(
    colors.red.bold(
      'ERROR! An Error occurred, while attempting to parse file path data, for the Karma test config.'
    )
  );

  console.error(
    colors.magenta(err)
  );

  return;
}

console.log(
  colors.blue.bold.underline(
    'Hallo! Karma browser tests are running, for:'
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

  if (CommonUtils.isNonEmptyString(currentEnvironMessageSubstring)) {
    console.log(
      colors.blue.bold(
        `Environment: ${currentEnvironMessageSubstring}`
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

  if (CommonUtils.isNonEmptyString(currentEnvironMessageSubstring)) {
    console.log(
      colors.blue.bold(
        `Environment: ${currentEnvironMessageSubstring}`
      )
    );
  }

  console.log(
    colors.blue.bold(
      'Test Type: All Available'
    )
  );
}

const testFilesDescriptorData = Object.values(testFilesDescriptorDataByPattern); 

if (testFilesDescriptorData.length > 0) {
  console.log(
    colors.blue.bold(
      'With File Patterns:'
    )
  );

  testFilesDescriptorData.forEach((fileDescriptorData) => {
    console.log(
      colors.green(fileDescriptorData.pattern)
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
      + ` and /${Paths.TEST_RELATIVE} directories inside ${Paths.SRC_APP_ROOT_ABSOLUTE}`
    )
  );

  console.warn(
    colors.magenta(
      `Test files are *.${FileTypes.EXT_JS} files with names ending in one of`
      + ` ${CommonUtils.convertArrayToCommaDelimitedStringWithAndOr(testFileNameSuffixes, true)}`
    )
  );

  console.warn(
    colors.yellow.bold('Exiting...')
  );

  return;
}

process.on('infrastructure_error', (error) => {
  console.error('infrastructure_error', error);
});

process.env.TEST_CALLER = 'karma';

module.exports = function(config) {
  config.set({
    autoWatch: true,
    browserNoActivityTimeout: 60000,
    browserDisconnectTimeout: 60000,
    browsers: [
      'jsdom'
    ],
    colors: true,
    concurrency: Infinity,
    coverageReporter: {
      type: 'html',
      dir: `${reportDir}/coverage`
    },
    customLaunchers: {
      FirefoxHeadless: {
        base: 'Firefox',
        flags: [ '-headless' ],
      },
    },
    detectBrowsers: {
      enabled: true,
      preferHeadless: true,
      postDetection: (availableBrowsers) => {
         //Remove PhantomJS if another browser has been detected...
         if (availableBrowsers.length > 1) {
           if (availableBrowsers.indexOf('PhantomJS') > -1) {
             let idx = availableBrowsers.indexOf('PhantomJS');
  
             if (idx !== -1) {
               availableBrowsers.splice(idx, 1);
             }
           }
         }

        return availableBrowsers;
      }
    },
    failOnEmptyTestSuite: false,
    files: testFilesDescriptorData,
    frameworks: [
      'detectBrowsers',
      'mocha',
      'webpack'
    ],
    htmlReporter: {
      // Required...
      outputFile: `${reportDir}/karma-report.html`,
            
      // Optional...
      pageTitle: 'Karma Tests',
      groupSuites: true,
      useCompactStyle: true,
      useLegacyStyle: true,
      showOnlyFailed: false
    },
    logLevel: config.LOG_INFO,
    plugins: [
      'karma-coverage',
      'karma-detect-browsers',
      'karma-htmlfile-reporter',
      'karma-mocha',
      'karma-sourcemap-loader',
      'karma-webpack',

      // browsers...
      'karma-chrome-launcher',
      'karma-edge-launcher',
      'karma-firefox-launcher',
      'karma-ie-launcher',
      'karma-jsdom-launcher',
      'karma-phantomjs-launcher'
    ],
    preprocessors,
    port: 3005,
    reporters: [
      'coverage',
      'progress'
    ],
    webpack: webpackConfig,
    webpackMiddleware: {
      stats: 'errors-only',
    }
  })
};
