function addEntryToIndex({state}) {
  const fileName = state.get('bin.newFileName');
  const indexContent = state.get('bin.currentBin.files.0.content');
  state.set('bin.currentBin.files.0.content',
    indexContent.replace('</body>', [
      '  <script src="' + fileName + '"></script>',
      '  </body>'
    ].join('\n'))
  );
}

export default addEntryToIndex;
