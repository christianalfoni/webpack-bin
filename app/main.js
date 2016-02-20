import React from 'react';
import ReactDOM from 'react-dom';
import Controller from 'cerebral';
import Model from 'cerebral-model-baobab';
import {Container} from 'cerebral-view-react';
import Devtools from 'cerebral-module-devtools';
import Http from 'cerebral-module-http';
import Bin from './modules/Bin';
import CodeEditor from './components/CodeEditor';
import Toolbar from './components/Toolbar';
import Preview from './components/Preview';

const controller = Controller(Model({}));

controller.addModules({
  bin: Bin(),

  http: Http(),
  devtools: Devtools()
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
