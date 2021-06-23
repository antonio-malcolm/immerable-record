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

const HealthCheckDataFetchMessages = {
  dataFetchAndStateProcessingTime: 'Data fetch and state processing time: ',
  dataRequestTarget: 'The Art Institute of Chicago',
  dataRequestTargetUrl: "https://api.artic.edu/api/v1/artworks?fields=title,artist_display,thumbnail&limit=5",
  mostRecentDataUpdateDateTime:  'Most recent success response: ',
  noThumb: 'No thumbnail image provided',
  requestStatusError: 'ERROR! Request received an error response:',
  requestStatusReady: 'Readying request.',
  requestStatusRequested: 'Request sent. Awaiting response...',
  requestStatusSuccess: 'SUCCESS! Request received a success response. Data is displayed, below.',
  requestStatusTimeout: 'TIMEOUT! Request timed out.',
  requestStatusUnavailable: 'No request status data available.',
  requestStatusUninitiated: 'Request not yet initiated.'
};
''
export default Object.freeze(HealthCheckDataFetchMessages)
