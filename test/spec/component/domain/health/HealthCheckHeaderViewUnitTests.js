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

import CommonUtils from 'util/CommonUtils';

import HealthCheckHeaderView from 'component/domain/health/HealthCheckHeaderView';

describe('HealthCheckHeaderView Unit Tests', () => {
  it('Renders With Expected Content', () => {
    const healthCheckHeaderView = shallow(<HealthCheckHeaderView />);
    const appName = `${process.env.APP_NAME} Application`;
    let environName = process.env.ENVIRON;
    let workspaceName = process.env.WORKSPACE;

    expect(healthCheckHeaderView.find('header')).to.have.lengthOf(1);

    if (CommonUtils.isNonEmptyString(process.env.APP_NAME)) {
      expect(healthCheckHeaderView.find('h1').text()).to.include(process.env.APP_NAME);
    }

    if (CommonUtils.isNonEmptyString(environName)) {
      switch (process.env.ENVIRON) {
        case 'dev':
          environName = 'development';
          break;
  
        case 'prod':
          environName = 'production';
          break;
  
        case 'prod-dev':
          environName = 'production + development';
          break;
  
        default:
          environName = `${process.env.ENVIRON}`;
          break;
      }

      expect(healthCheckHeaderView.text()).to.include(environName);
    }

    if (CommonUtils.isNonEmptyString(workspaceName)) {
      workspaceName = CommonUtils.convertFirstStringCharToUpperCase(
          workspaceName
        );

      expect(healthCheckHeaderView.text()).to.include(workspaceName);
      expect(healthCheckHeaderView.find('svg.workspace_header_icon')).to.have.lengthOf(1);
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
    it('Renders With App Name With Expected Content', () => {
      process.env.APP_NAME = 'HALLO';
      const healthCheckHeaderView = shallow(<HealthCheckHeaderView />);
  
      expect(healthCheckHeaderView.find('h1').text()).to.include('HALLO');
    });
  
    it('Renders Without App Name With Expected Content', () => {
      process.env.APP_NAME = undefined;
      const healthCheckHeaderView = shallow(<HealthCheckHeaderView />);
  
      expect(healthCheckHeaderView.find('h1').text()).to.not.include('HALLO');
    });
  
    it('Renders Workspace preact With Expected Content', () => {
      process.env.WORKSPACE = 'preact';
      const healthCheckHeaderView = shallow(<HealthCheckHeaderView />);
  
      expect(healthCheckHeaderView.find('svg.workspace_header_icon')).to.have.lengthOf(1);
    });
  
    it('Renders Without Workspace With Expected Content', () => {
      process.env.WORKSPACE = undefined;
      const healthCheckHeaderView = shallow(<HealthCheckHeaderView />);
  
      expect(healthCheckHeaderView.find('svg.workspace_header_icon')).to.have.lengthOf(0);
    });
  
    it('Renders Environ dev With Expected Content', () => {
      process.env.ENVIRON = 'dev';
      const healthCheckHeaderView = shallow(<HealthCheckHeaderView />);
  
      expect(healthCheckHeaderView.text()).to.include('development');
    });
  
    it('Renders Environ prod With Expected Content', () => {
      process.env.ENVIRON = 'prod';
      const healthCheckHeaderView = shallow(<HealthCheckHeaderView />);
  
      expect(healthCheckHeaderView.text()).to.include('production');
    });
  
    it('Renders Environ prod-dev With Expected Content', () => {
      process.env.ENVIRON = 'prod-dev';
      const healthCheckHeaderView = shallow(<HealthCheckHeaderView />);
  
      expect(healthCheckHeaderView.text()).to.include('production + development');
    });
  
    it('Renders Environ other / default With Expected Content', () => {
      process.env.ENVIRON = 'SOME-OTHER-VALUE';
      const healthCheckHeaderView = shallow(<HealthCheckHeaderView />);
  
      expect(healthCheckHeaderView.text()).to.include('SOME-OTHER-VALUE');
    });
  }
});
