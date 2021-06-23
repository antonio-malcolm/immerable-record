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

import ImmerableRecordDeepCrudMethods from 'immerable/record/ImmerableRecordDeepCrudMethods';

const getIn = function(ctxDraft, keys) {
    return ImmerableRecordDeepCrudMethods.getIn(
        ctxDraft, keys
      );
  };

const setIn = function(ctxDraft, keys, val) {
    return ImmerableRecordDeepCrudMethods.setIn(
        ctxDraft, keys, val
      );
  };

const deleteIn = function(ctxDraft, keys) {
    return ImmerableRecordDeepCrudMethods.deleteIn(
        ctxDraft, keys
      );
  };

const getInArrIdx = function(ctxDraft, keys, idx) {
    return ImmerableRecordDeepCrudMethods.getInArrIdx(
        ctxDraft, keys, idx
      );
  };

const setInArrIdx = function(ctxDraft, keys, idx, val) {
    return ImmerableRecordDeepCrudMethods.setInArrIdx(
        ctxDraft, keys, idx, val
      );
  };

const deleteInArrIdx = function(ctxDraft, keys, idx) {
    return ImmerableRecordDeepCrudMethods.deleteInArrIdx(
        ctxDraft, keys, idx
      );
  };

const pushInArr = function(ctxDraft, keys, val) {
    return ImmerableRecordDeepCrudMethods.pushInArr(
        ctxDraft, keys, val
      );
  };

const popInArr = function(ctxDraft, keys) {
    return ImmerableRecordDeepCrudMethods.popInArr(
         ctxDraft, keys
       );
  };

const unshiftInArr = function(ctxDraft, keys, val) {
    return ImmerableRecordDeepCrudMethods.unshiftInArr(
        ctxDraft, keys, val
      );
  };

const shiftInArr = function(ctxDraft, keys) {
    return ImmerableRecordDeepCrudMethods.shiftInArr(
        ctxDraft, keys
      );
  };

const ImmerableRecordClientMethods = Object.freeze({
  getIn,
  setIn,
  deleteIn,
  getInArrIdx,
  setInArrIdx,
  deleteInArrIdx,
  pushInArr,
  popInArr,
  unshiftInArr,
  shiftInArr
});

export default ImmerableRecordClientMethods;
