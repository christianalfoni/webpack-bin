import simple from '../quickstarts/simple';
import simpleWithCss from '../quickstarts/simpleWithCss';
import typescriptWithCss from '../quickstarts/typescriptWithCss';

function loadQuickstart({input, state}) {
  if (input.index === 0) {
    state.merge('bin.currentBin', simple)
  }
  if (input.index === 1) {
    state.merge('bin.currentBin', simpleWithCss)
  }
  if (input.index === 2) {
    state.merge('bin.currentBin', typescriptWithCss)
  }
}

export default loadQuickstart;
