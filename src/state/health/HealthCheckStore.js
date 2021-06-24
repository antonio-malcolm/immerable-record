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

import ImmerableRecord from 'immerable-record';

import RequestStatus from 'constant/RequestStatus';

class HealthCheckStore extends ImmerableRecord {
  constructor() {
    super({
      healthCheckData: {},
      healthCheckDataRequestStatus: RequestStatus.UNINITIATED,
      healthCheckDataRequestStatusReason: {
          [RequestStatus.UNINITIATED]: RequestStatus.UNINITIATED
        },
      healthCheckDataUpdateTimestamp: 0
    }, { historyLimit: 5 });

    this.getHealthCheckData = this.getHealthCheckData.bind(this);
    this.setHealthCheckData = this.setHealthCheckData.bind(this);

    this.getHealthCheckDataRequestStatus = this.getHealthCheckDataRequestStatus.bind(this);
    this.setHealthCheckDataRequestStatus = this.setHealthCheckDataRequestStatus.bind(this);

    Object.freeze(this);
  }

  getHealthCheckData() {
    return this.getIn(
        [ 'healthCheckData' ]
      );
  };

  setHealthCheckData(data) {
    return this.setIn([ 'healthCheckData' ], data);
  };

  getHealthCheckDataRequestStatus() {
    return this.getIn(
        [ 'healthCheckDataRequestStatus' ]
      );
  };

  setHealthCheckDataRequestStatus(status) {
    return this.setIn([ 'healthCheckDataRequestStatus' ], status);
  };

  getHealthCheckDataRequestStatusReason = () => {
    return this.getIn(
        [ 'healthCheckDataRequestStatusReason' ]
      );
  };

  setHealthCheckDataRequestStatusReason = (status, reason) => {
    return this.setIn(
        [ 'healthCheckDataRequestStatusReason' ],
        { [status]: reason }
      );
  };

  getHealthCheckDataUpdateTimestamp = () => {
    return this.getIn(
        [ 'healthCheckDataUpdateTimestamp' ]
      );
  }

  setHealthCheckDataUpdateTimestamp = () => {
    return this.setIn(
        [ 'healthCheckDataUpdateTimestamp' ],
        Date.now()
      );
  }

  resetHealthCheckDataUpdateTimestamp = () => {
    return this.setIn(
        [ 'healthCheckDataUpdateTimestamp' ],
        0
      );
  };
}

export default HealthCheckStore;
