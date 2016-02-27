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
    'react-dom': '0.14.7'
  });

  currentBin.set('files', [{
    name: 'main.js',
    content: `import React from 'react';
import {render} from 'react-dom';
import HelloWorld from './HelloWorld.js';

render(<HelloWorld/>, document.querySelector('#app'));`
  }, {
    name: 'HelloWorld.js',
    content: `import React from 'react';

function HelloWorld () {
  return (
    <h1>Hello World!</h1>
  );
}

export default HelloWorld;`
  }]);

}
