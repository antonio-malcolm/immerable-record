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

import HealthCheckActions from 'state/health/HealthCheckActions';
import HealthCheckActionTypes from 'state/health/HealthCheckActionTypes';

describe('HealthCheckActions Unit Tests', () => {
  it('#requestGetHealthCheckData Returns REQUEST_GET_HEALTH_CHECK_DATA, Payload', () => {
    const payload = { fields: 'test', limit: 10 };

    expect(HealthCheckActions.requestGetHealthCheckData(payload.fields, payload.limit)).to.deep.equal({
        type: HealthCheckActionTypes.REQUEST_GET_HEALTH_CHECK_DATA,
        payload
      });
  });

  it('#fulfillHealthCheckDataRequestSuccess Returns FULFILL_HEALTH_CHECK_DATA_REQUEST_SUCCESS, Payload', () => {
    const data = { data: {} };

    expect(HealthCheckActions.fulfillHealthCheckDataRequestSuccess(data)).to.deep.equal({
        type: HealthCheckActionTypes.FULFILL_HEALTH_CHECK_DATA_REQUEST_SUCCESS,
        payload: {
          data
        }
      });
  });

  it('#fulfillHealthCheckDataRequestError Returns FULFILL_HEALTH_CHECK_DATA_REQUEST_SUCCESS, Payload', () => {
    const err = 'foobar';

    expect(HealthCheckActions.fulfillHealthCheckDataRequestError(err)).to.deep.equal({
        type: HealthCheckActionTypes.FULFILL_HEALTH_CHECK_DATA_REQUEST_ERROR,
        payload: {
          err
        },
      });
  });
});
