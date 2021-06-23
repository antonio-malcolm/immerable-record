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

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import RequestStatus from 'constant/RequestStatus';
import RequestTimeoutMillis from 'constant/RequestTimeoutMillis';

import HealthCheckActions from 'state/health/HealthCheckActions';

import HealthCheckView from 'component/domain/health/HealthCheckView';

export class HealthCheckController extends React.Component {
  state = {
    healthCheckDispatchRequestStatus: RequestStatus.UNINITIATED,
    healthCheckDispatchRequestTimestampStart: 0,
    healthCheckDispatchRequestTimestampElapsed: 0,
    healthCheckSuccessTimestamp: 0,
    healthCheckErrorTimestamp: 0,
    healthCheckTimeoutTimestamp: 0
  };

  componentDidMount() {
    if (this.state.healthCheckDispatchRequestStatus === RequestStatus.UNINITIATED) {
      this.setState({
        healthCheckDispatchRequestStatus: RequestStatus.READY
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const nextState = { ...this.state };
    const { healthCheckDispatch, healthCheckStore } = this.props;

    const healthCheckDispatchRequestStatus = healthCheckStore.healthCheckDataRequestStatus;

    if (healthCheckDispatchRequestStatus !== nextState.healthCheckDispatchRequestStatus) {
      if (nextState.healthCheckDispatchRequestStatus !== RequestStatus.HOLD) {
        if (nextState.healthCheckDispatchRequestStatus !== RequestStatus.READY) {
          if (nextState.healthCheckDispatchRequestStatus !== RequestStatus.TIMEOUT) {
            nextState.healthCheckDispatchRequestStatus = healthCheckDispatchRequestStatus;
          }
        }
      }

      switch (nextState.healthCheckDispatchRequestStatus) {
        case RequestStatus.ERROR:
          nextState.healthCheckDispatchRequestStatus = RequestStatus.HOLD;
          nextState.healthCheckErrorTimestamp = Date.now();

          nextState.healthCheckDispatchRequestTimestampElapsed
            = (nextState.healthCheckErrorTimestamp - nextState.healthCheckDispatchRequestTimestampStart);

          this.setState(nextState);
          break;

        case RequestStatus.READY:
          nextState.healthCheckDispatchRequestTimestampElapsed = 0;
          nextState.healthCheckErrorTimestamp = 0;
          nextState.healthCheckSuccessTimestamp = 0;
          nextState.healthCheckTimeoutTimestamp = 0;

          healthCheckDispatch.requestGetHealthCheckData(
            'title,artist_display,thumbnail',
            5
          );

          nextState.healthCheckDispatchRequestStatus = RequestStatus.REQUESTED;
          nextState.healthCheckDispatchRequestTimestampStart = Date.now();

          this.setState(nextState);
          break;

        case RequestStatus.REQUESTED:
          if (nextState.healthCheckDispatchRequestTimestampElapsed > RequestTimeoutMillis) {
            nextState.healthCheckDispatchRequestStatus = RequestStatus.TIMEOUT;
          } else {
            nextState.healthCheckDispatchRequestTimestampElapsed = (
              Date.now() - nextState.healthCheckDispatchRequestTimestampStart
            );
          }

          this.setState(nextState);
          break;

        case RequestStatus.SUCCESS:
          nextState.healthCheckDispatchRequestStatus = RequestStatus.HOLD;
          nextState.healthCheckSuccessTimestamp = Date.now();

          nextState.healthCheckDispatchRequestTimestampElapsed
            = (nextState.healthCheckSuccessTimestamp - nextState.healthCheckDispatchRequestTimestampStart); 

          this.setState(nextState);
          break;

        case RequestStatus.TIMEOUT:
          nextState.healthCheckDispatchRequestStatus = RequestStatus.HOLD;
          nextState.healthCheckTimeoutTimestamp = Date.now();

          nextState.healthCheckDispatchRequestTimestampElapsed
            = (nextState.healthCheckTimeoutTimestamp - nextState.healthCheckDispatchRequestTimestampStart);

          this.setState(nextState);
          break;
      }
    }
  }

  render() {
    const {
      props: {
        healthCheckStore: {
          healthCheckData,
          healthCheckDataRequestStatusReason,
          healthCheckDataUpdateTimestamp
        }
      },
      state: {
        healthCheckDispatchRequestStatus,
        healthCheckDispatchRequestTimestampElapsed,
        healthCheckErrorTimestamp,
        healthCheckSuccessTimestamp,
        healthCheckTimeoutTimestamp
      }
    } = this;

    return (
      <HealthCheckView
        healthCheckData={ healthCheckData }
        healthCheckDataRequestStatus={ healthCheckDispatchRequestStatus }
        healthCheckDataRequestStatusReason={ healthCheckDataRequestStatusReason }
        healthCheckDataRequestTimeElapsed={ healthCheckDispatchRequestTimestampElapsed }
        healthCheckDataUpdateTimestamp={ healthCheckDataUpdateTimestamp }
        healthCheckErrorTimestamp={ healthCheckErrorTimestamp }
        healthCheckSuccessTimestamp={ healthCheckSuccessTimestamp }
        healthCheckTimeoutTimestamp={ healthCheckTimeoutTimestamp }
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    healthCheckStore: state.healthCheckStore
  }
}

function mapDispatchToProps(dispatch) {
  return { 
    healthCheckDispatch: {
      ...bindActionCreators(
        HealthCheckActions,
        dispatch
      )
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HealthCheckController);
