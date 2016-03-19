function setEmptyBin({state}) {
  state.set('bin.currentBin', {
    packages: {},
    loaders: {},
    files: [{
      name: 'index.html',
      content: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
  </head>
  <body>

  </body>
</html>`
    }]
  });
  state.set('bin.selectedFileIndex', 0);
}

export default setEmptyBin;
