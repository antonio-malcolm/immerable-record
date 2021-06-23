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

import { expect } from 'chai';

import ImmerableRecordDraftHistories from 'immerable/record/ImmerableRecordDraftHistories';

import TestFieldMocks from 'immerable/record/TestFieldMocks';

const testFields = TestFieldMocks.testFields;
const testFieldsChanged = TestFieldMocks.testFieldsChanged;

describe('ImmerableRecordDraftHistories Tests', () => {
  const historyKey = ImmerableRecordDraftHistories.createDraftHistoryKey(5);

  it('Upsert Creates New Draft History, Inserts When Existing History Is Not Found, By Key', () => {
    ImmerableRecordDraftHistories.upsertDraftHistory(historyKey, testFields);

    const newHistoryMember = ImmerableRecordDraftHistories.getDraftHistory(historyKey)[0][
        ImmerableRecordDraftHistories.draftHistoryKeys.DRAFT
      ];

    expect(newHistoryMember).to.deep.equal(testFields);
  });

  it('Upsert Updates Draft History, When Existing History Not Found, By Key', () => {
    ImmerableRecordDraftHistories.upsertDraftHistory(historyKey, testFieldsChanged);

    const prevHistoryMember = ImmerableRecordDraftHistories.getDraftHistory(historyKey)[0][
        ImmerableRecordDraftHistories.draftHistoryKeys.DRAFT
      ];

    const newHistoryMember = ImmerableRecordDraftHistories.getDraftHistory(historyKey)[1][
        ImmerableRecordDraftHistories.draftHistoryKeys.DRAFT
      ];

    expect(prevHistoryMember).to.deep.equal(testFields);
    expect(newHistoryMember).to.deep.equal(testFieldsChanged);
  });

  it('Upsert Does Nothing, When Non-object Key Is Provided', () => {
    const invalidKey = undefined;

    ImmerableRecordDraftHistories.upsertDraftHistory(invalidKey, testFieldsChanged);

    expect(ImmerableRecordDraftHistories.getDraftHistory(invalidKey)).to.be.undefined;
  });
});
