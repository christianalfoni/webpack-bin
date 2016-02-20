function shouldSave({input, state, output}) {
  const bin = state.select('bin');
  if (
    bin.get('hasSaved') &&
    bin.get('isValid') &&
    bin.get('selectedFileIndex') === bin.get('lastLintedIndex')
  ) {
    output.true();
  } else {
    output.false();
  }
}

shouldSave.outputs = ['true', 'false'];

export default shouldSave;
