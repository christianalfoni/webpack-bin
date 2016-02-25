function isNewBin({input, state, output}) {
  if (input.id !== state.get('bin.currentBin.id')) {
    output.true();
  } else {
    output.false();
  }
}

isNewBin.outputs = ['true', 'false'];

export default isNewBin;
