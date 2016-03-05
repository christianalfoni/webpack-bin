import shouldRunSignal from '../actions/shouldRunSignal';

function preventIfLive(chain) {
  return [
    shouldRunSignal, {
      true: chain,
      false: []
    }
  ];
}

export default preventIfLive;
