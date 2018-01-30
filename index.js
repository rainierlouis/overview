#!/usr/bin/env node

// TODO:
// 'ov App.js' builds the user config AND runs the visualisation at once - DONE
// Create script logic that will start the npm process
// Receive the parsed data from PARSE team
// Pass the parsed data to VISUAL team
// Refactor help menu - DONE

const cla = require("command-line-args");
const log = console.log;

const optionDefinitions = [
  { name: "entry", type: String },
  { name: "help", alias: "h", type: Boolean },
  { name: "reset", alias: "r", type: Boolean }
];

// access flags (options._unknown for user entry)
const options = cla(optionDefinitions, { partial: true });

//-- MODULES --//
const { reset, resetEntire } = require("./configuration/consoleReset");
const { menu } = require("./configuration/consoleHelp");
const { create, missingEntry } = require("./configuration/userConfig");
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

const ov = async data => {
  let entryPoint;

  if (data.split(" ")[0] === "entry") {
    entryPoint = entryValueExtractor(data);
    data = entryKeyExtractor(data);
  }

  switch (data) {
    case "help":
      reset();
      log(menu);
      break;
    case "reset":
      resetEntire();
      break;
    case "entry":
      reset();
      create(entryPoint);
      setTimeout(() => {
        // Ready for visual module consumption
        log("---START THE VISUALISATION---");
      }, 4000);
  }
};

ov(parse(userEntry(options)));
