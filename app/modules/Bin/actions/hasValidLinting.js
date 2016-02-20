function hasValidLinting({state, output}) {
  const bin = state.select('bin');
  if (state.get('isValid') && !state.get('isLinting')) {
    output.true();
  } else {
    output.false();
  }
}

hasValidLinting.outputs = ['true', 'false'];

export default hasValidLinting;
