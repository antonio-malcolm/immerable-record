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

const fs = require('fs');
const path = require('path');

const Paths = require('../../../constant/Paths');
const SimpleBuildTimeException = require(`${Paths.EXCEPTION_APP_ROOT_ABSOLUTE}/SimpleBuildTimeException`);

const appIndexFileName = 'immerable.immerable-record.js';
const appIndexFileTemplatePathRelative = `template/js/${appIndexFileName}`;
const buildDistDevDirPathRelative = 'build/dist/dev';
const buildDistProdvDirPathRelative = 'build/dist/prod';
const buildDistReleaseDirPathRelative = 'build/dist/release';

const workspacePathAbsolute = `${Paths.WORKSPACES_ABSOLUTE}/immerable`;

const appIndexFileTemplatePathAbsolute = `${workspacePathAbsolute}/${appIndexFileTemplatePathRelative}`;
const buildDistDevDirPathAbsolute = `${workspacePathAbsolute}/${buildDistDevDirPathRelative}`;
const buildDistProdvDirPathAbsolute = `${workspacePathAbsolute}/${buildDistProdvDirPathRelative}`;
const buildDistReleaseDirPathAbsolute = `${workspacePathAbsolute}/${buildDistReleaseDirPathRelative}`;

if (!(fs.existsSync(buildDistDevDirPathAbsolute) && fs.statSync(buildDistDevDirPathAbsolute).isDirectory())) {
  throw new SimpleBuildTimeException(
      `The development build, at: ${buildDistDevDirPathRelative}, is missing.`,
      './workspaces/immerable/task/makeReleaseDist.js'
    );
}

if (!(fs.existsSync(buildDistProdvDirPathAbsolute) && fs.statSync(buildDistProdvDirPathAbsolute).isDirectory())) {
  throw new SimpleBuildTimeException(
      `The production build, at: ${buildDistProdvDirPathRelative}, is missing.`,
      './workspaces/immerable/task/makeReleaseDist.js'
    );
}

if (!(fs.existsSync(appIndexFileTemplatePathAbsolute) && fs.statSync(appIndexFileTemplatePathAbsolute).isFile())) {
  throw new SimpleBuildTimeException(
      `The app index file, at: ${appIndexFileTemplatePathRelative}, is missing.`,
      './workspaces/immerable/task/makeReleaseDist.js'
    );
}

const copyDirectoryTree = function(src, dest) {
  const copyDirTree = (src, dest) => {
    if (fs.statSync(src).isDirectory(src)) {
      let fsDirents = fs.readdirSync(
        src,
        { withFileTypes: true }
      );

      fsDirents.forEach((dirent) => {
        let currSrc = path.join(src, dirent.name);
        let currDest = path.join(dest, dirent.name);

        if (dirent.isDirectory()) {
          if (!fs.existsSync(currDest)) {
            fs.mkdirSync(currDest);
          }

          copyDirTree(currSrc, currDest);
        } else {
          fs.copyFileSync(currSrc, currDest);
        }
      });
    }
  };

  if (!(fs.existsSync(dest) && fs.statSync(dest).isDirectory())) {
    fs.mkdirSync(dest);
  }

  copyDirTree(src, dest);
};

try {
  fs.rmSync(
      buildDistReleaseDirPathAbsolute,
      { force: true, recursive: true }
    );

  copyDirectoryTree(buildDistDevDirPathAbsolute, buildDistReleaseDirPathAbsolute);
  copyDirectoryTree(buildDistProdvDirPathAbsolute, buildDistReleaseDirPathAbsolute);
  fs.copyFileSync(appIndexFileTemplatePathAbsolute, `${buildDistReleaseDirPathAbsolute}/${appIndexFileName}`);
} catch (err) {
  throw new SimpleBuildTimeException(
      'Failed to create the release distribution.',
      './workspaces/immerable/makeReleaseDist.js',
      err
    );
}
