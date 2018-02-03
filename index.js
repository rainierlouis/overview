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
const opn = require("opn");
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
const { reset, resetEntire } = require("./configuration/consoleReset");
const { menu } = require("./configuration/consoleHelp");
const { create, missingEntry } = require("./configuration/userConfig");
const { parsing } = require("./configuration/parseModule");
const { visualData } = require("./configuration/visualModule");
//-------------//

const userEntry = entryObj =>
  entryObj._unknown && entryObj._unknown.length > 0
    ? entryObj._unknown[0]
    : entryObj;

const parse = input =>
  typeof input === "string" ? `entry ${input}` : concatObj(input);

const concatObj = optionObj => Object.keys(optionObj).map(key => key)[0];

const entryKeyExtractor = entryKey => entryKey.split(" ")[0];

const entryValueExtractor = entryValue => entryValue.split(" ")[1];

const pwdExtract = async entryPoint => {
  const pathD = shell.pwd().stdout;
  reset();
  create(entryPoint, pathD);
  setTimeout(async () => {
    // -- Ready for visual module consumption -- //
    await parsing(entryPoint, pathD);
    await visualData(pathD);
    //  // await opn(`${stdout}/visual/overwiew.html`, err => {});
  }, 4000);
};

const ov = async data => {
  let entryPoint;

  if (data && data.split(" ")[0] === "entry") {
    entryPoint = entryValueExtractor(data);
    data = entryKeyExtractor(data);
  }

  switch (data) {
    case "help":
      reset();
      menu();
      break;
    case "reset":
      resetEntire();
      break;
    case "path":
      break;
    case "entry":
      pwdExtract(entryPoint);
      break;
    default:
      reset();
      log(missingEntry());
  }
};

ov(parse(userEntry(options)));
