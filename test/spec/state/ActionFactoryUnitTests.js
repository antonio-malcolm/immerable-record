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

import ActionFactory from 'state/ActionFactory';

describe('ActionFactory Unit Tests', () => {
  it('Returns Action And Payload When Populated', () => {
    expect(ActionFactory.createAction('TEST_ACTION', { foo: 'bar' })).to.deep.equal({
        type: 'TEST_ACTION',
        payload: { foo: 'bar' }
      });
  });

  it('Returns Action And Empty Object When Payload is undefined', () => {
    expect(ActionFactory.createAction('TEST_ACTION')).to.deep.equal({
        type: 'TEST_ACTION',
        payload: {}
      });
  });

  it('Returns Action And New Object With Payload Value When Payload Is Not An Object', () => {
    expect(ActionFactory.createAction('TEST_ACTION', 2)).to.deep.equal({
        type: 'TEST_ACTION',
        payload: {
          value: 2
        }
      });
  });
});
