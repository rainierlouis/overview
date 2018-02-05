# OVERVIEW

Overview is a package module that creates a visual representation of the user's application structure.

[![npm version](https://badge.fury.io/js/app-overview.svg)](https://badge.fury.io/js/app-overview) [![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)

![Overview](https://i.imgur.com/gyTe5kp.png)

**NOTE: STILL WIP - Expected v1.0.0 release by 9th Feb 2018 - Thank you**

An invaluable tool for developers who will be able to immediately see the layout of the application folder and how the files within connect with one another.

## Table of contents

* [Getting started](#getting-started)
* [Usage](#usage)
* [Built with](#built-with)
* [Authors](#authors)
* [License](#license)

## Getting started

* In your preferred CLI

```
yarn add app-overview --dev
npm install app-overview --save-dev
```

* Go to the chosen app directory on the CLI - `overview index.js` or `overview src/index.js`, this will build the config file and begin the visualisation.
* Voila, open the overview.html file found in the Visual folder in your chosen browser - Enjoy!

## Usage

* `overview _.js` - Set entry file point + begin visualisation
* `overview -r` - Remove Visual folder + reset.
* `overview -h` - Menu/help
* `overview -p` - View current path.

## Built with

* [d3](https://d3js.org/) - Data driven visualisation
* [node](https://nodejs.org/en/docs/) - Modular CLI config & system filing
* [webpack](https://github.com/webpack/webpack) - Bundling application for npm consumption
* [command line args](https://github.com/75lb/command-line-args) - Parsing CLI options

## Authors

* **Achim Bode** - _Visualisation/D3/Design_ - [achimbode](https://github.com/achimbode)
* **Karsten Balogh** - _Parsing/Data Algorithms_ - [karstenba](https://github.com/karstenba)
* **Nikita Kudryavtsev** - _Visualisation/D3/Design_ - [palevoo](https://github.com/palevoo)
* **Rainier Louis** - _CLI Environment/NPM_ - [rainierlouis](https://github.com/rainierlouis)

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/rainierlouis/overview/blob/development/LICENSE.md) file for details
