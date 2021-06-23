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

const modifierQualifiers = {
  isFinal: '_FINAL_',
  isFinalPrivate: '_FINAL_PRIVATE_',
  isFinalPrivateTyped: '_FINAL_PRIVATE_NCONF_',
  isFinalTyped: '_FINAL_NCONF_',
  isFinalTypedPrivate: '_FINAL_NCONF_PRIVATE_',
  isNonConfig: '_NCONF_',
  isNonConfigFinal: '_NCONF_FINAL_',
  isNonConfigFinalPrivate: '_NCONF_FINAL_PRIVATE_',
  isNonConfigPrivate: '_NCONF_PRIVATE',
  isNonConfigPrivateFinal: '_NCONF_PRIVATE_FINAL_',
  isPrivate: '_PRIVATE_',
  isPrivateFinal: '_PRIVATE_FINAL_',
  isPrivateFinalTyped: '_PRIVATE_FINAL_NCONF_',
  isPrivateTyped: '_PRIVATE_NCONF_',
  isPrivateTypedFinal: '_PRIVATE_NCONF_FINAL_'
};

const getPropertiesWithModifiers = function(obj) {
  const propertiesWithModifiers = {};

  Object.keys(obj).forEach((propKey) => {
    let modifier = '';
    let propertiesWithModifiersKey = '';

    Object.keys(modifierQualifiers).forEach((modifierKey) => {
      let testKey = '';

      if (propKey.startsWith(
        modifierQualifiers[modifierKey]
      )) {
        testKey = propKey.substring(
            modifierQualifiers[modifierKey].length
          );

        if (propertiesWithModifiersKey.length === 0) {
          modifier = modifierKey;
          propertiesWithModifiersKey = testKey;
        }

        if (testKey.length < propertiesWithModifiersKey.length) {
          modifier = modifierKey;
          propertiesWithModifiersKey = testKey;
        }
      }
    });

    if (modifier.length > 0) {
      let propertyWithModifiers = {
        isFinal: false,
        isPrivate: false,
        isNonConfig: false,
        prevKey: propKey,
        value: obj[propKey]
      };

      switch (modifier) {
        case 'isFinal':
          propertyWithModifiers.isFinal = true;
          break;

        case 'isFinalPrivate':
          propertyWithModifiers.isFinal = true;
          propertyWithModifiers.isPrivate = true;
          break;

        case 'isFinalPrivateTyped':
          propertyWithModifiers.isFinal = true;
          propertyWithModifiers.isNonConfig = true;
          propertyWithModifiers.isPrivate = true;
          break;

        case 'isFinalTyped':
          propertyWithModifiers.isFinal = true;
          propertyWithModifiers.isNonConfig = true;
          break;

        case 'isFinalTypedPrivate':
          propertyWithModifiers.isFinal = true;
          propertyWithModifiers.isNonConfig = true;
          propertyWithModifiers.isPrivate = true;
          break;

        case 'isPrivate':
          propertyWithModifiers.isPrivate = true;
          break;

        case 'isPrivateFinal':
          propertyWithModifiers.isFinal = true;
          propertyWithModifiers.isPrivate = true;
          break;

        case 'isPrivateFinalTyped':
          propertyWithModifiers.isFinal = true;
          propertyWithModifiers.isNonConfig = true;
          propertyWithModifiers.isPrivate = true;
          break;

        case 'isPrivateTyped':
          propertyWithModifiers.isNonConfig = true;
          propertyWithModifiers.isPrivate = true;
          break;

        case 'isPrivateTypedFinal':
          propertyWithModifiers.isFinal = true;
          propertyWithModifiers.isNonConfig = true;
          propertyWithModifiers.isPrivate = true;
          break;

        case 'isNonConfig':
          propertyWithModifiers.isNonConfig = true;
          break;

        case 'isNonConfigFinal':
          propertyWithModifiers.isFinal = true;
          propertyWithModifiers.isNonConfig = true;
          break;

        case 'isNonConfigFinalPrivate':
          propertyWithModifiers.isFinal = true;
          propertyWithModifiers.isNonConfig = true;
          propertyWithModifiers.isPrivate = true;
          break;

        case 'isNonConfigPrivate':
          propertyWithModifiers.isNonConfig = true;
          propertyWithModifiers.isPrivate = true;
          break;

        case 'isNonConfigPrivateFinal':
          propertyWithModifiers.isFinal = true;
          propertyWithModifiers.isNonConfig = true;
          propertyWithModifiers.isPrivate = true;
          break;
      }

      propertiesWithModifiers[propertiesWithModifiersKey] = propertyWithModifiers;
    }
  });

  return propertiesWithModifiers;
};

const setModifiedProperties = function(context, shouldSeal) {
  if (shouldSeal !== false) {
    shouldSeal = true;
  }

  const privatePropKeys = {};
  const propertiesWithModifiers = getPropertiesWithModifiers(context);

  Object.keys(propertiesWithModifiers).forEach((key) => {
    let propertyWithModifers = propertiesWithModifiers[key];
    let privatePropKey = key;

    if (propertyWithModifers.isPrivate) {
      privatePropKey = Symbol(key);
    }

    Object.defineProperty(
      context,
      privatePropKey,
      {
        configurable: (propertyWithModifers.isNonConfig ? false : true),
        enumerable: (propertyWithModifers.isPrivate ? false : true),
        writable: (propertyWithModifers.isFinal ? false : true),
        value: propertyWithModifers.value
      }
    );

    delete context[propertyWithModifers.prevKey];
    privatePropKeys[key] = privatePropKey;
  });

  if (shouldSeal) {
    Object.seal(context);
  }

  return privatePropKeys;
}

export default setModifiedProperties;
