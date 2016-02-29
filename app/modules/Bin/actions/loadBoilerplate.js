import reactBoilerplate from '../boilerplates/react';
import cerebralBoilerplate from '../boilerplates/cerebral';

function loadBoilerplate({input, state}) {
  if (input.name === 'react') {
    reactBoilerplate(state);
  }
  if (input.name === 'cerebral') {
    cerebralBoilerplate(state);
  }
}

export default loadBoilerplate;
