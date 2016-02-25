function isLintable({state, output}) {
  const selectedFileIndex = state.get('bin.selectedFileIndex');
  const currentFileName = state.get(`bin.currentBin.files.${selectedFileIndex}.name`);
  const ext = currentFileName.split('.')[currentFileName.split('.').length - 1];
  if (ext === 'js') {
    output.true();
  } else {
    output.false;
  }
}

isLintable.outputs = ['true', 'false'];

export default isLintable;
