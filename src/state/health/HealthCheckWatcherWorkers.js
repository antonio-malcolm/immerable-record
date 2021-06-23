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

import { call, put } from 'redux-saga/effects';

import RestUtils from 'util/RestUtils';

import HealthCheckActions from 'state/health/HealthCheckActions';

const requestGetHealthCheckData = function*(action) {
  const { fields, limit } = action.payload;

  try {
    const response = yield call(
      RestUtils.callRest,
      'https://api.artic.edu/api/v1/artworks',
      {
        params: { fields, limit },
        getFullResponse: true
      }
    );

    yield put(
      HealthCheckActions.fulfillHealthCheckDataRequestSuccess(response.data)
    );
  } catch (err) {
    yield put(
      HealthCheckActions.fulfillHealthCheckDataRequestError(err)
    );
  }
};

const HealthCheckWatcherWorkers = Object.freeze({
  requestGetHealthCheckData
});

export default HealthCheckWatcherWorkers;
