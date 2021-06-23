/**
 * Copyrighht 2021 to present, Antonio Malcolm.
 * All rights reserved.
 *
 * This source code file is a part of immerable-record
 * (A.K.A., "ImmerableRecord", "immerableRecord",  "Immerable Record", or "immerable record").
 *
 * This source code is licensed under the BSD 3-Clause license,
 * and is subject to the terms of the BSD 3-Clause license,
 * found in the LICENSE file, in the root directory of this project.
 * If a copy of the BSD 3-Clause license cannot be found,
 * as part of this project, you can obtain one, at:
 * https://opensource.org/licenses/BSD-3-Clause
 */

import ImmerableRecordClientMethodTypes from 'immerable/record/ImmerableRecordClientMethodTypes';

const ImmerableRecordClientMethodNamesByType = Object.freeze({
  getIn: ImmerableRecordClientMethodTypes.READ,
  setIn: ImmerableRecordClientMethodTypes.WRITE,
  deleteIn: ImmerableRecordClientMethodTypes.WRITE,
  getInIdx: ImmerableRecordClientMethodTypes.READ,
  setInIdx: ImmerableRecordClientMethodTypes.WRITE,
  deleteInIdx: ImmerableRecordClientMethodTypes.WRITE,
  pushIn: ImmerableRecordClientMethodTypes.WRITE,
  popIn: ImmerableRecordClientMethodTypes.WRITE,
  shiftIn: ImmerableRecordClientMethodTypes.WRITE,
  unshiftIn: ImmerableRecordClientMethodTypes.WRITE
});

export default ImmerableRecordClientMethodNamesByType;
