import React from 'react';
import ReactDOM from 'react-dom';
import Controller from 'cerebral';
import Model from 'cerebral-model-baobab';
import {Container} from 'cerebral-view-react';
import Devtools from 'cerebral-module-devtools';
import Http from 'cerebral-module-http';
import BinModule from './modules/Bin';
import Bin from './components/Bin';

const controller = Controller(Model({}));

controller.addModules({
  bin: BinModule(),

  http: Http(),
  devtools: Devtools()
});

ReactDOM.render(
  <Container controller={controller}>
    <Bin/>
  </Container>,
document.getElementById('root'));
