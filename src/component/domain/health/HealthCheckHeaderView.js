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

import CommonUtils from 'util/CommonUtils';

const HealthCheckHeaderView = function() {
  let appName = 'Application';
  let environHeader = 'INFO UNAVAILABLE';
  let workspaceHeader = 'INFO UNAVAILABLE';

  if (CommonUtils.isNonEmptyString(process.env.APP_NAME)) {
    appName = `${process.env.APP_NAME} Application`;
  }

  if (CommonUtils.isNonEmptyString(process.env.ENVIRON)) {
    switch (process.env.ENVIRON) {
      case 'dev':
        environHeader = 'development';
        break;

      case 'prod':
        environHeader = 'production';
        break;

      case 'prod-dev':
        environHeader = 'production + development';
        break;

      default:
        environHeader = `${process.env.ENVIRON}`;
        break;
    }
  }

  if (CommonUtils.isNonEmptyString(process.env.WORKSPACE)) {
    workspaceHeader = `${process.env.WORKSPACE}`;

    let workspaceSvg;

    if (workspaceHeader === 'preact') {
      workspaceSvg = (
        <React.Fragment>
          <svg xmlns="http://www.w3.org/2000/svg" className="workspace_header_icon" width="26px" height="26px" viewBox="-256 -256 512 512">
            <title>Preact Logo</title>
            <path d="M0,-256 221.7025033688164,-128 221.7025033688164,128 0,256 -221.7025033688164,128 -221.7025033688164,-128z" fill="white"></path>
            <ellipse cx="0" cy="0" rx="75px" ry="196px" strokeWidth="16px" stroke-dasharray="373.548503517299 73.45149648270097" strokeDashoffset="885.7937254842823" fill="none" stroke="#673ab8" transform="rotate(52)">
            </ellipse>
            <ellipse cx="0" cy="0" rx="75px" ry="196px" strokeWidth="16px" stroke-dasharray="396.5925959364805 50.40740406351949" strokeDashoffset="-717.680310021795" fill="none" stroke="#673ab8" transform="rotate(-52)">
            </ellipse>
            <circle cx="0" cy="0" r="34" fill="#673ab8"></circle>
          </svg>
          &nbsp;
        </React.Fragment>
      );
    }

    if (workspaceHeader === 'react') {
      workspaceSvg = (
        <React.Fragment>
          <svg xmlns="http://www.w3.org/2000/svg" className="workspace_header_icon" width="26px" height="26px" viewBox="-11.5 -10.23174 23 20.46348">
            <title>React Logo</title>
            <circle cx="0" cy="0" r="2.05" fill="#61dafb"/>
            <g stroke="#61dafb" strokeWidth="1" fill="none">
              <ellipse rx="11" ry="4.2"/>
              <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
              <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
            </g>
          </svg>
          &nbsp;
        </React.Fragment>
      );
    }

    workspaceHeader = CommonUtils.convertFirstStringCharToUpperCase(
        workspaceHeader
      );

    workspaceHeader = (
      <span className="workspace_header_title">{ workspaceHeader }</span>
    );

    if (CommonUtils.isAssignedNotNull(workspaceSvg)) {
      workspaceHeader = (
        <React.Fragment>{ workspaceHeader } { workspaceSvg }</React.Fragment>
      );
    }
  }

  return (
    <header>
      <div>
        <h1>{ appName } Health Check</h1>
        <h3>Build: { workspaceHeader }</h3>
        <h3>Environment: { environHeader }</h3>
      </div>
    </header>
  );
};

export default HealthCheckHeaderView;
