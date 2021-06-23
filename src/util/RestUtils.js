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

import axios from 'axios';

import CommonUtils from 'util/CommonUtils';

/**
 * Internal Methods...
 */

const getOptionsDataFromSuccessResponse = function(resp) {
  let options = [];

  if (CommonUtils.isNonEmptyObject(resp.headers)) {
    const allowedMethodsStr = resp.headers[
        'Access-Control-Allow-Methods'
      ];

    if (CommonUtils.isNonEmptyString(allowedMethodsStr)) {
      options = allowedMethodsStr.split(',');
    }
  }

  return {
    options,
    status: resp.status
  };
};


/**
 * Exposed Methods...
 */

/**
 * A simple method, for retrieving HTTP request options,
 * or, for simply checking if a server is available.
 */
const callOptions = function(
  url,
  successCallback = (resp) => {
    return getOptionsDataFromSuccessResponse(resp);
  },
  errorCallback = (err) => {
    console.error('ERROR!');
    console.error(err);
  }
) {
  if (!CommonUtils.isNonEmptyString(url, true)) {
    return null;
  }

  const response = axios.request({
    method: 'options',
    url: `${url}`
  });

  response.then(
    (resp) => {
      successCallback(
        getOptionsDataFromSuccessResponse(resp)
      );
    },
    (err) => errorCallback(err)
  );

  return getOptionsDataFromSuccessResponse(
      response
    ); 
};

/**
 * #callRest supports both Promises and callbacks...
 */
const callRest = function (
  url,
  config = {
    data: undefined,
    params: undefined,
    headers: undefined,
    httpVerb: 'get',
    // #getFullResponse means return an object containing the following:
    // response data, response status, response status text, request data,
    // and the config data, used by axios, to initiate the request
    // Set to false, it will return only the response data...
    getFullResponse: false
  },
  successCallback = (resp) => resp,
  errorCallback = (err) => {
    console.error('ERROR!');
    console.error(err);
  }
) {
  if (!CommonUtils.isNonEmptyString(url, true)) {
    return null;
  }

  if (!CommonUtils.isNonEmptyString(config.httpVerb, true)) {
    config.httpVerb = 'get';
  }

  // Required, to set Content-Type...
  if (!CommonUtils.isNonEmptyObject(config.data)) {
    config.data = null;
  }

  if (!CommonUtils.isNonEmptyObject(config.params)) {
    config.params = null;
  }

  if (!CommonUtils.isNonEmptyObject(config.headers)) {
    config.headers = {};
  }

  if (!CommonUtils.isNonEmptyString(config.headers['Content-Type'], true)) {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';
  }

  const response = axios.request({
    // baseURL: [ADD YOUR BASE URL IF YOU DON'T WANT TO PASS A FULL URL ON EACH REQUEST]
    method: config.httpVerb,
    url: `${url}`,
    headers: config.headers,
    data: config.data,
    params: config.params
  });

  response.then(
    (resp) => {
      if (config.getFullResponse === true) {
        successCallback(resp);
      }

      successCallback(resp.data);
    },
    (err) => errorCallback(err)
  );

  if (config.getFullResponse === true) {
    return response;
  }

  return response.data;
};

const RestUtils = Object.freeze({
  callOptions,
  callRest
});

export default RestUtils;
