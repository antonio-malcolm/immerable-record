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
import PropTypes from 'prop-types';

import dayjs from 'dayjs';

import RequestStatus from 'constant/RequestStatus';
import CommonUtils from 'util/CommonUtils';

import HealthCheckDataFetchMessages from 'component/domain/health/HealthCheckDataFetchMessages';

const HealthCheckDataFetchResultsView = function(props) {
  const {
    healthCheckData,
    healthCheckDataRequestStatus,
    healthCheckDataRequestStatusReason,
    healthCheckDataRequestTimeElapsed,
    healthCheckDataUpdateTimestamp,
    healthCheckErrorTimestamp,
    healthCheckSuccessTimestamp,
    healthCheckTimeoutTimestamp
  } = props;

  let mostRecentDataUpdateDateTimeMessage = `${HealthCheckDataFetchMessages.mostRecentDataUpdateDateTime}`;
  let dataFetchAndStateProcessingTimeMessage = `${HealthCheckDataFetchMessages.dataFetchAndStateProcessingTime}`;
  let requestStatusClassName = 'healthCheckDataFetchRequestStatus';
  let requestStatusMessage;
  let healthCheckDataDisplayList;

  const createHealthCheckDataDisplayList = () => {
    let listItems = [];

    healthCheckData.data.forEach((dataItem) => {
      let listItemChildren = [
        <span className="dataCheck_data_title" key={ CommonUtils.generateRandomWholeNumber() }>{ dataItem.title }</span>,
        <span className="dataCheck_data_descr" key={ CommonUtils.generateRandomWholeNumber() }>{ dataItem.artist_display }</span>
      ];

      if (CommonUtils.isNonEmptyObject(dataItem.thumbnail)) {
        let thumbData = dataItem.thumbnail;

        listItemChildren.push(
          <span className="dataCheck_data_thumb" key={ CommonUtils.generateRandomWholeNumber() }>
            <span>Thumbnail:&nbsp;</span>
            <span>
              <img src={ thumbData.lqip } alt={ thumbData.alt_text } width={ thumbData.width } width={ thumbData.width } height={ thumbData.height } />
            </span>
          </span>
        );
      } else {
        listItemChildren.push(
          <span className="dataCheck_data_thumb" key={ CommonUtils.generateRandomWholeNumber() }>
            { HealthCheckDataFetchMessages.noThumb }
          </span>
        );
      }

      listItems.push(
        <li key={ CommonUtils.generateRandomWholeNumber() } className="dataCheck_data_item">
          { listItemChildren }
        </li>
      );
    });

    healthCheckDataDisplayList = (<ul className="dataCheck_results">{ listItems }</ul>);
  };

  switch (healthCheckDataRequestStatus) {
    case RequestStatus.HOLD:
      if (healthCheckSuccessTimestamp > 0) {
        requestStatusClassName = `${requestStatusClassName} ${requestStatusClassName}_success`;
        requestStatusMessage = HealthCheckDataFetchMessages.requestStatusSuccess;

        mostRecentDataUpdateDateTimeMessage = (
            <React.Fragment>
              { mostRecentDataUpdateDateTimeMessage }
              <span className="worth_noting">
                { dayjs(healthCheckDataUpdateTimestamp).format('DD MMMM YYYY [at] HH:mm:ss') }
              </span>
            </React.Fragment>
          );

        if (CommonUtils.isNumber(healthCheckDataRequestTimeElapsed)) {
          dataFetchAndStateProcessingTimeMessage = (
              <React.Fragment>
                { dataFetchAndStateProcessingTimeMessage }
                <span className="worth_noting">{ healthCheckDataRequestTimeElapsed }ms</span>
              </React.Fragment>
            );
        }

        if (CommonUtils.isNonEmptyObject(healthCheckData)) {
          createHealthCheckDataDisplayList();
        }
      } else {
        if (healthCheckErrorTimestamp > 0) {
          requestStatusClassName = `${requestStatusClassName} ${requestStatusClassName}_error`;
          requestStatusMessage = `${HealthCheckDataFetchMessages.requestStatusError} ${healthCheckDataRequestStatusReason[RequestStatus.ERROR]}`;
        }

        if (healthCheckTimeoutTimestamp > 0) {
          requestStatusClassName = `${requestStatusClassName} ${requestStatusClassName}_timeout`;
          requestStatusMessage = HealthCheckDataFetchMessages.requestStatusTimeout;
        }
      }

      break;

    case RequestStatus.READY:
      requestStatusClassName = `${requestStatusClassName} ${requestStatusClassName}_readying`;
      requestStatusMessage = HealthCheckDataFetchMessages.requestStatusReady;
      break;

    case RequestStatus.REQUESTED:
      requestStatusClassName = `${requestStatusClassName} ${requestStatusClassName}_requested`;
      requestStatusMessage = HealthCheckDataFetchMessages.requestStatusRequested;
      break;

    case RequestStatus.UNINITIATED:
      requestStatusMessage = HealthCheckDataFetchMessages.requestStatusUninitiated;
      break;

    default:
      requestStatusMessage = HealthCheckDataFetchMessages.requestStatusUnavailable;
      break;
  }

  return (
    <section className="dataFetch_check">
      <h3>Data Fetch, Store, Async Middleware, and State Immutability Check</h3>

      <div className="dataFetch_serverInfo">
        <div>
          <p>Data fetch target: <span className="worth_noting">{ HealthCheckDataFetchMessages.dataRequestTarget }</span></p>
          <p className="dataFetch_url">Data fetch URL: <a href={ HealthCheckDataFetchMessages.dataRequestTargetUrl } target="_blank">
            { HealthCheckDataFetchMessages.dataRequestTargetUrl }
          </a></p>
        </div>
  
        <div>
          <p>{ mostRecentDataUpdateDateTimeMessage }</p>
          <p>{ dataFetchAndStateProcessingTimeMessage }</p>
        </div>
      </div>

      <p className={ requestStatusClassName }>{ requestStatusMessage }</p>

      { healthCheckDataDisplayList }
    </section>
  );
};

HealthCheckDataFetchResultsView.propTypes = {
  // REQUIRED...
  healthCheckDataRequestStatus: PropTypes.string.isRequired,
  healthCheckDataUpdateTimestamp: PropTypes.number.isRequired,
  healthCheckErrorTimestamp: PropTypes.number.isRequired,
  healthCheckSuccessTimestamp: PropTypes.number.isRequired,
  healthCheckTimeoutTimestamp: PropTypes.number.isRequired,

  // OPTIONAL...
  healthCheckData: PropTypes.object,
  healthCheckDataRequestStatusReason: PropTypes.objectOf(PropTypes.string),
  healthCheckDataRequestTimeElapsed: PropTypes.number
};

export default HealthCheckDataFetchResultsView;
