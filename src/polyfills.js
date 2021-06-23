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

/**
 * For IE - window.document.documentMode is an IE-only property...
 */
if (window.document.documentMode) {
  // Use #require, ONLY!
  // NO dynamic #import (which returns a Promise), before polyfills, for IE...
  const polyfillCoreJs = require('core-js/stable');
  const polyfillRegenerator = require('regenerator-runtime/runtime');

  if (!polyfillCoreJs) {
    console.error('ERROR! (polyfills): IE polyfill, core-js, failed to load.');
  }

  if (!polyfillRegenerator) {
    console.error('ERROR! (polyfills): IE polyfill, regenerator-runtime, failed to load.');
  }
}
