import canControlComputed from '../../../computed/canControl';

function canControlBin({input, state, output}) {
  if (state.get(canControlComputed)) {
    output.true();
  } else {
    output.false();
  }
}

canControlBin.outputs = ['true', 'false'];

export default canControlBin;
