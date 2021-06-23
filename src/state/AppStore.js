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

import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import AppReducer from 'state/AppReducer';
import AppWatcher from 'state/AppWatcher';

const areReduxDevToolsLoaded = (
  (process.env.ENVIRON === 'dev') || (process.env.ENVIRON === 'prod-dev')
) && (typeof window.REDUX_COMPOSE_WITH_DEVTOOLS === 'function');

const composeImpl = areReduxDevToolsLoaded ? window.REDUX_COMPOSE_WITH_DEVTOOLS : compose;

if (areReduxDevToolsLoaded) {
  console.info('SUCCESS! Redux development tools are loaded.');
}

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];

const AppStore = createStore(
  AppReducer,
  composeImpl(
    applyMiddleware(
      ...middlewares
    )
  )
);

sagaMiddleware.run(AppWatcher);

export default AppStore;
