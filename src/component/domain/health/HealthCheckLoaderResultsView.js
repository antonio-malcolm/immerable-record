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
import dayjs from 'dayjs';

import CommonUtils from 'util/CommonUtils';

import HandsomePenguin from 'component/domain/health/asset/image/penguin-1_463-384.jpg';

const HealthCheckLoaderResultsView = function() {
  return (
    <section className="loader_check">
      <h3>File and CSS Loader Check</h3>

      <div>
        <div className="handsome_text">
          <p className="font_test">
            This should render the Better EB Garamond OTF font bundled with the application.
            There should also be a super-handsome peng'n, to the right!
          </p>

          <p>The page should have styles applied.</p>

          <p>Page load date and time: <span className="worth_noting">{ dayjs().format('DD MMMM YYYY [at] HH:mm:ss') }</span></p>
        </div>

        <div className="handsome_pengn">
          { CommonUtils.isAssignedNotNull(HandsomePenguin) && (
            <img src={ HandsomePenguin }
              className="fade-in-quick"
              width="463"
              height="384"
              alt="If no image appears here, check the import path, and, possibly, file loader webpack config"
            />
          ) }
        </div>
      </div>
    </section>
  );
};

export default HealthCheckLoaderResultsView;
