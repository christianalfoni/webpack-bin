function addFile({state}) {
  const fileName = state.get('bin.newFileName');
  const ext = fileName.split('.')[fileName.split('.').length - 1];
  state.push('bin.currentBin.files', {
    name: fileName,
    content: ''
  });
  if (ext === 'ts' && !state.get('bin.currentBin.loaders.typescript')) {
    state.set('bin.currentBin.loaders.typescript', {});
  }
  if (ext === 'css' && !state.get('bin.currentBin.loaders.css')) {
    state.set('bin.currentBin.loaders.css', {});
  }
  if (ext === 'coffee' && !state.get('bin.currentBin.loaders.coffeescript')) {
    state.set('bin.currentBin.loaders.coffeescript', {});
  }
}

export default addFile;
