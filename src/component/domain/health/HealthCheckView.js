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

import CommonUtils from 'util/CommonUtils';

import HealthCheckDataFetchResultsView from 'component/domain/health/HealthCheckDataFetchResultsView';
import HealthCheckHeaderView from 'component/domain/health/HealthCheckHeaderView';
import HealthCheckLoaderResultsView from 'component/domain/health/HealthCheckLoaderResultsView';

import 'component/domain/health/asset/style/HealthCheckView.scss';

const HealthCheckView = function(props) {
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

  let healthCheckClassName = `healthCheck`;

  if (CommonUtils.isNonEmptyString(process.env.WORKSPACE)) {
    healthCheckClassName
      = `${healthCheckClassName} ${healthCheckClassName}_${process.env.WORKSPACE}`;
  }

  return (
    <main className={ healthCheckClassName }>
      <HealthCheckHeaderView />

      <section className="description">
        <div>
          <h3>Hallo! This is a real-world test, to provide evidence of the following:</h3>
    
          <ul>
            <li>
              &#8226; Proper build
            </li>
    
            <li>
              &#8226; Proper bundling of the application and dependencies
            </li>

            <li>
              &#8226; Proper configuration and performance of the built-in server
            </li>

            <li>
              &#8226; Proper configuration and functioning of the CSS loaders (SASS)
            </li>
    
            <li>
              &#8226; Proper configuration and functioning of the file loaders
            </li>
    
            <li>
              &#8226; Proper functioning of the REST request utils (built with Axios)
            </li>
    
            <li>
              &#8226; Proper functioning of the application store (Redux), store middleware (Redux Saga), as well as related immutability libraries (Immer + ImmerableRecord)
            </li>
          </ul>
        </div>
      </section>

      <section className="checks">
        <HealthCheckLoaderResultsView />
  
        <HealthCheckDataFetchResultsView
          healthCheckData={ healthCheckData }
          healthCheckDataUpdateTimestamp={ healthCheckDataUpdateTimestamp }
          healthCheckDataRequestStatus={ healthCheckDataRequestStatus }
          healthCheckDataRequestStatusReason={ healthCheckDataRequestStatusReason }
          healthCheckDataRequestTimeElapsed={ healthCheckDataRequestTimeElapsed }
          healthCheckErrorTimestamp={ healthCheckErrorTimestamp }
          healthCheckSuccessTimestamp={ healthCheckSuccessTimestamp }
          healthCheckTimeoutTimestamp={ healthCheckTimeoutTimestamp }
        />
      </section>
    </main>
  );
};

HealthCheckView.propTypes = {
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

export default HealthCheckView;
