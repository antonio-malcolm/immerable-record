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
import ActionFactory from 'state/ActionFactory';

const requestGetHealthCheckData = function(fields, limit) {
  return ActionFactory.createAction(
      HealthCheckActionTypes.REQUEST_GET_HEALTH_CHECK_DATA,
      { fields, limit }
    );
};

const fulfillHealthCheckDataRequestSuccess = function(data) {
  return ActionFactory.createAction(
      HealthCheckActionTypes.FULFILL_HEALTH_CHECK_DATA_REQUEST_SUCCESS,
      { data }
    );
};

const fulfillHealthCheckDataRequestError = function(err) {
  return ActionFactory.createAction(
      HealthCheckActionTypes.FULFILL_HEALTH_CHECK_DATA_REQUEST_ERROR,
      { err }
    );
};

const HealthCheckActions = Object.freeze({
  requestGetHealthCheckData,
  fulfillHealthCheckDataRequestSuccess,
  fulfillHealthCheckDataRequestError
});

export default HealthCheckActions;
