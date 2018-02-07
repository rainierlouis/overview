#!/usr/bin/env node

// TODO:
// 'ov App.js' builds the user config AND runs the visualisation at once - DONE
// Receive the parsed data from PARSE team - DONE
// Pass the parsed data to VISUAL team - DONE
// Refactor help menu - DONE
// Add option to view folder path for entry point - DONE
// Take nested paths into account with entry file
// Open index.html with browser

const cla = require("command-line-args");
const { exec } = require("child_process");
const shell = require("shelljs");

const log = console.log;

const optionDefinitions = [
  { name: "entry", type: String },
  { name: "help", alias: "h", type: Boolean },
  { name: "reset", alias: "r", type: Boolean },
  { name: "path", alias: "p", type: Boolean }
];

// access flags (options._unknown for user entry)
const options = cla(optionDefinitions, { partial: true });

//-- MODULES --//
const reset = require("./configuration/consoleReset");
const visual = require("./configuration/visualModule").visualData;
const menu = require("./configuration/consoleHelp");
const user = require("./configuration/userConfig");
const parsing = require("./configuration/parseModule").parsing;
//-------------//

// HELPER METHODS //
const userEntry = entryObj =>
  entryObj._unknown && entryObj._unknown.length > 0
    ? entryObj._unknown[0]
    : entryObj;

const parse = input =>
  typeof input === "string" ? `entry ${input}` : concatObj(input);

const concatObj = optionObj => Object.keys(optionObj).map(key => key)[0];

const entryKeyExtractor = entryKey => entryKey.split(" ")[0];

const entryValueExtractor = entryValue => entryValue.split(" ")[1];

const formatEntry = userInput =>
  userInput[0] === "/"
    ? userInput.substr(1)
    : userInput[0] === "." ? userInput.substr(2) : userInput;

const beginVisual = async entryPoint => {
  const pathD = await shell.pwd().stdout;
  if (!user.checkEntryPoint(pathD, entryPoint)) {
    reset.reset();
    log(user.invalidInput());
    return;
  }
  if (user.checkNodeModules(pathD)) {
    // await reset.reset();
    // -- Ready for visual module consumption -- //
    await user.loadSpinner();
    await parsing(entryPoint, pathD);
    await visual(pathD);
    setTimeout(async () => {
      await shell.exec("open visual/overview.html");
    }, 6000);
  } else {
    await reset.reset();
    await log(user.invalidNode());
  }
};

// ---------------- //

const ov = async data => {
  let entryPoint;

  if (data && data.split(" ")[0] === "entry") {
    entryPoint = entryValueExtractor(data);
    data = entryKeyExtractor(data);
  }

  switch (data) {
    case "help":
      reset.reset();
      menu.menu();
      break;
    case "reset":
      reset.resetMethod();
      break;
    case "path":
      const pathD = await shell.pwd().stdout;
      log(`${pathD}/`);
      break;
    case "entry":
      beginVisual(formatEntry(entryPoint));
      break;
    default:
      reset.reset();
      log(user.invalidInput());
  }
};

ov(parse(userEntry(options)));
