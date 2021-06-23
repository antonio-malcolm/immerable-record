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

const testFields = {
  randomNum: Date.now(),
  randomStr: 'GOOD MORNING, WORLD!',
  arr: [ 20, 30, 40, 97 ],
  obj: {
    nestedNum: 32,
    nestedStr: 'penguins!',
    nestedEmptyArr: [],
    nestedArr: [
      1, 2, 3, 'greetings', 4, 'salutations'
    ],
    nestedObj: {
      nextNestedNum: 76,
      nextNestedStr: 'the penguins are holding a congress!',
      nextNestedObj: {
        nextNestedArr: [
          'some', 'thing', 'to', 'populate', 'the', 'array', 42
        ]
      }
    }
  }
};

const testFieldsChanged = {
  ...testFields,
  randomNum: (Date.now() + 2500),
  randomStr: 'GOOD EVENING, WORLD!',
  arr: [ 6, 'sixteen', 10, 'ten' ]
};

testFieldsChanged.obj.nestedNum = 5346;
testFieldsChanged.obj.nestedArr = [
    6, 56, 7, 'penguins', 9, 'salutations'
  ];

testFieldsChanged.obj.nestedObj.nestedStr = 'the penguins held a congress!';
testFieldsChanged.obj.nestedObj.nextNestedObj.nextNestedArr = [
    'the', 'penguins', 'held', 'a', 'congress!'
  ];

Object.freeze(testFields);
Object.freeze(testFieldsChanged);

export default Object.freeze({
  testFields,
  testFieldsChanged
});
