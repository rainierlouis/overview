# OVERVIEW

> A visualization of the application structure. See, read & learn the code, effortlessly.

[![npm version](https://badge.fury.io/js/app-overview.svg)](https://www.npmjs.com/package/app-overview)
[![npm](https://img.shields.io/npm/dw/app-overview.svg)]() [![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)

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

In your preferred CLI -

```
yarn add app-overview --dev
-or-
npm install app-overview --save-dev
```

Go to the chosen app directory on the CLI -

```
overview index.js
-or-
overview src/index.js
```

This will build the config file and begin the visualization. Once complete, the visual file will open in your default browser.

Alternatively, you can go to `YourAppDirectory/visual/overview.html`.

If you would like to reset/delete the Visual folder, simply enter `overview -r` in your CLI to remove the contents.

Enjoy!

## Usage

* `overview _.js` - Set entry file point + begin visualization
* `overview -r` - Remove Visual folder + reset.
* `overview -h` - Menu/help
* `overview -p` - View current path.

## Built with

* [d3](https://d3js.org/) - Data driven visualization
* [node](https://nodejs.org/en/docs/) - Modular CLI config & system filing
* [webpack](https://github.com/webpack/webpack) - Bundling application for npm consumption
* [command line args](https://github.com/75lb/command-line-args) - Parsing CLI options

## Authors

* **Achim Bode** - _Visualization/D3/Design_ - [achimbode](https://github.com/achimbode)
* **Karsten Balogh** - _Parsing/Data Algorithms_ - [karstenba](https://github.com/karstenba)
* **Nikita Kudryavtsev** - _Data Visualization/D3/Front-End_ - [palevoo](https://github.com/palevoo)
* **Rainier Louis** - _CLI Environment/NPM_ - [rainierlouis](https://github.com/rainierlouis)

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/rainierlouis/overview/blob/development/LICENSE.md) file for details
