function shouldLint({input, state}) {
  const currentFile = state.get(`bin.currentBin.files.${state.get('bin.selectedFileIndex')}`);
  const ext = currentFile.name.split('.')[currentFile.name.split('.').length - 1];
  if (ext === 'tsx' || ext === 'ts' || ext === 'less' || ext === 'styl') {
    state.set('bin.shouldLint', false);
  } else {
    state.set('bin.shouldLint', true);
  }
}

export default shouldLint;
