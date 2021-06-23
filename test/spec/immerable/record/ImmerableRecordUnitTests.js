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

import ImmerableRecord from 'immerable/record/ImmerableRecord';
import ImmerableRecordException from 'immerable/record/ImmerableRecordException';
import ImmerableRecordInternalContextKeys from 'immerable/record/ImmerableRecordInternalContextKeys';

import TestFieldMocks from 'immerable/record/TestFieldMocks';

const testFields = TestFieldMocks.testFields;
const testFieldsChanged = TestFieldMocks.testFieldsChanged;

class ImmerableRecordExtendingClass extends ImmerableRecord {
  constructor(classTestConfig = {}) {
    let contextObj = { ...testFields };
    let config = {};

    if (classTestConfig.shouldTestWithDirtyContextObj) {
      contextObj = 'foobar';
    }

    if (classTestConfig.shouldTestWithDirtyContextObjAsArray) {
      contextObj = [ 'foobar' ];
    }

    if (classTestConfig.shouldTestWithNullContextObj) {
      contextObj = null;
    }

    if (classTestConfig.shouldTestWithDirtyConfig) {
      config = 'foobar';
    }

    if (classTestConfig.shouldTestWithDirtyConfigAsArray) {
      config = [ 'foobar' ];
    }

    if (classTestConfig.shouldTestWithNullConfig) {
      config = null;
    }

    if (classTestConfig.shouldTestWithHistoryLimit) {
      config.historyLimit = 5;
    }

    if (classTestConfig.shouldTestWithDirtyHistoryLimit) {
      config.historyLimit = 'ten';
    }

    super(contextObj, config);

    if (classTestConfig.shouldFreeze) {
      Object.freeze(this);
    }

    if (classTestConfig.shouldSeal) {
      Object.seal(this);
    }
  }


  /**
   * Arrow function getters...
   */

  getRandomNum = () => {
    return this.getIn([ 'randomNum' ]);
  }

  getRandomStr = () => {
    return this.getIn([ 'randomStr' ]);
  }


  /**
   * Class method getters...
   */

  getArr() {
    return this.getIn([ 'arr' ]);
  }

  getObj() {
    return this.getIn([ 'obj' ]);
  }


  /**
   * Arrow function setters...
   */

  setRandomNum = (val) => {
    return this.setIn([ 'randomNum' ], val);
  }


  /**
   * Class method setters...
   */

  setRandomStr(val) {
    return this.setIn([ 'randomStr' ], val);
  }
}

describe('ImmerableRecord Unit Tests', () => {
  describe('ImmerableRecord Usage With Extending Class', () => {
    describe('Positive Test Cases', () => {
      let imrExtendingClassInstance;

      try {
        beforeEach(() => {
          imrExtendingClassInstance = new ImmerableRecordExtendingClass();
        });
      } catch (err) {
        console.error(err);
      }

      it('Get Fields With Expected Values Using Direct, Dot-notation Accessors', () => {
        // Check first-level accessors...
        expect(imrExtendingClassInstance.randomNum).to.equal(testFields.randomNum);
        expect(imrExtendingClassInstance.randomStr).to.equal(testFields.randomStr);
        expect(imrExtendingClassInstance.arr).to.be.an('array').that.deep.includes.ordered.members(testFields.arr);
        expect(imrExtendingClassInstance.obj).to.be.an('object').that.deep.equals(testFields.obj);

        // Check second-level accessors...
        expect(imrExtendingClassInstance.obj.nestedNum).to.equal(testFields.obj.nestedNum);
        expect(imrExtendingClassInstance.obj.nestedStr).to.equal(testFields.obj.nestedStr);
        expect(imrExtendingClassInstance.obj.nestedArr).to.be.an('array').that.deep.includes.ordered.members(testFields.obj.nestedArr);
        expect(imrExtendingClassInstance.obj.nestedObj).to.be.an('object').that.deep.equals(testFields.obj.nestedObj);

        // Check third-level and fourth-level accessors...
        expect(imrExtendingClassInstance.obj.nestedObj.nextNestedNum).to.equal(testFields.obj.nestedObj.nextNestedNum);
        expect(imrExtendingClassInstance.obj.nestedObj.nextNestedStr).to.equal(testFields.obj.nestedObj.nextNestedStr);
        expect(imrExtendingClassInstance.obj.nestedObj.nextNestedObj).to.be.an('object').that.deep.equals(testFields.obj.nestedObj.nextNestedObj);

        expect(imrExtendingClassInstance.obj.nestedObj.nextNestedObj.nextNestedArr).to.be.an('array')
          .that.deep.includes.ordered.members(testFields.obj.nestedObj.nextNestedObj.nextNestedArr);
      });

      it('Get Fields With Expected Values Using Class-scoped Getter Arrow Functions', () => {
        // Check first-level accessors...
        expect(imrExtendingClassInstance.getRandomNum()).to.equal(testFields.randomNum);
        expect(imrExtendingClassInstance.getRandomStr()).to.equal(testFields.randomStr);


        // Check second-level accessors...
        expect(imrExtendingClassInstance.getObj().nestedNum).to.equal(testFields.obj.nestedNum);
        expect(imrExtendingClassInstance.getObj().nestedStr).to.equal(testFields.obj.nestedStr);

        // Check third-level and fourth-level accessors...
        expect(imrExtendingClassInstance.getObj().nestedObj.nextNestedNum).to.equal(testFields.obj.nestedObj.nextNestedNum);
        expect(imrExtendingClassInstance.getObj().nestedObj.nextNestedStr).to.equal(testFields.obj.nestedObj.nextNestedStr);
      });

      it('Get Fields With Expected Values Using Class-scoped Getter Class Methods', () => {
        // Check first-level accessors...
        expect(imrExtendingClassInstance.getArr()).to.be.an('array').that.deep.includes.ordered.members(testFields.arr);
        expect(imrExtendingClassInstance.getObj()).to.be.an('object').that.deep.equals(testFields.obj);

        // Check second-level accessors...
        expect(imrExtendingClassInstance.getObj().nestedArr).to.be.an('array').that.deep.includes.ordered.members(testFields.obj.nestedArr);
        expect(imrExtendingClassInstance.getObj().nestedObj).to.be.an('object').that.deep.equals(testFields.obj.nestedObj);

        // Check third-level and fourth-level accessors...
        expect(imrExtendingClassInstance.getObj().nestedObj.nextNestedObj).to.be.an('object').that.deep.equals(testFields.obj.nestedObj.nextNestedObj);

        expect(imrExtendingClassInstance.getObj().nestedObj.nextNestedObj.nextNestedArr).to.be.an('array')
          .that.deep.includes.ordered.members(testFields.obj.nestedObj.nextNestedObj.nextNestedArr);
      });

      it('Set Fields With Expected Values Using Class-scoped Setter Arrow Functions', () => {
        imrExtendingClassInstance.setRandomNum(testFieldsChanged.randomNum);

        /**
         * Ensure all updated fields have new values.
         */
   
        // Check first-level accessors...
        expect(imrExtendingClassInstance.getRandomNum()).to.equal(testFieldsChanged.randomNum);

        /**
         * Ensure all other fields remain Unchanged.
         */

        // Check first-level accessors...
        expect(imrExtendingClassInstance.arr).to.be.an('array').that.deep.includes.ordered.members(testFields.arr);
        expect(imrExtendingClassInstance.obj).to.be.an('object').that.deep.equals(testFields.obj);


        // Check second-level accessors...
        expect(imrExtendingClassInstance.obj.nestedNum).to.equal(testFields.obj.nestedNum);
        expect(imrExtendingClassInstance.obj.nestedStr).to.equal(testFields.obj.nestedStr);
        expect(imrExtendingClassInstance.obj.nestedArr).to.be.an('array').that.deep.includes.ordered.members(testFields.obj.nestedArr);
        expect(imrExtendingClassInstance.obj.nestedObj).to.be.an('object').that.deep.equals(testFields.obj.nestedObj);

        // Check third-level and fourth-level accessors...
        expect(imrExtendingClassInstance.obj.nestedObj.nextNestedNum).to.equal(testFields.obj.nestedObj.nextNestedNum);
        expect(imrExtendingClassInstance.obj.nestedObj.nextNestedStr).to.equal(testFields.obj.nestedObj.nextNestedStr);
        expect(imrExtendingClassInstance.obj.nestedObj.nextNestedObj).to.be.an('object').that.deep.equals(testFields.obj.nestedObj.nextNestedObj);

        expect(imrExtendingClassInstance.obj.nestedObj.nextNestedObj.nextNestedArr).to.be.an('array')
          .that.deep.includes.ordered.members(testFields.obj.nestedObj.nextNestedObj.nextNestedArr);
      });

      it('Set fields With Expected Values Using Class-scoped Setter Class Methods', () => {
        imrExtendingClassInstance.setRandomStr(testFieldsChanged.randomNum);

        /**
         * Ensure all updated fields have new values.
         */

        // Check first-level accessors...
        expect(imrExtendingClassInstance.getRandomStr()).to.equal(testFieldsChanged.randomNum);

        /**
         * Ensure all other fields remain Unchanged.
         */

        // Check first-level accessors...
        expect(imrExtendingClassInstance.arr).to.be.an('array').that.deep.includes.ordered.members(testFields.arr);
        expect(imrExtendingClassInstance.obj).to.be.an('object').that.deep.equals(testFields.obj);


        // Check second-level accessors...
        expect(imrExtendingClassInstance.obj.nestedNum).to.equal(testFields.obj.nestedNum);
        expect(imrExtendingClassInstance.obj.nestedStr).to.equal(testFields.obj.nestedStr);
        expect(imrExtendingClassInstance.obj.nestedArr).to.be.an('array').that.deep.includes.ordered.members(testFields.obj.nestedArr);
        expect(imrExtendingClassInstance.obj.nestedObj).to.be.an('object').that.deep.equals(testFields.obj.nestedObj);

        // Check third-level and fourth-level accessors...
        expect(imrExtendingClassInstance.obj.nestedObj.nextNestedNum).to.equal(testFields.obj.nestedObj.nextNestedNum);
        expect(imrExtendingClassInstance.obj.nestedObj.nextNestedStr).to.equal(testFields.obj.nestedObj.nextNestedStr);
        expect(imrExtendingClassInstance.obj.nestedObj.nextNestedObj).to.be.an('object').that.deep.equals(testFields.obj.nestedObj.nextNestedObj);

        expect(imrExtendingClassInstance.obj.nestedObj.nextNestedObj.nextNestedArr).to.be.an('array')
          .that.deep.includes.ordered.members(testFields.obj.nestedObj.nextNestedObj.nextNestedArr);
      });

      it('Get Fields With Expected Values Using Built-in #getIn', () => {
         // Cover condition, in which providing an empty keys array simply returns undefined...
        expect(imrExtendingClassInstance.getIn([])).to.be.undefined;

        // Cover condition, in which providing a keys array with an empty key simply returns undefined...
        expect(imrExtendingClassInstance.getIn([ '' ])).to.be.undefined;

        // Check first-level accessors...
        expect(imrExtendingClassInstance.getIn([ 'randomNum' ])).to.equal(testFields.randomNum);
        expect(imrExtendingClassInstance.getIn([ 'randomStr' ])).to.equal(testFields.randomStr);
        expect(imrExtendingClassInstance.getIn([ 'arr' ])).to.be.an('array').that.deep.includes.ordered.members(testFields.arr);
        expect(imrExtendingClassInstance.getIn([ 'obj' ])).to.be.an('object').that.deep.equals(testFields.obj);

        // Check second-level accessors...
        expect(imrExtendingClassInstance.getIn([ 'obj', 'nestedNum' ])).to.equal(testFields.obj.nestedNum);
        expect(imrExtendingClassInstance.getIn([ 'obj', 'nestedStr' ])).to.equal(testFields.obj.nestedStr);
        expect(imrExtendingClassInstance.getIn([ 'obj', 'nestedArr' ])).to.be.an('array').that.deep.includes.ordered.members(testFields.obj.nestedArr);
        expect(imrExtendingClassInstance.getIn([ 'obj', 'nestedObj' ])).to.be.an('object').that.deep.equals(testFields.obj.nestedObj);

        // Check third-level and fourth-level accessors...
        expect(imrExtendingClassInstance.getIn([ 'obj','nestedObj','nextNestedNum' ])).to.equal(testFields.obj.nestedObj.nextNestedNum);
        expect(imrExtendingClassInstance.getIn([ 'obj','nestedObj','nextNestedStr' ])).to.equal(testFields.obj.nestedObj.nextNestedStr);
        expect(imrExtendingClassInstance.getIn([ 'obj','nestedObj','nextNestedObj' ])).to.be.an('object').that.deep.equals(testFields.obj.nestedObj.nextNestedObj);

        expect(imrExtendingClassInstance.getIn([ 'obj','nestedObj','nextNestedObj', 'nextNestedArr' ]))
          .to.be.an('array').that.deep.includes.ordered.members(testFields.obj.nestedObj.nextNestedObj.nextNestedArr);
      });

      it('Set Fields With Expected Values Using Built-in #setIn', () => {
         // Cover condition, in which providing an empty keys array simply returns the unmodified draft...
        expect(imrExtendingClassInstance.setIn([])).to.equal(imrExtendingClassInstance);

        // Check first-level accessors...
        expect(imrExtendingClassInstance.setIn([ 'randomNum' ], testFieldsChanged.randomNum).randomNum).to.equal(testFieldsChanged.randomNum);
        expect(imrExtendingClassInstance.setIn([ 'randomStr' ], testFieldsChanged.randomStr).randomStr).to.equal(testFieldsChanged.randomStr);

        // Check second-level accessors...
        expect(imrExtendingClassInstance.setIn([ 'obj', 'nestedNum' ], testFieldsChanged.obj.nestedNum).obj.nestedNum).to.equal(testFieldsChanged.obj.nestedNum);
        expect(imrExtendingClassInstance.setIn([ 'obj', 'nestedStr' ], testFieldsChanged.obj.nestedStr).obj.nestedStr).to.equal(testFieldsChanged.obj.nestedStr);

        // Check third-level and fourth-level accessors...
        expect(imrExtendingClassInstance.setIn([ 'obj','nestedObj','nextNestedNum' ], testFieldsChanged.obj.nestedObj.nextNestedNum).obj.nestedObj.nextNestedNum)
          .to.equal(testFieldsChanged.obj.nestedObj.nextNestedNum);

        expect(imrExtendingClassInstance.setIn([ 'obj','nestedObj','nextNestedStr' ], testFieldsChanged.obj.nestedObj.nextNestedStr).obj.nestedObj.nextNestedStr)
          .to.equal(testFieldsChanged.obj.nestedObj.nextNestedStr);
      });

      it('Delete Fields With Expected Undefined Values Using Built-in #deleteIn', () => {
         // Cover condition, in which providing an empty keys array simply returns the unmodified draft...
        expect(imrExtendingClassInstance.deleteIn([])).to.equal(imrExtendingClassInstance);

        // Check first-level accessors...
        expect(imrExtendingClassInstance.deleteIn([ 'randomNum' ]).randomNum).to.be.undefined;
        expect(imrExtendingClassInstance.deleteIn([ 'randomStr' ]).randomStr).to.be.undefined;

        // Check second-level accessors...
        expect(imrExtendingClassInstance.deleteIn([ 'obj', 'nestedNum' ]).obj.nestedNum).to.be.undefined;
        expect(imrExtendingClassInstance.deleteIn([ 'obj', 'nestedStr' ]).obj.nestedStr).to.be.undefined;

        // Check third-level and fourth-level accessors...
        expect(imrExtendingClassInstance.deleteIn([ 'obj','nestedObj','nextNestedNum' ]).obj.nestedObj.nextNestedNum).to.be.undefined;
        expect(imrExtendingClassInstance.deleteIn([ 'obj','nestedObj','nextNestedStr' ]).obj.nestedObj.nextNestedStr).to.be.undefined;
      });

      it('Get From Array Fields With Expected Values Using Built-in #getInArrIdx', () => {
        // Cover condition, in which providing an empty keys array simply returns undefined...
        expect(imrExtendingClassInstance.getInArrIdx([], 3)).to.be.undefined;

        // Cover condition, in which providing a keys array with an empty key simply returns undefined...
        expect(imrExtendingClassInstance.getInArrIdx([ ''], 3)).to.be.undefined;

        // Cover condition, in which providing an index greater than the array max index simply returns undefined...
        expect(imrExtendingClassInstance.getInArrIdx([ 'obj', 'nestedArr' ], 200000)).to.be.undefined;

        // Cover condition, in which providing keys array with path including non-existent property simply returns undefined...
        expect(imrExtendingClassInstance.getInArrIdx([ 'arr', 'nonexistent_property_key' ], 2)).to.be.undefined;

        // Cover condition, in which providing keys array with path leading to non-array property simply returns undefined...
        expect(imrExtendingClassInstance.getInArrIdx([ 'obj', 'nestedStr' ], 3)).to.be.undefined;

        // Check first-level accessors...
        expect(imrExtendingClassInstance.getInArrIdx([ 'arr' ], 1)).to.equal(testFields.arr[1]);

        // Check second-level accessors...
        expect(imrExtendingClassInstance.getInArrIdx([ 'obj', 'nestedArr' ], 2)).to.equal(testFields.obj.nestedArr[2]);

        // Check third-level and fourth-level accessors...
         expect(imrExtendingClassInstance.getInArrIdx([ 'obj','nestedObj','nextNestedObj', 'nextNestedArr' ], 2))
          .to.equal(testFields.obj.nestedObj.nextNestedObj.nextNestedArr[2]);
      });

      it('Modify Array Fields (add at index) With Expected Values Using Built-in #setInArrIdx', () => {
        // Cover condition, in which providing empty keys array simply returns the unmodified draft...
        expect(imrExtendingClassInstance.setInArrIdx([], 34, testFieldsChanged.randomNum)).to.equal(imrExtendingClassInstance);

        // Cover condition, in which providing an index less that zero simply returns the unmodified draft...
        expect(imrExtendingClassInstance.setInArrIdx([ 'arr' ], -1, testFieldsChanged.randomNum)).to.equal(imrExtendingClassInstance);

        // Cover condition, in which inserting into an empty array simply adds the member, regardless of index provided...
        expect(imrExtendingClassInstance.setInArrIdx([ 'obj', 'nestedEmptyArr' ], 34, testFieldsChanged.randomNum).obj.nestedEmptyArr[0])
          .to.equal(testFieldsChanged.randomNum);

        // Cover condition, in which inserting into an array with an index greater than the array max index simply adds the member,
        // to the end, regardless of index provided...
        expect(imrExtendingClassInstance.setInArrIdx([ 'obj', 'nestedArr' ], 34000, testFieldsChanged.randomNum).obj.nestedArr[
            // Don't use (#length - 1) here, as this length is, appraently, derived from the pre-update array...
            // We just need to check the last member, to verify the new value was added, to the end of the array...
            (imrExtendingClassInstance.obj.nestedArr.length)
          ]).to.equal(testFieldsChanged.randomNum);

        // Check first-level accessors...
        expect(imrExtendingClassInstance.setInArrIdx([ 'arr' ], 2, testFieldsChanged.arr[2]).arr[2]).to.equal(testFieldsChanged.arr[2]);

        // Check second-level accessors...
        expect(imrExtendingClassInstance.setInArrIdx([ 'obj', 'nestedArr' ], 1, testFieldsChanged.obj.nestedArr[1]).obj.nestedArr[1])
          .to.equal(testFieldsChanged.obj.nestedArr[1]);

        // Check third-level and fourth-level accessors...
        expect(imrExtendingClassInstance.setInArrIdx(
            [ 'obj','nestedObj','nextNestedObj', 'nextNestedArr' ],
            3,
            testFieldsChanged.obj.nestedObj.nextNestedObj.nextNestedArr[3]
          ).obj.nestedObj.nextNestedObj.nextNestedArr[3])
          .to.equal(testFieldsChanged.obj.nestedObj.nextNestedObj.nextNestedArr[3]);
      });

      it('Modify Array Fields (delete at index) With Expected Undefined Values Using Built-in #deleteInArrIdx', () => {
        // Cover condition, in which providing empty keys array simply returns the unmodified draft...
        expect(imrExtendingClassInstance.deleteInArrIdx([], 34)).to.equal(imrExtendingClassInstance);

        // Cover condition, in which providing an index less that zero simply returns the unmodified draft...
        expect(imrExtendingClassInstance.deleteInArrIdx([ 'arr' ], -1, testFieldsChanged.randomNum)).to.equal(imrExtendingClassInstance);

        // Cover condition, in which providing an index greater than the target array max index simply returns the unmodified draft...
        expect(imrExtendingClassInstance.deleteInArrIdx([ 'arr' ], 34000)).to.equal(imrExtendingClassInstance);

        // Check first-level accessors...
        expect(imrExtendingClassInstance.deleteInArrIdx([ 'arr' ], 2).arr[2]).to.equal(testFields.arr[3]);

        // Check second-level accessors...
        expect(imrExtendingClassInstance.deleteInArrIdx([ 'obj', 'nestedArr' ], 1).obj.nestedArr[1])
          .to.equal(testFields.obj.nestedArr[2]);

        // Check third-level and fourth-level accessors...
        expect(imrExtendingClassInstance.deleteInArrIdx(
            [ 'obj','nestedObj','nextNestedObj', 'nextNestedArr' ],
            3
          ).obj.nestedObj.nextNestedObj.nextNestedArr[3])
          .to.equal(testFields.obj.nestedObj.nextNestedObj.nextNestedArr[4]);
      });

      it('Modify Array Fields (add as last) With Expected Values Using Built-in #pushInArr', () => {
        // Cover condition, in which providing empty keys array simply returns the unmodified draft...
        expect(imrExtendingClassInstance.pushInArr([], 34)).to.equal(imrExtendingClassInstance);

        // Check first-level accessors...
        let testCheckData = (Date.now() + Math.floor(Math.random()));
        let testCheckLength = imrExtendingClassInstance.arr.length;
        let testInstance = imrExtendingClassInstance.pushInArr([ 'arr'], testCheckData);

        expect(testInstance.arr).to.have.lengthOf(
            (testCheckLength + 1)
          );

        expect(testInstance.arr[
          (testInstance.arr.length - 1)
        ]).to.equal(testCheckData);

        // Check second-level accessors...
        testCheckData = (Date.now() + Math.floor(Math.random()));
        testCheckLength = imrExtendingClassInstance.obj.nestedArr.length;
        testInstance = imrExtendingClassInstance.pushInArr(
            [ 'obj','nestedArr' ],
            testCheckData
          );

        expect(testInstance.obj.nestedArr).to.have.lengthOf(
            (testCheckLength + 1)
          );

        expect(testInstance.obj.nestedArr[
          (testInstance.obj.nestedArr.length - 1)
        ]).to.equal(testCheckData);

        // Check third-level and fourth-level accessors...
        testCheckData = (Date.now() + Math.floor(Math.random()));
        testCheckLength = imrExtendingClassInstance.obj.nestedObj.nextNestedObj.nextNestedArr.length;
        testInstance = imrExtendingClassInstance.pushInArr(
            [ 'obj','nestedObj','nextNestedObj', 'nextNestedArr' ],
            testCheckData
          );

        expect(testInstance.obj.nestedObj.nextNestedObj.nextNestedArr).to.have.lengthOf(
            (testCheckLength + 1)
          );

        expect(testInstance.obj.nestedObj.nextNestedObj.nextNestedArr[
          (testInstance.obj.nestedObj.nextNestedObj.nextNestedArr.length - 1)
        ]).to.equal(testCheckData);
      });

      it('Modify Array Fields (remove last) With Expected Values Using Built-in #popInArr', () => {
        // Cover condition, in which providing empty keys array simply returns the unmodified draft...
        expect(imrExtendingClassInstance.popInArr([])).to.equal(imrExtendingClassInstance);

        // Check first-level accessors...
        let testCheckData = imrExtendingClassInstance.arr[
            (imrExtendingClassInstance.arr.length - 1)
          ];

        let testCheckLength = imrExtendingClassInstance.arr.length;
        let testInstance = imrExtendingClassInstance.popInArr([ 'arr']);

        expect(testInstance.arr[
            testCheckLength
          ]).to.be.undefined;

        expect(testInstance.arr).to.have.lengthOf(
            (testCheckLength - 1)
          );

        expect(testInstance.arr[
            (imrExtendingClassInstance.arr.length - 1)
          ]).to.not.equal(testCheckData);

        // Check second-level accessors...
        testCheckData = imrExtendingClassInstance.arr[
            (imrExtendingClassInstance.obj.nestedArr.length - 1)
          ];

        testCheckLength = imrExtendingClassInstance.obj.nestedArr.length;
        testInstance = imrExtendingClassInstance.popInArr([ 'obj', 'nestedArr' ]);

        expect(testInstance.obj.nestedArr[
            testCheckLength
          ]).to.be.undefined;

        expect(testInstance.obj.nestedArr).to.have.lengthOf(
            (testCheckLength - 1)
          );

        expect(testInstance.obj.nestedArr[
          (imrExtendingClassInstance.obj.nestedArr.length - 1)
        ]).to.be.undefined;

        // Check third-level and fourth-level accessors...
        testCheckData = imrExtendingClassInstance.obj.nestedObj.nextNestedObj.nextNestedArr[
            (imrExtendingClassInstance.obj.nestedObj.nextNestedObj.nextNestedArr.length - 1)
          ];
        
        testCheckLength = imrExtendingClassInstance.obj.nestedObj.nextNestedObj.nextNestedArr.length;
        testInstance = imrExtendingClassInstance.popInArr([ 'obj','nestedObj','nextNestedObj', 'nextNestedArr' ]);

        expect(testInstance.obj.nestedObj.nextNestedObj.nextNestedArr[
            testCheckLength
          ]).to.be.undefined;

        expect(testInstance.obj.nestedObj.nextNestedObj.nextNestedArr).to.have.lengthOf(
            (testCheckLength - 1)
          );

        expect(testInstance.obj.nestedObj.nextNestedObj.nextNestedArr[
            (imrExtendingClassInstance.obj.nestedObj.nextNestedObj.nextNestedArr.length - 1)
          ]).to.not.equal(testCheckData);
      });

      it('Modify Array Fields (add as first) With Expected Values Using Built-in #unshiftInArr', () => {
        // Cover condition, in which providing empty keys array simply returns the unmodified draft...
        expect(imrExtendingClassInstance.pushInArr([], 34)).to.equal(imrExtendingClassInstance);

        // Check first-level accessors...
        let testCheckData = (Date.now() + Math.floor(Math.random()));
        let testCheckLength = imrExtendingClassInstance.arr.length;
        let testInstance = imrExtendingClassInstance.unshiftInArr([ 'arr'], testCheckData);

        expect(testInstance.arr).to.have.lengthOf(
            (testCheckLength + 1)
          );

        expect(testInstance.arr[0]).to.equal(testCheckData);

        // Check second-level accessors...
        testCheckData = (Date.now() + Math.floor(Math.random()));
        testCheckLength = imrExtendingClassInstance.obj.nestedArr.length;
        testInstance = imrExtendingClassInstance.unshiftInArr(
            [ 'obj','nestedArr' ],
            testCheckData
          );

        expect(testInstance.obj.nestedArr).to.have.lengthOf(
            (testCheckLength + 1)
          );

        expect(testInstance.obj.nestedArr[0]).to.equal(testCheckData);

        // Check third-level and fourth-level accessors...
        testCheckData = (Date.now() + Math.floor(Math.random()));
        testCheckLength = imrExtendingClassInstance.obj.nestedObj.nextNestedObj.nextNestedArr.length;
        testInstance = imrExtendingClassInstance.unshiftInArr(
            [ 'obj','nestedObj','nextNestedObj', 'nextNestedArr' ],
            testCheckData
          );

        expect(testInstance.obj.nestedObj.nextNestedObj.nextNestedArr).to.have.lengthOf(
            (testCheckLength + 1)
          );

        expect(testInstance.obj.nestedObj.nextNestedObj.nextNestedArr[0]).to.equal(testCheckData);
      });

      it('Modify Array Fields (remove first) With Expected Values Using Built-in #shiftInArr', () => {
        // Cover condition, in which providing empty keys array simply returns the unmodified draft...
        expect(imrExtendingClassInstance.shiftInArr([])).to.equal(imrExtendingClassInstance);

        // Check first-level accessors...
        let testCheckData = imrExtendingClassInstance.arr[
            (imrExtendingClassInstance.arr.length - 1)
          ];

        let testCheckLength = imrExtendingClassInstance.arr.length;
        let testInstance = imrExtendingClassInstance.shiftInArr([ 'arr']);

        expect(testInstance.arr[
            testCheckLength
          ]).to.be.undefined;

        expect(testInstance.arr).to.have.lengthOf(
            (testCheckLength - 1)
          );

        expect(testInstance.arr[0]).to.not.equal(testCheckData);

        // Check second-level accessors...
        testCheckData = imrExtendingClassInstance.arr[0];
        testCheckLength = imrExtendingClassInstance.obj.nestedArr.length;
        testInstance = imrExtendingClassInstance.shiftInArr([ 'obj', 'nestedArr' ]);

        expect(testInstance.obj.nestedArr[
            testCheckLength
          ]).to.be.undefined;

        expect(testInstance.obj.nestedArr).to.have.lengthOf(
            (testCheckLength - 1)
          );

        expect(testInstance.obj.nestedArr[0]).to.not.equal(testCheckData);

        // Check third-level and fourth-level accessors...
        testCheckData = imrExtendingClassInstance.obj.nestedObj.nextNestedObj.nextNestedArr[0];
        testCheckLength = imrExtendingClassInstance.obj.nestedObj.nextNestedObj.nextNestedArr.length;
        testInstance = imrExtendingClassInstance.shiftInArr([ 'obj','nestedObj','nextNestedObj', 'nextNestedArr' ]);

        expect(testInstance.obj.nestedObj.nextNestedObj.nextNestedArr[
            testCheckLength
          ]).to.be.undefined;

        expect(testInstance.obj.nestedObj.nextNestedObj.nextNestedArr).to.have.lengthOf(
            (testCheckLength - 1)
          );

        expect(testInstance.obj.nestedObj.nextNestedObj.nextNestedArr[0])
          .to.not.equal(testCheckData);
      });
    });

    describe('History API Test Cases', () => {
      it('When History Limit Is Set On Config, Each Update Adds A Draft To History', () => {
        let imrExtendingClassInstance;
  
        try {
          imrExtendingClassInstance = new ImmerableRecordExtendingClass({ shouldTestWithHistoryLimit: true });
        } catch (err) {
          console.log(err);
        }

        // Making two updates, here - there will be three drafts, including the original...
        imrExtendingClassInstance.setIn([ 'randomNum' ], testFieldsChanged.randomNum)
          .setIn([ 'randomStr' ], testFieldsChanged.randomStr);

        let draftHistory = imrExtendingClassInstance.immerableRecordHistory;

        expect(draftHistory).to.be.instanceOf(Object);
        expect(Object.keys(draftHistory)).to.have.lengthOf(3);
      });

      it('When History Limit Is Set On Config, And Number Of Drafts In History Meets Limit, History Should Reset', () => {
        let imrExtendingClassInstance;
  
        try {
          imrExtendingClassInstance = new ImmerableRecordExtendingClass({ shouldTestWithHistoryLimit: true });
        } catch (err) {
          console.log(err);
        }

        // Making two updates, here - there will be three drafts, including the original...
        imrExtendingClassInstance.setIn([ 'randomNum' ], testFieldsChanged.randomNum)
          .setIn([ 'randomStr' ], testFieldsChanged.randomStr)
          .shiftInArr([ 'arr' ]);

        let draftHistory = imrExtendingClassInstance.immerableRecordHistory;

        expect(draftHistory).to.be.instanceOf(Object);
        expect(Object.keys(draftHistory)).to.have.lengthOf(3);

        // historyLimit is set to 5, at which point, history is cleared,
        // and started anew. Four more updates hits the limit, after two,
        // then adds two to the next history...
        imrExtendingClassInstance.setIn([ 'randomNum' ], testFieldsChanged.randomNum)
          .setIn([ 'randomStr' ], testFieldsChanged.randomStr)
          .shiftInArr([ 'arr' ])
          .deleteIn([ 'obj', 'nestedNum' ])
          .deleteIn([ 'obj', 'nestedStr' ]);

        draftHistory = imrExtendingClassInstance.immerableRecordHistory;

        expect(draftHistory).to.be.instanceOf(Object);
        expect(Object.keys(draftHistory)).to.have.lengthOf(2);
      });

      it('When History Limit Is Not Set On Config, No History Is Kept Or Available', () => {
        let imrExtendingClassInstance;
  
        try {
          imrExtendingClassInstance = new ImmerableRecordExtendingClass();
        } catch (err) {
          console.log(err);
        }

        imrExtendingClassInstance.setIn([ 'randomNum' ], testFieldsChanged.randomNum)
          .setIn([ 'randomStr' ], testFieldsChanged.randomStr);

        let draftHistory = imrExtendingClassInstance.immerableRecordHistory;

        expect(draftHistory).to.be.undefined;
      });
    });

    describe('Negative Test Cases', () => {
      describe('Class Instantiation', () => {
        it('Instantiation With Incorrect Type contextObj Arg Should Throw Exception', () => {
          const testFunc = function() {
              let imrExtendingClassInstance = new ImmerableRecordExtendingClass(
                  { shouldTestWithDirtyContextObj: true }
                );
            };
  
          expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
        });

        it('Instantiation With Incorrect Type (Array) contextObj Arg Should Throw Exception', () => {
          const testFunc = function() {
              let imrExtendingClassInstance = new ImmerableRecordExtendingClass(
                  { shouldTestWithDirtyContextObjAsArray: true }
                );
            };
  
          expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
        });

        it('Instantiation With null contextObj Arg Should Return Object Without Context', () => {
          let imrExtendingClassInstance = new ImmerableRecordExtendingClass(
              { shouldTestWithNullContextObj: true }
            );

          expect(imrExtendingClassInstance.randomNum).to.be.undefined;
        });

        it('Instantiation With null config Arg Should Return New Instance', () => {
          let imrExtendingClassInstance = new ImmerableRecordExtendingClass(
              { shouldTestWithNullConfig: true }
            );

          expect(imrExtendingClassInstance.randomNum).to.equal(testFields.randomNum);
        });

        it('Instantiation With Incorrect Type config Arg Should Throw Exception', () => {
          const testFunc = function() {
              let imrExtendingClassInstance = new ImmerableRecordExtendingClass(
                  { shouldTestWithDirtyConfig: true }
                );
            };
  
          expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
        });

        it('Instantiation With Incorrect Type (Array) config Arg Should Throw Exception', () => {
          const testFunc = function() {
              let imrExtendingClassInstance = new ImmerableRecordExtendingClass(
                  { shouldTestWithDirtyConfigAsArray: true }
                );
            };
  
          expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
        });

        it('Instantiation With Incorrect Type config:historyLimit Arg Should Throw Exception', () => {
          const testFunc = function() {
              let imrExtendingClassInstance = new ImmerableRecordExtendingClass(
                  { shouldTestWithDirtyHistoryLimit: true }
                );
            };
  
          expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
        });
      });

      let imrExtendingClassInstance;

      try {
        beforeEach(() => {
          imrExtendingClassInstance = new ImmerableRecordExtendingClass();
        });
      } catch (err) {
        console.log(err);
      }

      it('Attempt To Add Property After Instantiation On Frozen Extending Instance Should Throw Exception', () => {
        imrExtendingClassInstance = new ImmerableRecordExtendingClass({ shouldFreeze: true });

        const testFunc = function() {
            imrExtendingClassInstance.fooBar = 'fooBar';
          };

        expect(testFunc).to.throw();
      });

      it('Attempt To Add Property After Instantiation On Sealed Extending Instance Should Throw Exception', () => {
        imrExtendingClassInstance = new ImmerableRecordExtendingClass({ shouldSeal: true });

        const testFunc = function() {
            imrExtendingClassInstance.fooBar = 'fooBar';
          };

        expect(testFunc).to.throw();
      });

      it('Attempted Get With Nonexistent Keys Arg Should Throw Exception, Using Built-in #getIn', () => {
        const testFunc = function() {
            imrExtendingClassInstance.getIn();
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Get With Non-array Type Keys Arg Should Throw Exception, Using Built-in #getIn', () => {
        const testFunc = function() {
            imrExtendingClassInstance.getIn('foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Set With Nonexistent Keys Arg Should Throw Exception, Using Built-in #setIn', () => {
        const testFunc = function() {
            imrExtendingClassInstance.setIn();
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Set With Non-array Type Keys Arg Should Throw Exception, Using Built-in #setIn', () => {
        const testFunc = function() {
            imrExtendingClassInstance.setIn('foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Set With Keys Arg COntaingin Empty Key Should Throw Exception, Using Built-in #setIn', () => {
        const testFunc = function() {
            expect(imrExtendingClassInstance.setIn([ '' ]));
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Set With Non-Matching Key Should Throw Exception, Using Built-in #setIn', () => {
        const testFunc = function() {
            imrExtendingClassInstance.setIn([ 'this key does not exist'], 'foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it(`Attempted Set With Internal Use Key: ${ImmerableRecordInternalContextKeys.IMMERABLE_RECORD_HISTORY} Should Throw Exception, Using Built-in #setIn`, () => {
        const testFunc = function() {
            imrExtendingClassInstance.setIn([ ImmerableRecordInternalContextKeys.IMMERABLE_RECORD_HISTORY ], 'foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it(`Attempted Set With Internal Use Key: ${ImmerableRecordInternalContextKeys.IS_IMMERABLE_RECORD_INITIALIZED} Should Throw Exception, Using Built-in #setIn`, () => {
        const testFunc = function() {
            imrExtendingClassInstance.setIn([ ImmerableRecordInternalContextKeys.IS_IMMERABLE_RECORD_INITIALIZED ], 'foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Delete With Nonexistent Keys Arg Should Throw Exception, Using Built-in #deleteIn', () => {
        const testFunc = function() {
            imrExtendingClassInstance.deleteIn();
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Delete With Non-array Type Keys Arg Should Throw Exception, Using Built-in #deleteIn', () => {
        const testFunc = function() {
            imrExtendingClassInstance.deleteIn('foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Delete With Non-Matching Key Should Throw Exception, Using Built-in #deleteIn', () => {
        const testFunc = function() {
            imrExtendingClassInstance.deleteIn([ 'this key does not exist' ]);
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it(`Attempted Delete With Internal Use Key: ${ImmerableRecordInternalContextKeys.IMMERABLE_RECORD_HISTORY} Should Throw Exception, Using Built-in #deleteIn`, () => {
        const testFunc = function() {
            imrExtendingClassInstance.deleteIn([ ImmerableRecordInternalContextKeys.IMMERABLE_RECORD_HISTORY ], 'foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it(`Attempted Delete With Internal Use Key: ${ImmerableRecordInternalContextKeys.IS_IMMERABLE_RECORD_INITIALIZED} Should Throw Exception, Using Built-in #deleteIn`, () => {
        const testFunc = function() {
            imrExtendingClassInstance.deleteIn([ ImmerableRecordInternalContextKeys.IS_IMMERABLE_RECORD_INITIALIZED ], 'foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Member Retrieval With Nonexistent Keys Arg Should Throw Exception, Using Built-in #getInArrIdx', () => {
        const testFunc = function() {
            imrExtendingClassInstance.getInArrIdx();
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Member Retrieval With Non-array Type Keys Arg Should Throw Exception, Using Built-in #getInArrIdx', () => {
        const testFunc = function() {
            imrExtendingClassInstance.getInArrIdx('foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Member Set With Nonexistent Keys Arg Should Throw Exception, Using Built-in #setInArrIdx', () => {
        const testFunc = function() {
            imrExtendingClassInstance.setInArrIdx();
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Member Set With Non-array Type Keys Arg Should Throw Exception, Using Built-in #setInArrIdx', () => {
        const testFunc = function() {
            imrExtendingClassInstance.setInArrIdx('foobar', 3, 'foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Member Set With Nonexistent Key Should Throw Exception, Using Built-in #setInArrIdx', () => {
        const testFunc = function() {
            imrExtendingClassInstance.setInArrIdx([ 'this key does not exist' ], 3, 'foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Member Set To Target Which Is Not An Array Should Throw Exception, Using Built-in #setInArrIdx', () => {
        const testFunc = function() {
            imrExtendingClassInstance.setInArrIdx([ 'obj', 'nestedStr' ], 3, 'foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it(`Attempted Array Member Set With Internal Use Key: ${ImmerableRecordInternalContextKeys.IMMERABLE_RECORD_HISTORY} Should Throw Exception, Using Built-in #setInArrIdx`, () => {
        const testFunc = function() {
            imrExtendingClassInstance.setInArrIdx([ ImmerableRecordInternalContextKeys.IMMERABLE_RECORD_HISTORY ], 2, 'foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it(`Attempted Array Member Set With Internal Use Key: ${ImmerableRecordInternalContextKeys.IS_IMMERABLE_RECORD_INITIALIZED} Should Throw Exception, Using Built-in #setInArrIdx`, () => {
        const testFunc = function() {
            imrExtendingClassInstance.setInArrIdx([ ImmerableRecordInternalContextKeys.IS_IMMERABLE_RECORD_INITIALIZED ], 2, 'foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Member Delete With Nonexistent Keys Arg Should Throw Exception, Using Built-in #deleteInArrIdx', () => {
        const testFunc = function() {
            imrExtendingClassInstance.deleteInArrIdx();
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Member Delete With Non-array Type Keys Arg Should Throw Exception, Using Built-in #deleteInArrIdx', () => {
        const testFunc = function() {
            imrExtendingClassInstance.deleteInArrIdx('foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Member Delete With Nonexistent Key Should Throw Exception, Using Built-in #deleteInArrIdx', () => {
        const testFunc = function() {
            imrExtendingClassInstance.deleteInArrIdx([ 'this key does not exist' ], 3);
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it(`Attempted Array Member Delete With Internal Use Key: ${ImmerableRecordInternalContextKeys.IMMERABLE_RECORD_HISTORY} Should Throw Exception, Using Built-in #deleteInArrIdx`, () => {
        const testFunc = function() {
            imrExtendingClassInstance.deleteInArrIdx([ ImmerableRecordInternalContextKeys.IMMERABLE_RECORD_HISTORY ], 2);
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it(`Attempted Array Member Delete With Internal Use Key: ${ImmerableRecordInternalContextKeys.IS_IMMERABLE_RECORD_INITIALIZED} Should Throw Exception, Using Built-in #deleteInArrIdx`, () => {
        const testFunc = function() {
            imrExtendingClassInstance.deleteInArrIdx([ ImmerableRecordInternalContextKeys.IS_IMMERABLE_RECORD_INITIALIZED ], 2);
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Push With Nonexistent Keys Arg Should Throw Exception, Using Built-in #pushInArr', () => {
        const testFunc = function() {
            imrExtendingClassInstance.pushInArr();
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Push With Non-array Type Keys Arg Should Throw Exception, Using Built-in #pushInArr', () => {
        const testFunc = function() {
            imrExtendingClassInstance.pushInArr('foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Push With Nonexistent Key Should Throw Exception, Using Built-in #pushInArr', () => {
        const testFunc = function() {
            imrExtendingClassInstance.pushInArr([ 'this key does not exist'], 3);
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Push When Property At Key Path Is Not Array Should Throw Exception, Using Built-in #pushInArr', () => {
        const testFunc = function() {
            imrExtendingClassInstance.pushInArr([ 'randomStr'], 3);
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it(`Attempted Array Push With Internal Use Key: ${ImmerableRecordInternalContextKeys.IMMERABLE_RECORD_HISTORY} Should Throw Exception, Using Built-in #pushInArr`, () => {
        const testFunc = function() {
            imrExtendingClassInstance.pushInArr([ ImmerableRecordInternalContextKeys.IMMERABLE_RECORD_HISTORY ], 'foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it(`Attempted Array Push With Internal Use Key: ${ImmerableRecordInternalContextKeys.IS_IMMERABLE_RECORD_INITIALIZED} Should Throw Exception, Using Built-in #pushInArr`, () => {
        const testFunc = function() {
            imrExtendingClassInstance.pushInArr([ ImmerableRecordInternalContextKeys.IS_IMMERABLE_RECORD_INITIALIZED ], 'foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Pop With Nonexistent Keys Arg Should Throw Exception, Using Built-in #popInArr', () => {
        const testFunc = function() {
            imrExtendingClassInstance.popInArr();
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Pop With Non-array Type Keys Arg Should Throw Exception, Using Built-in #popInArr', () => {
        const testFunc = function() {
            imrExtendingClassInstance.popInArr('foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Pop With Nonexistent Key Should Throw Exception, Using Built-in #popInArr', () => {
        const testFunc = function() {
            imrExtendingClassInstance.popInArr([ 'this key does not exist'], 3);
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Pop When Property At Key Path Is Not Array Should Throw Exception, Using Built-in #popInArr', () => {
        const testFunc = function() {
            imrExtendingClassInstance.popInArr([ 'randomStr']);
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it(`Attempted Array Pop With Internal Use Key: ${ImmerableRecordInternalContextKeys.IMMERABLE_RECORD_HISTORY} Should Throw Exception, Using Built-in #popInArr`, () => {
        const testFunc = function() {
            imrExtendingClassInstance.popInArr([ ImmerableRecordInternalContextKeys.IMMERABLE_RECORD_HISTORY ]);
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it(`Attempted Array Pop With Internal Use Key: ${ImmerableRecordInternalContextKeys.IS_IMMERABLE_RECORD_INITIALIZED} Should Throw Exception, Using Built-in #popInArr`, () => {
        const testFunc = function() {
            imrExtendingClassInstance.popInArr([ ImmerableRecordInternalContextKeys.IS_IMMERABLE_RECORD_INITIALIZED ]);
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Unshift With Nonexistent Keys Arg Should Throw Exception, Using Built-in #unshiftInArr', () => {
        const testFunc = function() {
            imrExtendingClassInstance.unshiftInArr();
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Unshift With Non-array Type Keys Arg Should Throw Exception, Using Built-in #unshiftInArr', () => {
        const testFunc = function() {
            imrExtendingClassInstance.unshiftInArr('foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Unshift With Nonexistent Key Should Throw Exception, Using Built-in #unshiftInArr', () => {
        const testFunc = function() {
            imrExtendingClassInstance.unshiftInArr([ 'this key does not exist' ], 3);
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Unshift When Property At Key Path Is Not Array Should Throw Exception, Using Built-in #unshiftInArr', () => {
        const testFunc = function() {
            imrExtendingClassInstance.unshiftInArr([ 'randomStr' ], 3);
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it(`Attempted Array Unshift With Internal Use Key: ${ImmerableRecordInternalContextKeys.IMMERABLE_RECORD_HISTORY} Should Throw Exception, Using Built-in #unshiftInArr`, () => {
        const testFunc = function() {
            imrExtendingClassInstance.unshiftInArr([ ImmerableRecordInternalContextKeys.IMMERABLE_RECORD_HISTORY ], 'foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it(`Attempted Array Unshift With Internal Use Key: ${ImmerableRecordInternalContextKeys.IS_IMMERABLE_RECORD_INITIALIZED} Should Throw Exception, Using Built-in #unshiftInArr`, () => {
        const testFunc = function() {
            imrExtendingClassInstance.unshiftInArr([ ImmerableRecordInternalContextKeys.IS_IMMERABLE_RECORD_INITIALIZED ], 'foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Shift With Nonexistent Keys Arg Should Throw Exception, Using Built-in #shiftInArr', () => {
        const testFunc = function() {
            imrExtendingClassInstance.shiftInArr();
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Shift With Non-array Type Keys Arg Should Throw Exception, Using Built-in #shiftInArr', () => {
        const testFunc = function() {
            imrExtendingClassInstance.shiftInArr('foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Shift With Nonexistent Key Should Throw Exception, Using Built-in #shiftInArr', () => {
        const testFunc = function() {
            imrExtendingClassInstance.shiftInArr([ 'this key does not exist' ], 3);
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Shift When Property At Key Path Is Not Array Should Throw Exception, Using Built-in #shiftInArr', () => {
        const testFunc = function() {
            imrExtendingClassInstance.shiftInArr([ 'randomStr' ]);
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it(`Attempted Array Shift With Internal Use Key: ${ImmerableRecordInternalContextKeys.IMMERABLE_RECORD_HISTORY} Should Throw Exception, Using Built-in #shiftInArr`, () => {
        const testFunc = function() {
            imrExtendingClassInstance.shiftInArr([ImmerableRecordInternalContextKeys.IMMERABLE_RECORD_HISTORY]);
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it(`Attempted Array Shift With Internal Use Key: ${ImmerableRecordInternalContextKeys.IS_IMMERABLE_RECORD_INITIALIZED} Should Throw Exception, Using Built-in #shiftInArr`, () => {
        const testFunc = function() {
            imrExtendingClassInstance.shiftInArr([ImmerableRecordInternalContextKeys.IS_IMMERABLE_RECORD_INITIALIZED]);
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });
    });
  });

  describe('ImmerableRecord Usage With Object', () => {
    describe('Positive Test Cases', () => {
      let imrObjectInstance;

      try {
        beforeEach(() => {
          imrObjectInstance = new ImmerableRecord({ ...testFields });
        });
      } catch (err) {
        console.log(err);
      }

      it('Get Fields With Expected Values Using Direct, Dot-notation Accessors', () => {
        // Check first-level accessors...
        expect(imrObjectInstance.randomNum).to.equal(testFields.randomNum);
        expect(imrObjectInstance.randomStr).to.equal(testFields.randomStr);
        expect(imrObjectInstance.arr).to.be.an('array').that.deep.includes.ordered.members(testFields.arr);
        expect(imrObjectInstance.obj).to.be.an('object').that.deep.equals(testFields.obj);

        // Check second-level accessors...
        expect(imrObjectInstance.obj.nestedNum).to.equal(testFields.obj.nestedNum);
        expect(imrObjectInstance.obj.nestedStr).to.equal(testFields.obj.nestedStr);
        expect(imrObjectInstance.obj.nestedArr).to.be.an('array').that.deep.includes.ordered.members(testFields.obj.nestedArr);
        expect(imrObjectInstance.obj.nestedObj).to.be.an('object').that.deep.equals(testFields.obj.nestedObj);

        // Check third-level and fourth-level accessors...
        expect(imrObjectInstance.obj.nestedObj.nextNestedNum).to.equal(testFields.obj.nestedObj.nextNestedNum);
        expect(imrObjectInstance.obj.nestedObj.nextNestedStr).to.equal(testFields.obj.nestedObj.nextNestedStr);
        expect(imrObjectInstance.obj.nestedObj.nextNestedObj).to.be.an('object').that.deep.equals(testFields.obj.nestedObj.nextNestedObj);

        expect(imrObjectInstance.obj.nestedObj.nextNestedObj.nextNestedArr).to.be.an('array')
          .that.deep.includes.ordered.members(testFields.obj.nestedObj.nextNestedObj.nextNestedArr);
      });

      it('Get Fields With Expected Values Using Built-in #getIn', () => {
         // Cover condition, in which providing an empty keys array simply returns undefined...
        expect(imrObjectInstance.getIn([])).to.be.undefined;

        // Cover condition, in which providing a keys array with an empty key simply returns undefined...
        expect(imrObjectInstance.getIn([ '' ])).to.be.undefined;

        // Check first-level accessors...
        expect(imrObjectInstance.getIn([ 'randomNum' ])).to.equal(testFields.randomNum);
        expect(imrObjectInstance.getIn([ 'randomStr' ])).to.equal(testFields.randomStr);
        expect(imrObjectInstance.getIn([ 'arr' ])).to.be.an('array').that.deep.includes.ordered.members(testFields.arr);
        expect(imrObjectInstance.getIn([ 'obj' ])).to.be.an('object').that.deep.equals(testFields.obj);

        // Check second-level accessors...
        expect(imrObjectInstance.getIn([ 'obj', 'nestedNum' ])).to.equal(testFields.obj.nestedNum);
        expect(imrObjectInstance.getIn([ 'obj', 'nestedStr' ])).to.equal(testFields.obj.nestedStr);
        expect(imrObjectInstance.getIn([ 'obj', 'nestedArr' ])).to.be.an('array').that.deep.includes.ordered.members(testFields.obj.nestedArr);
        expect(imrObjectInstance.getIn([ 'obj', 'nestedObj' ])).to.be.an('object').that.deep.equals(testFields.obj.nestedObj);

        // Check third-level and fourth-level accessors...
        expect(imrObjectInstance.getIn([ 'obj','nestedObj','nextNestedNum' ])).to.equal(testFields.obj.nestedObj.nextNestedNum);
        expect(imrObjectInstance.getIn([ 'obj','nestedObj','nextNestedStr' ])).to.equal(testFields.obj.nestedObj.nextNestedStr);
        expect(imrObjectInstance.getIn([ 'obj','nestedObj','nextNestedObj' ])).to.be.an('object').that.deep.equals(testFields.obj.nestedObj.nextNestedObj);

        expect(imrObjectInstance.getIn([ 'obj','nestedObj','nextNestedObj', 'nextNestedArr' ]))
          .to.be.an('array').that.deep.includes.ordered.members(testFields.obj.nestedObj.nextNestedObj.nextNestedArr);
      });

      it('Set Fields With Expected Values Using Built-in #setIn', () => {
         // Cover condition, in which providing an empty keys array simply returns the unmodified draft...
        expect(imrObjectInstance.setIn([])).to.equal(imrObjectInstance);

        // Check first-level accessors...
        expect(imrObjectInstance.setIn([ 'randomNum' ], testFieldsChanged.randomNum).randomNum).to.equal(testFieldsChanged.randomNum);
        expect(imrObjectInstance.setIn([ 'randomStr' ], testFieldsChanged.randomStr).randomStr).to.equal(testFieldsChanged.randomStr);

        // Check second-level accessors...
        expect(imrObjectInstance.setIn([ 'obj', 'nestedNum' ], testFieldsChanged.obj.nestedNum).obj.nestedNum).to.equal(testFieldsChanged.obj.nestedNum);
        expect(imrObjectInstance.setIn([ 'obj', 'nestedStr' ], testFieldsChanged.obj.nestedStr).obj.nestedStr).to.equal(testFieldsChanged.obj.nestedStr);

        // Check third-level and fourth-level accessors...
        expect(imrObjectInstance.setIn([ 'obj','nestedObj','nextNestedNum' ], testFieldsChanged.obj.nestedObj.nextNestedNum).obj.nestedObj.nextNestedNum)
          .to.equal(testFieldsChanged.obj.nestedObj.nextNestedNum);

        expect(imrObjectInstance.setIn([ 'obj','nestedObj','nextNestedStr' ], testFieldsChanged.obj.nestedObj.nextNestedStr).obj.nestedObj.nextNestedStr)
          .to.equal(testFieldsChanged.obj.nestedObj.nextNestedStr);
      });

      it('Delete Fields With Expected Undefined Values Using Built-in #deleteIn', () => {
         // Cover condition, in which providing an empty keys array simply returns the unmodified draft...
        expect(imrObjectInstance.deleteIn([])).to.equal(imrObjectInstance);

        // Check first-level accessors...
        expect(imrObjectInstance.deleteIn([ 'randomNum' ]).randomNum).to.be.undefined;
        expect(imrObjectInstance.deleteIn([ 'randomStr' ]).randomStr).to.be.undefined;

        // Check second-level accessors...
        expect(imrObjectInstance.deleteIn([ 'obj', 'nestedNum' ]).obj.nestedNum).to.be.undefined;
        expect(imrObjectInstance.deleteIn([ 'obj', 'nestedStr' ]).obj.nestedStr).to.be.undefined;

        // Check third-level and fourth-level accessors...
        expect(imrObjectInstance.deleteIn([ 'obj','nestedObj','nextNestedNum' ]).obj.nestedObj.nextNestedNum).to.be.undefined;
        expect(imrObjectInstance.deleteIn([ 'obj','nestedObj','nextNestedStr' ]).obj.nestedObj.nextNestedStr).to.be.undefined;
      });

      it('Get From Array Fields With Expected Values Using Built-in #getInArrIdx', () => {
        // Cover condition, in which providing an empty keys array simply returns undefined...
        expect(imrObjectInstance.getInArrIdx([], 3)).to.be.undefined;

        // Cover condition, in which providing a keys array with an empty key simply returns undefined...
        expect(imrObjectInstance.getInArrIdx([ '' ], 3)).to.be.undefined;

        // Cover condition, in which providing an index greater than the array max index simply returns undefined...
        expect(imrObjectInstance.getInArrIdx([ 'obj', 'nestedArr' ], 200000)).to.be.undefined;

        // Cover condition, in which providing keys array with path including non-existent property simply returns undefined...
        expect(imrObjectInstance.getInArrIdx([ 'arr', 'nonexistent_property_key' ], 2)).to.be.undefined;

        // Cover condition, in which providing keys array with path leading to non-array property simply returns undefined...
        expect(imrObjectInstance.getInArrIdx([ 'obj', 'nestedStr' ], 3)).to.be.undefined;

        // Check first-level accessors...
        expect(imrObjectInstance.getInArrIdx([ 'arr' ], 1)).to.equal(testFields.arr[1]);

        // Check second-level accessors...
        expect(imrObjectInstance.getInArrIdx([ 'obj', 'nestedArr' ], 2)).to.equal(testFields.obj.nestedArr[2]);

        // Check third-level and fourth-level accessors...
         expect(imrObjectInstance.getInArrIdx([ 'obj','nestedObj','nextNestedObj', 'nextNestedArr' ], 2))
          .to.equal(testFields.obj.nestedObj.nextNestedObj.nextNestedArr[2]);
      });

      it('Modify Array Fields (add at index) With Expected Values Using Built-in #setInArrIdx', () => {
        // Cover condition, in which providing empty keys array simply returns the unmodified draft...
        expect(imrObjectInstance.setInArrIdx([], 34), testFieldsChanged.randomNum).to.equal(imrObjectInstance);

        // Cover condition, in which providing an index less that zero simply returns the unmodified draft...
        expect(imrObjectInstance.setInArrIdx([ 'arr' ], -1, testFieldsChanged.randomNum)).to.equal(imrObjectInstance);

        // Cover condition, in which inserting into an empty array simply adds the member, regardless of index provided...
        expect(imrObjectInstance.setInArrIdx([ 'obj', 'nestedEmptyArr' ], 34, testFieldsChanged.randomNum).obj.nestedEmptyArr[0])
          .to.equal(testFieldsChanged.randomNum);

        // Cover condition, in which inserting into an array with an index greater than the array max index simply adds the member,
        // regardless of index provided...
        expect(imrObjectInstance.setInArrIdx([ 'obj', 'nestedArr' ], 34000, testFieldsChanged.randomNum).obj.nestedArr[
            // Don't use (#length - 1) here, as this length is, appraently, derived from the pre-update array...
            // We just need to check the last member, to verify the new value was added, to the end of the array...
            (imrObjectInstance.obj.nestedArr.length)
          ]).to.equal(testFieldsChanged.randomNum);

        // Cover condition, in which providing empty keys array simply returns the unmodified draft...
        expect(imrObjectInstance.setInArrIdx([], 34, testFieldsChanged.randomNum)).to.equal(imrObjectInstance);

        // Check first-level accessors...
        expect(imrObjectInstance.setInArrIdx([ 'arr' ], 2, testFieldsChanged.arr[2]).arr[2]).to.equal(testFieldsChanged.arr[2]);

        // Check second-level accessors...
        expect(imrObjectInstance.setInArrIdx([ 'obj', 'nestedArr' ], 1, testFieldsChanged.obj.nestedArr[1]).obj.nestedArr[1])
          .to.equal(testFieldsChanged.obj.nestedArr[1]);

        // Check third-level and fourth-level accessors...
        expect(imrObjectInstance.setInArrIdx(
            [ 'obj','nestedObj','nextNestedObj', 'nextNestedArr' ],
            3,
            testFieldsChanged.obj.nestedObj.nextNestedObj.nextNestedArr[3]
          ).obj.nestedObj.nextNestedObj.nextNestedArr[3])
          .to.equal(testFieldsChanged.obj.nestedObj.nextNestedObj.nextNestedArr[3]);
      });

      it('Modify Array Fields (delete at index) With Expected Undefined Values Using Built-in #deleteInArrIdx', () => {
        // Cover condition, in which providing empty keys array simply returns the unmodified draft...
        expect(imrObjectInstance.deleteInArrIdx([], 34)).to.equal(imrObjectInstance);

        // Cover condition, in which providing an index less that zero simply returns the unmodified draft...
        expect(imrObjectInstance.deleteInArrIdx([ 'arr' ], -1, testFieldsChanged.randomNum)).to.equal(imrObjectInstance);

        // Cover condition, in which providing an index greater than the target array max index simply returns the unmodified draft...
        expect(imrObjectInstance.deleteInArrIdx([ 'arr' ], 34000)).to.equal(imrObjectInstance);

        // Check first-level accessors...
        expect(imrObjectInstance.deleteInArrIdx([ 'arr' ], 2).arr[2]).to.equal(testFields.arr[3]);

        // Check second-level accessors...
        expect(imrObjectInstance.deleteInArrIdx([ 'obj', 'nestedArr' ], 1).obj.nestedArr[1])
          .to.equal(testFields.obj.nestedArr[2]);

        // Check third-level and fourth-level accessors...
        expect(imrObjectInstance.deleteInArrIdx(
            [ 'obj','nestedObj','nextNestedObj', 'nextNestedArr' ],
            3
          ).obj.nestedObj.nextNestedObj.nextNestedArr[3])
          .to.equal(testFields.obj.nestedObj.nextNestedObj.nextNestedArr[4]);
      });

      it('Modify Array Fields (add as last) With Expected Values Using Built-in #pushInArr', () => {
        // Cover condition, in which providing empty keys array simply returns the unmodified draft...
        expect(imrObjectInstance.pushInArr([], 34)).to.equal(imrObjectInstance);

        // Check first-level accessors...
        let testCheckData = (Date.now() + Math.floor(Math.random()));
        let testCheckLength = imrObjectInstance.arr.length;
        let testInstance = imrObjectInstance.pushInArr([ 'arr' ], testCheckData);

        expect(testInstance.arr).to.have.lengthOf(
            (testCheckLength + 1)
          );

        expect(testInstance.arr[
          (testInstance.arr.length - 1)
        ]).to.equal(testCheckData);

        // Check second-level accessors...
        testCheckData = (Date.now() + Math.floor(Math.random()));
        testCheckLength = imrObjectInstance.obj.nestedArr.length;
        testInstance = imrObjectInstance.pushInArr(
            [ 'obj','nestedArr' ],
            testCheckData
          );

        expect(testInstance.obj.nestedArr).to.have.lengthOf(
            (testCheckLength + 1)
          );

        expect(testInstance.obj.nestedArr[
          (testInstance.obj.nestedArr.length - 1)
        ]).to.equal(testCheckData);

        // Check third-level and fourth-level accessors...
        testCheckData = (Date.now() + Math.floor(Math.random()));
        testCheckLength = imrObjectInstance.obj.nestedObj.nextNestedObj.nextNestedArr.length;
        testInstance = imrObjectInstance.pushInArr(
            [ 'obj','nestedObj','nextNestedObj', 'nextNestedArr' ],
            testCheckData
          );

        expect(testInstance.obj.nestedObj.nextNestedObj.nextNestedArr).to.have.lengthOf(
            (testCheckLength + 1)
          );

        expect(testInstance.obj.nestedObj.nextNestedObj.nextNestedArr[
          (testInstance.obj.nestedObj.nextNestedObj.nextNestedArr.length - 1)
        ]).to.equal(testCheckData);
      });

      it('Modify Array Fields (remove last) With Expected Values Using Built-in #popInArr', () => {
        // Cover condition, in which providing empty keys array simply returns the unmodified draft...
        expect(imrObjectInstance.popInArr([])).to.equal(imrObjectInstance);

        // Check first-level accessors...
        let testCheckData = imrObjectInstance.arr[
            (imrObjectInstance.arr.length - 1)
          ];

        let testCheckLength = imrObjectInstance.arr.length;
        let testInstance = imrObjectInstance.popInArr([ 'arr' ]);

        expect(testInstance.arr[
            testCheckLength
          ]).to.be.undefined;

        expect(testInstance.arr).to.have.lengthOf(
            (testCheckLength - 1)
          );

        expect(testInstance.arr[
            (imrObjectInstance.arr.length - 1)
          ]).to.not.equal(testCheckData);

        // Check second-level accessors...
        testCheckData = imrObjectInstance.arr[
            (imrObjectInstance.obj.nestedArr.length - 1)
          ];

        testCheckLength = imrObjectInstance.obj.nestedArr.length;
        testInstance = imrObjectInstance.popInArr([ 'obj', 'nestedArr' ]);

        expect(testInstance.obj.nestedArr[
            testCheckLength
          ]).to.be.undefined;

        expect(testInstance.obj.nestedArr).to.have.lengthOf(
            (testCheckLength - 1)
          );

        expect(testInstance.obj.nestedArr[
          (imrObjectInstance.obj.nestedArr.length - 1)
        ]).to.be.undefined;

        // Check third-level and fourth-level accessors...
        testCheckData = imrObjectInstance.obj.nestedObj.nextNestedObj.nextNestedArr[
            (imrObjectInstance.obj.nestedObj.nextNestedObj.nextNestedArr.length - 1)
          ];
        
        testCheckLength = imrObjectInstance.obj.nestedObj.nextNestedObj.nextNestedArr.length;
        testInstance = imrObjectInstance.popInArr([ 'obj','nestedObj','nextNestedObj', 'nextNestedArr' ]);

        expect(testInstance.obj.nestedObj.nextNestedObj.nextNestedArr[
            testCheckLength
          ]).to.be.undefined;

        expect(testInstance.obj.nestedObj.nextNestedObj.nextNestedArr).to.have.lengthOf(
            (testCheckLength - 1)
          );

        expect(testInstance.obj.nestedObj.nextNestedObj.nextNestedArr[
            (imrObjectInstance.obj.nestedObj.nextNestedObj.nextNestedArr.length - 1)
          ]).to.not.equal(testCheckData);
      });

      it('Modify Array Fields (add as first) With Expected Values Using Built-in #unshiftInArr', () => {
        // Cover condition, in which providing empty keys array simply returns the unmodified draft...
        expect(imrObjectInstance.unshiftInArr([], 34)).to.equal(imrObjectInstance);

        // Check first-level accessors...
        let testCheckData = (Date.now() + Math.floor(Math.random()));
        let testCheckLength = imrObjectInstance.arr.length;
        let testInstance = imrObjectInstance.unshiftInArr([ 'arr' ], testCheckData);

        expect(testInstance.arr).to.have.lengthOf(
            (testCheckLength + 1)
          );

        expect(testInstance.arr[0]).to.equal(testCheckData);

        // Check second-level accessors...
        testCheckData = (Date.now() + Math.floor(Math.random()));
        testCheckLength = imrObjectInstance.obj.nestedArr.length;
        testInstance = imrObjectInstance.unshiftInArr(
            [ 'obj','nestedArr' ],
            testCheckData
          );

        expect(testInstance.obj.nestedArr).to.have.lengthOf(
            (testCheckLength + 1)
          );

        expect(testInstance.obj.nestedArr[0]).to.equal(testCheckData);

        // Check third-level and fourth-level accessors...
        testCheckData = (Date.now() + Math.floor(Math.random()));
        testCheckLength = imrObjectInstance.obj.nestedObj.nextNestedObj.nextNestedArr.length;
        testInstance = imrObjectInstance.unshiftInArr(
            [ 'obj','nestedObj','nextNestedObj', 'nextNestedArr' ],
            testCheckData
          );

        expect(testInstance.obj.nestedObj.nextNestedObj.nextNestedArr).to.have.lengthOf(
            (testCheckLength + 1)
          );

        expect(testInstance.obj.nestedObj.nextNestedObj.nextNestedArr[0]).to.equal(testCheckData);
      });

      it('Modify Array Fields (remove first) With Expected Values Using Built-in #shiftInArr', () => {
        // Cover condition, in which providing empty keys array simply returns the unmodified draft...
        expect(imrObjectInstance.shiftInArr([], 34)).to.equal(imrObjectInstance);

        // Check first-level accessors...
        let testCheckData = imrObjectInstance.arr[
            (imrObjectInstance.arr.length - 1)
          ];

        let testCheckLength = imrObjectInstance.arr.length;
        let testInstance = imrObjectInstance.shiftInArr([ 'arr' ]);

        expect(testInstance.arr[
            testCheckLength
          ]).to.be.undefined;

        expect(testInstance.arr).to.have.lengthOf(
            (testCheckLength - 1)
          );

        expect(testInstance.arr[0]).to.not.equal(testCheckData);

        // Check second-level accessors...
        testCheckData = imrObjectInstance.arr[0];
        testCheckLength = imrObjectInstance.obj.nestedArr.length;
        testInstance = imrObjectInstance.shiftInArr([ 'obj', 'nestedArr' ]);

        expect(testInstance.obj.nestedArr[
            testCheckLength
          ]).to.be.undefined;

        expect(testInstance.obj.nestedArr).to.have.lengthOf(
            (testCheckLength - 1)
          );

        expect(testInstance.obj.nestedArr[0]).to.not.equal(testCheckData);

        // Check third-level and fourth-level accessors...
        testCheckData = imrObjectInstance.obj.nestedObj.nextNestedObj.nextNestedArr[0];
        testCheckLength = imrObjectInstance.obj.nestedObj.nextNestedObj.nextNestedArr.length;
        testInstance = imrObjectInstance.shiftInArr([ 'obj','nestedObj','nextNestedObj', 'nextNestedArr' ]);

        expect(testInstance.obj.nestedObj.nextNestedObj.nextNestedArr[
            testCheckLength
          ]).to.be.undefined;

        expect(testInstance.obj.nestedObj.nextNestedObj.nextNestedArr).to.have.lengthOf(
            (testCheckLength - 1)
          );

        expect(testInstance.obj.nestedObj.nextNestedObj.nextNestedArr[0])
          .to.not.equal(testCheckData);
      });
    });

    describe('History API Test Cases', () => {
      it('When History Limit Is Set On Config, Each Update Adds A Draft To History', () => {
        let imrObjectInstance;
  
        try {
          imrObjectInstance = new ImmerableRecord(
              { ...testFields },
              { historyLimit: 5 }
            );
        } catch (err) {
          console.log(err);
        }

        // Making two updates, here - there will be three drafts, including the original...
        imrObjectInstance.setIn([ 'randomNum' ], testFieldsChanged.randomNum)
          .setIn([ 'randomStr' ], testFieldsChanged.randomStr);

        let draftHistory = imrObjectInstance.immerableRecordHistory;

        expect(draftHistory).to.be.instanceOf(Object);
        expect(Object.keys(draftHistory)).to.have.lengthOf(3);
      });

      it('When History Limit Is Set On Config, And Number Of Drafts In History Meets Limit, History Should Reset', () => {
        let imrObjectInstance;
  
        try {
          imrObjectInstance = new ImmerableRecord(
              { ...testFields },
              { historyLimit: 5 }
            );
        } catch (err) {
          console.log(err);
        }

        // Making two updates, here - there will be three drafts, including the original...
        imrObjectInstance.setIn([ 'randomNum' ], testFieldsChanged.randomNum)
          .setIn([ 'randomStr' ], testFieldsChanged.randomStr)
          .shiftInArr([ 'arr' ]);

        let draftHistory = imrObjectInstance.immerableRecordHistory;

        expect(draftHistory).to.be.instanceOf(Object);
        expect(Object.keys(draftHistory)).to.have.lengthOf(3);

        // historyLimit is set to 5, at which point, history is cleared,
        // and started anew. Four more updates hits the limit, after two,
        // then adds two to the next history...
        imrObjectInstance.setIn([ 'randomNum' ], testFieldsChanged.randomNum)
          .setIn([ 'randomStr' ], testFieldsChanged.randomStr)
          .shiftInArr([ 'arr' ])
          .deleteIn([ 'obj', 'nestedNum' ])
          .deleteIn([ 'obj', 'nestedStr' ]);

        draftHistory = imrObjectInstance.immerableRecordHistory;

        expect(draftHistory).to.be.instanceOf(Object);
        expect(Object.keys(draftHistory)).to.have.lengthOf(2);
      });

      it('When History Limit Is Not Set On Config, No History Is Kept Or Available', () => {
        let imrObjectInstance;
  
        try {
          imrObjectInstance = new ImmerableRecord({ ...testFields });
        } catch (err) {
          console.log(err);
        }

        imrObjectInstance.setIn([ 'randomNum' ], testFieldsChanged.randomNum)
          .setIn([ 'randomStr' ], testFieldsChanged.randomStr);

        let draftHistory = imrObjectInstance.immerableRecordHistory;

        expect(draftHistory).to.be.undefined;
      });
    });

    describe('Negative Test Cases', () => {
      describe('Object Instantiation', () => {
        it('Instantiation With Incorrect Type contextObj Arg Should Throw Exception', () => {
          const testFunc = function() {
              let imrObjectInstance = new ImmerableRecord(
                  'this string is not allowed'
                );
            };
  
          expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
        });

        it('Instantiation With Incorrect Type (Array) contextObj Arg Should Throw Exception', () => {
          const testFunc = function() {
              let imrObjectInstance = new ImmerableRecord(
                  [ 'this', 'array', 'is', 'not', 'allowed' ]
                );
            };
  
          expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
        });

        it('Instantiation With null contextObj Arg Should Return Object Without Context', () => {
          let imrObjectInstance = new ImmerableRecord();

          expect(imrObjectInstance.randomNum).to.be.undefined;
        });

        it('Instantiation With null config Arg Should Return New Instance', () => {
          let imrObjectInstance = new ImmerableRecord(testFields, null);

          expect(imrObjectInstance.randomNum).to.equal(testFields.randomNum);
        });

        it('Instantiation With Incorrect Type config Arg Should Throw Exception', () => {
          const testFunc = function() {
              let imrObjectInstance = new ImmerableRecord(
                  { foo: 'bar' },
                  'this string is not allowed'
                );
            };

          expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
        });

        it('Instantiation With Incorrect Type (Array) config Arg Should Throw Exception', () => {
          const testFunc = function() {
              let imrObjectInstance = new ImmerableRecord(
                  { foo: 'bar' },
                  [ 'this', 'array', 'is', 'not', 'allowed' ]
                );
            };
  
          expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
        });

        it('Instantiation With Incorrect Type config:historyLimit Arg Should Throw Exception', () => {
          const testFunc = function() {
              let imrObjectInstance = new ImmerableRecord(
                  { foo: 'bar' },
                  { historyLimit: 'ten is not a Number' }
                );
            };
  
          expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
        });
      });

      let imrObjectInstance;

      try {
        beforeEach(() => {
          imrObjectInstance = new ImmerableRecord({ ...testFields });
        });
      } catch (err) {
        console.log(err);
      }

      it('Attempt To Add Property After Instantiation On Frozen Extending Instance Should Throw Exception', () => {
        imrObjectInstance = new ImmerableRecordExtendingClass({ shouldFreeze: true });

        const testFunc = function() {
            imrObjectInstance.fooBar = 'fooBar';
          };

        expect(testFunc).to.throw();
      });

      it('Attempt To Add Property After Instantiation On Sealed Extending Instance Should Throw Exception', () => {
        imrObjectInstance = new ImmerableRecordExtendingClass({ shouldSeal: true });

        const testFunc = function() {
            imrObjectInstance.fooBar = 'fooBar';
          };

        expect(testFunc).to.throw();
      });

      it('Attempted Get With Nonexistent Keys Arg Should Throw Exception, Using Built-in #getIn', () => {
        const testFunc = function() {
            imrObjectInstance.getIn();
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Get With Non-array Type Keys Arg Should Throw Exception, Using Built-in #getIn', () => {
        const testFunc = function() {
            imrObjectInstance.getIn('foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Set With Nonexistent Keys Arg Should Throw Exception, Using Built-in #setIn', () => {
        const testFunc = function() {
            imrObjectInstance.setIn();
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Set With Non-array Type Keys Arg Should Throw Exception, Using Built-in #setIn', () => {
        const testFunc = function() {
            imrObjectInstance.setIn('foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Set With Keys Arg COntaingin Empty Key Should Throw Exception, Using Built-in #setIn', () => {
        const testFunc = function() {
            expect(imrObjectInstance.setIn([ '' ]));
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Set With Non-Matching Key Should Throw Exception, Using Built-in #setIn', () => {
        const testFunc = function() {
            imrObjectInstance.setIn([ 'this key does not exist'], 'foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it(`Attempted Set With Internal Use Key: ${ImmerableRecordInternalContextKeys.IMMERABLE_RECORD_HISTORY} Should Throw Exception, Using Built-in #setIn`, () => {
        const testFunc = function() {
            imrObjectInstance.setIn([ImmerableRecordInternalContextKeys.IMMERABLE_RECORD_HISTORY], 'foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it(`Attempted Set With Internal Use Key: ${ImmerableRecordInternalContextKeys.IS_IMMERABLE_RECORD_INITIALIZED} Should Throw Exception, Using Built-in #setIn`, () => {
        const testFunc = function() {
            imrObjectInstance.setIn([ImmerableRecordInternalContextKeys.IS_IMMERABLE_RECORD_INITIALIZED], 'foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Delete With Nonexistent Keys Arg Should Throw Exception, Using Built-in #deleteIn', () => {
        const testFunc = function() {
            imrObjectInstance.deleteIn();
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Delete With Non-array Type Keys Arg Should Throw Exception, Using Built-in #deleteIn', () => {
        const testFunc = function() {
            imrObjectInstance.deleteIn('foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Delete With Non-Matching Key Should Throw Exception, Using Built-in #deleteIn', () => {
        const testFunc = function() {
            imrObjectInstance.deleteIn([ 'this key does not exist' ]);
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it(`Attempted Delete With Internal Use Key: ${ImmerableRecordInternalContextKeys.IMMERABLE_RECORD_HISTORY} Should Throw Exception, Using Built-in #deleteIn`, () => {
        const testFunc = function() {
            imrObjectInstance.deleteIn([ ImmerableRecordInternalContextKeys.IMMERABLE_RECORD_HISTORY ], 'foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it(`Attempted Delete With Internal Use Key: ${ImmerableRecordInternalContextKeys.IS_IMMERABLE_RECORD_INITIALIZED} Should Throw Exception, Using Built-in #deleteIn`, () => {
        const testFunc = function() {
            imrObjectInstance.deleteIn([ ImmerableRecordInternalContextKeys.IS_IMMERABLE_RECORD_INITIALIZED ], 'foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Member Retrieval With Nonexistent Keys Arg Should Throw Exception, Using Built-in #getInArrIdx', () => {
        const testFunc = function() {
            imrObjectInstance.getInArrIdx();
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Member Retrieval With Non-array Type Keys Arg Should Throw Exception, Using Built-in #getInArrIdx', () => {
        const testFunc = function() {
            imrObjectInstance.getInArrIdx('foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Member Set With Nonexistent Keys Arg Should Throw Exception, Using Built-in #setInArrIdx', () => {
        const testFunc = function() {
            imrObjectInstance.setInArrIdx();
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Member Set With Non-array Type Keys Arg Should Throw Exception, Using Built-in #setInArrIdx', () => {
        const testFunc = function() {
            imrObjectInstance.setInArrIdx('foobar', 3, 'foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Member Set With Nonexistent Key Should Throw Exception, Using Built-in #setInArrIdx', () => {
        const testFunc = function() {
            imrObjectInstance.setInArrIdx([ 'this key does not exist' ], 3, 'foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Member Set To Target Which Is Not An Array Should Throw Exception, Using Built-in #setInArrIdx', () => {
        const testFunc = function() {
            imrObjectInstance.setInArrIdx([ 'obj', 'nestedStr' ], 3, 'foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it(`Attempted Array Member Set With Internal Use Key: ${ImmerableRecordInternalContextKeys.IMMERABLE_RECORD_HISTORY} Should Throw Exception, Using Built-in #setInArrIdx`, () => {
        const testFunc = function() {
            imrObjectInstance.setInArrIdx([ ImmerableRecordInternalContextKeys.IMMERABLE_RECORD_HISTORY ], 2, 'foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it(`Attempted Array Member Set With Internal Use Key: ${ImmerableRecordInternalContextKeys.IS_IMMERABLE_RECORD_INITIALIZED} Should Throw Exception, Using Built-in #setInArrIdx`, () => {
        const testFunc = function() {
            imrObjectInstance.setInArrIdx([ ImmerableRecordInternalContextKeys.IS_IMMERABLE_RECORD_INITIALIZED ], 2, 'foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Member Delete With Nonexistent Keys Arg Should Throw Exception, Using Built-in #deleteInArrIdx', () => {
        const testFunc = function() {
            imrObjectInstance.deleteInArrIdx();
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Member Delete With Non-array Type Keys Arg Should Throw Exception, Using Built-in #deleteInArrIdx', () => {
        const testFunc = function() {
            imrObjectInstance.deleteInArrIdx('foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Member Delete With Nonexistent Key Should Throw Exception, Using Built-in #deleteInArrIdx', () => {
        const testFunc = function() {
            imrObjectInstance.deleteInArrIdx([ 'this key does not exist' ], 3);
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it(`Attempted Array Member Delete With Internal Use Key: ${ImmerableRecordInternalContextKeys.IMMERABLE_RECORD_HISTORY} Should Throw Exception, Using Built-in #deleteInArrIdx`, () => {
        const testFunc = function() {
            imrObjectInstance.deleteInArrIdx([ ImmerableRecordInternalContextKeys.IMMERABLE_RECORD_HISTORY ], 2);
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it(`Attempted Array Member Delete With Internal Use Key: ${ImmerableRecordInternalContextKeys.IS_IMMERABLE_RECORD_INITIALIZED} Should Throw Exception, Using Built-in #deleteInArrIdx`, () => {
        const testFunc = function() {
            imrObjectInstance.deleteInArrIdx([ ImmerableRecordInternalContextKeys.IS_IMMERABLE_RECORD_INITIALIZED ], 2);
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Push With Nonexistent Keys Arg Should Throw Exception, Using Built-in #pushInArr', () => {
        const testFunc = function() {
            imrObjectInstance.pushInArr();
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Push With Non-array Type Keys Arg Should Throw Exception, Using Built-in #pushInArr', () => {
        const testFunc = function() {
            imrObjectInstance.pushInArr('foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Push With Nonexistent Key Should Throw Exception, Using Built-in #pushInArr', () => {
        const testFunc = function() {
            imrObjectInstance.pushInArr([ 'this key does not exist' ], 3);
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Push When Property At Key Path Is Not Array Should Throw Exception, Using Built-in #pushInArr', () => {
        const testFunc = function() {
            imrObjectInstance.pushInArr([ 'randomStr' ], 3);
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it(`Attempted Array Push With Internal Use Key: ${ImmerableRecordInternalContextKeys.IMMERABLE_RECORD_HISTORY} Should Throw Exception, Using Built-in #pushInArr`, () => {
        const testFunc = function() {
            imrObjectInstance.pushInArr([ ImmerableRecordInternalContextKeys.IMMERABLE_RECORD_HISTORY ], 'foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it(`Attempted Array Push With Internal Use Key: ${ImmerableRecordInternalContextKeys.IS_IMMERABLE_RECORD_INITIALIZED} Should Throw Exception, Using Built-in #pushInArr`, () => {
        const testFunc = function() {
            imrObjectInstance.pushInArr([ ImmerableRecordInternalContextKeys.IS_IMMERABLE_RECORD_INITIALIZED ], 'foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Pop With Nonexistent Keys Arg Should Throw Exception, Using Built-in #popInArr', () => {
        const testFunc = function() {
            imrObjectInstance.popInArr();
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Pop With Non-array Type Keys Arg Should Throw Exception, Using Built-in #popInArr', () => {
        const testFunc = function() {
            imrObjectInstance.popInArr('foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Pop With Nonexistent Key Should Throw Exception, Using Built-in #popInArr', () => {
        const testFunc = function() {
            imrObjectInstance.popInArr([ 'this key does not exist' ], 3);
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Pop When Property At Key Path Is Not Array Should Throw Exception, Using Built-in #popInArr', () => {
        const testFunc = function() {
            imrObjectInstance.popInArr([ 'randomStr' ]);
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it(`Attempted Array Pop With Internal Use Key: ${ImmerableRecordInternalContextKeys.IMMERABLE_RECORD_HISTORY} Should Throw Exception, Using Built-in #popInArr`, () => {
        const testFunc = function() {
            imrObjectInstance.popInArr([ ImmerableRecordInternalContextKeys.IMMERABLE_RECORD_HISTORY ]);
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it(`Attempted Array Pop With Internal Use Key: ${ImmerableRecordInternalContextKeys.IS_IMMERABLE_RECORD_INITIALIZED} Should Throw Exception, Using Built-in #popInArr`, () => {
        const testFunc = function() {
            imrObjectInstance.popInArr([ ImmerableRecordInternalContextKeys.IS_IMMERABLE_RECORD_INITIALIZED ]);
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Unshift With Nonexistent Keys Arg Should Throw Exception, Using Built-in #unshiftInArr', () => {
        const testFunc = function() {
            imrObjectInstance.unshiftInArr();
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Unshift With Non-array Type Keys Arg Should Throw Exception, Using Built-in #unshiftInArr', () => {
        const testFunc = function() {
            imrObjectInstance.unshiftInArr('foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Unshift With Nonexistent Key Should Throw Exception, Using Built-in #unshiftInArr', () => {
        const testFunc = function() {
            imrObjectInstance.unshiftInArr([ 'this key does not exist' ], 3);
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Unshift When Property At Key Path Is Not Array Should Throw Exception, Using Built-in #unshiftInArr', () => {
        const testFunc = function() {
            imrObjectInstance.unshiftInArr([ 'randomStr' ], 3);
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it(`Attempted Array Unshift With Internal Use Key: ${ImmerableRecordInternalContextKeys.IMMERABLE_RECORD_HISTORY} Should Throw Exception, Using Built-in #unshiftInArr`, () => {
        const testFunc = function() {
            imrObjectInstance.unshiftInArr([ ImmerableRecordInternalContextKeys.IMMERABLE_RECORD_HISTORY ], 'foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it(`Attempted Array Unshift With Internal Use Key: ${ImmerableRecordInternalContextKeys.IS_IMMERABLE_RECORD_INITIALIZED} Should Throw Exception, Using Built-in #unshiftInArr`, () => {
        const testFunc = function() {
            imrObjectInstance.unshiftInArr([ ImmerableRecordInternalContextKeys.IS_IMMERABLE_RECORD_INITIALIZED ], 'foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Shift With Nonexistent Keys Arg Should Throw Exception, Using Built-in #shiftInArr', () => {
        const testFunc = function() {
            imrObjectInstance.shiftInArr();
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Shift With Non-array Type Keys Arg Should Throw Exception, Using Built-in #shiftInArr', () => {
        const testFunc = function() {
            imrObjectInstance.shiftInArr('foobar');
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Shift With Nonexistent Key Should Throw Exception, Using Built-in #shiftInArr', () => {
        const testFunc = function() {
            imrObjectInstance.shiftInArr([ 'this key does not exist' ], 3);
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it('Attempted Array Shift When Property At Key Path Is Not Array Should Throw Exception, Using Built-in #shiftInArr', () => {
        const testFunc = function() {
            imrObjectInstance.shiftInArr([ 'randomStr' ]);
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it(`Attempted Array Shift With Internal Use Key: ${ImmerableRecordInternalContextKeys.IMMERABLE_RECORD_HISTORY} Should Throw Exception, Using Built-in #shiftInArr`, () => {
        const testFunc = function() {
            imrObjectInstance.shiftInArr([ ImmerableRecordInternalContextKeys.IMMERABLE_RECORD_HISTORY ]);
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });

      it(`Attempted Array Shift With Internal Use Key: ${ImmerableRecordInternalContextKeys.IS_IMMERABLE_RECORD_INITIALIZED} Should Throw Exception, Using Built-in #shiftInArr`, () => {
        const testFunc = function() {
            imrObjectInstance.shiftInArr([ ImmerableRecordInternalContextKeys.IS_IMMERABLE_RECORD_INITIALIZED ]);
          };

        expect(testFunc).to.throw().to.be.instanceOf(ImmerableRecordException);
      });
    });
  });
});
