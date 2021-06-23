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

'use strict';

import { configure } from 'enzyme';

import CommonUtils from 'util/CommonUtils';

let adapterImportPromise;
let currentWorkspace = process.env.WORKSPACE;

if (currentWorkspace === 'preact') {
  adapterImportPromise = import('enzyme-adapter-preact-pure');
} else {
  adapterImportPromise = import('@wojtekmaj/enzyme-adapter-react-17');
}

currentWorkspace = CommonUtils.convertFirstStringCharToUpperCase(
    currentWorkspace
  );

if (CommonUtils.isAssignedNotNull(adapterImportPromise)) {
  console.log(`Using enzyme adapter for: ${currentWorkspace}`);
} else {
  console.error(`ERROR! No enzyme adapter found for: ${currentWorkspace}`);
}

adapterImportPromise.then((adapter) => {
  if (adapter.default !== undefined) {
    const Adapter = adapter.default;

    configure({
      adapter: new Adapter()
    });
  } else {
    console.error(`ERROR! No enzyme adapter found for: ${currentWorkspace}`);
  }
}).catch((err) => {
  console.error('ERROR! An error occurred, while attemtping to initialize the Enzyme Adapter.');
  console.error(err);
});
