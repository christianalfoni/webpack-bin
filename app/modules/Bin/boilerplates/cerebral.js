export default function (state) {
  const currentBin = state.select('bin.currentBin');

  currentBin.set('loaders', {
    babel: {
      stage0: true,
      es2015: true,
      react: true
    }
  });

  currentBin.set('packages', {
    'react': '0.14.7',
    'react-dom': '0.14.7',
    'cerebral': '0.33.30',
    'cerebral-model-baobab': '0.4.7',
    'cerebral-view-react': '0.11.8'
  });

  currentBin.set('files', [{
    name: 'main.js',
    content: `import React from 'react';
import {render} from 'react-dom';
import Controller from 'cerebral';
import Model from 'cerebral-model-baobab';
import {Container} from 'cerebral-view-react';
import AppModule from './AppModule';
import App from './App.js';

const controller = Controller(Model({}));
controller.addModules({app: AppModule})

render((
  <Container controller={controller}>
    <App/>
  </Container>
), document.querySelector('#app'));`
  }, {
    name: 'App.js',
    content: `import React from 'react';
import {HOC} from 'cerebral-view-react';

class App extends React.Component {
  render() {
    const {color, title, signals} = this.props;

    return (
      <div>
        <h1 style={{color: color}}>{title}</h1>
        <button onClick={() => signals.app.buttonClicked()}>
          Change color
        </button>
      </div>
    );
  }
}

export default HOC(App, {
  title: 'app.title',
  color: 'app.titleColor'
});`
  }, {
    name: 'AppModule.js',
    content: `function changeColor({state}) {
  const colors = ['red', 'blue', 'black', 'green'];
  const index = Math.floor(Math.random() * colors.length);
  state.set('app.titleColor', colors[index]);
}

export default function(module) {

  module.addState({
    title: 'Hello Cerebral',
    titleColor: 'black'
  });

  module.addSignals({
    buttonClicked: [changeColor]
  });

}`
  }]);

}
