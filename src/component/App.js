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
import { Provider } from 'react-redux';

import AppStore from 'state/AppStore';

import HealthCheckController from 'component/domain/health/HealthCheckController';

import 'asset/font/better-eb-garamond/BetterEBGaramond-Regular-v0.1.otf';
import 'asset/style/App.scss';


class App extends React.Component {
  render() {
    return (
      <Provider store ={ AppStore }>
        <HealthCheckController />
      </Provider>
    );
  }
}

export default App;
