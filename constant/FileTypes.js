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

/**
 * Common file types...
 */
const EXT_CSS = 'css';
const EXT_JS = 'js';
const EXT_HTML = 'html';
const EXT_SCSS = 'scss';

/**
 * Audio files...
 */
const EXT_AAC = 'aac';
const EXT_AIFF = 'aiff';
const EXT_FLAC = 'flac';
const EXT_M4A = 'm4a';
const EXT_MP3 = 'mp3';
const EXT_OGA = 'oga';
const EXT_PCM = 'pcm';
const EXT_WAV = 'wav';

/**
 * Video files...
 */
const EXT_AVI = 'avi';
const EXT_FLV = 'flv';
const EXT_M4V = 'm4v';
const EXT_MOV = 'mov';
const EXT_MP2 = 'mp2';
const EXT_MPE = 'mpe';
const EXT_MPG = 'mpg';
const EXT_MPV = 'mpv';
const EXT_OGG = 'ogg';
const EXT_QT = 'qt';
const EXT_SWF = 'swf';
const EXT_WEBM = 'webm';
const EXT_WMV = 'wmv';

/**
 * Image files...
 */
const EXT_GIF = 'gif';
const EXT_JPG = 'jpg';
const EXT_JPEG = 'jpeg';
const EXT_PNG = 'png';
const EXT_SVG = 'svg';


/**
 * Webfonts...
 */
const EXT_EOT = 'eot';
const EXT_OTF = 'otf';
const EXT_TTF = 'ttf';
const EXT_WOFF = 'woff';
const EXT_WOFF2 = 'woff2';


/**
 * Source maps...
 */
const EXT_SOURCE_MAP = 'map';

/**
 * Regular expression matching,
 * across multiple file extensions,
 * grouped by media / type...
 */
const REGEX_EXT_AUDIO = /\.(aac|aiff|flac|m4a|mp3|oga|pcm|wav)$/;
const REGEX_EXT_CSS = /\.(css|scss)$/;
const REGEX_EXT_FONT = /\.(woff|woff2|eot|ttf|otf)$/;
const REGEX_EXT_IMAGE = /\.(jpg|jpeg|gif|png|svg)$/;
const REGEX_EXT_JS = /\.(js)$/;
const REGEX_EXT_VIDEO = /\.(avi|flv|m4v|mov|mp2|mpe|mpg|mpv|ogg|qt|swf|webm|wmv)$/;

module.exports = Object.freeze({
  EXT_AAC,
  EXT_AIFF,
  EXT_AVI,
  EXT_CSS,
  EXT_EOT,
  EXT_FLAC,
  EXT_FLV,
  EXT_GIF,
  EXT_JPG,
  EXT_JPEG,
  EXT_JS,
  EXT_HTML,
  EXT_M4A,
  EXT_M4V,
  EXT_MOV,
  EXT_MP2,
  EXT_MP3,
  EXT_MPE,
  EXT_MPG,
  EXT_MPV,
  EXT_OGA,
  EXT_OGG,
  EXT_OTF,
  EXT_PCM,
  EXT_PNG,
  EXT_QT,
  EXT_SCSS,
  EXT_SOURCE_MAP,
  EXT_SVG,
  EXT_SWF,
  EXT_TTF,
  EXT_WAV,
  EXT_WEBM,
  EXT_WMV,
  EXT_WOFF,
  EXT_WOFF2,
  REGEX_EXT_AUDIO,
  REGEX_EXT_CSS,
  REGEX_EXT_FONT,
  REGEX_EXT_IMAGE,
  REGEX_EXT_JS,
  REGEX_EXT_VIDEO
});
