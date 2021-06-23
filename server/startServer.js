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
const fs = require("fs");
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');

const Paths = require('../constant/Paths');
const AppInfo = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/AppInfo`);
const CurrentVarValues = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/CurrentVarValues`);
const Environs = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/Environs`);
const FileTypes = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/FileTypes`);
const VarNames = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/VarNames`);
const Workspaces = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/Workspaces`);

const CommonUtils = require(`${Paths.UTIL_APP_ROOT_ABSOLUTE}/CommonUtils`);
const FileSystemUtils = require(`${Paths.UTIL_APP_ROOT_ABSOLUTE}/FileSystemUtils`);

const WebpackDevInMemory = require('./WebpackDevInMemory');

const getConsoleOutWorkspaceMessageToPaths = () => {
  const consoleOutWorkspaceMessageToPaths = {};

  Object.keys(Workspaces).forEach((wsKey) => {
    let bundleDistUrlPathBase = `/${Paths.DIST_RELATIVE}/${Workspaces[wsKey]}`;
    let workspaceBuildDistDirectoryPathRelative = `/${Workspaces[wsKey]}/${Paths.BUILD_RELATIVE}/${Paths.DIST_RELATIVE}`;

    if (fs.existsSync(`${Paths.WORKSPACES_ABSOLUTE}${workspaceBuildDistDirectoryPathRelative}`)) {
      let workspaceBuildDistDirectoryPathAbsolute = `${Paths.WORKSPACES_ABSOLUTE}${workspaceBuildDistDirectoryPathRelative}`;
      let environDirs = fs.readdirSync(workspaceBuildDistDirectoryPathAbsolute);

      if (CommonUtils.isNonEmptyArray(environDirs)) {
        consoleOutWorkspaceMessageToPaths[Workspaces[wsKey]] = {
          bundleDistUrlPathBase,
          workspaceBuildDistDirectoryPath: `${Paths.WORKSPACES_RELATIVE}${workspaceBuildDistDirectoryPathRelative}`
        };
      }
    }
  });

  return consoleOutWorkspaceMessageToPaths;
};

const getDistributionBundleAssets = () => {
  const distributionBundleAssets = {};

  Object.keys(Workspaces).forEach((wsKey) => {
    let bundleDistUrlPathBaseRelative = `${Paths.DIST_RELATIVE}/${Workspaces[wsKey]}`;
    let workspaceBuildDistDirectoryPathRelative = `/${Workspaces[wsKey]}/${Paths.BUILD_RELATIVE}/${Paths.DIST_RELATIVE}`;

    if (fs.existsSync(`${Paths.WORKSPACES_ABSOLUTE}${workspaceBuildDistDirectoryPathRelative}`)) {
      let workspaceBuildDistDirectoryPathAbsolute = `${Paths.WORKSPACES_ABSOLUTE}${workspaceBuildDistDirectoryPathRelative}`;
    
      let environDirents = fs.readdirSync(
          workspaceBuildDistDirectoryPathAbsolute,
          { withFileTypes: true }
        );

      if (CommonUtils.isNonEmptyArray(environDirents)) {
        let environBundleAssets = {};

        environDirents.forEach((environDirent) => {
          if (environDirent.isDirectory() && Object.values(Environs).includes(environDirent.name)) {
            let workspaceBuildDistEnvironDir = `${workspaceBuildDistDirectoryPathAbsolute}/${environDirent.name}`;

            let unorderedEnvironAssets = FileSystemUtils.getAllPathNamesInDirectoryTree(
                workspaceBuildDistEnvironDir,
                'file',
                [
                  // Common file types...
                  FileTypes.EXT_CSS, 
                  FileTypes.EXT_JS,
                  FileTypes.EXT_HTML,

                  // Audio files...
                  FileTypes.EXT_AAC,
                  FileTypes.EXT_AIFF,
                  FileTypes.EXT_FLAC ,
                  FileTypes.EXT_M4A,
                  FileTypes.EXT_MP3,
                  FileTypes.EXT_OGA,
                  FileTypes.EXT_PCM,
                  FileTypes.EXT_WAV,
  
                  // Image files...
                  FileTypes.EXT_GIF,
                  FileTypes.EXT_JPG,
                  FileTypes.EXT_JPEG,
                  FileTypes.EXT_PNG,
                  FileTypes.EXT_SVG,

                  // Video files...
                  FileTypes.EXT_AVI,
                  FileTypes.EXT_FLV,
                  FileTypes.EXT_M4V ,
                  FileTypes.EXT_MOV,
                  FileTypes.EXT_MP2,
                  FileTypes.EXT_MPE,
                  FileTypes.EXT_MPG,
                  FileTypes.EXT_MPV,
                  FileTypes.EXT_OGG,
                  FileTypes.EXT_QT,
                  FileTypes.EXT_SWF,
                  FileTypes.EXT_WEBM,
                  FileTypes.EXT_WMV,

                  //  Webfonts...
                  FileTypes.EXT_EOF,
                  FileTypes.EXT_OTF,
                  FileTypes.EXT_TTF,
                  FileTypes.EXT_WOFF,
                  FileTypes.EXT_WOFF2,
  
                  // Source maps...
                  FileTypes.EXT_SOURCE_MAP
                ]
              );

            if (CommonUtils.isNonEmptyArray(unorderedEnvironAssets)) {
              environBundleAssets[environDirent.name] = {};

              unorderedEnvironAssets.forEach((asset) => {
                let assetPathRelative = `${bundleDistUrlPathBaseRelative}/${environDirent.name}/${asset}`;

                // Common file types...

                if (asset.endsWith(`.${FileTypes.EXT_CSS}`)) {
                  if (environBundleAssets[environDirent.name][FileTypes.EXT_CSS] === undefined) {
                    environBundleAssets[environDirent.name][FileTypes.EXT_CSS] = [];
                  }
      
                  environBundleAssets[environDirent.name][FileTypes.EXT_CSS].push(assetPathRelative);
                }
      
                if (asset.endsWith(`.${FileTypes.EXT_JS}`)) {
                  if (environBundleAssets[environDirent.name][FileTypes.EXT_JS] === undefined) {
                    environBundleAssets[environDirent.name][FileTypes.EXT_JS] = [];
                  }
      
                  environBundleAssets[environDirent.name][FileTypes.EXT_JS].push(assetPathRelative);
                }
      
                if (asset.endsWith(`.${FileTypes.EXT_HTML}`)) {
                  if (environBundleAssets[environDirent.name][FileTypes.EXT_HTML] === undefined) {
                    environBundleAssets[environDirent.name][FileTypes.EXT_HTML] = [];
                  }
      
                  environBundleAssets[environDirent.name][FileTypes.EXT_HTML].push(assetPathRelative);
                }

                // Audio files...

                if (asset.endsWith(`.${FileTypes.EXT_AAC}`)) {
                  if (environBundleAssets[environDirent.name][FileTypes.EXT_AAC] === undefined) {
                    environBundleAssets[environDirent.name][FileTypes.EXT_AAC] = [];
                  }
      
                  environBundleAssets[environDirent.name][FileTypes.EXT_AAC].push(assetPathRelative);
                }
      
                if (asset.endsWith(`.${FileTypes.EXT_AIFF}`)) {
                  if (environBundleAssets[environDirent.name][FileTypes.EXT_AIFF] === undefined) {
                    environBundleAssets[environDirent.name][FileTypes.EXT_AIFF] = [];
                  }
      
                  environBundleAssets[environDirent.name][FileTypes.EXT_AIFF].push(assetPathRelative);
                }
      
                if (asset.endsWith(`.${FileTypes.EXT_FLAC}`)) {
                  if (environBundleAssets[environDirent.name][FileTypes.EXT_FLAC] === undefined) {
                    environBundleAssets[environDirent.name][FileTypes.EXT_FLAC] = [];
                  }
      
                  environBundleAssets[environDirent.name][FileTypes.EXT_FLAC].push(assetPathRelative);
                }
      
                if (asset.endsWith(`.${FileTypes.EXT_M4A}`)) {
                  if (environBundleAssets[environDirent.name][FileTypes.EXT_M4A] === undefined) {
                    environBundleAssets[environDirent.name][FileTypes.EXT_M4A] = [];
                  }
      
                  environBundleAssets[environDirent.name][FileTypes.EXT_M4A].push(assetPathRelative);
                }
      
                if (asset.endsWith(`.${FileTypes.EXT_MP3}`)) {
                  if (environBundleAssets[environDirent.name][FileTypes.EXT_MP3] === undefined) {
                    environBundleAssets[environDirent.name][FileTypes.EXT_MP3] = [];
                  }
      
                  environBundleAssets[environDirent.name][FileTypes.EXT_MP3].push(assetPathRelative);
                }

                if (asset.endsWith(`.${FileTypes.EXT_OGA}`)) {
                  if (environBundleAssets[environDirent.name][FileTypes.EXT_OGA] === undefined) {
                    environBundleAssets[environDirent.name][FileTypes.EXT_OGA] = [];
                  }
      
                  environBundleAssets[environDirent.name][FileTypes.EXT_OGA].push(assetPathRelative);
                }
      
                if (asset.endsWith(`.${FileTypes.EXT_PCM}`)) {
                  if (environBundleAssets[environDirent.name][FileTypes.EXT_PCM] === undefined) {
                    environBundleAssets[environDirent.name][FileTypes.EXT_PCM] = [];
                  }
      
                  environBundleAssets[environDirent.name][FileTypes.EXT_PCM].push(assetPathRelative);
                }
      
                if (asset.endsWith(`.${FileTypes.EXT_WAV}`)) {
                  if (environBundleAssets[environDirent.name][FileTypes.EXT_WAV] === undefined) {
                    environBundleAssets[environDirent.name][FileTypes.EXT_WAV] = [];
                  }

                  environBundleAssets[environDirent.name][FileTypes.EXT_WAV].push(assetPathRelative);
                }

                // Image files...
                
                if (asset.endsWith(`.${FileTypes.EXT_GIF}`)) {
                  if (environBundleAssets[environDirent.name][FileTypes.EXT_GIF] === undefined) {
                    environBundleAssets[environDirent.name][FileTypes.EXT_GIF] = [];
                  }
      
                  environBundleAssets[environDirent.name][FileTypes.EXT_GIF].push(assetPathRelative);
                }
      
                if (asset.endsWith(`.${FileTypes.EXT_JPG}`)) {
                  if (environBundleAssets[environDirent.name][FileTypes.EXT_JPG] === undefined) {
                    environBundleAssets[environDirent.name][FileTypes.EXT_JPG] = [];
                  }
      
                  environBundleAssets[environDirent.name][FileTypes.EXT_JPG].push(assetPathRelative);
                }
      
                if (asset.endsWith(`.${FileTypes.EXT_JPEG}`)) {
                  if (environBundleAssets[environDirent.name][FileTypes.EXT_JPEG] === undefined) {
                    environBundleAssets[environDirent.name][FileTypes.EXT_JPEG] = [];
                  }
      
                  environBundleAssets[environDirent.name][FileTypes.EXT_JPEG].push(assetPathRelative);
                }
      
                if (asset.endsWith(`.${FileTypes.EXT_PNG}`)) {
                  if (environBundleAssets[environDirent.name][FileTypes.EXT_PNG] === undefined) {
                    environBundleAssets[environDirent.name][FileTypes.EXT_PNG] = [];
                  }
      
                  environBundleAssets[environDirent.name][FileTypes.EXT_PNG].push(assetPathRelative);
                }
      
                if (asset.endsWith(`.${FileTypes.EXT_SVG}`)) {
                  if (environBundleAssets[environDirent.name][FileTypes.EXT_SVG] === undefined) {
                    environBundleAssets[environDirent.name][FileTypes.EXT_SVG] = [];
                  }
      
                  environBundleAssets[environDirent.name][FileTypes.EXT_SVG].push(assetPathRelative);
                }

                // Video files...

                if (asset.endsWith(`.${FileTypes.EXT_AVI}`)) {
                  if (environBundleAssets[environDirent.name][FileTypes.EXT_AVI] === undefined) {
                    environBundleAssets[environDirent.name][FileTypes.EXT_AVI] = [];
                  }
      
                  environBundleAssets[environDirent.name][FileTypes.EXT_AVI].push(assetPathRelative);
                }
      
                if (asset.endsWith(`.${FileTypes.EXT_FLV}`)) {
                  if (environBundleAssets[environDirent.name][FileTypes.EXT_FLV] === undefined) {
                    environBundleAssets[environDirent.name][FileTypes.EXT_FLV] = [];
                  }
      
                  environBundleAssets[environDirent.name][FileTypes.EXT_FLV].push(assetPathRelative);
                }
      
                if (asset.endsWith(`.${FileTypes.EXT_M4V}`)) {
                  if (environBundleAssets[environDirent.name][FileTypes.EXT_M4V] === undefined) {
                    environBundleAssets[environDirent.name][FileTypes.EXT_M4V] = [];
                  }
      
                  environBundleAssets[environDirent.name][FileTypes.EXT_M4V].push(assetPathRelative);
                }
   
                if (asset.endsWith(`.${FileTypes.EXT_MOV}`)) {
                  if (environBundleAssets[environDirent.name][FileTypes.EXT_MOV] === undefined) {
                    environBundleAssets[environDirent.name][FileTypes.EXT_MOV] = [];
                  }
      
                  environBundleAssets[environDirent.name][FileTypes.EXT_MOV].push(assetPathRelative);
                }
      
                if (asset.endsWith(`.${FileTypes.EXT_MP2}`)) {
                  if (environBundleAssets[environDirent.name][FileTypes.EXT_MP2] === undefined) {
                    environBundleAssets[environDirent.name][FileTypes.EXT_MP2] = [];
                  }
      
                  environBundleAssets[environDirent.name][FileTypes.EXT_MP2].push(assetPathRelative);
                }

                if (asset.endsWith(`.${FileTypes.EXT_MPE}`)) {
                  if (environBundleAssets[environDirent.name][FileTypes.EXT_MPE] === undefined) {
                    environBundleAssets[environDirent.name][FileTypes.EXT_MPE] = [];
                  }
      
                  environBundleAssets[environDirent.name][FileTypes.EXT_MPE].push(assetPathRelative);
                }
      
                if (asset.endsWith(`.${FileTypes.EXT_MPG}`)) {
                  if (environBundleAssets[environDirent.name][FileTypes.EXT_MPG] === undefined) {
                    environBundleAssets[environDirent.name][FileTypes.EXT_MPG] = [];
                  }
      
                  environBundleAssets[environDirent.name][FileTypes.EXT_MPG].push(assetPathRelative);
                }
      
                if (asset.endsWith(`.${FileTypes.EXT_MPV}`)) {
                  if (environBundleAssets[environDirent.name][FileTypes.EXT_MPV] === undefined) {
                    environBundleAssets[environDirent.name][FileTypes.EXT_MPV] = [];
                  }

                  environBundleAssets[environDirent.name][FileTypes.EXT_MPV].push(assetPathRelative);
                }

                if (asset.endsWith(`.${FileTypes.EXT_OGG}`)) {
                  if (environBundleAssets[environDirent.name][FileTypes.EXT_OGG] === undefined) {
                    environBundleAssets[environDirent.name][FileTypes.EXT_OGG] = [];
                  }
      
                  environBundleAssets[environDirent.name][FileTypes.EXT_OGG].push(assetPathRelative);
                }

                if (asset.endsWith(`.${FileTypes.EXT_QT}`)) {
                  if (environBundleAssets[environDirent.name][FileTypes.EXT_QT] === undefined) {
                    environBundleAssets[environDirent.name][FileTypes.EXT_QT] = [];
                  }
      
                  environBundleAssets[environDirent.name][FileTypes.EXT_QT].push(assetPathRelative);
                }
      
                if (asset.endsWith(`.${FileTypes.EXT_SWF}`)) {
                  if (environBundleAssets[environDirent.name][FileTypes.EXT_SWF] === undefined) {
                    environBundleAssets[environDirent.name][FileTypes.EXT_SWF] = [];
                  }
      
                  environBundleAssets[environDirent.name][FileTypes.EXT_SWF].push(assetPathRelative);
                }
      
                if (asset.endsWith(`.${FileTypes.EXT_WEBM}`)) {
                  if (environBundleAssets[environDirent.name][FileTypes.EXT_WEBM] === undefined) {
                    environBundleAssets[environDirent.name][FileTypes.EXT_WEBM] = [];
                  }

                  environBundleAssets[environDirent.name][FileTypes.EXT_WEBM].push(assetPathRelative);
                }

                if (asset.endsWith(`.${FileTypes.EXT_WMV}`)) {
                  if (environBundleAssets[environDirent.name][FileTypes.EXT_WMV] === undefined) {
                    environBundleAssets[environDirent.name][FileTypes.EXT_WMV] = [];
                  }
      
                  environBundleAssets[environDirent.name][FileTypes.EXT_WMV].push(assetPathRelative);
                }

                //  Webfonts...

                if (asset.endsWith(`.${FileTypes.EXT_EOF}`)) {
                  if (environBundleAssets[environDirent.name][FileTypes.EXT_EOF] === undefined) {
                    environBundleAssets[environDirent.name][FileTypes.EXT_EOF] = [];
                  }
      
                  environBundleAssets[environDirent.name][FileTypes.EXT_EOF].push(assetPathRelative);
                }
      
                if (asset.endsWith(`.${FileTypes.EXT_OTF}`)) {
                  if (environBundleAssets[environDirent.name][FileTypes.EXT_OTF] === undefined) {
                    environBundleAssets[environDirent.name][FileTypes.EXT_OTF] = [];
                  }
      
                  environBundleAssets[environDirent.name][FileTypes.EXT_OTF].push(assetPathRelative);
                }
      
                if (asset.endsWith(`.${FileTypes.EXT_TTF}`)) {
                  if (environBundleAssets[environDirent.name][FileTypes.EXT_TTF] === undefined) {
                    environBundleAssets[environDirent.name][FileTypes.EXT_TTF] = [];
                  }

                  environBundleAssets[environDirent.name][FileTypes.EXT_TTF].push(assetPathRelative);
                }

                if (asset.endsWith(`.${FileTypes.EXT_WOFF}`)) {
                  if (environBundleAssets[environDirent.name][FileTypes.EXT_WOFF] === undefined) {
                    environBundleAssets[environDirent.name][FileTypes.EXT_WOFF] = [];
                  }

                  environBundleAssets[environDirent.name][FileTypes.EXT_WOFF].push(assetPathRelative);
                }

                if (asset.endsWith(`.${FileTypes.EXT_WOFF2}`)) {
                  if (environBundleAssets[environDirent.name][FileTypes.EXT_WOFF2] === undefined) {
                    environBundleAssets[environDirent.name][FileTypes.EXT_WOFF2] = [];
                  }

                  environBundleAssets[environDirent.name][FileTypes.EXT_WOFF2].push(assetPathRelative);
                }

                // Source maps...

                if (asset.endsWith(`.${FileTypes.EXT_SOURCE_MAP}`)) {
                  if (environBundleAssets[environDirent.name][FileTypes.EXT_SOURCE_MAP] === undefined) {
                    environBundleAssets[environDirent.name][FileTypes.EXT_SOURCE_MAP] = [];
                  }

                  environBundleAssets[environDirent.name][FileTypes.EXT_SOURCE_MAP].push(assetPathRelative);
                }
              });
            }

            distributionBundleAssets[Workspaces[wsKey]] = environBundleAssets
          }
        });
      }
    }
  });
  
  return distributionBundleAssets;
};

const getServerSrvAssets = () => {
  const serverSrvAssets = {};

  let unorderedServerSrvAssets = FileSystemUtils.getAllPathNamesInDirectoryTree(
      Paths.SERVER_FILES_ABSOLUTE,
      'file',
      [
        // Common file types...
        FileTypes.EXT_CSS, 
        FileTypes.EXT_JS,
        FileTypes.EXT_HTML,

        // Audio files...
        FileTypes.EXT_AAC,
        FileTypes.EXT_AIFF,
        FileTypes.EXT_FLAC ,
        FileTypes.EXT_M4A,
        FileTypes.EXT_MP3,
        FileTypes.EXT_OGA,
        FileTypes.EXT_PCM,
        FileTypes.EXT_WAV,

        // Image files...
        FileTypes.EXT_GIF,
        FileTypes.EXT_JPG,
        FileTypes.EXT_JPEG,
        FileTypes.EXT_PNG,
        FileTypes.EXT_SVG,

        // Video files...
        FileTypes.EXT_AVI,
        FileTypes.EXT_FLV,
        FileTypes.EXT_M4V ,
        FileTypes.EXT_MOV,
        FileTypes.EXT_MP2,
        FileTypes.EXT_MPE,
        FileTypes.EXT_MPG,
        FileTypes.EXT_MPV,
        FileTypes.EXT_OGG,
        FileTypes.EXT_QT,
        FileTypes.EXT_SWF,
        FileTypes.EXT_WEBM,
        FileTypes.EXT_WMV,

        //  Webfonts...
        FileTypes.EXT_EOF,
        FileTypes.EXT_OTF,
        FileTypes.EXT_TTF,
        FileTypes.EXT_WOFF,
        FileTypes.EXT_WOFF2,

        // Source maps...
        FileTypes.EXT_SOURCE_MAP
      ]
    );

  if (CommonUtils.isNonEmptyArray(unorderedServerSrvAssets)) {
    unorderedServerSrvAssets.forEach((asset) => {
      let assetPathRelative = `${Paths.SERVER_FILES_RELATIVE}/${asset}`;

      // Common file types...

      if (asset.endsWith(`.${FileTypes.EXT_CSS}`)) {
        if (serverSrvAssets[FileTypes.EXT_CSS] === undefined) {
          serverSrvAssets[FileTypes.EXT_CSS] = [];
        }

        serverSrvAssets[FileTypes.EXT_CSS].push(assetPathRelative);
      }

      if (asset.endsWith(`.${FileTypes.EXT_JS}`)) {
        if (serverSrvAssets[FileTypes.EXT_JS] === undefined) {
          serverSrvAssets[FileTypes.EXT_JS] = [];
        }

        serverSrvAssets[FileTypes.EXT_JS].push(assetPathRelative);
      }

      if (asset.endsWith(`.${FileTypes.EXT_HTML}`)) {
        if (serverSrvAssets[FileTypes.EXT_HTML] === undefined) {
          serverSrvAssets[FileTypes.EXT_HTML] = [];
        }

        serverSrvAssets[FileTypes.EXT_HTML].push(assetPathRelative);
      }

      // Audio files...

      if (asset.endsWith(`.${FileTypes.EXT_AAC}`)) {
        if (serverSrvAssets[FileTypes.EXT_AAC] === undefined) {
          serverSrvAssets[FileTypes.EXT_AAC] = [];
        }

        serverSrvAssets[FileTypes.EXT_AAC].push(assetPathRelative);
      }

      if (asset.endsWith(`.${FileTypes.EXT_AIFF}`)) {
        if (serverSrvAssets[FileTypes.EXT_AIFF] === undefined) {
          serverSrvAssets[FileTypes.EXT_AIFF] = [];
        }

        serverSrvAssets[FileTypes.EXT_AIFF].push(assetPathRelative);
      }

      if (asset.endsWith(`.${FileTypes.EXT_FLAC}`)) {
        if (serverSrvAssets[FileTypes.EXT_FLAC] === undefined) {
          serverSrvAssets[FileTypes.EXT_FLAC] = [];
        }

        serverSrvAssets[FileTypes.EXT_FLAC].push(assetPathRelative);
      }

      if (asset.endsWith(`.${FileTypes.EXT_M4A}`)) {
        if (serverSrvAssets[FileTypes.EXT_M4A] === undefined) {
          serverSrvAssets[FileTypes.EXT_M4A] = [];
        }

        serverSrvAssets[FileTypes.EXT_M4A].push(assetPathRelative);
      }

      if (asset.endsWith(`.${FileTypes.EXT_MP3}`)) {
        if (serverSrvAssets[FileTypes.EXT_MP3] === undefined) {
          serverSrvAssets[FileTypes.EXT_MP3] = [];
        }

        serverSrvAssets[FileTypes.EXT_MP3].push(assetPathRelative);
      }

      if (asset.endsWith(`.${FileTypes.EXT_OGA}`)) {
        if (serverSrvAssets[FileTypes.EXT_OGA] === undefined) {
          serverSrvAssets[FileTypes.EXT_OGA] = [];
        }

        serverSrvAssets[FileTypes.EXT_OGA].push(assetPathRelative);
      }

      if (asset.endsWith(`.${FileTypes.EXT_PCM}`)) {
        if (serverSrvAssets[FileTypes.EXT_PCM] === undefined) {
          serverSrvAssets[FileTypes.EXT_PCM] = [];
        }

        serverSrvAssets[FileTypes.EXT_PCM].push(assetPathRelative);
      }

      if (asset.endsWith(`.${FileTypes.EXT_WAV}`)) {
        if (serverSrvAssets[FileTypes.EXT_WAV] === undefined) {
          serverSrvAssets[FileTypes.EXT_WAV] = [];
        }

        serverSrvAssets[FileTypes.EXT_WAV].push(assetPathRelative);
      }

      // Image files...

      if (asset.endsWith(`.${FileTypes.EXT_GIF}`)) {
        if (serverSrvAssets[FileTypes.EXT_GIF] === undefined) {
          serverSrvAssets[FileTypes.EXT_GIF] = [];
        }

        serverSrvAssets[FileTypes.EXT_GIF].push(assetPathRelative);
      }

      if (asset.endsWith(`.${FileTypes.EXT_JPG}`)) {
        if (serverSrvAssets[FileTypes.EXT_JPG] === undefined) {
          serverSrvAssets[FileTypes.EXT_JPG] = [];
        }

        serverSrvAssets[FileTypes.EXT_JPG].push(assetPathRelative);
      }

      if (asset.endsWith(`.${FileTypes.EXT_JPEG}`)) {
        if (serverSrvAssets[FileTypes.EXT_JPEG] === undefined) {
          serverSrvAssets[FileTypes.EXT_JPEG] = [];
        }

        serverSrvAssets[FileTypes.EXT_JPEG].push(assetPathRelative);
      }

      if (asset.endsWith(`.${FileTypes.EXT_PNG}`)) {
        if (serverSrvAssets[FileTypes.EXT_PNG] === undefined) {
          serverSrvAssets[FileTypes.EXT_PNG] = [];
        }

        serverSrvAssets[FileTypes.EXT_PNG].push(assetPathRelative);
      }

      if (asset.endsWith(`.${FileTypes.EXT_SVG}`)) {
        if (serverSrvAssets[FileTypes.EXT_SVG] === undefined) {
          serverSrvAssets[FileTypes.EXT_SVG] = [];
        }

        serverSrvAssets[FileTypes.EXT_SVG].push(assetPathRelative);
      }

      // Video files...

      if (asset.endsWith(`.${FileTypes.EXT_AVI}`)) {
        if (serverSrvAssets[FileTypes.EXT_AVI] === undefined) {
          serverSrvAssets[FileTypes.EXT_AVI] = [];
        }

        serverSrvAssets[FileTypes.EXT_AVI].push(assetPathRelative);
      }

      if (asset.endsWith(`.${FileTypes.EXT_FLV}`)) {
        if (serverSrvAssets[FileTypes.EXT_FLV] === undefined) {
          serverSrvAssets[FileTypes.EXT_FLV] = [];
        }

        serverSrvAssets[FileTypes.EXT_FLV].push(assetPathRelative);
      }

      if (asset.endsWith(`.${FileTypes.EXT_M4V}`)) {
        if (serverSrvAssets[FileTypes.EXT_M4V] === undefined) {
          serverSrvAssets[FileTypes.EXT_M4V] = [];
        }

        serverSrvAssets[FileTypes.EXT_M4V].push(assetPathRelative);
      }

      if (asset.endsWith(`.${FileTypes.EXT_MOV}`)) {
        if (serverSrvAssets[FileTypes.EXT_MOV] === undefined) {
          serverSrvAssets[FileTypes.EXT_MOV] = [];
        }

        serverSrvAssets[FileTypes.EXT_MOV].push(assetPathRelative);
      }

      if (asset.endsWith(`.${FileTypes.EXT_MP2}`)) {
        if (serverSrvAssets[FileTypes.EXT_MP2] === undefined) {
          serverSrvAssets[FileTypes.EXT_MP2] = [];
        }

        serverSrvAssets[FileTypes.EXT_MP2].push(assetPathRelative);
      }

      if (asset.endsWith(`.${FileTypes.EXT_MPE}`)) {
        if (serverSrvAssets[FileTypes.EXT_MPE] === undefined) {
          serverSrvAssets[FileTypes.EXT_MPE] = [];
        }

        serverSrvAssets[FileTypes.EXT_MPE].push(assetPathRelative);
      }

      if (asset.endsWith(`.${FileTypes.EXT_MPG}`)) {
        if (serverSrvAssets[FileTypes.EXT_MPG] === undefined) {
          serverSrvAssets[FileTypes.EXT_MPG] = [];
        }

        serverSrvAssets[FileTypes.EXT_MPG].push(assetPathRelative);
      }

      if (asset.endsWith(`.${FileTypes.EXT_MPV}`)) {
        if (serverSrvAssets[FileTypes.EXT_MPV] === undefined) {
          serverSrvAssets[FileTypes.EXT_MPV] = [];
        }

        serverSrvAssets[FileTypes.EXT_MPV].push(assetPathRelative);
      }

      if (asset.endsWith(`.${FileTypes.EXT_OGG}`)) {
        if (serverSrvAssets[FileTypes.EXT_OGG] === undefined) {
          serverSrvAssets[FileTypes.EXT_OGG] = [];
        }

        serverSrvAssets[FileTypes.EXT_OGG].push(assetPathRelative);
      }

      if (asset.endsWith(`.${FileTypes.EXT_QT}`)) {
        if (serverSrvAssets[FileTypes.EXT_QT] === undefined) {
          serverSrvAssets[FileTypes.EXT_QT] = [];
        }

        serverSrvAssets[FileTypes.EXT_QT].push(assetPathRelative);
      }

      if (asset.endsWith(`.${FileTypes.EXT_SWF}`)) {
        if (serverSrvAssets[FileTypes.EXT_SWF] === undefined) {
          serverSrvAssets[FileTypes.EXT_SWF] = [];
        }

        serverSrvAssets[FileTypes.EXT_SWF].push(assetPathRelative);
      }

      if (asset.endsWith(`.${FileTypes.EXT_WEBM}`)) {
        if (serverSrvAssets[FileTypes.EXT_WEBM] === undefined) {
          serverSrvAssets[FileTypes.EXT_WEBM] = [];
        }

        serverSrvAssets[FileTypes.EXT_WEBM].push(assetPathRelative);
      }

      if (asset.endsWith(`.${FileTypes.EXT_WMV}`)) {
        if (serverSrvAssets[FileTypes.EXT_WMV] === undefined) {
          serverSrvAssets[FileTypes.EXT_WMV] = [];
        }

        serverSrvAssets[FileTypes.EXT_WMV].push(assetPathRelative);
      }

      //  Webfonts...

      if (asset.endsWith(`.${FileTypes.EXT_EOF}`)) {
        if (serverSrvAssets[FileTypes.EXT_EOF] === undefined) {
          serverSrvAssets[FileTypes.EXT_EOF] = [];
        }

        serverSrvAssets[FileTypes.EXT_EOF].push(assetPathRelative);
      }

      if (asset.endsWith(`.${FileTypes.EXT_OTF}`)) {
        if (serverSrvAssets[FileTypes.EXT_OTF] === undefined) {
          serverSrvAssets[FileTypes.EXT_OTF] = [];
        }

        serverSrvAssets[FileTypes.EXT_OTF].push(assetPathRelative);
      }

      if (asset.endsWith(`.${FileTypes.EXT_TTF}`)) {
        if (serverSrvAssets[FileTypes.EXT_TTF] === undefined) {
          serverSrvAssets[FileTypes.EXT_TTF] = [];
        }

        serverSrvAssets[FileTypes.EXT_TTF].push(assetPathRelative);
      }

      if (asset.endsWith(`.${FileTypes.EXT_WOFF}`)) {
        if (serverSrvAssets[FileTypes.EXT_WOFF] === undefined) {
          serverSrvAssets[FileTypes.EXT_WOFF] = [];
        }

        serverSrvAssets[FileTypes.EXT_WOFF].push(assetPathRelative);
      }

      if (asset.endsWith(`.${FileTypes.EXT_WOFF2}`)) {
        if (serverSrvAssets[FileTypes.EXT_WOFF2] === undefined) {
          serverSrvAssets[FileTypes.EXT_WOFF2] = [];
        }

        serverSrvAssets[FileTypes.EXT_WOFF2].push(assetPathRelative);
      }

      // Source maps...

      if (asset.endsWith(`.${FileTypes.EXT_SOURCE_MAP}`)) {
        if (serverSrvAssets[FileTypes.EXT_SOURCE_MAP] === undefined) {
          serverSrvAssets[FileTypes.EXT_SOURCE_MAP] = [];
        }

        serverSrvAssets[FileTypes.EXT_SOURCE_MAP].push(assetPathRelative);
      }
    });
  }

  return serverSrvAssets;
};

const getTestOutputBundleAssets = () => {
  const testOutputBundleAssets = {};

  let testOutputHtmlAssets = FileSystemUtils.getAllPathNamesInDirectoryTree(
      `${Paths.TEST_OUTPUT_ABSOLUTE}/${Paths.REPORT_RELATIVE}`,
      'file',
      [ FileTypes.EXT_HTML ]
    );

  if (CommonUtils.isNonEmptyArray(testOutputHtmlAssets)) {
    testOutputHtmlAssets.forEach((asset) => {
      if (testOutputBundleAssets[FileTypes.EXT_HTML] === undefined) {
        testOutputBundleAssets[FileTypes.EXT_HTML] = [];
      }

      testOutputBundleAssets[FileTypes.EXT_HTML].push(
        `${Paths.TEST_RELATIVE}/${Paths.REPORT_RELATIVE}/${asset}`
      );
    });
  }

  return testOutputBundleAssets;
};

let address = process.env[VarNames.SERVER_ADDRESS];

if (!CommonUtils.isNonEmptyString(address)) {
  address = Paths.SERVER_ADDRESS_LOCALHOST;
}

// Change to '0.0.0.0', to share over a network...
if (process.env[VarNames.SERVER_SHOULD_NETWORK] === 'true') {
  address = '0.0.0.0';
}

let port = process.env[VarNames.SERVER_PORT];

if (!CommonUtils.isNonEmptyString(port)) {
  port = Paths.SERVER_PORT;
}

let shouldHotReload = process.env[VarNames.SERVER_SHOULD_HOT_RELOAD];

if (shouldHotReload !== 'false') {
  shouldHotReload = 'true';
}

const serverConfig = {
  address,
  port,
  routes: {
    files: {
      relativeTo: Paths.BUILD_DIST_ABSOLUTE
    },  
    cors: true
  }
};

const server = new Hapi.Server(serverConfig);

WebpackDevInMemory.initWebpack(
  address,
  port,
  (shouldHotReload === 'true')
);

server.ext('onRequest', (request, h) => {
  let response;
  
  try {
    WebpackDevInMemory.callDevMiddleware(request.raw.req, request.raw.res, (err) => {
      if (err) {
        response = h.response(err);
      } else {
        response = h.continue;
      }
    });
  } catch (err) {
    response = err;
    console.error(err);
  }

  if (!response) {
    request._isReplied = request.raw.res.finished;
    response = h.abandon;
  }

  return response;
});

server.ext('onRequest', (request, h) => {
  let response;

  try {
    WebpackDevInMemory.callHotMiddleware(request.raw.req, request.raw.res, (err) => {
      if (err) {
        response = h.response(err);
      } else {
        response = h.continue;
      }
    });
  } catch (err) {
    response = err;
    console.error(err);
  }

  if (!response) {
    request._isReplied = request.raw.res.finished;
    response = h.abandon;
  }

  return response;
});

const startServer = async () => {
  try {
    await server.register(Inert);
    console.log('Hapi Inert static resource handling registered...');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  /**
   * Serve in-memory, hot, live-updating bundles,
   * from webpack-dev-middleware, from virutal directory /srv/mmry...
   */
  server.route({
    method: 'GET',
    path: `/${Paths.SERVER_FILES_MMRY_RELATIVE}/{path*}`,
    handler: {
      directory: {
        // 'path' should absolute path for relative public path assigned to webpack-dev-middleware...
        path: Paths.SERVER_FILES_MMRY_ABSOLUTE,
        redirectToSlash: true,
        index: false,
        listing: true
      }
    }
  });

  /**
   * Serve static, generated bundles, from the build output path, 
   * which can be either dev or prod bundles,
   * from either Preact or React...
   */
  Object.keys(Workspaces).forEach((wsKey) => {
    let bundleDistUrlPathBase = `/${Paths.DIST_RELATIVE}/${Workspaces[wsKey]}`;

    let workspaceBuildDistDirectoryPathAbsolute
      = `/${Paths.WORKSPACES_ABSOLUTE}/${Workspaces[wsKey]}/${Paths.BUILD_RELATIVE}/${Paths.DIST_RELATIVE}`;

    server.route({
      method: 'GET',
      path: `${bundleDistUrlPathBase}/{path*}`,
      handler: {
        directory: {
        path: workspaceBuildDistDirectoryPathAbsolute,
          redirectToSlash: true,
          index: false,
          listing: true
        }
      }
    });
  });

  /**
   * Serve test report output...
   */
  server.route({
    method: 'GET',
    path: `/${Paths.TEST_RELATIVE}/{path*}`,
    handler: {
      directory: {
        path: Paths.TEST_OUTPUT_ABSOLUTE,
        redirectToSlash: true,
        index: false,
        listing: true
      }
    }
  });

  /**
   * Serve all other static files, from directory /server/srv...
   */
  server.route({
    method: 'GET',
    path: `/${Paths.SERVER_FILES_RELATIVE}/{path*}`,
    handler: {
      directory: {
        path: Paths.SERVER_FILES_ABSOLUTE,
        redirectToSlash: true,
        index: false,
        listing: true
      }
    }
  });

  /**
   * Serve a JSON object, containing all assets available,
   * with relative paths, organized by source and type,
   * for in-memory webpack dev bundles,
   * as well as built distibution bundles,
   * as well as test report assets...
   */
  server.route({
    method: 'GET',
    path: `/${Paths.SERVER_ASSETS_AVAIL_RELATIVE}`,
    handler: (request, h) => {
      const assetsAvailable = {};

      const distributionBundleAssets = getDistributionBundleAssets();
      const inMemoryBundleAssets = WebpackDevInMemory.getInMemoryBundleAssets();
      const serverSrvAssets = getServerSrvAssets();
      const testOutputBundleAssets = getTestOutputBundleAssets();

      if (CommonUtils.isNonEmptyObject(inMemoryBundleAssets)) {
        assetsAvailable[Paths.SERVER_FILES_MMRY_RELATIVE] = inMemoryBundleAssets;
      }

      if (CommonUtils.isNonEmptyObject(serverSrvAssets)) {
        assetsAvailable[Paths.SERVER_FILES_RELATIVE] = serverSrvAssets;
      }

      if (CommonUtils.isNonEmptyObject(distributionBundleAssets)) {
        assetsAvailable[Paths.DIST_RELATIVE] = distributionBundleAssets;
      }

      if (CommonUtils.isNonEmptyObject(testOutputBundleAssets)) {
        assetsAvailable[Paths.TEST_RELATIVE] = testOutputBundleAssets;
      }

      return assetsAvailable;
    }
  });

  try {
    await server.start();

    const serverUrlBase = `${server.info.protocol}://${address}:${port}`;

    console.log(
      colors.blue.bold.underline(
        `Hallo! Welcome, to ${AppInfo.APP_NAME}, powered by Hapi!`
      )
    );
    console.log(
      colors.green(
        `The server is ready to take requests, at base URL: ${serverUrlBase}`
      )
    );
    console.log('');

    if (process.env[VarNames.SERVER_SHOULD_NETWORK] === 'true') {
      console.log('Network access to assets served is ' + colors.green('ACTIVE'));
    } else {
      console.log('Network access to assets served is ' + colors.yellow('INACTIVE'));
    }
    console.log('');

    console.log(`${colors.blue.bold('Endpoints')}:`);
    console.log('');

    console.log('JSON object, containing paths, to all assets served, structured by source and type:');
    console.log(
      colors.blue(
        `${serverUrlBase}/${Paths.SERVER_ASSETS_AVAIL_RELATIVE}`
      )
    );

    console.log('');
    console.log('In-memory webpack bundles (base URL):');
    console.log(
      colors.blue(`${serverUrlBase}/${Paths.SERVER_FILES_MMRY_RELATIVE}`)
    );

    console.log('In-memory webpack bundles will be provided for:');
    console.log(`Workspace: ${colors.green(CurrentVarValues.WORKSPACE)}`);

    switch (CurrentVarValues.ENVIRON) {
      case Environs.DEV:
        console.log(`Environment: ${colors.green('development')}`);
        break;

      case Environs.PROD:
        console.log(`Environment: ${colors.green('production')}`);
        break;

      case Environs.PROD_DEV:
        console.log(`Environment: ${colors.green('production+development')}`);
        break;
    }

    if (shouldHotReload === 'true') {
      console.log(`Hot page reloading is: ${colors.green('ACTIVE')}`);
    } else {
      console.log(`Hot page reloading is: ${colors.yellow('INACTIVE')}`);
    }

    // This will, normally, NOT be populated, at this stage...
    const inMemoryBundleAssets = WebpackDevInMemory.getInMemoryBundleAssets();

    if (CommonUtils.isNonEmptyObject(inMemoryBundleAssets)) {
      console.log('Paths:');

      Object.keys(inMemoryBundleAssets).forEach((key) => {
        inMemoryBundleAssets[key].forEach((asset) => {
          console.log(
            colors.green(asset)
          );
        });
      });
    }

    const serverSrvAssets = getServerSrvAssets();

    if (CommonUtils.isNonEmptyObject(serverSrvAssets)) {
      console.log('');
      console.log('Manually-provided server files (base URL):');
      console.log(
        colors.blue(`${serverUrlBase}/${Paths.SERVER_FILES_RELATIVE}`)
      );
      console.log('Paths:');

      Object.keys(serverSrvAssets).forEach((key) => {
        serverSrvAssets[key].forEach((asset) => {
          console.log(
            colors.green(asset)
          );
        });
      });
    }

    const consoleOutWorkspaceMessageToPaths = getConsoleOutWorkspaceMessageToPaths();
    const consoleOutWorkspaceMessageToPathsKeys = Object.keys(consoleOutWorkspaceMessageToPaths);
    const distributionBundleAssets = getDistributionBundleAssets();

    if (CommonUtils.isNonEmptyArray(consoleOutWorkspaceMessageToPathsKeys)) {
      console.log('');
      console.log('Distribution build bundles (base URL):');
      console.log(
        colors.blue(`${serverUrlBase}/${Paths.DIST_RELATIVE}`)
      );
      console.log('Paths:');

      consoleOutWorkspaceMessageToPathsKeys.forEach((workspace) => {
        console.log(
          `From workspace: ${colors.green(workspace)}:`
        );

        if (CommonUtils.isNonEmptyObject(distributionBundleAssets)) {
          if (CommonUtils.isNonEmptyObject(distributionBundleAssets[workspace])) {
            Object.keys(distributionBundleAssets[workspace]).forEach((environ) => {
              Object.keys(distributionBundleAssets[workspace][environ]).forEach((key) => {
                distributionBundleAssets[workspace][environ][key].forEach((asset) => {
                  console.log(
                    colors.green(asset)
                  );
                });
              });
            });
          }
        }
      });
    }

    const testOutputBundleAssets = getTestOutputBundleAssets();

    if (CommonUtils.isNonEmptyObject(testOutputBundleAssets)) {
      if (CommonUtils.isNonEmptyArray(testOutputBundleAssets[FileTypes.EXT_HTML])) {
        console.log('');
        console.log('Test output reports (base URL):');
        console.log(
          colors.blue(`${serverUrlBase}/${Paths.TEST_RELATIVE}/${Paths.REPORT_RELATIVE}`)
        );
        console.log('Paths:');

        testOutputBundleAssets[FileTypes.EXT_HTML].forEach((asset) => {
          console.log(
            colors.green(asset)
          );
        });
      }
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer();
