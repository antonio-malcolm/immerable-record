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

const CommonUtils = require('../util/CommonUtils');

const engineKeys = [ 'node', 'npm', 'pnpm' ];

const RunTaskWrongEngineException = function(
  engineVersionsExpected = {},
  engineVersionsInstalled = {},
  err,
  additionalInfo
) {
  console.error('ERROR! Tasks require the correct package engine versions be installed.');

  if (CommonUtils.isNonEmptyObject(engineVersionsExpected)) {
    console.warn('Expected Engine Versions:');

    engineKeys.forEach((engine) => {
      console.warn(`  ${engine}: ${engineVersionsExpected[engine]}`);
    });
  }

  if (CommonUtils.isNonEmptyObject(engineVersionsInstalled)) {
    console.log('');
    console.warn('Installed Engine Versions:');

    engineKeys.forEach((engine) => {
      console.warn(`  ${engine}: ${engineVersionsInstalled[engine]}`);
    });
  }

  if (CommonUtils.isAssignedNotNull(err) && CommonUtils.isAssignedNotNull(err.message)) {
    console.log('');
    console.warn(
       `Reason: ${err.name}: ${err.message}`
      );
  }

  if (CommonUtils.isNonEmptyString(additionalInfo)) {
    console.log('');
    console.warn(
       `Additional Info: ${additionalInfo}`
      );
  }

  console.log('');
  console.warn('Ensure the correct node, npm, and pnpm versions are installed, then try your task again.');
  console.log('');
  console.log('Exiting...');
};

const child_process = require('child_process');

let engineVersionsExpected = {};

try {
  engineVersionsExpected = require('../package.json').engines;

  if (!CommonUtils.isNonEmptyObject(engineVersionsExpected)) {
    throw new RunTaskWrongEngineException(
        null,
        null,
        null,
        'No engines are assigned to package.json.'
      );
  }
} catch (err) {
  throw new RunTaskWrongEngineException(
      null,
      null,
      err,
      'Could not obtain the required npm version from package.json.'
    );
}

engineKeys.forEach((engine) => {
  if (!CommonUtils.isAssignedNotNull(engineVersionsExpected[engine])) {
    throw new RunTaskWrongEngineException(
        null,
        null,
        null,
        `Could not obtain the expected ${engine} version from package.json.`
      );
  }
});

const nodeVersionInstalled = process.versions.node;

if (!CommonUtils.isNonEmptyString(nodeVersionInstalled, true)) {
  throw new RunTaskWrongEngineException(
      null,
      null,
      null,
      `Could not obtain the installed node version from the host system.`
    );
}

let npmVersionInstalled;
let pnpmVersionInstalled;

const engineVersionsInstalled = {
    node: nodeVersionInstalled
  };

try {
  npmVersionInstalled = child_process.execSync('npm --version').toString();
  npmVersionInstalled = CommonUtils.replaceNewLinesInString(npmVersionInstalled, '');
  npmVersionInstalled = CommonUtils.replaceSpaceCharsInString(npmVersionInstalled, '');
} catch (err) {
  throw new RunTaskWrongEngineException(
      null,
      null,
      err,
      `Could not obtain the installed npm version from the host system.`
    );
}

engineVersionsInstalled.npm = npmVersionInstalled;

try {
  pnpmVersionInstalled = child_process.execSync('pnpm --version').toString();
  pnpmVersionInstalled = CommonUtils.replaceNewLinesInString(pnpmVersionInstalled, '');
  pnpmVersionInstalled = CommonUtils.replaceSpaceCharsInString(pnpmVersionInstalled, '');
} catch (err) {
  throw new RunTaskWrongEngineException(
      null,
      null,
      err,
      `Could not obtain the installed pnpm version from the host system.`
    );
}

engineVersionsInstalled.pnpm = pnpmVersionInstalled;

engineKeys.forEach((engine) => {
  if (!CommonUtils.isNonEmptyString(engineVersionsInstalled[engine], true)) {
    throw new RunTaskWrongEngineException(
        null,
        null,
        null,
        `Could not obtain the installed ${engine} version from the host system.`
      );
  }
});

let hasEngineVersionMismatch = false;

engineKeys.forEach((engine) => {
  let engineVersionExpected = engineVersionsExpected[engine];
  let isEngineVersionExpectedLatestMajor = (engineVersionExpected.indexOf('^') === 0);

  let engineVersionInstalled = engineVersionsInstalled[engine];

  if (isEngineVersionExpectedLatestMajor) {
    let engineMajorVersionExpected = engineVersionExpected.substring(1).split('.')[0];
    let engineMajorVersionInstalled = engineVersionInstalled.split('.')[0];

    if (engineMajorVersionExpected !== engineMajorVersionInstalled) {
      hasEngineVersionMismatch = true;
    }
  } else {
    if (engineVersionExpected !== engineVersionInstalled) {
      hasEngineVersionMismatch = true;
    }
  }
});

if (hasEngineVersionMismatch) {
  throw new RunTaskWrongEngineException(
      engineVersionsExpected,
      engineVersionsInstalled,
      null,
      'Engine versions are mismatched. Refer to the "engines", in package.json, for the correct versions'
    );
}
