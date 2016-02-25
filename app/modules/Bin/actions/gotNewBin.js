function gotNewBin({input, state, output}) {
  if (input.result.id && state.get('bin.currentBin.id') !== input.result.id) {
    output.true();
  } else {
    output.false();
  }
}

gotNewBin.outputs = ['true', 'false'];

export default gotNewBin;
