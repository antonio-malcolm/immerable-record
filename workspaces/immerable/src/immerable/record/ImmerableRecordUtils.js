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

const isNonEmptyObject = function (obj) {
  return (typeof obj === 'object')
    && !Array.isArray(obj)
    && (obj !== null)
    && (Object.keys(obj).length > 0);
};

const isNonEmptyString = function (str, shouldTrim) {
  if (shouldTrim !== true) {
    shouldTrim = false;
  }

  if ((typeof str === 'string') || (str instanceof String)) {
    if (str.length < 1) {
      return false;
    }

    if (shouldTrim) {
      if (str.trim().length < 1) {
        return false;
      }
    }

    return true;
  }

  return false;
};

const isNumber = function (num) {
  return (
      (typeof num === 'number' || num instanceof Number)
      && !isNaN(num)
    );
};

const ImmerableRecordUtils = Object.freeze({
  isNonEmptyObject,
  isNonEmptyString,
  isNumber
});

export default ImmerableRecordUtils;
