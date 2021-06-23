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

import { expect } from 'chai';
import { shallow } from 'enzyme';
import { restore, spy, stub } from 'sinon';

import RequestStatus from 'constant/RequestStatus';
import RequestTimeoutMillis from 'constant/RequestTimeoutMillis';

import HealthCheckResponseDataMock from 'component/domain/health/HealthCheckResponseDataMock';

import HealthCheckActions from 'state/health/HealthCheckActions';
import HealthCheckStore from 'state/health/HealthCheckStore';

import { HealthCheckController } from 'component/domain/health/HealthCheckController';
import HealthCheckView from 'component/domain/health/HealthCheckView';

const propsMockDefault = {
    healthCheckDispatch: { ...HealthCheckActions },
    healthCheckStore: new HealthCheckStore()
  };

propsMockDefault.healthCheckDispatch.requestGetHealthCheckData = stub();
propsMockDefault.healthCheckDispatch.fulfillHealthCheckDataRequestSuccess = stub();
propsMockDefault.healthCheckDispatch.fulfillHealthCheckDataRequestError = stub();

Object.freeze(propsMockDefault);

describe('HealthCheckController Integration Tests', () => {
  let propsMock;
  let requestGetHealthCheckDataSpy;
  let healthCheckController;

  beforeEach(() => {
    propsMock = { ...propsMockDefault };
    requestGetHealthCheckDataSpy = spy(propsMock.healthCheckDispatch.requestGetHealthCheckData);
    propsMock.healthCheckDispatch.requestGetHealthCheckData = requestGetHealthCheckDataSpy;

    healthCheckController = shallow(<HealthCheckController { ...propsMock } />);
  });

  afterEach(() => {
    healthCheckController.unmount();
    restore();
  });

  if (process.env.WORKSPACE === 'react') {
    it('On Initial Mount, #componentDidMount Sets Request Status to READY, Triggers Data Fetch Request, Has Expected Props, State, And Children', () => {
      const healthCheckControllerProps = healthCheckController.props();
      const healthCheckControllerState = healthCheckController.state();

      expect(healthCheckControllerState.healthCheckDispatchRequestStatus).to.equal(RequestStatus.REQUESTED);
      expect(healthCheckControllerState.healthCheckDispatchRequestTimestampElapsed).to.equal(0);
      expect(healthCheckControllerState.healthCheckErrorTimestamp).to.equal(0);
      expect(healthCheckControllerState.healthCheckSuccessTimestamp).to.equal(0);
      expect(healthCheckControllerState.healthCheckTimeoutTimestamp).to.equal(0);

      expect(healthCheckControllerProps.healthCheckData).to.be.empty;

      expect(requestGetHealthCheckDataSpy.callCount).to.equal(1);

      const healthCheckView = healthCheckController.find(HealthCheckView);

      expect(healthCheckView).to.have.lengthOf(1);

      const healthCheckViewProps = healthCheckView.props();

      expect(healthCheckViewProps.healthCheckData).to.equal(healthCheckControllerProps.healthCheckData);
      expect(healthCheckViewProps.healthCheckDataRequestStatus).to.equal(healthCheckControllerState.healthCheckDispatchRequestStatus);
      expect(healthCheckViewProps.healthCheckDataRequestTimeElapsed).to.equal(healthCheckControllerState.healthCheckDispatchRequestTimestampElapsed);
      expect(healthCheckViewProps.healthCheckErrorTimestamp).to.equal(healthCheckControllerState.healthCheckErrorTimestamp);
      expect(healthCheckViewProps.healthCheckSuccessTimestamp).to.equal(healthCheckControllerState.healthCheckSuccessTimestamp);
      expect(healthCheckViewProps.healthCheckTimeoutTimestamp).to.equal(healthCheckControllerState.healthCheckTimeoutTimestamp);
    });

    it('After Store Returns Data Fetch Requested, #componentDidUpdate Maintains Request Status REQUESTED, Has Expected Props, State, And Children', () => {
      healthCheckController.setState({
          healthCheckDispatchRequestStatus: RequestStatus.UNINITIATED
        });

      propsMock = {
        ...propsMock,
        healthCheckStore: {
            ...propsMock.healthCheckStore,
            healthCheckDataRequestStatus: RequestStatus.REQUESTED,
            healthCheckDataRequestStatusReason: { [RequestStatus.REQUESTED]: RequestStatus.REQUESTED },
            getHealthCheckDataRequestStatus: () => RequestStatus.REQUESTED,
            getHealthCheckDataRequestStatusReason: () => ({ [RequestStatus.REQUESTED]: RequestStatus.REQUESTED })
          }
      };

      healthCheckController.setProps(propsMock);

      const healthCheckControllerProps = healthCheckController.props();
      const healthCheckControllerState = healthCheckController.state();

      expect(healthCheckControllerState.healthCheckDispatchRequestStatus).to.equal(RequestStatus.REQUESTED);
      expect(healthCheckControllerState.healthCheckErrorTimestamp).to.equal(0);
      expect(healthCheckControllerState.healthCheckSuccessTimestamp).to.equal(0);
      expect(healthCheckControllerState.healthCheckTimeoutTimestamp).to.equal(0);

      expect(healthCheckControllerProps.healthCheckData).to.be.empty;

      expect(requestGetHealthCheckDataSpy.callCount).to.equal(1);

      const healthCheckView = healthCheckController.find(HealthCheckView);

      expect(healthCheckView).to.have.lengthOf(1);

      const healthCheckViewProps = healthCheckView.props();

      expect(healthCheckViewProps.healthCheckData).to.equal(healthCheckControllerProps.healthCheckData);
      expect(healthCheckViewProps.healthCheckDataRequestStatus).to.equal(healthCheckControllerState.healthCheckDispatchRequestStatus);
      expect(healthCheckViewProps.healthCheckDataRequestTimeElapsed).to.equal(healthCheckControllerState.healthCheckDispatchRequestTimestampElapsed);
      expect(healthCheckViewProps.healthCheckErrorTimestamp).to.equal(healthCheckControllerState.healthCheckErrorTimestamp);
      expect(healthCheckViewProps.healthCheckSuccessTimestamp).to.equal(healthCheckControllerState.healthCheckSuccessTimestamp);
      expect(healthCheckViewProps.healthCheckTimeoutTimestamp).to.equal(healthCheckControllerState.healthCheckTimeoutTimestamp);
    });

    it('After Store Returns Data Fetch Success, #componentDidUpdate Sets Request Status To HOLD, Has Expected Props, State, And Children', () => {
      healthCheckController.setState({
        healthCheckDispatchRequestStatus: RequestStatus.UNINITIATED,
        healthCheckDispatchRequestTimestampElapsed: 1
      });

      propsMock = {
        ...propsMock,
        healthCheckStore: {
            ...propsMock.healthCheckStore,
            healthCheckDataRequestStatus: RequestStatus.REQUESTED,
            healthCheckDataRequestStatusReason: { [RequestStatus.REQUESTED]: RequestStatus.REQUESTED },
            getHealthCheckDataRequestStatus: () => RequestStatus.REQUESTED,
            getHealthCheckDataRequestStatusReason: () => ({ [RequestStatus.REQUESTED]: RequestStatus.REQUESTED })
          }
      };

      healthCheckController.setProps(propsMock);

      propsMock = {
        ...propsMock,
        healthCheckStore: {
            ...propsMock.healthCheckStore,
            healthCheckData: HealthCheckResponseDataMock,
            healthCheckDataRequestStatus: RequestStatus.SUCCESS,
            healthCheckDataRequestStatusReason: { [RequestStatus.SUCCESS]: RequestStatus.SUCCESS },
            getHealthCheckData: () => HealthCheckResponseDataMock,
            getHealthCheckDataRequestStatus: () => RequestStatus.SUCCESS,
            getHealthCheckDataRequestStatusReason: () => ({ [RequestStatus.SUCCESS]: RequestStatus.SUCCESS })
          }
      };

      healthCheckController.setProps(propsMock);

      const healthCheckControllerProps = healthCheckController.props();
      const healthCheckControllerState = healthCheckController.state();

      expect(healthCheckControllerState.healthCheckDispatchRequestStatus).to.equal(RequestStatus.HOLD);
      expect(healthCheckControllerState.healthCheckErrorTimestamp).to.equal(0);
      expect(healthCheckControllerState.healthCheckSuccessTimestamp).to.be.greaterThan(0);
      expect(healthCheckControllerState.healthCheckTimeoutTimestamp).to.equal(0);

      expect(healthCheckControllerProps.healthCheckData).to.deep.equal(HealthCheckResponseDataMock);

      expect(requestGetHealthCheckDataSpy.callCount).to.equal(1);

      const healthCheckView = healthCheckController.find(HealthCheckView);

      expect(healthCheckView).to.have.lengthOf(1);

      const healthCheckViewProps = healthCheckView.props();

      expect(healthCheckViewProps.healthCheckData).to.equal(healthCheckControllerProps.healthCheckData);
      expect(healthCheckViewProps.healthCheckDataRequestStatus).to.equal(healthCheckControllerState.healthCheckDispatchRequestStatus);
      expect(healthCheckViewProps.healthCheckDataRequestTimeElapsed).to.equal(healthCheckControllerState.healthCheckDispatchRequestTimestampElapsed);
      expect(healthCheckViewProps.healthCheckErrorTimestamp).to.equal(healthCheckControllerState.healthCheckErrorTimestamp);
      expect(healthCheckViewProps.healthCheckSuccessTimestamp).to.equal(healthCheckControllerState.healthCheckSuccessTimestamp);
      expect(healthCheckViewProps.healthCheckTimeoutTimestamp).to.equal(healthCheckControllerState.healthCheckTimeoutTimestamp);
    });

    it('After Store Returns Data Fetch Error, #componentDidUpdate Sets Request Status To HOLD, Has Expected Props, State, And Children', () => {
      healthCheckController.setState({
        healthCheckDispatchRequestStatus: RequestStatus.UNINITIATED,
        healthCheckDispatchRequestTimestampElapsed: 1
      });

      propsMock = {
        ...propsMock,
        healthCheckStore: {
            ...propsMock.healthCheckStore,
            healthCheckDataRequestStatus: RequestStatus.REQUESTED,
            healthCheckDataRequestStatusReason: { [RequestStatus.REQUESTED]: RequestStatus.REQUESTED },
            getHealthCheckDataRequestStatus: () => RequestStatus.REQUESTED,
            getHealthCheckDataRequestStatusReason: () => ({ [RequestStatus.REQUESTED]: RequestStatus.REQUESTED })
          }
      };

      healthCheckController.setProps(propsMock);

      propsMock = {
        ...propsMock,
        healthCheckStore: {
            ...propsMock.healthCheckStore,
            healthCheckDataRequestStatus: RequestStatus.ERROR,
            healthCheckDataRequestStatusReason: { [RequestStatus.ERROR]: RequestStatus.ERROR },
            getHealthCheckDataRequestStatus: () => RequestStatus.ERROR,
            getHealthCheckDataRequestStatusReason: () => ({ [RequestStatus.ERROR]: RequestStatus.ERROR })
          }
      };

      healthCheckController.setProps(propsMock);

      const healthCheckControllerProps = healthCheckController.props();
      const healthCheckControllerState = healthCheckController.state();

      expect(healthCheckControllerState.healthCheckDispatchRequestStatus).to.equal(RequestStatus.HOLD);
      expect(healthCheckControllerState.healthCheckErrorTimestamp).to.be.greaterThan(0);
      expect(healthCheckControllerState.healthCheckSuccessTimestamp).to.equal(0);
      expect(healthCheckControllerState.healthCheckTimeoutTimestamp).to.equal(0);

      expect(healthCheckControllerProps.healthCheckData).to.be.empty;

      expect(requestGetHealthCheckDataSpy.callCount).to.equal(1);

      const healthCheckView = healthCheckController.find(HealthCheckView);

      expect(healthCheckView).to.have.lengthOf(1);

      const healthCheckViewProps = healthCheckView.props();

      expect(healthCheckViewProps.healthCheckData).to.equal(healthCheckControllerProps.healthCheckData);
      expect(healthCheckViewProps.healthCheckDataRequestStatus).to.equal(healthCheckControllerState.healthCheckDispatchRequestStatus);
      expect(healthCheckViewProps.healthCheckDataRequestTimeElapsed).to.equal(healthCheckControllerState.healthCheckDispatchRequestTimestampElapsed);
      expect(healthCheckViewProps.healthCheckErrorTimestamp).to.equal(healthCheckControllerState.healthCheckErrorTimestamp);
      expect(healthCheckViewProps.healthCheckSuccessTimestamp).to.equal(healthCheckControllerState.healthCheckSuccessTimestamp);
      expect(healthCheckViewProps.healthCheckTimeoutTimestamp).to.equal(healthCheckControllerState.healthCheckTimeoutTimestamp);
    });

    it('After Data Fetch Timeout, #componentDidUpdate Sets Request Status To HOLD, Has Expected Props, State, And Children', () => {
      healthCheckController.setState({
        healthCheckDispatchRequestStatus: RequestStatus.UNINITIATED,
        healthCheckDispatchRequestTimestampElapsed: (RequestTimeoutMillis * 2)
      });

      propsMock = {
        ...propsMock,
        healthCheckStore: {
            ...propsMock.healthCheckStore,
            healthCheckDataRequestStatus: RequestStatus.REQUESTED,
            healthCheckDataRequestStatusReason: { [RequestStatus.REQUESTED]: RequestStatus.REQUESTED },
            getHealthCheckDataRequestStatus: () => RequestStatus.REQUESTED,
            getHealthCheckDataRequestStatusReason: () => ({ [RequestStatus.REQUESTED]: RequestStatus.REQUESTED })
          }
      };

      healthCheckController.setProps(propsMock);

      const healthCheckControllerProps = healthCheckController.props();
      const healthCheckControllerState = healthCheckController.state();

      expect(healthCheckControllerState.healthCheckDispatchRequestStatus).to.equal(RequestStatus.HOLD);
      expect(healthCheckControllerState.healthCheckErrorTimestamp).to.equal(0);
      expect(healthCheckControllerState.healthCheckSuccessTimestamp).to.equal(0);
      expect(healthCheckControllerState.healthCheckTimeoutTimestamp).to.be.greaterThan(0);

      expect(healthCheckControllerProps.healthCheckData).to.be.empty;

      expect(requestGetHealthCheckDataSpy.callCount).to.equal(1);

      const healthCheckView = healthCheckController.find(HealthCheckView);

      expect(healthCheckView).to.have.lengthOf(1);

      const healthCheckViewProps = healthCheckView.props();

      expect(healthCheckViewProps.healthCheckData).to.equal(healthCheckControllerProps.healthCheckData);
      expect(healthCheckViewProps.healthCheckDataRequestStatus).to.equal(healthCheckControllerState.healthCheckDispatchRequestStatus);
      expect(healthCheckViewProps.healthCheckDataRequestTimeElapsed).to.equal(healthCheckControllerState.healthCheckDispatchRequestTimestampElapsed);
      expect(healthCheckViewProps.healthCheckErrorTimestamp).to.equal(healthCheckControllerState.healthCheckErrorTimestamp);
      expect(healthCheckViewProps.healthCheckSuccessTimestamp).to.equal(healthCheckControllerState.healthCheckSuccessTimestamp);
      expect(healthCheckViewProps.healthCheckTimeoutTimestamp).to.equal(healthCheckControllerState.healthCheckTimeoutTimestamp);
    });
  }
});
