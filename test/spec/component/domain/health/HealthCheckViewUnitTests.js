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
import CommonUtils from 'util/CommonUtils';

import HealthCheckView from 'component/domain/health/HealthCheckView';
import HealthCheckDataFetchResultsView from 'component/domain/health/HealthCheckDataFetchResultsView';
import HealthCheckHeaderView from 'component/domain/health/HealthCheckHeaderView';
import HealthCheckLoaderResultsView from 'component/domain/health/HealthCheckLoaderResultsView';

const propsMock = {
  healthCheckDataRequestStatus: RequestStatus.UNINITIATED,
  healthCheckDataUpdateTimestamp: 0,
  healthCheckErrorTimestamp: 0,
  healthCheckSuccessTimestamp: 0,
  healthCheckTimeoutTimestamp: 0,
};

describe('HealthCheckView Unit Tests', () => {
  it('Renders With Expected Content', () => {
    const healthCheckView = shallow(<HealthCheckView { ...propsMock } />);
    const workspaceName = process.env.WORKSPACE;

    expect(healthCheckView.find(HealthCheckDataFetchResultsView)).to.have.lengthOf(1);
    expect(healthCheckView.find(HealthCheckHeaderView)).to.have.lengthOf(1);
    expect(healthCheckView.find(HealthCheckLoaderResultsView)).to.have.lengthOf(1);
    expect(healthCheckView.find('section.description')).to.have.lengthOf(1);

    if (CommonUtils.isNonEmptyString(workspaceName)) {
      expect(healthCheckView.find(`main.healthCheck_${workspaceName}`)).to.have.lengthOf(1);
    }
  });

  /**
   * Karma uses Webpack + Babel preprocessing,
   * so process#env is a string, not an object,
   * so cannot be set, in Karma's browser testing.
   *
   * So, skip these, in the case of Karma...
   */
  if (process.env.TEST_CALLER !== 'karma') {
    it('With Workspace Name, Renders With Extended Classname', () => {
      process.env.WORKSPACE = 'preact';
      const healthCheckView = shallow(<HealthCheckView { ...propsMock } />);
  
      expect(healthCheckView.find('main.healthCheck_preact')).to.have.lengthOf(1);
    });
  
    it('Without Workspace Name, Renders With Default Classname', () => {
      process.env.WORKSPACE = undefined;
      let healthCheckView = shallow(<HealthCheckView { ...propsMock } />);
  
      expect(healthCheckView.find(`main.healthCheck`)).to.have.lengthOf(1);
      expect(healthCheckView.find('main.healthCheck_preact')).to.have.lengthOf(0);
  
      process.env.WORKSPACE = '';
      healthCheckView = shallow(<HealthCheckView { ...propsMock } />);
  
      expect(healthCheckView.find(`main.healthCheck`)).to.have.lengthOf(1);
      expect(healthCheckView.find('main.healthCheck_preact')).to.have.lengthOf(0);
    });
  }
});
