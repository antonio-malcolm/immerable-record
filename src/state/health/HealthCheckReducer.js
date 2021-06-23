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

import HealthCheckActionTypes from 'state/health/HealthCheckActionTypes';
import HealthCheckReducerWorkers from 'state/health/HealthCheckReducerWorkers';
import HealthCheckStore from 'state/health/HealthCheckStore';

const healthCheckStore = new HealthCheckStore();

const HealthCheckReducer = function(state = healthCheckStore, action) {
  switch (action.type) {
    case HealthCheckActionTypes.REQUEST_GET_HEALTH_CHECK_DATA:
      return HealthCheckReducerWorkers.reduceRequestGetHealthCheckData(
        state
      );

    case HealthCheckActionTypes.FULFILL_HEALTH_CHECK_DATA_REQUEST_SUCCESS:
      return HealthCheckReducerWorkers.reduceFulfillHealthCheckDataRequestSuccess(
        state,
        action.payload.data
      );

    case HealthCheckActionTypes.FULFILL_HEALTH_CHECK_DATA_REQUEST_ERROR:
      return HealthCheckReducerWorkers.reduceFulfillHealthCheckDataRequestError(
        state,
        action.payload.err
      );

    default:
      return state;
  }
};

export default HealthCheckReducer;
