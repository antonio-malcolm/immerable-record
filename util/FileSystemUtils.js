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
const path = require('path');

const CommonUtils = require('./CommonUtils');

const findFilePathsByNameInDirectoryTree = function(fileName, dirPath, depth, limit) {
  const filePaths = [];

  if (!CommonUtils.isNonEmptyString(fileName, true)) {
    return filePaths;
  }

  if (!CommonUtils.isNonEmptyString(dirPath, true)) {
    dirPath = path.dirname(require.main.filename);
  }

  /**
   * Setting depth to -1 means no limit to parent directory tree traversal.
   * Setting limit to -1 means no limit to found results.
   */

  if (!CommonUtils.isAssignedNotNull(depth)) {
    depth = -1;
  }

  if (!CommonUtils.isAssignedNotNull(limit)) {
    limit = -1;
  }

  let currDepth = 0;

  const findFilePathsByNameInDirTree = (fileName, dirPath, depth, limit) => {
    currDepth++;

    const filePath = path.resolve(dirPath, fileName);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      filePaths.push(filePath);

      if (limit > 0) {
        limit--;
      }
    }

    if (depth > -1) {
      if (currDepth === depth) {
        return;
      }
    }

    if (limit === 0) {
      return;
    }

    const parentDirPath = path.resolve(dirPath, '..');

    if (parentDirPath !== dirPath) {
      findFilePathsByNameInDirTree(fileName, parentDirPath, depth, limit);
    }
  }

  findFilePathsByNameInDirTree(fileName, dirPath, depth, limit);

  return filePaths;
};

const getAllPathNamesInDirectoryTree = function(dirPath, fileOrDirType, fileExts, filterMethodValuePairs) {
  if (!(fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory())) {
    return [];
  }

  if (CommonUtils.isNonEmptyString(fileOrDirType, true)) {
    fileOrDirType = String(fileOrDirType).toLowerCase();
  }

  let fsDirents = fs.readdirSync(
    dirPath,
    { withFileTypes: true }
  );

  const addPathName = (pathName, pathNames) => {
    if (!CommonUtils.isNonEmptyObject(filterMethodValuePairs)) {
      return pathNames.push(pathName);
    }

    let pathNameBeforeExt = pathName.slice(0, pathName.lastIndexOf('.'));
    let shouldAddPathName = true;

    Object.keys(filterMethodValuePairs).forEach((filterMethod) => {
      let filterValue = filterMethodValuePairs[filterMethod];

      if (CommonUtils.isNonEmptyString(filterValue, true)) {
        if (filterMethod === 'endsWith') {
          if (!pathNameBeforeExt.endsWith(filterValue)) {
             shouldAddPathName = false;
          }
        }

        if (filterMethod === 'includes') {
          if (pathNameBeforeExt.indexOf(filterValue) < 0) {
             shouldAddPathName = false;
          }
        }

        if (filterMethod === 'startsWith') {
          if (!pathNameBeforeExt.startsWith(filterValue)) {
             shouldAddPathName = false;
          }
        }
      }

      if (CommonUtils.isNonEmptyArray(filterValue)) {
        if (filterMethod === 'includes') {
          filterValue.forEach((val) => {
            if (pathNameBeforeExt.indexOf(val) < 0) {
               shouldAddPathName = false;
            }
          });
        }
      }
    });

    if (pathNames.indexOf(pathName) < 0) {
      if (shouldAddPathName) {
        pathNames.push(pathName);
      }
    }
  };

  const getAllPathNamesInDirTree = (fsDirents, dirMembers = [], pathNames = []) => {
    if (CommonUtils.isNonEmptyArray(fsDirents)) {
      fsDirents.forEach((dirent) => {
        if (dirent.isDirectory()) {
          dirMembers.push(dirent.name);

          getAllPathNamesInDirTree(
            fs.readdirSync(
              `${dirPath}/${dirMembers.length ? `${dirMembers.join('/')}` : ''}`,
              { withFileTypes: true }
            ),
            dirMembers,
            pathNames
          );

          dirMembers.pop();
        }

        if (CommonUtils.isNonEmptyArray(fileExts)) {
          if (!CommonUtils.isNonEmptyString(fileOrDirType, true) || (fileOrDirType === 'file')) {
            let pathName = `${dirMembers.length ? `${dirMembers.join('/')}/` : ''}${dirent.name}`;
            let fileExt = pathName.slice(pathName.lastIndexOf('.') + 1);
  
            if (fileExts.includes(fileExt)) {
              addPathName(pathName, pathNames);
            }
          }
        } else {
          if (!CommonUtils.isNonEmptyString(fileOrDirType, true)) {
            addPathName(pathName, pathNames);
          }

          if ((fileOrDirType === 'dir') || (fileOrDirType === 'directory')) {
            if (dirent.isDirectory()) {
              addPathName(pathName, pathNames);
            }
          }

          if (fileOrDirType === 'file') {
            if (dirent.isFile()) {
              addPathName(pathName, pathNames);
            }
          }
        }
      });
    }

    return pathNames;
  };

  return getAllPathNamesInDirTree(fsDirents);
};

module.exports = Object.freeze({
  findFilePathsByNameInDirectoryTree,
  getAllPathNamesInDirectoryTree
});
