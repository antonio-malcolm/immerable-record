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

import RequestStatus from 'constant/RequestStatus';

import CommonUtils from 'util/CommonUtils';

const reduceRequestGetHealthCheckData = function(state) {
  return state.setHealthCheckDataRequestStatus(RequestStatus.REQUESTED)
    .setHealthCheckDataRequestStatusReason(
      RequestStatus.REQUESTED,
      RequestStatus.REQUESTED
    );
};

const reduceFulfillHealthCheckDataRequestSuccess = function(state, data) {
  return state.setHealthCheckData(data)
    .setHealthCheckDataRequestStatus(RequestStatus.SUCCESS)
    .setHealthCheckDataRequestStatusReason(
      RequestStatus.SUCCESS,
      RequestStatus.SUCCESS
    ).setHealthCheckDataUpdateTimestamp();
};

const reduceFulfillHealthCheckDataRequestError = function(state, err) {
  let reason = err;

  if (CommonUtils.isAssignedNotNull(reason.message)) {
    reason = reason.message;
  }

  return state.setHealthCheckDataRequestStatus(RequestStatus.ERROR)
    .setHealthCheckDataRequestStatusReason(
      RequestStatus.ERROR,
      reason
    );
};

const HealthCheckReducerWorkers = Object.freeze({
  reduceRequestGetHealthCheckData,
  reduceFulfillHealthCheckDataRequestSuccess,
  reduceFulfillHealthCheckDataRequestError
});

export default HealthCheckReducerWorkers;
