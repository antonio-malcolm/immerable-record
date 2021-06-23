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

import RequestStatus from 'constant/RequestStatus';

import HealthCheckResponseDataMock from 'component/domain/health/HealthCheckResponseDataMock';

import HealthCheckStore from 'state/health/HealthCheckStore';

const defaultState = Object.freeze({
    healthCheckData: {},
    healthCheckDataRequestStatus: RequestStatus.UNINITIATED,
    healthCheckDataRequestStatusReason: {
        [RequestStatus.UNINITIATED]: RequestStatus.UNINITIATED
      },
    healthCheckDataUpdateTimestamp: 0
  });

describe('HealthCheckStore Unit Tests', () => {
  let healthCheckStore = new HealthCheckStore();

  it('#setHealthCheckData Updates #healthCheckData And Returns New Instance With Expected Fields', () => {
    expect(healthCheckStore.healthCheckData).to.deep.equal(defaultState.healthCheckData);

    healthCheckStore = healthCheckStore.setHealthCheckData(HealthCheckResponseDataMock);

    expect(healthCheckStore).to.be.instanceOf(HealthCheckStore);
    expect(healthCheckStore.healthCheckData).to.deep.equal(HealthCheckResponseDataMock);

    expect(healthCheckStore.healthCheckDataRequestStatus).to.equal(defaultState.healthCheckDataRequestStatus);
    expect(healthCheckStore.healthCheckDataRequestStatusReason).to.deep.equal(defaultState.healthCheckDataRequestStatusReason);

    expect(healthCheckStore.healthCheckDataUpdateTimestamp).to.equal(defaultState.healthCheckDataUpdateTimestamp);
  });

  it('#getHealthCheckData Returns Expected #healthCheckData Field Value', () => {
    expect(healthCheckStore.getHealthCheckData()).to.equal(HealthCheckResponseDataMock);
  });
  
  it('#setHealthCheckDataRequestStatus Updates #healthCheckDataRequestStatus And Returns New Instance With Expected Fields', () => {
    expect(healthCheckStore.healthCheckDataRequestStatus).to.equal(defaultState.healthCheckDataRequestStatus);

    healthCheckStore = healthCheckStore.setHealthCheckDataRequestStatus(RequestStatus.SUCCESS);

    expect(healthCheckStore).to.be.instanceOf(HealthCheckStore);
    expect(healthCheckStore.healthCheckDataRequestStatus).to.equal(RequestStatus.SUCCESS);

    expect(healthCheckStore.healthCheckData).to.deep.equal(HealthCheckResponseDataMock);
    expect(healthCheckStore.healthCheckDataRequestStatusReason).to.deep.equal(defaultState.healthCheckDataRequestStatusReason);

    expect(healthCheckStore.healthCheckDataUpdateTimestamp).to.equal(defaultState.healthCheckDataUpdateTimestamp);
  });

  it('#getHealthCheckDataRequestStatus Returns Expected #healthCheckDataRequestStatus Field Value', () => {
    expect(healthCheckStore.getHealthCheckDataRequestStatus()).to.equal(RequestStatus.SUCCESS);
  });

  it('#setHealthCheckDataRequestStatusReason Updates #healthCheckDataRequestStatusReason And Returns New Instance With Expected Fields', () => {
    expect(healthCheckStore.healthCheckDataRequestStatusReason).to.deep.equal(defaultState.healthCheckDataRequestStatusReason);

    healthCheckStore = healthCheckStore.setHealthCheckDataRequestStatusReason(RequestStatus.SUCCESS, RequestStatus.SUCCESS);

    expect(healthCheckStore).to.be.instanceOf(HealthCheckStore);
    expect(healthCheckStore.healthCheckDataRequestStatusReason).to.deep.equal({
        [RequestStatus.SUCCESS]: RequestStatus.SUCCESS
      });

    expect(healthCheckStore.healthCheckData).to.deep.equal(HealthCheckResponseDataMock);
    expect(healthCheckStore.healthCheckDataRequestStatus).to.equal(RequestStatus.SUCCESS);

    expect(healthCheckStore.healthCheckDataUpdateTimestamp).to.equal(defaultState.healthCheckDataUpdateTimestamp);
  });

  it('#getHealthCheckDataRequestStatusReason Returns Expected #healthCheckDataRequestStatusReason Field Value', () => {
    expect(healthCheckStore.getHealthCheckDataRequestStatusReason()).to.deep.equal({
        [RequestStatus.SUCCESS]: RequestStatus.SUCCESS   
      });
  });

  it('#setHealthCheckDataUpdateTimestamp Sets #healthCheckDataUpdateTimestamp And Returns New Instance With Expected Fields', () => {
    expect(healthCheckStore.healthCheckDataUpdateTimestamp).to.equal(defaultState.healthCheckDataUpdateTimestamp);

    healthCheckStore = healthCheckStore.setHealthCheckDataUpdateTimestamp();

    expect(healthCheckStore).to.be.instanceOf(HealthCheckStore);
    expect(healthCheckStore.healthCheckDataUpdateTimestamp).to.be.greaterThan(defaultState.healthCheckDataUpdateTimestamp);

    expect(healthCheckStore.healthCheckData).to.deep.equal(HealthCheckResponseDataMock);
    expect(healthCheckStore.healthCheckDataRequestStatus).to.equal(RequestStatus.SUCCESS);
    expect(healthCheckStore.healthCheckDataRequestStatusReason).to.deep.equal({
        [RequestStatus.SUCCESS]: RequestStatus.SUCCESS   
      });
  });

  it('#getHealthCheckDataUpdateTimestamp Returns Expected #healthCheckDataUpdateTimestamp Field Value', () => {
    expect(healthCheckStore.getHealthCheckDataUpdateTimestamp()).to.be.greaterThan(0);
  });

  it('#resetHealthCheckDataUpdateTimestamp Sets #healthCheckDataUpdateTimestamp To Zero And Returns New Instance With Expected Fields', () => {
    expect(healthCheckStore.healthCheckDataUpdateTimestamp).to.be.greaterThan(defaultState.healthCheckDataUpdateTimestamp);

    healthCheckStore = healthCheckStore.resetHealthCheckDataUpdateTimestamp();

    expect(healthCheckStore).to.be.instanceOf(HealthCheckStore);
    expect(healthCheckStore.healthCheckDataUpdateTimestamp).to.equal(defaultState.healthCheckDataUpdateTimestamp);

    expect(healthCheckStore.healthCheckData).to.deep.equal(HealthCheckResponseDataMock);
    expect(healthCheckStore.healthCheckDataRequestStatus).to.equal(RequestStatus.SUCCESS);
    expect(healthCheckStore.healthCheckDataRequestStatusReason).to.deep.equal({
        [RequestStatus.SUCCESS]: RequestStatus.SUCCESS   
      });
  });
});
