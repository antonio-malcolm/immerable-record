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

require('./runTaskPreflightEngineCheck');

const Paths = require('../constant/Paths');
const CommonUtils = require(`${Paths.UTIL_APP_ROOT_ABSOLUTE}/CommonUtils`);

const RunTaskMissingDependenciesException = function(missingDependencies = [], err) {
  console.error('ERROR! Tasks require the package dependencies be installed.');

  if (CommonUtils.isNonEmptyArray(missingDependencies)) {
    console.warn(
        `Missing Dependencies: ${CommonUtils.convertArrayToCommaDelimitedStringWithAndOr(missingDependencies)}`
      );
  }

  if (CommonUtils.isAssignedNotNull(err) && CommonUtils.isAssignedNotNull(err.message)) {
    console.warn(
       `Reason: ${err.name}: ${err.message}`
      );
  }

  console.log('');
  console.warn('Run: `$ pnpm install`, then try your task again.');
  console.log('');
  console.log('Exiting...');
};

let colors;
let parseArgs;

try {
  colors = require('colors');
  parseArgs = require('minimist');
} catch (err) {
  throw new RunTaskMissingDependenciesException(
      ['colors', 'minimist'],
      err
    );
}

const Environs = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/Environs`);
const VarNames = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/VarNames`);
const Workspaces = require(`${Paths.CONSTANT_APP_ROOT_ABSOLUTE}/Workspaces`);

const CleanTaskScopes = require('./constant/CleanTaskScopes.js');
const Tasks = require('./constant/Tasks');
const TaskArgSanitizer = require('./sanitizer/TaskArgSanitizer');
const TaskArgDescriptions = require('./constant/TaskArgDescriptions');
const TaskDescriptions = require('./constant/TaskDescriptions');
const TaskVarNames = require('./constant/TaskVarNames');
const TaskWorker = require('./worker/TaskWorker');

const getArgs = function(argKeys) {
  let args = [];

  let parsedArgs = parseArgs(
      process.argv.slice(3),
      {
        'string': [
          TaskVarNames.CLEAN_SCOPE,
          VarNames.ENVIRON,
          VarNames.WORKSPACE
        ],
        'boolean': [
          TaskVarNames.IS_MEMBER_TASK,
          TaskVarNames.SHOULD_DEBUG,
          VarNames.SERVER_SHOULD_HOT_RELOAD,
          VarNames.SERVER_SHOULD_NETWORK
        ]
      }
    );

  // Remove any non-keyed args...
  // https://github.com/substack/minimist
  delete parsedArgs['_'];

  // If no args were provided, check environment variables...
  if (!CommonUtils.isNonEmptyObject(parsedArgs)) {
    parsedArgs[TaskVarNames.IS_MEMBER_TASK] = process.env[TaskVarNames.IS_MEMBER_TASK];
    parsedArgs[TaskVarNames.CLEAN_SCOPE] = process.env[TaskVarNames.CLEAN_SCOPE];
    parsedArgs[TaskVarNames.SHOULD_DEBUG] = process.env[TaskVarNames.SHOULD_DEBUG];
    parsedArgs[VarNames.ENVIRON] = process.env[VarNames.ENVIRON];
    parsedArgs[VarNames.SERVER_SHOULD_HOT_RELOAD] = process.env[VarNames.SERVER_SHOULD_HOT_RELOAD];
    parsedArgs[VarNames.SERVER_SHOULD_NETWORK] = process.env[VarNames.SERVER_SHOULD_NETWORK];
    parsedArgs[VarNames.WORKSPACE] = process.env[VarNames.WORKSPACE];
  }

  argKeys.forEach((key) => {
    switch (key) {
      case TaskVarNames.IS_MEMBER_TASK:
        if (parsedArgs[key] !== true) {
          args.push(false);
        } else {
          args.push(true);
        }

        break;

      case TaskVarNames.SHOULD_DEBUG:
        if (parsedArgs[key] !== true) {
          args.push(false);
        } else {
          args.push(true);
        }

        break;

      case VarNames.SERVER_SHOULD_HOT_RELOAD:
        if (parsedArgs[key] !== true) {
          args.push(false);
        } else {
          args.push(true);
        }

        break;

      case VarNames.SERVER_SHOULD_NETWORK:
        if (parsedArgs[key] !== true) {
          args.push(false);
        } else {
          args.push(true);
        }

        break;

      default:
        args.push(
          parsedArgs[key]
        );

        return;
    }
  });

  return args;
};

const logException = function(task, exception){
  let callerName;
  let message;
  let stacktrace;

  if (typeof exception.getMessage === 'function') {
    callerName = exception.getCallerName();
    message = exception.getMessage();
    stacktrace = exception.getStackTrace();
  } else {
    callerName = exception.name;
    message = exception.message;
    stacktrace = exception.stack;
  }

  console.log(
    colors.red.bold(
      `ERROR! An error occurred, during task: ${task}... `
    )
  );

  console.log(
    colors.magenta.bold('At: ') + colors.magenta(callerName)
  );

  console.log(
    colors.magenta.bold('Message: ') + colors.magenta(message)
  );

  console.log(
    colors.yellow.bold('Stack Trace: ') + colors.yellow(stacktrace)
  );
};

const build = function(workspace, environ) {
  console.log(
    colors.blue.bold.underline(
      `Starting task: ${Tasks.BUILD}...`
    )
  );

  try {
    workspace = TaskArgSanitizer.sanitizeWorkspaceArg(workspace, Tasks.BUILD);
    environ = TaskArgSanitizer.sanitizeEnvironArg(environ, Tasks.BUILD);
  } catch (ex) {
    logException(Tasks.BUILD, ex);
    return;
  }

  console.log(
    colors.blue(
      `Calling member task: ${Tasks.UPDATE}...`
    )
  );

  try {
    TaskWorker.update(workspace);

    console.log(
      colors.blue(
        `Calling member task: ${Tasks.BUILD}...`
      )
    );

    TaskWorker.build(workspace, environ);

    console.log(
      colors.green.bold(
        `SUCCESS! Successfully completed task: ${Tasks.BUILD}.`
      )
    );
  } catch (ex) {
    logException(Tasks.BUILD, ex);
    return;
  }
};

const clean = function(workspace, cleanScope) {
  console.log(
    colors.blue.bold.underline(
      `Starting task: ${Tasks.CLEAN}...`
    )
  );

  try {
    workspace = TaskArgSanitizer.sanitizeWorkspaceArg(workspace, Tasks.CLEAN);
    cleanScope = TaskArgSanitizer.sanitizeCleanTaskScopeArg(cleanScope, Tasks.CLEAN);
  } catch (ex) {
    logException(Tasks.CLEAN, ex);
    return;
  }

  try {
    TaskWorker.clean(workspace, cleanScope);

    console.log(
      colors.green.bold(
        `SUCCESS! Successfully completed task: ${Tasks.CLEAN}.`
      )
    );
  } catch (ex) {
    logException(Tasks.CLEAN, ex);
    return;
  }
};

const lint = function(workspace, shouldDebug) {
  console.log(
    colors.blue.bold.underline(
      `Starting task: ${Tasks.LINT}...`
    )
  );

  try {
    workspace = TaskArgSanitizer.sanitizeWorkspaceArg(workspace, Tasks.LINT);
  } catch (ex) {
    logException(Tasks.LINT, ex);
    return;
  }

  console.log(
    colors.blue(
      `Calling member task: ${Tasks.UPDATE}...`
    )
  );

  try {
    TaskWorker.update(workspace);

    console.log(
      colors.blue(
        `Calling member task: ${Tasks.LINT}...`
      )
    );

    TaskWorker.lint(workspace, shouldDebug);

    console.log(
      colors.green.bold(
        `SUCCESS! Successfully completed task: ${Tasks.LINT}.`
      )
    );
  } catch (ex) {
    /**
     * Don't print entire exception, on lint, as eslint will always exit with an error,
     * if the liniting itself fails, and throwing is for when something is actually broken.
     *
     * Also, if something is actually broken (such as the lint config),
     * eslint will print that, to the console.
     */
    console.warn(
      colors.yellow.bold(
        'If no error is present, above, regarding lint configuration, your code formatting has failed the lint.'
      )
    );

    console.warn(
      colors.yellow.bold(
        'Check the report output, to verify whether or not your code formatting meets the linting standards.'
      )
    );

    return;
  }
};

const start = function(workspace, environ, shouldHotReload, shouldNetwork) {
  console.log(
    colors.blue.bold.underline(
      `Starting task: ${Tasks.START}...`
    )
  );

  console.log(
    colors.blue(
      `Sanitizing args...`
    )
  );

  try {
    workspace = TaskArgSanitizer.sanitizeWorkspaceArg(workspace, Tasks.START);
    environ = TaskArgSanitizer.sanitizeEnvironArg(environ, Tasks.START);
    shouldHotReload = TaskArgSanitizer.sanitizeShouldHotReloadArg(shouldHotReload, Tasks.START);
    shouldNetwork = TaskArgSanitizer.sanitizeShouldNetworkArg(shouldNetwork, Tasks.START);
  } catch (ex) {
    logException(Tasks.START, ex);
    return;
  }

  console.log(
    colors.blue(
      `Calling member task: ${Tasks.UPDATE}...`
    )
  );

  try {
    TaskWorker.update(workspace);

    console.log(
      colors.blue(
        `Calling member task: ${Tasks.START}...`
      )
    );

    TaskWorker.start(
      workspace,
      environ,
      shouldHotReload,
      shouldNetwork
    );

    console.log(
      colors.green.bold(
        `SUCCESS! Successfully completed task: ${Tasks.START}.`
      )
    );
  } catch (ex) {
    logException(Tasks.START, ex);
    return;
  }
};

const update = function(workspace, isMemberTask) {
  if (isMemberTask !== true) {
    isMemberTask = false;
  }

  if (isMemberTask) {
    console.log(
      colors.blue.bold.underline(
        `Calling member task: ${Tasks.UPDATE}...`
      )
    );
  } else {
    console.log(
      colors.blue.bold.underline(
        `Starting task: ${Tasks.UPDATE}...`
      )
    );
  }

  try {
    workspace = TaskArgSanitizer.sanitizeWorkspaceArg(workspace, Tasks.UPDATE);
  } catch (ex) {
    logException(Tasks.UPDATE, ex);
    return;
  }

  try {
    TaskWorker.update(workspace);

    console.log(
      colors.green.bold(
        `SUCCESS! Successfully completed task: ${Tasks.UPDATE}.`
      )
    );
  } catch (ex) {
    logException(Tasks.UPDATE, ex);
    return;
  }
};

const task = process.argv[2];

switch (task) {
  case Tasks.BUILD:
    build(
      ...getArgs([
        VarNames.WORKSPACE,
        VarNames.ENVIRON
      ])
    );

    break;

  case Tasks.CLEAN:
    clean(
      ...getArgs([
        VarNames.WORKSPACE,
        TaskVarNames.CLEAN_SCOPE
      ])
    );

    break;

  case Tasks.LINT:
    lint(
      ...getArgs([
        VarNames.WORKSPACE,
        TaskVarNames.SHOULD_DEBUG
      ])
    );

    break;

  case Tasks.START:
    start(
      ...getArgs([
        VarNames.WORKSPACE,
        VarNames.ENVIRON,
        VarNames.SERVER_SHOULD_HOT_RELOAD,
        VarNames.SERVER_SHOULD_NETWORK
      ])
    );

    break;

  case Tasks.UPDATE:
    update(
      ...getArgs([
        VarNames.WORKSPACE,
        TaskVarNames.IS_MEMBER_TASK
      ])
    );

    break;

  case Tasks.LIST:
    console.log(
      colors.blue.bold.underline(
        `The following tasks are available, for this project:`
      )
    );

    Object.values(Tasks).forEach((TASK) => {
      console.log(
        colors.green.bold(`${TASK}: `)
        + colors.blue(
          TaskDescriptions[TASK]
        )
      );

      const taskArgDescriptions = TaskArgDescriptions[TASK];

      if (CommonUtils.isNonEmptyObject(taskArgDescriptions)) {
        console.log(
          colors.blue.bold('  Available arguments:')
        );

        Object.keys(taskArgDescriptions).forEach((ARG_DESC_KEY) => {
          console.log(
            colors.green.bold(`    ${ARG_DESC_KEY}: `)
            + colors.blue(
              taskArgDescriptions[ARG_DESC_KEY]
            )
          );

          let acceptedValues = [];
          let acceptedValuesAreBoolean = false;

          switch (ARG_DESC_KEY) {
            case `--${TaskVarNames.CLEAN_SCOPE}`:
              acceptedValues = Object.values(CleanTaskScopes);
              break;

            case `--${VarNames.ENVIRON}`:
              acceptedValues = Object.values(Environs);
              break;

            case `--${VarNames.WORKSPACE}`:
              acceptedValues = Object.values(Workspaces);
              break;

            default:
              acceptedValues = [ 'true', 'false' ];
              acceptedValuesAreBoolean = true;
              break;
          }

          if (CommonUtils.isNonEmptyArray(acceptedValues)) {
            console.log(
              colors.blue.bold('      Accepted values:')
            );
  
            acceptedValues.forEach((VAL) => {
              console.log(
                colors.green.bold(`        ${VAL}`)
              );
            });
  
            if (acceptedValuesAreBoolean) {
              console.log(
                colors.blue('        (presence of arg, with no value, assumes true)')
              );
              console.log(
                colors.blue('        (absence of arg assumes false)')
              );
            }
          }
        });
      }

      console.log('');
    });

    break;

  default:
    console.log(
      colors.red.bold(
        `ERROR! No task: ${task} is registered, for execution!`
      )
    );

    console.log(
      colors.red.bold(
        `Exiting...`
      )
    );

    break;
}
