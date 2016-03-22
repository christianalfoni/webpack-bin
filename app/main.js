import React from 'react';
import ReactDOM from 'react-dom';
import Controller from 'cerebral';
import Model from 'cerebral-model-baobab';
import {Container} from 'cerebral-view-react';
import Devtools from 'cerebral-module-devtools';
import Router from 'cerebral-module-router';
import Http from 'cerebral-module-http';
import BinModule from './modules/Bin';
import NpmModule from './modules/Npm';
import LiveModule from './modules/Live';
import Mobile from './modules/Mobile';
import hideSnackbar from './modules/Bin/actions/hideSnackbar';

const controller = Controller(Model({}));

controller.addSignals({
  snackbarTimedOut: [
    hideSnackbar
  ]
});

controller.addModules({
  bin: BinModule(),
  npm: NpmModule(),
  live: LiveModule(),
  mobile: Mobile(),

  http: Http(),
  devtools: process.env.NODE_ENV === 'production' ? function () {} : Devtools(),
  router: Router({
    '/': 'bin.rootRouted',
    '/:id': 'bin.opened'
  })
});

let currentApp = null;
const calculateCurrentApp = function () {
  if (window.innerWidth < 400 && window.innerWidth < window.innerHeight) {
    return 'mobilePortrait';
  }
  if (window.innerWidth < 1280) {
    return 'mobileLandscape';
  }
  return 'desktop';
};

const renderApp = function () {
  const newApp = calculateCurrentApp();
  if (currentApp === newApp) {
    return;
  }

  document.querySelector('#loader').style.display = 'block';
  ReactDOM.unmountComponentAtNode(document.getElementById('root'));

  require.ensure([], () => {
    let Bin;
    if (newApp === 'mobilePortrait') {
      Bin = require('./mobilePortrait/Bin/index.js').default;
    } else if (newApp === 'mobileLandscape') {
      Bin = require('./mobileLandscape/Bin/index.js').default;
    } else {
      Bin = require('./desktop/Bin/index.js').default;
    }

    ReactDOM.render(
      <Container controller={controller} style={{height: '100%'}}>
        <Bin/>
      </Container>,
    document.getElementById('root'));
  });
};

window.addEventListener('resize', renderApp);
renderApp();
