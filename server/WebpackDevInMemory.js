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
const WebpackDashboardPlugin = require('webpack-dashboard/plugin');

const Paths = require('../constant/Paths');
const AppInfo = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/AppInfo`);
const CurrentVarValues = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/CurrentVarValues`);
const FileTypes = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/FileTypes`);

const CommonUtils = require(`${Paths.UTIL_APP_ROOT_ABSOLUTE}/CommonUtils`);

let inMemoryBundleAssets = {};  

let webpack;
let webpackDevMiddleware;
let webpackHotMiddleware;

const callDevMiddleware = function(request, response, callback) {
  if (!CommonUtils.isAssignedNotNull(webpackDevMiddleware)) {
    console.log(
      colors.red.bold(
        'WebpackDevMiddleware is not instantiated! Did you call #initWebpack first?'
      )
    );
  }

  webpackDevMiddleware(request, response, callback);
};

const callHotMiddleware = function(request, response, callback) {
  if (!CommonUtils.isAssignedNotNull(webpackHotMiddleware)) {
    console.log(
      colors.red.bold(
        'WebpackDevMiddleware is not instantiated! Did you call #initWebpack first?'
      )
    );
  }

  webpackHotMiddleware(request, response, callback);
};

const getDevMiddleware = function() {
  if (!CommonUtils.isAssignedNotNull(webpackDevMiddleware)) {
    console.log(
      colors.red.bold(
        'WebpackDevMiddleware is not instantiated! Did you call #initWebpack first?'
      )
    );
  }

  return webpackDevMiddleware;
};

const getHotMiddleware = function() {
  if (!CommonUtils.isAssignedNotNull(webpackHotMiddleware)) {
    console.log(
      colors.red.bold(
        'webpackHotMiddleware is not instantiated! Did you call #initWebpack first?'
      )
    );
  }

  return webpackHotMiddleware;
};

const getInMemoryBundleAssets = function() {
  return inMemoryBundleAssets;
};

const getWebpack = function() {
  if (!CommonUtils.isAssignedNotNull(webpack)) {
    console.log(
      colors.red.bold(
        'webpack compiler is not instantiated! Did you call #initWebpack first?'
      )
    );
  }

  return webpack;
};

const initWebpack = function(devServerAddress, devServerPort, shouldHotReload) {
  const webpackConfig = require(
      `${Paths.CONFIG_CURRENT_WORKSPACE_ABSOLUTE}/webpack/webpack-${CurrentVarValues.ENVIRON}.config.js`
    );

  const currentWorkspace = CommonUtils.convertFirstStringCharToUpperCase(
      CurrentVarValues.WORKSPACE
    );

  if (CommonUtils.isNonEmptyObject(webpackConfig)) {
    console.log(
      colors.blue.bold(
        `Using Webpack configuration for: ${currentWorkspace}, at path: `
      ) + colors.green(
        `${Paths.CONFIG_CURRENT_WORKSPACE_ABSOLUTE}/webpack/webpack-${CurrentVarValues.ENVIRON}.config.js`
      )
    );
  } else {
    console.error(
      colors.red.bold(
        `ERROR! No Webpack config found for: ${currentWorkspace}, at path: `
      ) + colors.red(
        `${Paths.CONFIG_CURRENT_WORKSPACE_ABSOLUTE}/webpack/webpack-${CurrentVarValues.ENVIRON}.config.js`
      )
    );

    return;
  }

  const webpackPublicPath = `/${Paths.SERVER_FILES_MMRY_RELATIVE}`;
  
  webpackConfig.devServer = {
    host: devServerAddress,
    inline: shouldHotReload,
    liveReload: shouldHotReload,
    port: devServerPort,
    publicPath: webpackPublicPath,
    historyApiFallback: true,
    // Set to quiet - hand off output to the WebpackDashboardPlugin
    quiet: true
  };
  
  if (CurrentVarValues.SERVER_SHOULD_HOT_RELOAD) {
    let entryConfig = webpackConfig.entry;

    if (CommonUtils.isNonEmptyObject(entryConfig)) {
      entryConfig = entryConfig[AppInfo.CURRENT_WORKSPACE_APP_NAME];
    }
  
    if (CommonUtils.isAssignedNotNull(entryConfig)) {
      if (CommonUtils.isNonEmptyArray(entryConfig)) {
        webpackConfig.entry[AppInfo.CURRENT_WORKSPACE_APP_NAME] = [
          ...entryConfig,
          'webpack-hot-middleware/client?reload=true&timeout=1000'
        ];
      } else {
        webpackConfig.entry[AppInfo.CURRENT_WORKSPACE_APP_NAME] = [
          entryConfig,
          'webpack-hot-middleware/client?reload=true&timeout=1000'
        ];
      }
    }
  }
  
  webpackConfig.module.rules.forEach((rule) => {
    let testRgxAsStr = String(rule.test);

    rule.use.forEach((use) => {
      if (CommonUtils.isNonEmptyObject(use)) {
        if (CommonUtils.isNonEmptyObject(use.options)) {
          switch (testRgxAsStr) {
            case String(FileTypes.REGEX_EXT_AUDIO):
              if (use.loader === 'file-loader') {
                use.options.publicPath = `${webpackPublicPath}/${Paths.ASSET_RELATIVE}/${Paths.AUDIO_RELATIVE}`;
              }
              break;

            case String(FileTypes.REGEX_EXT_FONT):
              if (use.loader === 'file-loader') {
                use.options.publicPath = `${webpackPublicPath}/${Paths.ASSET_RELATIVE}/${Paths.FONT_RELATIVE}`;
              }
              break;
  
            case String(FileTypes.REGEX_EXT_IMAGE):
              if (use.loader === 'file-loader') {
                use.options.publicPath = `${webpackPublicPath}/${Paths.ASSET_RELATIVE}/${Paths.IMAGE_RELATIVE}`;
              }
              break;

            case String(FileTypes.REGEX_EXT_VIDEO):
              if (use.loader === 'file-loader') {
                use.options.publicPath = `${webpackPublicPath}/${Paths.ASSET_RELATIVE}/${Paths.VIDEO_RELATIVE}`;
              }
              break;
          }
        }
      }
    });
  });

  webpackConfig.output.publicPath = webpackPublicPath;

  webpackConfig.plugins = [
    ...webpackConfig.plugins,
    new Webpack.HotModuleReplacementPlugin(),
    new WebpackDashboardPlugin()
  ];

  webpack = Webpack(webpackConfig);

  webpack.hooks.shouldEmit.tap(
    'Populate in-memory bundle assets...',
    (compilation) => {
      const inMemoryBundleAssetsNext = {};  
      let assetPathRelativePrefix = webpackPublicPath;

      if (webpackPublicPath.indexOf('/') === 0) {
        assetPathRelativePrefix = assetPathRelativePrefix.substring(1);
      }

      Object.keys(compilation.assets).forEach((asset) => {
        // Don't include hot update files...
        if (asset.indexOf('hot-update') === -1) {
          let assetPathRelative = `${assetPathRelativePrefix}/${asset}`;

          // Common file types...

          if (asset.endsWith(`.${FileTypes.EXT_CSS}`)) {
            if (inMemoryBundleAssetsNext[FileTypes.EXT_CSS] === undefined) {
              inMemoryBundleAssetsNext[FileTypes.EXT_CSS] = [];
            }

            inMemoryBundleAssetsNext[FileTypes.EXT_CSS].push(assetPathRelative);
          }

          if (asset.endsWith(`.${FileTypes.EXT_JS}`)) {
            if (inMemoryBundleAssetsNext[FileTypes.EXT_JS] === undefined) {
              inMemoryBundleAssetsNext[FileTypes.EXT_JS] = [];
            }

            inMemoryBundleAssetsNext[FileTypes.EXT_JS].push(assetPathRelative);
          }

          if (asset.endsWith(`.${FileTypes.EXT_HTML}`)) {
            if (inMemoryBundleAssetsNext[FileTypes.EXT_HTML] === undefined) {
              inMemoryBundleAssetsNext[FileTypes.EXT_HTML] = [];
            }

            inMemoryBundleAssetsNext[FileTypes.EXT_HTML].push(assetPathRelative);
          }

          // Audio files...

          if (asset.endsWith(`.${FileTypes.EXT_AAC}`)) {
            if (inMemoryBundleAssetsNext[FileTypes.EXT_AAC] === undefined) {
              inMemoryBundleAssetsNext[FileTypes.EXT_AAC] = [];
            }

            inMemoryBundleAssetsNext[FileTypes.EXT_AAC].push(assetPathRelative);
          }

          if (asset.endsWith(`.${FileTypes.EXT_AIFF}`)) {
            if (inMemoryBundleAssetsNext[FileTypes.EXT_AIFF] === undefined) {
              inMemoryBundleAssetsNext[FileTypes.EXT_AIFF] = [];
            }

            inMemoryBundleAssetsNext[FileTypes.EXT_AIFF].push(assetPathRelative);
          }

          if (asset.endsWith(`.${FileTypes.EXT_FLAC}`)) {
            if (inMemoryBundleAssetsNext[FileTypes.EXT_FLAC] === undefined) {
              inMemoryBundleAssetsNext[FileTypes.EXT_FLAC] = [];
            }

            inMemoryBundleAssetsNext[FileTypes.EXT_FLAC].push(assetPathRelative);
          }

          if (asset.endsWith(`.${FileTypes.EXT_M4A}`)) {
            if (inMemoryBundleAssetsNext[FileTypes.EXT_M4A] === undefined) {
              inMemoryBundleAssetsNext[FileTypes.EXT_M4A] = [];
            }

            inMemoryBundleAssetsNext[FileTypes.EXT_M4A].push(assetPathRelative);
          }

          if (asset.endsWith(`.${FileTypes.EXT_MP3}`)) {
            if (inMemoryBundleAssetsNext[FileTypes.EXT_MP3] === undefined) {
              inMemoryBundleAssetsNext[FileTypes.EXT_MP3] = [];
            }

            inMemoryBundleAssetsNext[FileTypes.EXT_MP3].push(assetPathRelative);
          }

          if (asset.endsWith(`.${FileTypes.EXT_OGA}`)) {
            if (inMemoryBundleAssetsNext[FileTypes.EXT_OGA] === undefined) {
              inMemoryBundleAssetsNext[FileTypes.EXT_OGA] = [];
            }

            inMemoryBundleAssetsNext[FileTypes.EXT_OGA].push(assetPathRelative);
          }

          if (asset.endsWith(`.${FileTypes.EXT_PCM}`)) {
            if (inMemoryBundleAssetsNext[FileTypes.EXT_PCM] === undefined) {
              inMemoryBundleAssetsNext[FileTypes.EXT_PCM] = [];
            }

            inMemoryBundleAssetsNext[FileTypes.EXT_PCM].push(assetPathRelative);
          }

          if (asset.endsWith(`.${FileTypes.EXT_WAV}`)) {
            if (inMemoryBundleAssetsNext[FileTypes.EXT_WAV] === undefined) {
              inMemoryBundleAssetsNext[FileTypes.EXT_WAV] = [];
            }

            inMemoryBundleAssetsNext[FileTypes.EXT_WAV].push(assetPathRelative);
          }

          // Image files...

          if (asset.endsWith(`.${FileTypes.EXT_GIF}`)) {
            if (inMemoryBundleAssetsNext[FileTypes.EXT_GIF] === undefined) {
              inMemoryBundleAssetsNext[FileTypes.EXT_GIF] = [];
            }

            inMemoryBundleAssetsNext[FileTypes.EXT_GIF].push(assetPathRelative);
          }

          if (asset.endsWith(`.${FileTypes.EXT_JPG}`)) {
            if (inMemoryBundleAssetsNext[FileTypes.EXT_JPG] === undefined) {
              inMemoryBundleAssetsNext[FileTypes.EXT_JPG] = [];
            }

            inMemoryBundleAssetsNext[FileTypes.EXT_JPG].push(assetPathRelative);
          }

          if (asset.endsWith(`.${FileTypes.EXT_JPEG}`)) {
            if (inMemoryBundleAssetsNext[FileTypes.EXT_JPEG] === undefined) {
              inMemoryBundleAssetsNext[FileTypes.EXT_JPEG] = [];
            }

            inMemoryBundleAssetsNext[FileTypes.EXT_JPEG].push(assetPathRelative);
          }

          if (asset.endsWith(`.${FileTypes.EXT_PNG}`)) {
            if (inMemoryBundleAssetsNext[FileTypes.EXT_PNG] === undefined) {
              inMemoryBundleAssetsNext[FileTypes.EXT_PNG] = [];
            }

            inMemoryBundleAssetsNext[FileTypes.EXT_PNG].push(assetPathRelative);
          }

          if (asset.endsWith(`.${FileTypes.EXT_SVG}`)) {
            if (inMemoryBundleAssetsNext[FileTypes.EXT_SVG] === undefined) {
              inMemoryBundleAssetsNext[FileTypes.EXT_SVG] = [];
            }

            inMemoryBundleAssetsNext[FileTypes.EXT_SVG].push(assetPathRelative);
          }

          // Video files...

          if (asset.endsWith(`.${FileTypes.EXT_AVI}`)) {
            if (inMemoryBundleAssetsNext[FileTypes.EXT_AVI] === undefined) {
              inMemoryBundleAssetsNext[FileTypes.EXT_AVI] = [];
            }

            inMemoryBundleAssetsNext[FileTypes.EXT_AVI].push(assetPathRelative);
          }

          if (asset.endsWith(`.${FileTypes.EXT_FLV}`)) {
            if (inMemoryBundleAssetsNext[FileTypes.EXT_FLV] === undefined) {
              inMemoryBundleAssetsNext[FileTypes.EXT_FLV] = [];
            }

            inMemoryBundleAssetsNext[FileTypes.EXT_FLV].push(assetPathRelative);
          }

          if (asset.endsWith(`.${FileTypes.EXT_M4V}`)) {
            if (inMemoryBundleAssetsNext[FileTypes.EXT_M4V] === undefined) {
              inMemoryBundleAssetsNext[FileTypes.EXT_M4V] = [];
            }

            inMemoryBundleAssetsNext[FileTypes.EXT_M4V].push(assetPathRelative);
          }

          if (asset.endsWith(`.${FileTypes.EXT_MOV}`)) {
            if (inMemoryBundleAssetsNext[FileTypes.EXT_MOV] === undefined) {
              inMemoryBundleAssetsNext[FileTypes.EXT_MOV] = [];
            }

            inMemoryBundleAssetsNext[FileTypes.EXT_MOV].push(assetPathRelative);
          }

          if (asset.endsWith(`.${FileTypes.EXT_MP2}`)) {
            if (inMemoryBundleAssetsNext[FileTypes.EXT_MP2] === undefined) {
              inMemoryBundleAssetsNext[FileTypes.EXT_MP2] = [];
            }

            inMemoryBundleAssetsNext[FileTypes.EXT_MP2].push(assetPathRelative);
          }

          if (asset.endsWith(`.${FileTypes.EXT_MPE}`)) {
            if (inMemoryBundleAssetsNext[FileTypes.EXT_MPE] === undefined) {
              inMemoryBundleAssetsNext[FileTypes.EXT_MPE] = [];
            }

            inMemoryBundleAssetsNext[FileTypes.EXT_MPE].push(assetPathRelative);
          }

          if (asset.endsWith(`.${FileTypes.EXT_MPG}`)) {
            if (inMemoryBundleAssetsNext[FileTypes.EXT_MPG] === undefined) {
              inMemoryBundleAssetsNext[FileTypes.EXT_MPG] = [];
            }

            inMemoryBundleAssetsNext[FileTypes.EXT_MPG].push(assetPathRelative);
          }

          if (asset.endsWith(`.${FileTypes.EXT_MPV}`)) {
            if (inMemoryBundleAssetsNext[FileTypes.EXT_MPV] === undefined) {
              inMemoryBundleAssetsNext[FileTypes.EXT_MPV] = [];
            }

            inMemoryBundleAssetsNext[FileTypes.EXT_MPV].push(assetPathRelative);
          }

          if (asset.endsWith(`.${FileTypes.EXT_OGG}`)) {
            if (inMemoryBundleAssetsNext[FileTypes.EXT_OGG] === undefined) {
              inMemoryBundleAssetsNext[FileTypes.EXT_OGG] = [];
            }

            inMemoryBundleAssetsNext[FileTypes.EXT_OGG].push(assetPathRelative);
          }

          if (asset.endsWith(`.${FileTypes.EXT_QT}`)) {
            if (inMemoryBundleAssetsNext[FileTypes.EXT_QT] === undefined) {
              inMemoryBundleAssetsNext[FileTypes.EXT_QT] = [];
            }

            inMemoryBundleAssetsNext[FileTypes.EXT_QT].push(assetPathRelative);
          }

          if (asset.endsWith(`.${FileTypes.EXT_SWF}`)) {
            if (inMemoryBundleAssetsNext[FileTypes.EXT_SWF] === undefined) {
              inMemoryBundleAssetsNext[FileTypes.EXT_SWF] = [];
            }

            inMemoryBundleAssetsNext[FileTypes.EXT_SWF].push(assetPathRelative);
          }

          if (asset.endsWith(`.${FileTypes.EXT_WEBM}`)) {
            if (inMemoryBundleAssetsNext[FileTypes.EXT_WEBM] === undefined) {
              inMemoryBundleAssetsNext[FileTypes.EXT_WEBM] = [];
            }

            inMemoryBundleAssetsNext[FileTypes.EXT_WEBM].push(assetPathRelative);
          }

          if (asset.endsWith(`.${FileTypes.EXT_WMV}`)) {
            if (inMemoryBundleAssetsNext[FileTypes.EXT_WMV] === undefined) {
              inMemoryBundleAssetsNext[FileTypes.EXT_WMV] = [];
            }

            inMemoryBundleAssetsNext[FileTypes.EXT_WMV].push(assetPathRelative);
          }

          //  Webfonts...

          if (asset.endsWith(`.${FileTypes.EXT_EOF}`)) {
            if (inMemoryBundleAssetsNext[FileTypes.EXT_EOF] === undefined) {
              inMemoryBundleAssetsNext[FileTypes.EXT_EOF] = [];
            }

            inMemoryBundleAssetsNext[FileTypes.EXT_EOF].push(assetPathRelative);
          }

          if (asset.endsWith(`.${FileTypes.EXT_OTF}`)) {
            if (inMemoryBundleAssetsNext[FileTypes.EXT_OTF] === undefined) {
              inMemoryBundleAssetsNext[FileTypes.EXT_OTF] = [];
            }

            inMemoryBundleAssetsNext[FileTypes.EXT_OTF].push(assetPathRelative);
          }

          if (asset.endsWith(`.${FileTypes.EXT_TTF}`)) {
            if (inMemoryBundleAssetsNext[FileTypes.EXT_TTF] === undefined) {
              inMemoryBundleAssetsNext[FileTypes.EXT_TTF] = [];
            }

            inMemoryBundleAssetsNext[FileTypes.EXT_TTF].push(assetPathRelative);
          }

          if (asset.endsWith(`.${FileTypes.EXT_WOFF}`)) {
            if (inMemoryBundleAssetsNext[FileTypes.EXT_WOFF] === undefined) {
              inMemoryBundleAssetsNext[FileTypes.EXT_WOFF] = [];
            }

            inMemoryBundleAssetsNext[FileTypes.EXT_WOFF].push(assetPathRelative);
          }

          if (asset.endsWith(`.${FileTypes.EXT_WOFF2}`)) {
            if (inMemoryBundleAssetsNext[FileTypes.EXT_WOFF2] === undefined) {
              inMemoryBundleAssetsNext[FileTypes.EXT_WOFF2] = [];
            }

            inMemoryBundleAssetsNext[FileTypes.EXT_WOFF2].push(assetPathRelative);
          }

          // Source maps...

          if (asset.endsWith(`.${FileTypes.EXT_SOURCE_MAP}`)) {
            if (inMemoryBundleAssetsNext[FileTypes.EXT_SOURCE_MAP] === undefined) {
              inMemoryBundleAssetsNext[FileTypes.EXT_SOURCE_MAP] = [];
            }

            inMemoryBundleAssetsNext[FileTypes.EXT_SOURCE_MAP].push(assetPathRelative);
          }
        }
      });

      inMemoryBundleAssets = inMemoryBundleAssetsNext;

      return true;
    }
  );

  webpackDevMiddleware = require('webpack-dev-middleware')(webpack, {
      publicPath: webpackPublicPath
    });

  webpackHotMiddleware = require('webpack-hot-middleware')(
      webpack, {
      log: () => {}
    });

  return webpack;
};

module.exports = {
  callDevMiddleware,
  callHotMiddleware,
  getDevMiddleware,
  getHotMiddleware,
  getInMemoryBundleAssets,
  getWebpack,
  initWebpack,
};
