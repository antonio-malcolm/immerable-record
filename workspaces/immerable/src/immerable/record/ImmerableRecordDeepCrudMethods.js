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

import { produce } from 'immer';

import ImmerableRecordException from 'immerable/record/ImmerableRecordException';
import ImmerableRecordInternalContextKeys from 'immerable/record/ImmerableRecordInternalContextKeys';
import ImmerableRecordUtils from 'immerable/record/ImmerableRecordUtils';

/**
 * Getters and setters, for deeply-nested structures, which take an array of keys.
 * All setters, among the following methods, return a new draft.
 */

const seekModTgtObj = function(modTgt, keys, callerName) {
  keys.every((key, idx) => {
    if (!ImmerableRecordUtils.isNonEmptyString(key, true)) {
      throw new ImmerableRecordException(
        `Missing path key at index: ${idx}, in keys: ${keys.join(', ')}`,
        callerName
      );
    }

    modTgt = modTgt[key];

    if (modTgt === undefined) {
      throw new ImmerableRecordException(
        `No target object found for path key: ${key}, in keys: ${keys.join(', ')}`,
        callerName
      );
    }

    return true;
  });

  return modTgt;
};

const validateArgs = function(ctxDraft, keys, callerName, isWrite) {
  if (isWrite !== true) {
    isWrite = false;
  }

  if (!Array.isArray(keys)) {
    throw new ImmerableRecordException(
      `Invalid path keys (is not an array): ${keys}`,
      callerName
    );
  }

  if (!ImmerableRecordUtils.isNonEmptyObject(ctxDraft)) {
    throw new ImmerableRecordException(
      `No draft was provided.`,
      callerName
    );
  }

  if (isWrite) {
    if (keys.indexOf(
      ImmerableRecordInternalContextKeys.IMMERABLE_RECORD_HISTORY
    ) > -1) {
      throw new ImmerableRecordException(
        `Invalid key path: ${ImmerableRecordInternalContextKeys.IMMERABLE_RECORD_HISTORY}`
        + ' is an internal, non-writable property, used by the ImmerableRecord API.',
        callerName
      );
    }
  
    if (keys.indexOf(
      ImmerableRecordInternalContextKeys.IS_IMMERABLE_RECORD_INITIALIZED
    ) > -1) {
      throw new ImmerableRecordException(
        `Invalid key path: ${ImmerableRecordInternalContextKeys.IS_IMMERABLE_RECORD_INITIALIZED}`
        + ' is an internal, non-writable property, used by the ImmerableRecord API.',
        callerName
      );
    }
  }
};


/**
 * Exposed methods...
 */

const getIn = function(ctxDraft, keys) {
  validateArgs(ctxDraft, keys, 'getIn');

  if (keys.length < 1) {
    return undefined;
  }

  const modTgtKey = keys.pop();
  let modTgt;

  try {
    modTgt = seekModTgtObj(ctxDraft, keys, 'getIn');
  } catch (ex) {
    if (ex instanceof ImmerableRecordException) {
      return undefined;
    }
  }

  return modTgt[modTgtKey];
};

const setIn = function(ctxDraft, keys, val) {
  validateArgs(ctxDraft, keys, 'setIn', true);

  if (keys.length < 1) {
    return ctxDraft;
  }

  return produce(ctxDraft, (draft) => {
    const modTgtKey = keys.pop();
    const modTgt = seekModTgtObj(draft, keys, 'setIn');

    if (modTgt[modTgtKey] === undefined) {
      throw new ImmerableRecordException(
        `No object found at key path: ${keys.join(', ')}`,
        'setIn'
      );
    }

    modTgt[modTgtKey] = val;
  });
};

const deleteIn = function(ctxDraft, keys) {
  validateArgs(ctxDraft, keys, 'deleteIn', true);

  if (keys.length < 1) {
    return ctxDraft;
  }

  return produce(ctxDraft, (draft) => {
    const modTgtKey = keys.pop();
    const modTgt = seekModTgtObj(draft, keys, 'deleteIn');

    if (modTgt[modTgtKey] === undefined) {
      throw new ImmerableRecordException(
        `No object found at key path: ${keys.join(', ')}`,
        'deleteIn'
      );
    }

    delete modTgt[modTgtKey];
  });
};

const getInArrIdx = function(ctxDraft, keys, idx) {
  validateArgs(ctxDraft, keys, 'getInArrIdx');

  if (keys.length < 1) {
    return undefined;
  }

  const modTgtKey = keys.pop();
  let modTgt;

  try {
    modTgt = seekModTgtObj(ctxDraft, keys, 'getInArrIdx');
  } catch (ex) {
    if (ex instanceof ImmerableRecordException) {
      return undefined;
    }
  }

  if (modTgt[modTgtKey] === undefined) {
    return undefined;
  }

  modTgt = modTgt[modTgtKey];

  if (!Array.isArray(modTgt)) {
    return undefined;
  }

  if (idx > (modTgt.length - 1)) {
    return undefined;
  }

  return modTgt[idx];
};

const setInArrIdx = function(ctxDraft, keys, idx, val) {
  validateArgs(ctxDraft, keys, 'setInArrIdx', true);

  if (keys.length < 1) {
    return ctxDraft;
  }

  if (idx < 0) {
    return ctxDraft;
  }

  return produce(ctxDraft, (draft) => {
    const modTgtKey = keys.pop();
    let modTgt = seekModTgtObj(draft, keys, 'setInArrIdx');

    modTgt = modTgt[modTgtKey];

   if (!Array.isArray(modTgt)) {
      throw new ImmerableRecordException(
        `Insertion target at: ${keys.join(', ')} is not an Array. Type is: ${typeof modTgt}`,
        'setInArrIdx'
      );
    }

   if (modTgt.length < 1) {
      modTgt.push(val);
      return;
    }

   if (idx > (modTgt.length - 1)) {
      modTgt.push(val);
      return;
    }

    /**
     * Use Array#splice. only, here!
     * Immer does not support direct assignment,
     * other than assigning length or numerical values.
     * (i.e., arr[idx] = val)
     *
     * https://immerjs.github.io/immer/pitfalls/#only-valid-indices-and-length-can-be-mutated-on-arrays
     */
    modTgt.splice(idx, 1, val);
  });
};

const deleteInArrIdx = function(ctxDraft, keys, idx) {
  validateArgs(ctxDraft, keys, 'deleteInArrIdx', true);

  if (keys.length < 1) {
    return ctxDraft;
  }

  if (idx < 0) {
    return ctxDraft;
  }

  return produce(ctxDraft, (draft) => {
    const modTgtKey = keys.pop();
    let modTgt = seekModTgtObj(draft, keys, 'deleteInArrIdx');

    modTgt = modTgt[modTgtKey];

    if (!Array.isArray(modTgt)) {
      throw new ImmerableRecordException(
        `Deletion target at: ${keys.join(', ')} is not an Array. Type is: ${typeof modTgt}`,
        'deleteInArrIdx'
      );
    }

    if (idx > (modTgt.length - 1)) {
      return;
    }
    
    modTgt.splice(idx, 1);
  });
};

const pushInArr = function(ctxDraft, keys, val) {
  validateArgs(ctxDraft, keys, 'pushInArr', true);

  if (keys.length < 1) {
    return ctxDraft;
  }

  return produce(ctxDraft, (draft) => {
    const modTgtKey = keys.pop();
    let modTgt = seekModTgtObj(draft, keys, 'pushInArr');

    modTgt = modTgt[modTgtKey];

    if (!Array.isArray(modTgt)) {
      throw new ImmerableRecordException(
        `Push target at: ${keys.join(', ')} is not an Array. Type is: ${typeof modTgt}`,
        'pushInArr'
      );
    }

    modTgt.push(val);
  });
};

const popInArr = function(ctxDraft, keys) {
  validateArgs(ctxDraft, keys, 'popInArr', true);

  if (keys.length < 1) {
    return ctxDraft;
  }

  return produce(ctxDraft, (draft) => {
    const modTgtKey = keys.pop();
    let modTgt = seekModTgtObj(draft, keys, 'popInArr');

    modTgt = modTgt[modTgtKey];

    if (!Array.isArray(modTgt)) {
      throw new ImmerableRecordException(
        `Pop target at: ${keys.join(', ')} is not an Array. Type is: ${typeof modTgt}`,
        'popInArr'
      );
    }

    modTgt.pop();
  });
};

const unshiftInArr = function(ctxDraft, keys, val) {
  validateArgs(ctxDraft, keys, 'unshiftInArr');

  if (keys.length < 1) {
    return ctxDraft;
  }

  return produce(ctxDraft, (draft) => {
    const modTgtKey = keys.pop();
    let modTgt = seekModTgtObj(draft, keys, 'unshiftInArr');

    modTgt = modTgt[modTgtKey];

    if (!Array.isArray(modTgt)) {
      throw new ImmerableRecordException(
        `Unshift target at: ${keys.join(', ')} is not an Array. Type is: ${typeof modTgt}`,
        'unshiftInArr'
      );
    }

    modTgt.unshift(val);
  });
};

const shiftInArr = function(ctxDraft, keys) {
  validateArgs(ctxDraft, keys, 'shiftInArr', true);

  if (keys.length < 1) {
    return ctxDraft;
  }

  return produce(ctxDraft, (draft) => {
    const modTgtKey = keys.pop();
    let modTgt = seekModTgtObj(draft, keys, 'shiftInArr');

    modTgt = modTgt[modTgtKey];

    if (!Array.isArray(modTgt)) {
      throw new ImmerableRecordException(
        `Shift target at: ${keys.join(', ')} is not an Array. Type is: ${typeof modTgt}`,
        'shiftInArr'
      );
    }

    modTgt.shift();
  });
};

const ImmerableRecordDeepCrudMethods = Object.freeze({
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

export default ImmerableRecordDeepCrudMethods;
