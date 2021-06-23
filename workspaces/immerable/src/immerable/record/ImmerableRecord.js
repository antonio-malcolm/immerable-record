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

import { immerable } from 'immer';

import ImmerableRecordClientMethods from 'immerable/record/ImmerableRecordClientMethods';
import ImmerableRecordClientMethodNamesByType from 'immerable/record/ImmerableRecordClientMethodNamesByType';
import ImmerableRecordClientMethodTypes from 'immerable/record/ImmerableRecordClientMethodTypes';
import ImmerableRecordDraftHistories from 'immerable/record/ImmerableRecordDraftHistories';
import ImmerableRecordException from 'immerable/record/ImmerableRecordException';
import ImmerableRecordInternalContextKeys from 'immerable/record/ImmerableRecordInternalContextKeys';
import ImmerableRecordUtils from 'immerable/record/ImmerableRecordUtils';

const configKeys = {
  HISTORY_LIMIT:
    ImmerableRecordDraftHistories.draftHistoryKeys.HISTORY_LIMIT
};

export default class ImmerableRecord {
  [immerable] = true;

  constructor(contextObj, config = {}) {
    if (!(contextObj === null || typeof contextObj === 'undefined')) {
      if (typeof contextObj !== 'object' || Array.isArray(contextObj)) {
        throw new ImmerableRecordException(
          `An object is expected for arg: contextObj. Got: ${Array.isArray(contextObj) ? 'array' : (typeof contextObj)}`,
          'ImmerableRecord#constructor'
        );
      }
    }

    if (!(config === null || typeof config === 'undefined')) {
     if (typeof config !== 'object' || Array.isArray(config)) {
        throw new ImmerableRecordException(
          `An object is expected for arg: config. Got: ${Array.isArray(config) ? 'array' : (typeof config)}`,
          'ImmerableRecord#constructor'
        );
      }
    } else {
      config = {};
    }

    const historyLimit = config[configKeys.HISTORY_LIMIT];

    if (historyLimit !== null && !(typeof historyLimit === 'number' || typeof historyLimit === 'undefined')) {
      throw new ImmerableRecordException(
        `A number is expected for configuration: ${configKeys.HISTORY_LIMIT}. Got: ${typeof historyLimit}`,
        'ImmerableRecord#constructor',
      );
    }

    const hasContext = ImmerableRecordUtils.isNonEmptyObject(contextObj);
    const hasHistory = ImmerableRecordUtils.isNumber(historyLimit) && (historyLimit > 0);
    let historyKey;

    if (hasHistory) {
      historyKey = ImmerableRecordDraftHistories.createDraftHistoryKey(historyLimit);
    }

    let contextDraft = this;

    const updateContextDraft = (nextDraft) => {
        if (hasHistory) {
          ImmerableRecordDraftHistories.upsertDraftHistory(historyKey, nextDraft);
        }
  
        contextDraft = nextDraft;
  
        return contextDraft;
      };

    /**
     * Add getters and setters, for deeply-nested structures, which take an array of keys.
     * All setters, among the following methods, return a new draft.
     */
    Object.keys(ImmerableRecordClientMethods).forEach((key) => {
      Object.defineProperty(
        contextDraft,
        key,
        {
          configurable: false,
          enumerable: true,
          writable: false,
          value: ( ...args ) => {
              if (
                ImmerableRecordClientMethodNamesByType[key]
                  === ImmerableRecordClientMethodTypes.WRITE
              ) {
                return updateContextDraft(
                  ImmerableRecordClientMethods[key](
                      contextDraft,
                      ...args
                    )
                );
              }

              return ImmerableRecordClientMethods[key](
                  contextDraft,
                  ...args
                )
            }
        }
      );
    });

    /**
     * Assign immutable default values,
     * from a supplied context object,
     * on only the initial instantiation.
     */
    if (hasContext) {
      Object.keys(contextObj).forEach((key) => {
        Object.defineProperty(
          contextDraft,
          key,
          {
            configurable: false,
            enumerable: true,
            get: () => contextObj[key]
          }
        );
      });
    }

    if (hasHistory) {
      Object.defineProperty(
        contextDraft,
        ImmerableRecordInternalContextKeys.IMMERABLE_RECORD_HISTORY,
        {
          configurable: false,
          enumerable: true,
          get: () => ImmerableRecordDraftHistories.getDraftHistory(historyKey)
        }
      );
    }

    return updateContextDraft(contextDraft);
  }
}
