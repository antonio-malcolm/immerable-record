Welcome, to Immerable Record!
=============================
!["NodeJS Version"](https://img.shields.io/badge/NodeJS-%5E14%2E17%2E0-43853d?style=for-the-badge&logo=nodedotjs)
 !["npm Version"](https://img.shields.io/badge/npm-%5E6%2E14%2E3-ea2039?style=for-the-badge&logo=npm)
 !["pnpm Version"](https://img.shields.io/badge/pnpm-%5E6%2E7%2E6-f69220?style=for-the-badge&logo=pnpm)
 !["Immer Version"](https://img.shields.io/badge/Immer-%5E9%2E0%2E3-00e7C3?style=for-the-badge&logo=immer)  
!["Test Code Coverage"](https://img.shields.io/badge/Test%20Coverage-97%25-43c25f?style=for-the-badge)
 !["Test Status"](https://img.shields.io/badge/Test%20Status-All%20Pass%20(160)-43c25f?style=for-the-badge)
 !["Build Status"](https://img.shields.io/badge/Build%20Status-Success-43c25f?style=for-the-badge)

__Immerable Record is an immutable record data structure API, which uses pure, vanilla JavaScript objects for deep nesting.__

__It is similar, in contract, to the ImmutableJS Record, but uses Immer, for immutability, 
so you are always working with vanilla JavaScript objects, in your immutable data, no matter how deeply nested your data structure.__

## Contents
[About](#about)  
[Quickstart](#quickstart)
  -  [Requirements](#requirements)
  -  [Class Extension](#class-extension)  
  -  [Object Extension](#object-extension)
  -  [Accessing Properties](#accessing-properties)

[Methods](#methods)  
[History API](#methods)  
[Advanced Topics](#advanced-topics)
  -  [Building From Source](#building-from-source)
  -  [Running Tests](#running-tests)
  -  [Smoke Testing](#smoke-testing)
  -  [Cleanup](#cleanup)
  -  [Project Structure](#project-structure)

[Author And License Info](#author-and-license-info)  
[Support This Project](#support-this-project)

## About

All instances returned by Immerable Record CRUD methods, (and wrapper methods defined on the extending class or object), are immutable Immer drafts (as they are returned from the Immer `.produce` method).

All properties of a draft returned by an Immerable Record can be accessed using vanilla JavaScript dot or square bracket notation. As with an ImmutableJS Record, any CRUD actions preformed must be done via built-in methods, which are mostly on parity, with their ImuutableJS counterparts, such as `.getIn` and `.setIn` (Immerable Record has a few additionals, such as `.getInArrIdx` and `.setInArrIdx`, for drilling into arrays).

Immerable Record also provides a history API, which enables you to easily traverse, examine, and use previous versions of your object. Records, from history, are also immutable Immer drafts.

## Quickstart

#### Requirements
The only requirement for Immerable Record is a dependency of `"immer": "^9.0.3"`.  
Immerable Record uses Immer as a peer dependency, so you will need to add both `immer` and `immerable-record` to your `package.json` dependencies:
```JSON
"dependencies": {

  "immer": "^9.0.3",
  "immerable-record": "^1.0.0",

}
```

Or:
```shell
$ npm install --save immer@9.0.3 immerable-record@1.0.0
```

#### Class Extension
To begin, we'll create a simple class, which extends the ImmerableRecord class. While Immerable Record is not limited to use with Redux, 
this sample implementation is ideal, for creating domain objects, with which to divide your Redux state into manageable units of responsibility. This is a _working example_, from a released project:

```JavaScript
import { ImmerableRecord } from 'immerable-record';

import RequestStatus from 'constant/RequestStatus';

// CLASS EXTENDS ImmerableRecord
class HealthCheckStore extends ImmerableRecord {
  constructor() {
    // SET THE DEFAULT DRAFT...
    super({
      healthCheckData: {},
      healthCheckDataRequestStatus: RequestStatus.UNINITIATED,
      healthCheckDataRequestStatusReason: {
          [RequestStatus.UNINITIATED]: RequestStatus.UNINITIATED
        },
      healthCheckDataUpdateTimestamp: 0

       // CONFIG OBJECT WITH historyLimit ENABLES HISTORY API...
    }, { historyLimit: 5 });

    // PREVENT REASSIGNMENT OR EXTENSION, OF THE INITIAL INSTANCE
    // (Object.seal is fine, too)
    // ALL SUBSEQUENT INSTANCES / DRAFTS RETURNED, ON UPDATE, ARE ALREADY NON-EXTENSIBLE...
    Object.freeze(this);
  }

  // SAMPLE GETTER WRAPPER METHOD (CLASS METHOD)...
  getHealthCheckData() {
    return this.healthCheckData;
  };

  // SAMPLE SETTER WRAPPER METHOD (CLASS METHOD)...
  setHealthCheckData(data) {
    return this.setIn([ 'healthCheckData' ], data);
  };

  getHealthCheckDataRequestStatus() {
    return this.healthCheckDataRequestStatus;
  };

  setHealthCheckDataRequestStatus(status) {
    return this.setIn([ 'healthCheckDataRequestStatus' ], status);
  };

  // SAMPLE GETTER WRAPPER METHOD (ARROW FUNCTION)...
  getHealthCheckDataRequestStatusReason = () => {
    return this.healthCheckDataRequestStatusReason;
  };

  // SAMPLE SETTER METHOD (ARROW FUNCTION)...
  setHealthCheckDataRequestStatusReason = (status, reason) => {

    // SAMPLE IMMERABLE RECORD .setIn METHOD USAGE...
    return this.setIn(
        [ 'healthCheckDataRequestStatusReason' ],
        { [status]: reason }
      );
  };

  getHealthCheckDataUpdateTimestamp() {

    // SAMPLE IMMERABLE RECORD .getIn METHOD USAGE...
    // (NOT STRICTLY NECESSARY, AS WE CAN GET BY VANILLA JS DOT NOTAION)...
    return this.getIn(
        [ 'healthCheckDataUpdateTimestamp' ],
        Date.now()
      );
  }

  setHealthCheckDataUpdateTimestamp() {
    return this.setIn(
        [ 'healthCheckDataUpdateTimestamp' ],
        Date.now()
      );
  }

  resetHealthCheckDataUpdateTimestamp() {
    return this.setIn(
        [ 'healthCheckDataUpdateTimestamp' ],
        0
      );
  };
}
```

#### Object Extension
The following object usage is the object equivalent, to the above class example:

```JavaScript
import { ImmerableRecord } from 'immerable-record';

import RequestStatus from 'constant/RequestStatus';

let healthCheckStore = new ImmerableRecord({
    healthCheckData: {},
    healthCheckDataRequestStatus: RequestStatus.UNINITIATED,
    healthCheckDataRequestStatusReason: {
        [RequestStatus.UNINITIATED]: RequestStatus.UNINITIATED
      },
    healthCheckDataUpdateTimestamp: 0

     // CONFIG OBJECT WITH historyLimit ENABLES HISTORY API...
  }, { historyLimit: 5 });

// SAMPLE GETTER WRAPPER METHOD (CLASS METHOD)...
healthCheckStore.getHealthCheckData = function() {
    return this.healthCheckData;
  };

// SAMPLE SETTER WRAPPER METHOD (CLASS METHOD)...
healthCheckStore.setHealthCheckData = function(data) {
    return this.setIn([ 'healthCheckData' ], data);
  };

healthCheckStore.getHealthCheckDataRequestStatus = function() {
    return this.healthCheckDataRequestStatus;
  };

healthCheckStore.setHealthCheckDataRequestStatus = function(status) {
    return this.setIn([ 'healthCheckDataRequestStatus' ], status);
  };

// SAMPLE GETTER WRAPPER METHOD (ARROW FUNCTION)...
healthCheckStore.getHealthCheckDataRequestStatusReason = () => {
    return healthCheckStore.healthCheckDataRequestStatusReason;
  };

// SAMPLE SETTER METHOD (ARROW FUNCTION)...
healthCheckStore.setHealthCheckDataRequestStatusReason = (status, reason) => {
  
    // SAMPLE IMMERABLE RECORD .setIn METHOD USAGE...
    return healthCheckStore.setIn(
        [ 'healthCheckDataRequestStatusReason' ],
        { [status]: reason }
      );
  };

healthCheckStore.getHealthCheckDataUpdateTimestamp = function() {
  
    // SAMPLE IMMERABLE RECORD .getIn METHOD USAGE...
    // (NOT STRICTLY NECESSARY, AS WE CAN GET BY VANILLA JS DOT NOTAION)...
    return this.getIn(
        [ 'healthCheckDataUpdateTimestamp' ],
        Date.now()
      );
  };

healthCheckStore.setHealthCheckDataUpdateTimestamp = function() {
    return this.setIn(
        [ 'healthCheckDataUpdateTimestamp' ],
        Date.now()
      );
  };

healthCheckStore.resetHealthCheckDataUpdateTimestamp = function() {
    return this.setIn(
        [ 'healthCheckDataUpdateTimestamp' ],
        0
      );
  };

// PREVENT REASSIGNMENT OR EXTENSION, OF THE INITIAL INSTANCE
// (Object.seal is fine, too)
// ALL SUBSEQUENT INSTANCES / DRAFTS RETURNED, ON UPDATE, ARE ALREADY NON-EXTENSIBLE...
Object.freeze(healthCheckStore);
```

#### Accessing Properties
Accessing properties of your Immerable Record instance can be done using vanilla JavaScript dot or square bracket notation.

__Example (given the following data structure):__
```Javascript
{
  parentKey: {
    childKey: {
      someKey: 'I am a nested value!',
      anotherKey: 'I am also a nested value!'
    }
  }
}
```

The following variable value will be: `'I am a nested value!'`.
```Javascript
var someValue = parentKey.childKey.someKey;
```

The following variable value will be: `'I am also a nested value!'`.
```Javascript
var anotherValue = parentKey.childKey['anotherKey'];
```

Alternatively, you can also use method: `.getIn` (alternatively, `.getInArrIdx`, to access from an array index).  
The following variable value will be: `'I am a nested value!'`.
```Javascript
var someValue = obj.getIn([
    'parentKey',
    'childKey',
    'someKey'
  ]);
```

## Methods
_Note: all available methods may be wrapped by extending classes or objects, as in the examples provided in the [Quickstart](#quickstart) section.)_

Methods which return drafts (CRUD) can be chained.

### `.getIn(Array(keys))`
Returns a value from the field at key location, nested according to the provided keys arg. Each key traverses a level deeper, into the Record data structure.

__Args (1):__  
keys (Array<String>): An array of keys, each of which traverses a level deeper, into the Record data structure.

__Returns:__  
The value associated to the last key in the keys arg, after traversing into the Record data structure, according to the previous keys.

__Example (given the following data structure):__
```Javascript
{
  parentKey: {
    childKey: {
      nextKey: 'I am a nested value!'
    }
  }
}
```  
`.getIn([ 'parentKey', 'childKey', 'nextKey' ])` would return the value `'I am a nested value!'`


### `.setIn(Array(keys), ? value)`
Sets the specified value on the field at key location. nested according to the provided keys arg. Each key traverses a level deeper, into the Record data structure.

__Args (2):__  
keys (Array<String>): An array of keys, each of which traverses a level deeper, into the Record data structure.  
value (?): the value to be assigned to the field associated to the last key in the keys arg.

__Returns:__  
A new, immutable copy of the Record, with the updated field value.

__Example (given the following data structure):__
```Javascript
{
  parentKey: {
    childKey: {
      nextKey:
    }
  }
}
```  
`.setIn([ 'parentKey', 'childKey', 'nextKey' ], 2000)` would set `parentKey.childKey.nextKey = 2000`, then return a new, immutable copy of the Record.


### `.deleteIn(Array(keys))`
Deletes the field at key location, nested according to the provided keys arg. Each key traverses a level deeper, into the Record data structure.

__Args (1):__  
keys (Array<String>): An array of keys, each of which traverses a level deeper, into the Record data structure.

__Returns:__  
A new, immutable copy of the Record, with the field at the keys location removed.

__Example (given the following data structure):__
```Javascript
{
  parentKey: {
    childKey: {
      nextKey: 'I am a nested value!'
    }
  }
}
```  
`.deleteIn([ 'parentKey', 'childKey', 'nextKey' ])` would remove field `nextKey` from the structure, then return a new copy of the Record, with data structure: `parentKey.childKey`

### `.getInArrIdx(Array(keys), Number idx)`
Returns the value at the array index, from the array field at key location, nested according to the provided keys arg. Each key traverses a level deeper, into the Record data structure.

__Args (2):__  
keys (Array<String>): An array of keys, each of which traverses a level deeper, into the Record data structure.  
idx (Number): The array index at which the returned value is located, in the array field associated to the last key in the keys arg.

__Returns:__  
The value located at the index of the array field associated to the last key in the keys arg, after traversing into the Record data structure, according to the previous keys.

__Example (given the following data structure):__
```Javascript
{
  parentKey: {
    childKey: {
      nextKey: [ 1, 2, 'some value', 'foobar' ]
    }
  }
}
```  
`.getInArrIdx([ 'parentKey', 'childKey', 'nextKey' ], 2)` would return the value `'some value'`


### `.setInArrIdx(Array(keys), Number idx, ? value)`
Sets the specified value, at the array index, in the array field at key location. nested according to the provided keys array. Each key traverses a level deeper, into the Record data structure.

__Args (3):__  
keys (Array<String>): An array of keys, each of which traverses a level deeper, into the Record data structure.  
idx (Number): The array index at which the value is to be set, in the array field associated to the last key in the keys arg.  
value (?): the value to be assigned at the array index of the array field associated to the last key in the keys arg.

__Returns:__  
A new, immutable copy of the Record, with the updated array field, with the new value added at the specified index.

__Example (given the following data structure):__
```Javascript
{
  parentKey: {
    childKey: {
      nextKey: [ 1, 2, 'old value', 'foobar' ]
    }
  }
}
```  
`.setInArrIdx([ 'parentKey', 'childKey', 'nextKey' ], 2, 'a new value')` would set `parentKey.childKey.nextKey[2] = 'new value'` (previously, `'old value'`), then return a new, immutable copy of the Record.


### `.deleteInArrIdx(Array(keys))`
Removes the value, at the array index field at key location, nested according to the provided keys array. Each key traverses a level deeper, into the Record data structure.

__Args (1):__  
keys (Array<String>): An array of keys, each of which traverses a level deeper, into the Record data structure.  
idx (Number): The array index from which the value is to be removed, from the array field associated to the last key in the keys arg.

__Returns:__  
A new, immutable copy of the Record, with the updated array field, with the value at the specified index removed.

__Example (given the following data structure):__
```Javascript
{ parentKey: {
    childKey: {
      nextKey:  [ 1, 2, 'old value', 'foobar' ]
    }
  }
}
```  
`.deleteInArrIdx([ 'parentKey', 'childKey', 'nextKey' ], 2)` would remove `old value` from the structure, leaving `parentKey.childKey.nextKey = [ 1, 2, 'foobar' ]`, then return a new copy of the Record.


### `.pushInArr(Array(keys), ? value)`
Adds the specified value to the end (last) of the array - the array field at key location. nested according to the provided keys array. Each key traverses a level deeper, into the Record data structure.

__Args (2):__  
keys (Array<String>): An array of keys, each of which traverses a level deeper, into the Record data structure.  
value (?): the value to be added top the end (last) of the array - the array field associated to the last key in the keys arg.

__Returns:__  
A new, immutable copy of the Record, with the updated array field, with the new value added to the end (last).

__Example (given the following data structure):__
```Javascript
{
  parentKey: {
    childKey: {
      nextKey: [ 1, 2, 'some value', 'another value' ]
    }
  }
}
```  
`.pushInArr([ 'parentKey', 'childKey', 'nextKey' ], 'a new value')` would add `'a new value'`, resulting in `parentKey.childKey.nextKey = [ 1, 2, 'some value', 'another value', 'a new value' ]` , then return a new, immutable copy of the Record.


### `.popInArr(Array(keys))`
Removes the specified value from the end (last) of the array - the array field at key location. nested according to the provided keys array. Each key traverses a level deeper, into the Record data structure.

__Args (1):__  
keys (Array<String>): An array of keys, each of which traverses a level deeper, into the Record data structure.

__Returns:__  
A new, immutable copy of the Record, with the updated array field, with the end (last) value removed.

__Example (given the following data structure):__
```Javascript
{
  parentKey: {
    childKey: {
      nextKey: [ 1, 2, 'some value', 'another value' ]
    }
  }
}
```  
`.popInArr([ 'parentKey', 'childKey', 'nextKey' ])` would remove `'another value'`, resulting in `parentKey.childKey.nextKey = [ 1, 2, 'some value' ]` , then return a new, immutable copy of the Record.


### `.unshiftInArr(Array(keys), ? value)`
Adds the specified value to the beginning (first) of the array - the array field at key location. nested according to the provided keys array. Each key traverses a level deeper, into the Record data structure.

__Args (2):__  
keys (Array<String>): An array of keys, each of which traverses a level deeper, into the Record data structure.  
value (?): the value to be added top the beginning (first) of the array - the array field associated to the last key in the keys arg.

__Returns:__  
A new, immutable copy of the Record, with the updated array field, with the new value added to the beginning (first).

__Example (given the following data structure):__
```Javascript
{
  parentKey: {
    childKey: {
      nextKey: [ 1, 2, 'some value', 'another value' ]
    }
  }
}
```  
`.pushInArr([ 'parentKey', 'childKey', 'nextKey' ], 'a new value')` would add `'a new value'`, resulting in `parentKey.childKey.nextKey = [ 'a new value', 1, 2, 'some value', 'another value' ]` , then return a new, immutable copy of the Record.


### `.shiftInArr(Array(keys))`
Removes the specified value from the beginning (first) of the array - the array field at key location. nested according to the provided keys array. Each key traverses a level deeper, into the Record data structure.

__Args (1):__  
keys (Array<String>): An array of keys, each of which traverses a level deeper, into the Record data structure.

__Returns:__  
A new, immutable copy of the Record, with the updated array field, with the beginning (first) value removed.

__Example (given the following data structure):__
```Javascript
{
  parentKey: {
    childKey: {
      nextKey: [ 1, 2, 'some value', 'another value' ]
    }
  }
}
```  
`.shiftInArr([ 'parentKey', 'childKey', 'nextKey' ])` would remove `1`, resulting in `parentKey.childKey.nextKey = [ 2, 'some value', 'another value' ]` , then return a new, immutable copy of the Record.

## History API
Every update made to an Immerable Record instance returns a new, immutable draft.  
With the history API enabled, each draft is saved to history, and that history can be accessed from any draft revision.  
All that is required, to enable history, is to provide a configuration object, with a `historyLimit` property greater than zero (0).
When the number of drafts in history reaches the set limit, history will be cleared, before the next draft is added, so you will always have the most recent, up to your set limit.

With the following configuration, the 5 most recent drafts will be stored in history:
```JavaScript
{ historyLimit: 5 }
```

History can then be accessed as a simple property, of any draft revision.  
The following variable value will be an object containing the history drafts, along with timestamps, each indicating the timestamp of the creation of its respective draft.
```Javascript
var irHistory = obj.immerableRecordHistory;
```

The above variable, `irHistory`, with a `hsitoryLimit` of `5`, will look like the following:
```JavaScript
{
  0: {
      draft: Object { ... },
      timestamp: 1624445438549
    },
  1: {
      draft: Object { ... },
      timestamp: 1624445569463
    },
  2: {
      draft: Object { ... },
      timestamp: 1624445597180
    },
  3: {
      draft: Object { ... },
      timestamp: 1624445615310
    },
  4: {
      draft: Object { ... },
      timestamp: 1624445638760
    },
  5: {
      draft: Object { ... },
      timestamp: 1624445655949
    }
}
```

## Advanced Topics

#### Building From Source
To begin, clone the github repository:
```shell
$ git clone https://github.com/antonio-malcolm/immerable-record.git
```

As of the latest update to this README, this project uses the following versions, of NodeJS, npm, and pnpm:

NodeJS: v14.17.1  
npm: v6.14.13  
pnpm: v6.9.1

To ensure you are using the current, correct versions, refer to the engines block, in [package.json](package.json) 
The author of this project uses [nvm](https://github.com/nvm-sh/nvm), to install and switch between NodeJS and npm versions, and doing so is highly recommended.

This project uses pnpm, to manage dependencies and workspaces, and it is also used to execute tasks, within the task maanagement modules.  
To install pnpm (current project version):
```shell
$ npm install -g pnpm@6.9.1
```

After installing pnpm, install the project dependencies:
```shell
$ pnpm install
```

After successful installation of the project dependencies, you may build any one or all of the development, production, or release builds.
Each build is isolated, under directory: workspaces/immerable/build/dist/[dev, prod, release].

dev build:  
```shell
$ pnpm run build:immerable:dev
```

prod build:  
```shell
$ pnpm run build:immerable:prod
```

release build:  
```shell
$ pnpm run build:immerable:release
```

#### Running Tests
To run all tests (as of the latest update to this README, all tests are unit tests):
```shell
$ pnpm run test:immerable
```

Aside from test console output, test reports are generated, for both results and coverage, which are accessible from your web browser.  
After tests have been run, start the projects built-in server, and navigate to the following local URLs, in your web browser:
To clean the immerable build directory:
```shell
$ pnpm run start
```

[http://localhost:3001/test/report/immerable/mochawesome/Test_Report_immerable-record.html](http://localhost:3001/test/report/immerable/mochawesome/Test_Report_immerable-record.html)  
[http://localhost:3001/test/report/immerable/nyc/index.html](http://localhost:3001/test/report/immerable/nyc/index.html)

#### Smoke Testing
This project comes with React components, Redux state, and REST utilities which are used to test Immerable Record in a real-world scenario.  
In this scenario, Immerable Record is utilized, as the domain class, for a Redux store.  

Smoke testing is performed with a live, "over-the-wire" data GET request. During the request cycle, several state changes are made, both to actively track the request status, and to store the response data.

To begin the test, build the release package (used as a smoke test dependency), and start the project's built-in server.  
```shell
$ pnpm run build:immerable:release
$ pnpm run start
```

After successful build and server start, navigate to the following local URL, using your web browser:  
[http://localhost:3001/mmry/index.html](http://localhost:3001/mmry/index.html)

If the build and server start were successful, you should see the following request and response metrics, status, and data:
!["Smoke Test Status Data"](readme-asset/immerable-record_smoke-test_visual_result.png)

#### Cleanup
There are several options, for performing project cleanup.

To clean all workspace dependency, build, and test output directories:
```shell
$ pnpm run clean
```

To clean the immerable dependency, build, and test output directories:
```shell
$ pnpm run clean:immerable
```

To clean the immerable dependency directory:
```shell
$ pnpm run clean:immerable:dependency
```

To clean the immerable build directory:
```shell
$ pnpm run clean:immerable:build
```

To clean the test output directory:
```shell
$ pnpm run clean:test
```

#### Project Structure
Below is a general overview of the project structure, i.e., "where to find the relevant things".

Immerable Record source code:  
[workspaces/immerable/src/immerable/record/](workspaces/immerable/src/immerable/record/)

Immerable Record build output (after build, you will find child directories dist/[dev, prod, release]):  
[workspaces/immerable/build/](workspaces/immerable/build/)

Immerable Record test modules:
[test/spec/immerable/record/]([test/spec/immerable/record/])

Test output (genrated after running tests)
`test/output/`

## Author And License Info
Immerable Record is authored by, and copyright 2021 to present, Antonio Malcolm.  
All rights reserved.

Immerable Record (A.K.A., "ImmerableRecord", "immerableRecord",  "Immerable Record", or "immerable record")
 is licensed under the BSD 3-Clause license,
 and is subject to the terms of the BSD 3-Clause license,
 found in the LICENSE file, in the root directory of this project.
 If a copy of the BSD 3-Clause license cannot be found,
 as part of this project, you can obtain one, at:
 [https://opensource.org/licenses/BSD-3-Clause](https://opensource.org/licenses/BSD-3-Clause)

## Support This Project
This software is built with the greatest care and attention to detail, and thoroughly tested.  
Any support is greatly appreciated!

[!["Donate: Buy Me A Coffee"](https://img.shields.io/badge/Donate-Buy%20Me%20A%20Coffee-a1644c?style=for-the-badge&logo=buymeacoffee)](https://buymeacoffee.com/antoniomalcolm)
 [!["Donate: LiberaPay"](https://img.shields.io/badge/Donate-LiberaPay-f6c915?style=for-the-badge&logo=liberapay)](https://www.buymeacoffee.com/antoniomalcolm)
 [!["Donate: PayPal"](https://img.shields.io/badge/Donate-PayPal-0070ba?style=for-the-badge&logo=paypal)](https://paypal.me/antoniomalcolm)