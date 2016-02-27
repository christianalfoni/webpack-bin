import reactBoilerplate from '../boilerplates/react';

function loadBoilerplate({input, state}) {
  if (input.name === 'react') {
    reactBoilerplate(state);
  }
}

export default loadBoilerplate;
