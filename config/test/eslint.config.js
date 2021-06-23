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

'use strict';

const colors = require('colors');

const Paths = require('../../constant/Paths');
const CurrentVarValues = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/CurrentVarValues`);

const CommonUtils = require(`${Paths.UTIL_APP_ROOT_ABSOLUTE}/CommonUtils`);

let reportDir = `${Paths.TEST_OUTPUT_ABSOLUTE}/${Paths.REPORT_RELATIVE}`;

if (CommonUtils.isNonEmptyString(CurrentVarValues.WORKSPACE, true)) {
  reportDir = `${reportDir}/${CurrentVarValues.WORKSPACE}`;
}

console.log(
  colors.blue.bold.underline(
    'Hallo! We are linting the source code, for:'
  )
);

if (CommonUtils.isNonEmptyString(CurrentVarValues.WORKSPACE)) {
  console.log(
    colors.blue.bold(
      `Workspace: ${CurrentVarValues.WORKSPACE}`
    )
  );
}

reportDir = `${reportDir}/eslint`;

console.log(
  colors.blue.bold(
    'Reports will be written to: '
  )
);

console.log(
  colors.green(reportDir)
);

module.exports = {
  env: {
    browser: true,
    es6: true,
    mocha: true
  },
  extends: [
    'plugin:react/recommended',
    'airbnb'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    babelOptions: {
      configFile: `${Paths.CONFIG_APP_ROOT_ABSOLUTE}/babel/babel.config.js`
    },
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: [
    'react'
  ],
  rules: {
    'array-bracket-spacing': [ 'warn' ],
    'arrow-parens': [ 'warn' ],
    'brace-style': [ 'warn' ],
    'comma-dangle': [ 'warn' ],
    'consistent-return': [ 'warn' ],
    'eol-last': [ 'warn' ],

    'func-names': [
        'warn',
        'always',
        { generators: 'as-needed' }
      ],

    'global-require': [ 'warn' ],
    'import/no-extraneous-dependencies': [ 'warn' ],
    'import/no-unresolved': [
        2,
        { ignore: [ '^react$' ] }
      ],

    // https://github.com/benmosher/eslint-plugin-import/blob/v2.20.0/docs/rules/order.md
    'import/order': [ 'warn' ],

    'indent': [
        'warn',
        2,
        { SwitchCase: 1 }
      ],

    'jsx-a11y/anchor-is-valid': [ 'warn' ],
    'keyword-spacing': [ 'warn' ],
    'max-len': [ 'warn' ],
    'no-param-reassign': [ 0 ],
    'no-mixed-spaces-and-tabs': [ 'warn' ],
    'no-multi-spaces': [ 'warn' ],
    'no-multiple-empty-lines': [ 'warn' ],
    'no-restricted-syntax': [ 0 ],
    'no-tabs': [ 'warn' ],
    'no-trailing-spaces': [ 'warn' ],
    'no-unneeded-ternary': [ 'warn' ],
    'no-underscore-dangle': [ 'warn' ],
    'no-unused-expressions': [ 0 ],
    'no-unused-vars': [ 'warn' ],
    'no-useless-constructor': [ 'warn' ],

    'object-curly-newline': [
        'warn',
        { consistent: true, minProperties: 3 }
      ],

    'object-curly-spacing': [ 'warn' ],
    'object-shorthand': [ 'warn', 'always' ],
    'operator-linebreak': [ 'warn' ],
    'padded-blocks': [ 'warn' ],
    'prefer-arrow-callback': [ 'warn' ],
    'prefer-const': [ 'warn' ],

    'prefer-destructuring': [
        'warn', {
          array: true,
          object: true
        },
        {
          enforceForRenamedProperties: false
        }
      ],

    'prefer-template': [ 'warn' ],
    'quotes': [ 'warn' ],
    'quote-props': [ 'warn', 'consistent' ],
    'rest-spread-spacing': [ 'warn', 'never' ],
    'semi': [ 'warn' ],

    'spaced-comment': [ 'warn' ],

    /**
     * React rules...
     */
    'react/destructuring-assignment': [
        'warn',
        'always',
        { ignoreClassFields: true }
      ],

    'react/forbid-prop-types': [ 0 ],
    'react/jsx-closing-bracket-location': [ 'warn' ],
    'react/jsx-curly-newline': [ 'warn' ],
    'react/jsx-curly-spacing': [ 'warn', 'always' ],
    'react/jsx-filename-extension': [ 0 ],
    'react/jsx-fragments': [ 0 ],
    'react/jsx-indent': [ 'warn', 2 ],
    'react/jsx-equals-spacing': [ 'warn' ],
    'react/jsx-one-expression-per-line': [ 'warn' ],
    'react/jsx-props-no-spreading': [ 0 ],
    'react/jsx-tag-spacing': [ 'warn' ],
    'react/jsx-wrap-multilines': [ 'warn' ],
    'react/no-access-state-in-setstate': [ 'warn' ],
    'react/no-array-index-key': [ 'warn' ],
    'react/no-unused-state': [ 'warn' ],
    'react/prop-types': [ 'warn' ],
    'react/prefer-stateless-function': [ 'warn' ],
    'react/require-default-props': [ 'warn' ],
    'react/sort-comp': [ 0 ],
    'react/state-in-constructor': [ 'warn', 'never' ]
  },

  settings: {
    color: true,
    'import/resolver': {
      node: {
        paths: [ 'src', 'workspaces/**/src' ],
        extensions: [ '.js', '.jsx', '.ts', '.tsx' ]
      }
    },
    'output-file': `${reportDir}/eslint-report.txt`
  }
};
