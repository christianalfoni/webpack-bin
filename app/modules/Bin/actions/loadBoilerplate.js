import reactBoilerplate from '../boilerplates/react';
import cerebralBoilerplate from '../boilerplates/cerebral';
import reduxBoilerplate from '../boilerplates/redux';

function loadBoilerplate({input, state}) {
  if (input.name === 'react') {
    reactBoilerplate(state);
  }
  if (input.name === 'cerebral') {
    cerebralBoilerplate(state);
  }
  if (input.name === 'redux') {
    reduxBoilerplate(state);
  }
}

export default loadBoilerplate;
