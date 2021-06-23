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

import RequestStatus from 'constant/RequestStatus';

import HealthCheckResponseDataMock from 'component/domain/health/HealthCheckResponseDataMock';

import HealthCheckDataFetchMessages from 'component/domain/health/HealthCheckDataFetchMessages';
import HealthCheckDataFetchResultsView from 'component/domain/health/HealthCheckDataFetchResultsView';

describe('HealthCheckDataFetchResultsView Unit Tests', () => {
  it('When Request Status Is UNINITIATED, Renders With Expected Content', () => {
    const propsMock = {
      healthCheckDataRequestStatus: RequestStatus.UNINITIATED,
      healthCheckDataUpdateTimestamp: 0,
      healthCheckErrorTimestamp: 0,
      healthCheckSuccessTimestamp: 0,
      healthCheckTimeoutTimestamp: 0
    };

    const healthCheckDataFetchResultsView = shallow(<HealthCheckDataFetchResultsView { ...propsMock } />);

    expect(healthCheckDataFetchResultsView.find('.dataFetch_serverInfo')).to.have.lengthOf(1);
    expect(healthCheckDataFetchResultsView.find('.dataCheck_data')).to.be.empty;

    const dataFetchUrlLmnt = healthCheckDataFetchResultsView.find('.dataFetch_url');
    const dataFetchStatusMessageLmnt = healthCheckDataFetchResultsView.find('.healthCheckDataFetchRequestStatus');

    expect(dataFetchUrlLmnt).to.have.lengthOf(1);
    expect(dataFetchStatusMessageLmnt).to.have.lengthOf(1);

    expect(dataFetchUrlLmnt.text()).to.include([ HealthCheckDataFetchMessages.dataRequestTargetUrl ]);
    expect(dataFetchStatusMessageLmnt.text()).to.include([ HealthCheckDataFetchMessages.requestStatusUninitiated ]);
  });

  it('When Request Status Is READY, Renders With Expected Content', () => {
    const propsMock = {
      healthCheckDataRequestStatus: RequestStatus.READY,
      healthCheckDataUpdateTimestamp: 0,
      healthCheckErrorTimestamp: 0,
      healthCheckSuccessTimestamp: 0,
      healthCheckTimeoutTimestamp: 0
    };

    const healthCheckDataFetchResultsView = shallow(<HealthCheckDataFetchResultsView { ...propsMock } />);

    expect(healthCheckDataFetchResultsView.find('.dataFetch_serverInfo')).to.have.lengthOf(1);
    expect(healthCheckDataFetchResultsView.find('.dataCheck_data')).to.be.empty;

    const dataFetchUrlLmnt = healthCheckDataFetchResultsView.find('.dataFetch_url');
    const dataFetchStatusMessageLmnt = healthCheckDataFetchResultsView.find('.healthCheckDataFetchRequestStatus_readying');

    expect(dataFetchUrlLmnt).to.have.lengthOf(1);
    expect(dataFetchStatusMessageLmnt).to.have.lengthOf(1);

    expect(dataFetchUrlLmnt.text()).to.include([ HealthCheckDataFetchMessages.dataRequestTargetUrl ]);
    expect(dataFetchStatusMessageLmnt.text()).to.include([ HealthCheckDataFetchMessages.requestStatusReady ]);
  });

  it('When Request Status Is REQUESTED, Renders With Expected Content', () => {
    const propsMock = {
      healthCheckDataRequestStatus: RequestStatus.REQUESTED,
      healthCheckDataUpdateTimestamp: 0,
      healthCheckErrorTimestamp: 0,
      healthCheckSuccessTimestamp: 0,
      healthCheckTimeoutTimestamp: 0
    };

    const healthCheckDataFetchResultsView = shallow(<HealthCheckDataFetchResultsView { ...propsMock } />);

    expect(healthCheckDataFetchResultsView.find('.dataFetch_serverInfo')).to.have.lengthOf(1);
    expect(healthCheckDataFetchResultsView.find('.dataCheck_data')).to.be.empty;

    const dataFetchUrlLmnt = healthCheckDataFetchResultsView.find('.dataFetch_url');
    const dataFetchStatusMessageLmnt = healthCheckDataFetchResultsView.find('.healthCheckDataFetchRequestStatus_requested');

    expect(dataFetchUrlLmnt).to.have.lengthOf(1);
    expect(dataFetchStatusMessageLmnt).to.have.lengthOf(1);

    expect(dataFetchUrlLmnt.text()).to.include([ HealthCheckDataFetchMessages.dataRequestTargetUrl ]);
    expect(dataFetchStatusMessageLmnt.text()).to.include([ HealthCheckDataFetchMessages.requestStatusRequested ]);
  });

  it('When Request Status, after success, Is HOLD, Renders With Expected Content', () => {
    let propsMock = {
      healthCheckData: HealthCheckResponseDataMock,
      healthCheckDataRequestStatus: RequestStatus.HOLD,
      healthCheckDataRequestTimeElapsed: 10,
      healthCheckDataUpdateTimestamp: 0,
      healthCheckErrorTimestamp: 0,
      healthCheckSuccessTimestamp: 10,
      healthCheckTimeoutTimestamp: 0
    };

    let healthCheckDataFetchResultsView = shallow(<HealthCheckDataFetchResultsView { ...propsMock } />);

    expect(healthCheckDataFetchResultsView.find('.dataFetch_serverInfo')).to.have.lengthOf(1);

    const dataFetchUrlLmnt = healthCheckDataFetchResultsView.find('.dataFetch_url');
    const dataFetchStatusMessageLmnt = healthCheckDataFetchResultsView.find('.healthCheckDataFetchRequestStatus_success');
    let dataFetchResultsLmnt = healthCheckDataFetchResultsView.find('.dataCheck_results');

    expect(dataFetchUrlLmnt).to.have.lengthOf(1);
    expect(dataFetchStatusMessageLmnt).to.have.lengthOf(1);
    expect(dataFetchResultsLmnt).to.have.lengthOf(1);

    expect(dataFetchResultsLmnt.children()).to.have.lengthOf(
      Object.keys(HealthCheckResponseDataMock.data).length
    );

    expect(dataFetchUrlLmnt.text()).to.include([ HealthCheckDataFetchMessages.dataRequestTargetUrl ]);
    expect(dataFetchStatusMessageLmnt.text()).to.include([ HealthCheckDataFetchMessages.requestStatusSuccess ]);

    const healthCheckDataMockNoThumbs = { ...HealthCheckResponseDataMock };

    healthCheckDataMockNoThumbs.data.forEach((dataItem) => {
      dataItem.thumbnail = undefined;
    });

    propsMock = {
      healthCheckData: healthCheckDataMockNoThumbs,
      healthCheckDataRequestStatus: RequestStatus.HOLD,
      healthCheckDataRequestTimeElapsed: 10,
      healthCheckDataUpdateTimestamp: 0,
      healthCheckErrorTimestamp: 0,
      healthCheckSuccessTimestamp: 10,
      healthCheckTimeoutTimestamp: 0
    };

    healthCheckDataFetchResultsView = shallow(<HealthCheckDataFetchResultsView { ...propsMock } />);
    dataFetchResultsLmnt = healthCheckDataFetchResultsView.find('.dataCheck_results');

    expect(dataFetchResultsLmnt).to.have.lengthOf(1);

    expect(dataFetchResultsLmnt.children()).to.have.lengthOf(
      Object.keys(HealthCheckResponseDataMock.data).length
    );

    dataFetchResultsLmnt.children().forEach((child) => {
      expect(child.find('.dataCheck_data_thumb').text()).to.include(HealthCheckDataFetchMessages.noThumb);
    });

    propsMock = {
      healthCheckData: {},
      healthCheckDataRequestStatus: RequestStatus.HOLD,
      healthCheckDataRequestTimeElapsed: undefined,
      healthCheckDataUpdateTimestamp: 0,
      healthCheckErrorTimestamp: 0,
      healthCheckSuccessTimestamp: 10,
      healthCheckTimeoutTimestamp: 0
    };

    healthCheckDataFetchResultsView = shallow(<HealthCheckDataFetchResultsView { ...propsMock } />);
    dataFetchResultsLmnt = healthCheckDataFetchResultsView.find('.dataCheck_results');

    expect(dataFetchResultsLmnt).to.have.lengthOf(0);
  });

  it('When Request Status, after error, Is HOLD, Renders With Expected Content', () => {
    const propsMock = {
      healthCheckDataRequestStatus: RequestStatus.HOLD,
      healthCheckDataRequestStatusReason: { [RequestStatus.ERROR]: RequestStatus.ERROR },
      healthCheckDataUpdateTimestamp: 0,
      healthCheckErrorTimestamp: 100,
      healthCheckSuccessTimestamp: 0,
      healthCheckTimeoutTimestamp: 0
    };

    const healthCheckDataFetchResultsView = shallow(<HealthCheckDataFetchResultsView { ...propsMock } />);

    expect(healthCheckDataFetchResultsView.find('.dataFetch_serverInfo')).to.have.lengthOf(1);
    expect(healthCheckDataFetchResultsView.find('.dataCheck_data')).to.be.empty;

    const dataFetchUrlLmnt = healthCheckDataFetchResultsView.find('.dataFetch_url');
    const dataFetchStatusMessageLmnt = healthCheckDataFetchResultsView.find('.healthCheckDataFetchRequestStatus_error');

    expect(dataFetchUrlLmnt).to.have.lengthOf(1);
    expect(dataFetchStatusMessageLmnt).to.have.lengthOf(1);

    expect(dataFetchUrlLmnt.text()).to.include([ HealthCheckDataFetchMessages.dataRequestTargetUrl ]);
    expect(dataFetchStatusMessageLmnt.text()).to.include([ HealthCheckDataFetchMessages.requestStatusError ]);
  });

  it('When Request Status, after timeout, Is HOLD, Renders With Expected Content', () => {
    const propsMock = {
      healthCheckDataRequestStatus: RequestStatus.HOLD,
      healthCheckDataUpdateTimestamp: 0,
      healthCheckErrorTimestamp: 0,
      healthCheckSuccessTimestamp: 0,
      healthCheckTimeoutTimestamp: 10
    };

    const healthCheckDataFetchResultsView = shallow(<HealthCheckDataFetchResultsView { ...propsMock } />);

    expect(healthCheckDataFetchResultsView.find('.dataFetch_serverInfo')).to.have.lengthOf(1);
    expect(healthCheckDataFetchResultsView.find('.dataCheck_data')).to.be.empty;

    const dataFetchUrlLmnt = healthCheckDataFetchResultsView.find('.dataFetch_url');
    const dataFetchStatusMessageLmnt = healthCheckDataFetchResultsView.find('.healthCheckDataFetchRequestStatus_timeout');

    expect(dataFetchUrlLmnt).to.have.lengthOf(1);
    expect(dataFetchStatusMessageLmnt).to.have.lengthOf(1);

    expect(dataFetchUrlLmnt.text()).to.include([ HealthCheckDataFetchMessages.dataRequestTargetUrl ]);
    expect(dataFetchStatusMessageLmnt.text()).to.include([ HealthCheckDataFetchMessages.requestStatusTimeout ]);
  });

  it('When Request Status Is unavailable, Renders With Expected Content', () => {
    const propsMock = {
      healthCheckDataRequestStatus: 'derp!',
      healthCheckDataUpdateTimestamp: 0,
      healthCheckErrorTimestamp: 0,
      healthCheckSuccessTimestamp: 0,
      healthCheckTimeoutTimestamp: 0
    };

    const healthCheckDataFetchResultsView = shallow(<HealthCheckDataFetchResultsView { ...propsMock } />);

    expect(healthCheckDataFetchResultsView.find('.dataFetch_serverInfo')).to.have.lengthOf(1);
    expect(healthCheckDataFetchResultsView.find('.dataCheck_data')).to.be.empty;

    const dataFetchUrlLmnt = healthCheckDataFetchResultsView.find('.dataFetch_url');
    const dataFetchStatusMessageLmnt = healthCheckDataFetchResultsView.find('.healthCheckDataFetchRequestStatus');

    expect(dataFetchUrlLmnt).to.have.lengthOf(1);
    expect(dataFetchStatusMessageLmnt).to.have.lengthOf(1);

    expect(dataFetchUrlLmnt.text()).to.include([ HealthCheckDataFetchMessages.dataRequestTargetUrl ]);
    expect(dataFetchStatusMessageLmnt.text()).to.include([ HealthCheckDataFetchMessages.requestStatusUnavailable ]);
  });
});
