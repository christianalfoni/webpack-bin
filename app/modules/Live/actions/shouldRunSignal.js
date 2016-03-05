import canControlComputed from '../../../computed/canControl';

function shouldRunSignal({input, state, output}) {
  if (input.isLiveSignal || state.get(canControlComputed)) {
    output.true();
  } else {
    output.false();
  }
}

shouldRunSignal.outputs = ['true', 'false'];

export default shouldRunSignal;
