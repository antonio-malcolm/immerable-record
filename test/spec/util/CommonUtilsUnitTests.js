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

import { expect } from 'chai';

import CommonUtils from 'util/CommonUtils';

describe('CommonUtils Unit Tests', () => {
  it ('convertArrayToCommaDelimitedStringWithAndOr', () => {
    const testStr = 'this is a test string';
    const testStrDelimitedWithAnd = 'this, is, a, test, and string';
    const testStrDelimitedWithOr = 'this, is, a, test, or string';
    let testArr;

    expect(CommonUtils.convertArrayToCommaDelimitedStringWithAndOr(testArr)).to.be.null;

    testArr = [];

    expect(CommonUtils.convertArrayToCommaDelimitedStringWithAndOr(testArr)).to.be.null;

    testArr = [ 'this' ];

    expect(CommonUtils.convertArrayToCommaDelimitedStringWithAndOr(testArr)).to.equal('this');

    testArr = testStr.split(' ');

    expect(
        CommonUtils.convertArrayToCommaDelimitedStringWithAndOr(testArr)
      ).to.equal(testStrDelimitedWithAnd);

    expect(
        CommonUtils.convertArrayToCommaDelimitedStringWithAndOr(testArr, false)
      ).to.equal(testStrDelimitedWithAnd);

    expect(
        CommonUtils.convertArrayToCommaDelimitedStringWithAndOr(testArr, true)
      ).to.equal(testStrDelimitedWithOr);
  });

  it ('convertFirstStringCharToUpperCase', () => {
    const testStr = 'testStr';
    const testStrWithUpperCaseFirstChar = 'TestStr';

    expect(CommonUtils.convertFirstStringCharToUpperCase()).to.be.null;
    expect(CommonUtils.convertFirstStringCharToUpperCase(testStr)).to.equal(testStrWithUpperCaseFirstChar);
  });

  it ('flatten2dArray', () => {
    const testArrFlattened = [ 1, 2, 3, 4, 5, 6 ];
    let testArr;

    expect(CommonUtils.flatten2dArray(testArr)).to.be.null;

    testArr = [];

    expect(CommonUtils.flatten2dArray(testArr)).to.be.empty;

    testArr = [ [ 1, 2, 3 ], [ 4, 5, 6 ] ];

    expect(CommonUtils.flatten2dArray(testArr)).to.deep.equal(testArrFlattened);
  });

  it ('generateRandomWholeNumber', () => {
    expect(CommonUtils.generateRandomWholeNumber()).to.be.greaterThan(0);
    expect(CommonUtils.generateRandomWholeNumber(100)).to.be.greaterThan(0);
    expect(CommonUtils.generateRandomWholeNumber(100)).to.be.lessThan(101);
  });

  it ('isAssignedNotNull', () => {
    expect(CommonUtils.isAssignedNotNull()).to.be.false;
    expect(CommonUtils.isAssignedNotNull(null)).to.be.false;
    expect(CommonUtils.isAssignedNotNull(undefined)).to.be.false;

    expect(CommonUtils.isAssignedNotNull(2)).to.be.true;
    expect(CommonUtils.isAssignedNotNull('srt')).to.be.true;

    expect(CommonUtils.isAssignedNotNull(true)).to.be.true;
    expect(CommonUtils.isAssignedNotNull(false)).to.be.true;

    expect(CommonUtils.isAssignedNotNull([])).to.be.true;
    expect(CommonUtils.isAssignedNotNull({})).to.be.true;
  });

  it ('isNonEmptyArray', () => {
    expect(CommonUtils.isNonEmptyArray()).to.be.false;
    expect(CommonUtils.isNonEmptyArray(null)).to.be.false;
    expect(CommonUtils.isNonEmptyArray(undefined)).to.be.false;

    expect(CommonUtils.isNonEmptyArray(2)).to.be.false;
    expect(CommonUtils.isNonEmptyArray('srt')).to.be.false;

    expect(CommonUtils.isNonEmptyArray(true)).to.be.false;
    expect(CommonUtils.isNonEmptyArray(false)).to.be.false;

    expect(CommonUtils.isNonEmptyArray([])).to.be.false;
    expect(CommonUtils.isNonEmptyArray({})).to.be.false;

    expect(CommonUtils.isNonEmptyArray([ 1 ])).to.be.true;
  });

  it ('isNonEmptyObject', () => {
    expect(CommonUtils.isNonEmptyObject()).to.be.false;
    expect(CommonUtils.isNonEmptyObject(null)).to.be.false;
    expect(CommonUtils.isNonEmptyObject(undefined)).to.be.false;

    expect(CommonUtils.isNonEmptyObject(2)).to.be.false;
    expect(CommonUtils.isNonEmptyObject('srt')).to.be.false;

    expect(CommonUtils.isNonEmptyObject(true)).to.be.false;
    expect(CommonUtils.isNonEmptyObject(false)).to.be.false;

    expect(CommonUtils.isNonEmptyObject([])).to.be.false;
    expect(CommonUtils.isNonEmptyObject({})).to.be.false;

    expect(CommonUtils.isNonEmptyObject({ test: 'foo' })).to.be.true;
  });

  it ('isNonEmptyString', () => {
    expect(CommonUtils.isNonEmptyString()).to.be.false;
    expect(CommonUtils.isNonEmptyString(null)).to.be.false;
    expect(CommonUtils.isNonEmptyString(undefined)).to.be.false;

    expect(CommonUtils.isNonEmptyString(2)).to.be.false;

    expect(CommonUtils.isNonEmptyString(true)).to.be.false;
    expect(CommonUtils.isNonEmptyString(false)).to.be.false;

    expect(CommonUtils.isNonEmptyString([])).to.be.false;
    expect(CommonUtils.isNonEmptyString({})).to.be.false;

    expect(CommonUtils.isNonEmptyString([ 1 ])).to.be.false;
    expect(CommonUtils.isNonEmptyString({ test: 'foo' })).to.be.false;

    expect(CommonUtils.isNonEmptyString('srt')).to.be.true;

    expect(CommonUtils.isNonEmptyString('', true)).to.be.false;
    expect(CommonUtils.isNonEmptyString('', false)).to.be.false;
    expect(CommonUtils.isNonEmptyString('   ', true)).to.be.false;
    expect(CommonUtils.isNonEmptyString('   ', false)).to.be.true;
  });

  it ('isNumber', () => {
    expect(CommonUtils.isNumber()).to.be.false;
    expect(CommonUtils.isNumber(null)).to.be.false;
    expect(CommonUtils.isNumber(undefined)).to.be.false;

    expect(CommonUtils.isNumber('srt')).to.be.false;

    expect(CommonUtils.isNumber(true)).to.be.false;
    expect(CommonUtils.isNumber(false)).to.be.false;

    expect(CommonUtils.isNumber([])).to.be.false;
    expect(CommonUtils.isNumber({})).to.be.false;

    expect(CommonUtils.isNumber([ 1 ])).to.be.false;
    expect(CommonUtils.isNumber({ test: 'foo' })).to.be.false;

    expect(CommonUtils.isNumber(2)).to.be.true;
  });

  it ('doMergeSortArrayOnMemberField', () => {
    const testArrAlpha = [
        { someKey: 'e' },
        { someKey: 'a' },
        { someKey: 'b' },
        { someKey: 'i' },
        { someKey: 'c' },
        { someKey: 'h' },
        { someKey: 'd' },
        { someKey: 'j' },
        { someKey: 'f' },
        { someKey: 'g' }
      ];

    const testArrAlphaSortedAsc = [
        { someKey: 'a' },
        { someKey: 'b' },
        { someKey: 'c' },
        { someKey: 'd' },
        { someKey: 'e' },
        { someKey: 'f' },
        { someKey: 'g' },
        { someKey: 'h' },
        { someKey: 'i' },
        { someKey: 'j' }
      ];

    const testArrAlphaSortedDesc = [
        { someKey: 'j' },
        { someKey: 'i' },
        { someKey: 'h' },
        { someKey: 'g' },
        { someKey: 'f' },
        { someKey: 'e' },
        { someKey: 'd' },
        { someKey: 'c' },
        { someKey: 'b' },
        { someKey: 'a' }
      ];

    const testArrNum = [
        { someKey: 5 },
        { someKey: 1 },
        { someKey: 2 },
        { someKey: 9 },
        { someKey: 3 },
        { someKey: 8 },
        { someKey: 4 },
        { someKey: 10 },
        { someKey: 6 },
        { someKey: 7 }
      ];

    const testArrNumSortedAsc = [
        { someKey: 1 },
        { someKey: 2 },
        { someKey: 3 },
        { someKey: 4 },
        { someKey: 5 },
        { someKey: 6 },
        { someKey: 7 },
        { someKey: 8 },
        { someKey: 9 },
        { someKey: 10 }
      ];

    const testArrNumSortedDesc = [
        { someKey: 10 },
        { someKey: 9 },
        { someKey: 8 },
        { someKey: 7 },
        { someKey: 6 },
        { someKey: 5 },
        { someKey: 4 },
        { someKey: 3 },
        { someKey: 2 },
        { someKey: 1 }
      ];

    expect(CommonUtils.doMergeSortArrayOnMemberField()).to.be.empty;
    expect(CommonUtils.doMergeSortArrayOnMemberField([])).to.be.empty;

    expect(CommonUtils.doMergeSortArrayOnMemberField(testArrAlpha, 'someKey')).to.deep.equal(testArrAlphaSortedAsc);
    expect(CommonUtils.doMergeSortArrayOnMemberField(testArrAlpha, 'someKey', 'str', 'dsc')).to.deep.equal(testArrAlphaSortedDesc);

    expect(CommonUtils.doMergeSortArrayOnMemberField(testArrNum, 'someKey', 'num')).to.deep.equal(testArrNumSortedAsc);
    expect(CommonUtils.doMergeSortArrayOnMemberField(testArrNum, 'someKey', 'num', 'dsc')).to.deep.equal(testArrNumSortedDesc);
  });

  it ('replaceNewLinesInString', () => {
    let testStr;

    expect(CommonUtils.replaceNewLinesInString(testStr)).to.be.null;

    testStr = '';

    expect(CommonUtils.replaceNewLinesInString(testStr)).to.equal(testStr);

    testStr = 'this is \n a \r test string';
    const testStrResult = 'this is [REPLACEMENT] a [REPLACEMENT] test string';

    expect(CommonUtils.replaceNewLinesInString(testStr, '[REPLACEMENT]')).to.equal(testStrResult);
  });

  it ('replaceSpaceCharsInString', () => {
    let testStr;

    expect(CommonUtils.replaceSpaceCharsInString(testStr)).to.be.null;

    testStr = '';

    expect(CommonUtils.replaceSpaceCharsInString(testStr)).to.equal(testStr);

    testStr = 'this is a test string';
    const testStrResult = 'this[REPLACEMENT]is[REPLACEMENT]a[REPLACEMENT]test[REPLACEMENT]string';

    expect(CommonUtils.replaceSpaceCharsInString(testStr, '[REPLACEMENT]')).to.equal(testStrResult);
  });

  it ('replaceTabCharsInString', () => {
    let testStr;

    expect(CommonUtils.replaceTabCharsInString(testStr)).to.be.null;

    testStr = '';

    expect(CommonUtils.replaceTabCharsInString(testStr)).to.equal(testStr);

    testStr = 'this is\ta test\tstring';
    const testStrResult = 'this is[REPLACEMENT]a test[REPLACEMENT]string';

    expect(CommonUtils.replaceTabCharsInString(testStr, '[REPLACEMENT]')).to.equal(testStrResult);
  });
});
