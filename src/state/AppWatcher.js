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

import { all, call, spawn } from 'redux-saga/effects';

import CommonUtils from 'util/CommonUtils';

import HealthCheckWatchers from 'state/health/HealthCheckWatchers';

const AppWatcher = function* () {
  const watchers = CommonUtils.flatten2dArray([
    HealthCheckWatchers
  ]);

  yield all(
    watchers.map((watcher) => spawn(function* () {
      while (true) {
        try {
          yield call(watcher);
          break;
        } catch (err) {
          console.log(err);
        }
      }
    }))
  );
};

export default AppWatcher;
