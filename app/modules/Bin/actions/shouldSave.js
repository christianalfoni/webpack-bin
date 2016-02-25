function shouldSave({input, state, output}) {
  const bin = state.select('bin');
  if (
    bin.get('hasTriedToRun') &&
    bin.get('isValid') &&
    bin.get('selectedFileIndex') === bin.get('lastLintedFileIndex')
  ) {
    output.true();
  } else {
    output.false();
  }
}

shouldSave.outputs = ['true', 'false'];

export default shouldSave;
