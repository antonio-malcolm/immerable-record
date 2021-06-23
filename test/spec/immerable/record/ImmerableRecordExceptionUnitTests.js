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

import chai, { expect } from 'chai';
import { spy } from 'sinon';
import sinonChai from 'sinon-chai';

import ImmerableRecordException from 'immerable/record/ImmerableRecordException';

chai.use(sinonChai);

describe('ImmerableRecordException Tests', () => {
  const mockCallerName = '(IGNORE)';
  const mockMessage = 'You may safely ignore this mocked test error...';
  let immerableRecordException;
  let immerableRecordExceptionName;
  let consoleErrorSpy;

  before(() => {
    consoleErrorSpy = spy(console, 'error');
    immerableRecordException = new ImmerableRecordException(mockMessage, mockCallerName);
    immerableRecordExceptionName = immerableRecordException.name;
  });

  after(() => {
    consoleErrorSpy.restore();
  });

  it('Has All Expected Field Values Upon Instantiation', () => {
    expect(immerableRecordException.name).to.equal(immerableRecordExceptionName);
    expect(immerableRecordException.caller).to.equal(mockCallerName);
    expect(immerableRecordException.message).to.include(mockMessage);

    // stacktrace, internally assigned, should be present only when thrown,
    // i.e., not through direct instantiation...
    expect(immerableRecordException.stack).to.not.be.undefined;

    expect(consoleErrorSpy.callCount).to.equal(0);
  });

  it('Has All Expected Field Values Upon Instantiation And Logs To Console With true Passed', () => {
    // It's a specioal occassion - we want to console the error, this time (pass true as last arg)...
    immerableRecordException = new ImmerableRecordException(mockMessage, mockCallerName, true);

    expect(immerableRecordException.name).to.equal(immerableRecordExceptionName);
    expect(immerableRecordException.caller).to.equal(mockCallerName);
    expect(immerableRecordException.message).to.include(mockMessage);

    // stacktrace, internally assigned, should be present only when thrown,
    // i.e., not through direct instantiation...
    expect(immerableRecordException.stack).to.not.be.undefined;

    expect(console.error).to.be.called;
  });

  it('Attempt To Add Property After Instantiation Should Throw Exception (frozen, by default)', () => {
    const testFunc = function() {
        immerableRecordException.fooBar = 'fooBar';
      };

    expect(testFunc).to.throw();
  });

  it('Does Not Include Caller In Message When No Caller Name Is Provided', () => {
    immerableRecordException = new ImmerableRecordException(mockMessage);
    expect(immerableRecordException.message).to.include(mockMessage);
  });
});
