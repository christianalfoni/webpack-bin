import React from 'react';
import ReactDOM from 'react-dom';
import Controller from 'cerebral';
import Model from 'cerebral-model-baobab';
import {Container} from 'cerebral-view-react';
import Devtools from 'cerebral-module-devtools';
import Router from 'cerebral-module-router';
import Http from 'cerebral-module-http';
import BinModule from './modules/Bin';
import Bin from './components/Bin';
import NpmModule from './modules/Npm';
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

  http: Http(),
  devtools: process.env.NODE_ENV === 'production' ? function () {} : Devtools(),
  router: Router({
    '/': 'bin.rootRouted',
    '/:id': 'bin.opened'
  })
});

ReactDOM.render(
  <Container controller={controller}>
    <Bin/>
  </Container>,
document.getElementById('root'));
