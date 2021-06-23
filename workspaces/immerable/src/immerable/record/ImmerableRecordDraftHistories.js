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

import ImmerableRecordUtils from 'immerable/record/ImmerableRecordUtils';

const immerableRecordDraftHistories = new WeakMap();

const draftHistoryKeys = Object.freeze({
  CREATED_ON: 'createdOn',
  DRAFT: 'draft',
  HISTORY_LIMIT: 'historyLimit',
  TIMESTAMP: 'timestamp'
});

const createDraftHistoryKey = function(historyLimit) {
    return Object.freeze({
        [draftHistoryKeys.HISTORY_LIMIT]: historyLimit,
        [draftHistoryKeys.CREATED_ON]: Date.now()
      });
  };

const getDraftHistory = function(draftHistoryKey) {
    return Object.freeze(
        immerableRecordDraftHistories.get(draftHistoryKey)
      );
  };

const upsertDraftHistory = function(draftHistoryKey, historyDraft) {
    if (ImmerableRecordUtils.isNonEmptyObject(draftHistoryKey)) {
      let draftHistory = immerableRecordDraftHistories.get(
          draftHistoryKey
        );
  
      let historyCount = 0;
  
      if (draftHistory === undefined) {
        draftHistory = {};
      } else {
        draftHistory = { ...draftHistory };
        historyCount = Object.keys(draftHistory).length;
      }
  
      if (draftHistoryKey[draftHistoryKeys.HISTORY_LIMIT] > historyCount) {
        draftHistory[historyCount] = {
          [draftHistoryKeys.DRAFT]: historyDraft,
          [draftHistoryKeys.TIMESTAMP]: Date.now()
        };
      } else {
        draftHistory = {
          [0]: {
            [draftHistoryKeys.DRAFT]: historyDraft,
            [draftHistoryKeys.TIMESTAMP]: Date.now()
          }
        };
      }
  
      immerableRecordDraftHistories.set(
        draftHistoryKey,
        draftHistory
      );
    }
  };

export default Object.freeze({
  createDraftHistoryKey,
  draftHistoryKeys,
  getDraftHistory,
  upsertDraftHistory
});
