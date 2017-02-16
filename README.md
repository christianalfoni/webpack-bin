# webpack-bin
A webpack code sandbox

## Webpackbin 2 is closing in
Webpackbin was an experiment to see if it would be possible to create a bin service based on webpack. It has been a big success, though it has some pretty huge challenges in terms of memory management and scalability in general. It also has quite a few bugs.

Webpackbin2 is now closing in and scalability issues has been solved, new features are added and you should generally get a better experience using the tool.

#### Watch a video on its new architecture
[![Webpackbin2](https://img.youtube.com/vi/LWZHFcA9W6M/0.jpg)](https://www.youtube.com/watch?v=LWZHFcA9W6M)

#### Test it
The test environment of Webpackbin is located here: https://webpackbin-test.firebaseapp.com/#/. Note that the background services are running Heroku instances that needs to sleep, meaning that it might takes a few extra seconds loading up your bin initially and do NPM package searches.

### Requirements
Node v5, NPM v3 and MongoDB

### Start
1. `npm install`
2. Change your hosts file and add `www.webpackbin.dev` and `sandbox.webpackbin.dev`
3. Make sure a mongodb instance is running
4. Make sure npm-extractor is running (look below)
5. `npm start`
6. Open up `www.webpackbin.dev:4000` in your browser

### NPM Extractor
WebpackBin depends on [npm-extractor](https://github.com/christianalfoni/npm-extractor). Just clone it and run it :-)

### Want to add a boilerplate?
1. Create a new BIN
2. Code the boilerplate
3. Create an issue with the URL of the BIN
4. We will update it on next release

This process will be simplified with further implementations

### Want to contribute?
1. Create a pull request pointing to an issue (if any)

The project does not currently have any tests, so this is subject to change when the project stabilizes.
