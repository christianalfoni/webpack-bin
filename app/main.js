import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'cerebral-module-router';
import Controller from 'cerebral';
import Model from 'cerebral-model-baobab';
import {Container} from 'cerebral-view-react';
import Devtools from 'cerebral-module-devtools';
import Http from 'cerebral-module-http';
import Example from './modules/Example';
import CodeEditor from './components/CodeEditor';
import Toolbar from './components/Toolbar';
import Preview from './components/Preview';

const controller = Controller(Model({}));

controller.addModules({
  example: Example(),

  http: Http(),
  devtools: Devtools(),
  router: Router({
    '/': 'example.redirectRoot',
    '/:color': 'example.colorChanged'
  }, {
    onlyHash: true
  })
});

ReactDOM.render(
  <Container controller={controller}>
    <Toolbar/>
    <div style={{height: 'calc(100vh - 50px)', width: '100%', display: 'flex'}}>
      <CodeEditor/>
      <Preview/>
    </div>
  </Container>,
document.getElementById('root'));
