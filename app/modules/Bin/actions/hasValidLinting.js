function hasValidLinting({state, output}) {
  const bin = state.select('bin');
  if (bin.get('isValid') && !bin.get('isLinting')) {
    output.true();
  } else {
    output.false();
  }
}

hasValidLinting.outputs = ['true', 'false'];

export default hasValidLinting;
