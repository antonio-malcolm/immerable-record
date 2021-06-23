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
 * This module is intended to contain reusable methods writ ONLY with core, vanilla JS,
 * with NO EXTERNAL DEPENDENCIES! It is used in modules which check for external dependencies,
 * and return a different result, to the end user, if missing.
 *
 * Do not use import(s) or require(s) here!
 */

/**
 * Converts an array to a string, with comma-delimitation,
 * and, before last value, ' and ' or ' or '
 *
 * i.e., [1, 2, 3] to '1, 2, and 3'
 * i.e., ['one', 'two', 'three'], to 'one, two, and three'
 */
const convertArrayToCommaDelimitedStringWithAndOr = function(arr, shouldEndWithOr) {
  if (!(Array.isArray(arr) && arr.length)) {
    return '';
  }

  let lastDelimiter = 'and'

  if (shouldEndWithOr === true) {
    lastDelimiter = 'or';
  }

  if (arr.length === 1) {
    return `${arr[0]}`;
  }

  if (arr.length === 2) {
    return `${arr[0]} ${lastDelimiter} ${arr[1]}`;
  }

  const endIdx = (arr.length - 1);
  const arrToJoin = arr.slice(0, endIdx);
  const lastArrItem = arr[endIdx];

  return `${arrToJoin.join(', ')}, ${lastDelimiter} ${lastArrItem}`;
};

const convertFirstStringCharToUpperCase = function(str) {
  if (str === null || (typeof str === 'undefined')) {
    return null;
  }

  return `${str[0].toUpperCase()}${str.slice(1)}`;;
};

const isAssignedNotNull = function(obj) {
  return (
    (typeof obj !== 'undefined')
    && (obj !== null)
  );
}

const isNonEmptyArray = function (arr) {
  return (Array.isArray(arr) && (arr.length > 0));
};

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

const replaceNewLinesInString = function(str, rplc) {
  if (!(typeof str === 'string' || str instanceof String)) {
    return null;
  }

  if (str.length < 1) {
    return str;
  }

  return str.replace(/\n|\r/g, rplc);
};

const replaceSpaceCharsInString = function(str, rplc) {
  if (!(typeof str === 'string' || str instanceof String)) {
    return null;
  }

  if (str.length < 1) {
    return str;
  }

  return str.replace(/\s/g, rplc);
};

const replaceTabCharsInString = function(str, rplc) {
  if (!(typeof str === 'string' || str instanceof String)) {
    return null;
  }

  if (str.length < 1) {
    return str;
  }

  return str.replace(/\t/g, rplc);
};

module.exports = Object.freeze({
  convertArrayToCommaDelimitedStringWithAndOr,
  convertFirstStringCharToUpperCase,
  isAssignedNotNull,
  isNonEmptyArray,
  isNonEmptyObject,
  isNonEmptyString,
  isNumber,
  replaceNewLinesInString,
  replaceSpaceCharsInString,
  replaceTabCharsInString
});
