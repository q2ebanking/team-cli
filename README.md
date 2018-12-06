# team-cli

[![npm version](https://badge.fury.io/js/team-cli.svg)](https://badge.fury.io/js/team-cli)

Automate all the things with a team-centric CLI. Abstract away annoying day-to-day tasks and eliminate tribal team knowledge by building your team their very own CLI.

## Getting Started

### Initialize Project

```bash
mkdir teamname-cli
cd teamname-cli
git init
npm init
npm install --save team-cli
```

### Create Bin index.js

Then in an `index.js` you could write the following:

```javascript
#!/usr/bin/env node

const { resolve } = require('path');
const cli = require('team-cli');

const commandsDir = resolve(__dirname, 'commands');
cli(commandsDir);
```

### Point to Bin index.js in Package

Then customize your `package.json` to include a path to the bin:

```json
"bin": {
  "NAME_OF_TOOL": "./index.js"
}
```

### Create Commands

Then you may make a `commands` directory with files like `command-foo.js`:

```javascript
const run = require('team-cli/terminal');
const { resolve } = require('path');

const script = resolve(__dirname, 'foo.sh'); // also supports bash .ps1 scripts

const action = async param => {
  await run(script, param)
  // Or, run any Node code you wish
};

module.exports = {
  title: 'foo <param>',
  description: 'Calls foo',
  action,
}
```

### Try it out!

```bash
node ./index.js --help
```

## Options

Any command can export the following options:

```javascript
{
  title: 'foo', // or 'foo <required_param>' or 'foo [optional_param]'
  action: (param) => {} // function with param as a string or undefined
  description: 'Calls foo', // optional
  alias: 'f', // optional
  option: ['-f, --force', 'Forces something to happen'], // optional, this will become available globally not just per-command
}
```

## For Your Users

At any time a `--help` or `-h` may be passed to log commands to the console.

### Prompts

Optionally, you may find it useful to walk users through a guided CLI experience with prompts to your users. I suggest [prompts](https://www.npmjs.com/package/prompts) for this task, but any tool of your choice will work within an action.

#### Example usage with prompts:

```javascript
const action = async (cmd) => {
  if (!cmd) {
    let { value: cmdResponse } = await prompts({
        type: 'text',
        name: 'value',
        message: 'Which git command would you like to run?',
    });
    cmd = cmdResponse
  }
  await run(`git ${cmd}`, '~/aCoolRepo');
};
```

### Logging

The environment's log level can be changed with `process.env.LOG_LEVEL` to any of [winston's](https://github.com/winstonjs/winston) supported log levels including `verbose`.

To customize where logs are saved, pass a second param in your `index.js`'s `cli` call like so:

```javascript
cli(commandsDir, logsDir)
```
