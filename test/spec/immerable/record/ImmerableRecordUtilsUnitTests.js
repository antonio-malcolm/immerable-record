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

import { expect } from 'chai';

import ImmerableRecordUtils from 'immerable/record/ImmerableRecordUtils';

describe('ImmerableRecordUtils Unit Tests', () => {
  it ('isNonEmptyObject', () => {
    expect(ImmerableRecordUtils.isNonEmptyObject()).to.be.false;
    expect(ImmerableRecordUtils.isNonEmptyObject(null)).to.be.false;
    expect(ImmerableRecordUtils.isNonEmptyObject(undefined)).to.be.false;

    expect(ImmerableRecordUtils.isNonEmptyObject(2)).to.be.false;
    expect(ImmerableRecordUtils.isNonEmptyObject('srt')).to.be.false;

    expect(ImmerableRecordUtils.isNonEmptyObject(true)).to.be.false;
    expect(ImmerableRecordUtils.isNonEmptyObject(false)).to.be.false;

    expect(ImmerableRecordUtils.isNonEmptyObject([])).to.be.false;
    expect(ImmerableRecordUtils.isNonEmptyObject({})).to.be.false;

    expect(ImmerableRecordUtils.isNonEmptyObject({ test: 'foo' })).to.be.true;
  });

  it ('isNonEmptyString', () => {
    expect(ImmerableRecordUtils.isNonEmptyString()).to.be.false;
    expect(ImmerableRecordUtils.isNonEmptyString(null)).to.be.false;
    expect(ImmerableRecordUtils.isNonEmptyString(undefined)).to.be.false;

    expect(ImmerableRecordUtils.isNonEmptyString(2)).to.be.false;

    expect(ImmerableRecordUtils.isNonEmptyString(true)).to.be.false;
    expect(ImmerableRecordUtils.isNonEmptyString(false)).to.be.false;

    expect(ImmerableRecordUtils.isNonEmptyString([])).to.be.false;
    expect(ImmerableRecordUtils.isNonEmptyString({})).to.be.false;

    expect(ImmerableRecordUtils.isNonEmptyString([1])).to.be.false;
    expect(ImmerableRecordUtils.isNonEmptyString({ test: 'foo' })).to.be.false;

    expect(ImmerableRecordUtils.isNonEmptyString('srt')).to.be.true;

    expect(ImmerableRecordUtils.isNonEmptyString('', true)).to.be.false;
    expect(ImmerableRecordUtils.isNonEmptyString('', false)).to.be.false;
    expect(ImmerableRecordUtils.isNonEmptyString('   ', true)).to.be.false;
    expect(ImmerableRecordUtils.isNonEmptyString('   ', false)).to.be.true;
  });
  
  it ('isNumber', () => {
    expect(ImmerableRecordUtils.isNumber()).to.be.false;
    expect(ImmerableRecordUtils.isNumber(null)).to.be.false;
    expect(ImmerableRecordUtils.isNumber(undefined)).to.be.false;

    expect(ImmerableRecordUtils.isNumber('srt')).to.be.false;

    expect(ImmerableRecordUtils.isNumber(true)).to.be.false;
    expect(ImmerableRecordUtils.isNumber(false)).to.be.false;

    expect(ImmerableRecordUtils.isNumber([])).to.be.false;
    expect(ImmerableRecordUtils.isNumber({})).to.be.false;

    expect(ImmerableRecordUtils.isNumber([1])).to.be.false;
    expect(ImmerableRecordUtils.isNumber({ test: 'foo' })).to.be.false;

    expect(ImmerableRecordUtils.isNumber(2)).to.be.true;
  });
});
