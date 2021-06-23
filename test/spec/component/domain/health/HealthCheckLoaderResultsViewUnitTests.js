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

import HealthCheckLoaderResultsView from 'component/domain/health/HealthCheckLoaderResultsView';

describe('HealthCheckLoaderResultsView Unit Tests', () => {
  let healthCheckLoaderResultsView = shallow(<HealthCheckLoaderResultsView />);

  it('Renders With Expected Content', () => {
    const loaderCheckLmnt = healthCheckLoaderResultsView.find('.loader_check');

    expect(loaderCheckLmnt).to.have.lengthOf(1);

    const testLoaderFontLmnt = healthCheckLoaderResultsView.find('.handsome_text');
    const testLoaderImgLmnt = healthCheckLoaderResultsView.find('.handsome_pengn');

    expect(testLoaderFontLmnt).to.have.lengthOf(1);
    expect(testLoaderFontLmnt.find('.font_test')).to.have.lengthOf(1);

    expect(loaderCheckLmnt).to.have.lengthOf(1);
    expect(testLoaderImgLmnt.find('img')).to.have.lengthOf(1);
  });
});
