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

/**
 * A set of useful statuses, for tracking the stages of an HTTP request (or similar),
 * from the applications POV, in order to determine an action to be taken at each stage.
 *
 * Useful in React state and the #componentDidUpdate method, when used with Redux state,
 * in coordination with middleware to fetch data over HTTP.
 *
 * RequestStatus value can be used to both trigger requests (by updating React state to 'READY',
 * for example, and capturing that in #componentDidUpdate), s well as determine an action to take,
 * once the request is triggered (by updating Redux state with its own status value,
 * then tracking that, via a switch block, within React's #componentDidUpdate).
 */
const RequestStatus = Object.freeze({
  ERROR: 'ERROR',
  HOLD: 'HOLD',
  READY: 'READY',
  REQUESTED: 'REQUESTED',
  SUCCESS: 'SUCCESS',
  TIMEOUT: 'TIMEOUT',
  UNINITIATED: 'UNINITIATED'
});

export default RequestStatus;
