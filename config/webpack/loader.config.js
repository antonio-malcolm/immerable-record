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
const Webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const postcssPresetEnv = require('postcss-preset-env');

const Paths = require('../../constant/Paths');
const AppInfo = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/AppInfo`);
const CurrentVarValues = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/CurrentVarValues`);
const Environs = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/Environs`);
const FileTypes = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/FileTypes`);
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
    colors.blue(
      `Configuring babel, with configuration for workspace: ${CurrentVarValues.WORKSPACE}, at path: `
    ) + colors.green(
      babelConfigPathAbsolute
    )
  );
} else {
  console.log(
    colors.blue(
      `Configuring babel, with base configuration, at path: `
    ) + colors.green(
      babelConfigPathAbsolute
    )
  );
}

if (!(fs.existsSync(babelConfigPathAbsolute) && fs.statSync(babelConfigPathAbsolute).isFile())) {
  throw new SimpleBuildTimeException(
      `No babel configuration file found at: ${babelConfigPathAbsolute}`,
      './config/webpack/loader.config.js'
    );
}

try {
  babelConfig = require(babelConfigPathAbsolute);
} catch (err) {
  throw new SimpleBuildTimeException(
      `Could not parse babel configuration file, found at: ${babelConfigPathAbsolute}`,
      './config/webpack/loader.config.js',
      err
    );
}

if (!CommonUtils.isNonEmptyObject(babelConfig)) {
  throw new SimpleBuildTimeException(
      `No babel configuration data, in file, found at: ${babelConfigPathAbsolute}`,
      './config/webpack/loader.config.js'
    );
}

let supportedBrowsers;

try {
  supportedBrowsers = require(`${Paths.CONFIG_APP_ROOT_ABSOLUTE}/supported-browsers.js`);
} catch (err) {
  throw new SimpleBuildTimeException(
      `Could not parse supported browsers configuration file, found at: ${Paths.CONFIG_APP_ROOT_ABSOLUTE}/supported-browsers.js`,
      './config/webpack/loader.config.js',
      err
    );
}

if (!CommonUtils.isNonEmptyArray(supportedBrowsers)) {
  throw new SimpleBuildTimeException(
      `No supported browsers configuration data, in file, found at: ${Paths.CONFIG_APP_ROOT_ABSOLUTE}/supported-browsers.js`,
      './config/webpack/loader.config.js'
    );
}

const jsRuleInclude = [ Paths.SRC_APP_ROOT_ABSOLUTE ];

// Get /src directory from the current workspace, if one exists...
if (
  fs.existsSync(Paths.SRC_CURRENT_WORKSPACE_ABSOLUTE)
  && fs.statSync(Paths.SRC_CURRENT_WORKSPACE_ABSOLUTE).isDirectory()
) {
  console.log(
    colors.blue(
      `loader.config.js: Adding /${Paths.SRC_RELATIVE} directory, for workspace: ${CurrentVarValues.WORKSPACE}.`
    )
  );

  jsRuleInclude.push(Paths.SRC_CURRENT_WORKSPACE_ABSOLUTE);
}

const plugins = [];

if (CurrentVarValues.WORKSPACE !== Workspaces.IMMERABLE) {
  let minCssExtractPluginFileName = 
     `${AppInfo.CURRENT_WORKSPACE_APP_NAME}.${CurrentVarValues.WORKSPACE}.${CurrentVarValues.ENVIRON}`;
  
  if (CurrentVarValues.ENVIRON === Environs.PROD || CurrentVarValues.ENVIRON === Environs.PROD_DEV) {
    minCssExtractPluginFileName = `${minCssExtractPluginFileName}.[contenthash]`;
  
    plugins.push(
      new Webpack.optimize.MinChunkSizePlugin({
        minChunkSize: 500_000
      })
    );
  }
  
  plugins.push(
    new MiniCssExtractPlugin({
      filename: `${Paths.ASSET_RELATIVE}/${Paths.STYLE_RELATIVE}/${minCssExtractPluginFileName}.bundle.css`,
      chunkFilename: `${Paths.ASSET_RELATIVE}/${Paths.STYLE_RELATIVE}/${minCssExtractPluginFileName}.[id].chunk.css`
    })
  );
}

if (CurrentVarValues.SHOULD_GENERATE_BUNDLE_METRICS_VIEW) {
  plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'bundleMetricsView.html',
      defaultSizes: 'parsed',
      openAnalyzer: false
    }),
  );
}

module.exports = {
  plugins: [
    ...plugins
  ],
  rules: {
    jsRule: {
      test: FileTypes.REGEX_EXT_JS,
      include: jsRuleInclude,
      exclude: babelConfig.exclude,
      use: [{
        loader: 'babel-loader',
        options: {
          cacheDirectory: `${Paths.BUILD_CACHE_ABSOLUTE}/babel`,
          plugins: babelConfig.plugins,
          presets: babelConfig.presets
        }
      }]
    },
    cssRule: {
      test: FileTypes.REGEX_EXT_CSS,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            // We need both the postcss-loader and the sass-loader
            importLoaders: 2,
            modules: { auto: true },
            sourceMap: (
                CurrentVarValues.ENVIRON === Environs.DEV
                || CurrentVarValues.ENVIRON === Environs.PROD_DEV
              ),
            url: true
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              hideNothingWarning: true,
              plugins: () => [
                postcssPresetEnv({
                  autoprefixer: {
                    cascade: false,
                    overrideBrowserslist: supportedBrowsers
                  },
                  stage: 0
                })
              ]
            },
            sourceMap: (
                CurrentVarValues.ENVIRON === Environs.DEV
                || CurrentVarValues.ENVIRON === Environs.PROD_DEV
              )
          }
        },
        {
          loader: 'resolve-url-loader',
          options: {
            sourceMap: (
                CurrentVarValues.ENVIRON === Environs.DEV
                || CurrentVarValues.ENVIRON === Environs.PROD_DEV
              )
          }
        },
        {
          loader: 'sass-loader',
          options: {
            // Require dart sass implementation,
            // to support the current features...
            implementation: require('sass'),
            sassOptions: {
              fiber: require('fibers')
            },
            sourceMap: (
                CurrentVarValues.ENVIRON === Environs.DEV
                || CurrentVarValues.ENVIRON === Environs.PROD_DEV
              )
          }
        }
      ]
    },
    audioRule: {
      test: FileTypes.REGEX_EXT_AUDIO,
      use: [{
        loader: 'file-loader',
        options: {
          outputPath: `${Paths.ASSET_RELATIVE}/${Paths.AUDIO_RELATIVE}`
        }
      }]
    },
    fontRule: {
      test: FileTypes.REGEX_EXT_FONT,
      use: [{
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: `${Paths.ASSET_RELATIVE}/${Paths.FONT_RELATIVE}`,
          // Public path set here, so css-loader sets the correct path,
          // relative to the stylesheet, in the production bundle...
          publicPath: `../${Paths.FONT_RELATIVE}`
        }
      }]
    },
    imageRule: {
      test: FileTypes.REGEX_EXT_IMAGE,
      use: [{
        loader: 'file-loader',
        options: {
          outputPath: `${Paths.ASSET_RELATIVE}/${Paths.IMAGE_RELATIVE}`
        }
      }]
    },
    videoRule: {
      test: FileTypes.REGEX_EXT_VIDEO,
      use: [{
        loader: 'file-loader',
        options: {
          outputPath: `${Paths.ASSET_RELATIVE}/${Paths.VIDEO_RELATIVE}`
        }
      }]
    },
  }
};
