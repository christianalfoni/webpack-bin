function setEmptyBin({state}) {
  state.set('bin.currentBin', {
    packages: {},
    loaders: {},
    files: [{
      name: 'main.js',
      content: ''
    }]
  });
  state.set('bin.selectedFileIndex', 0);
}

export default setEmptyBin;
