function setDefaultBin({state}) {
  state.set('bin.currentBin', {
    packages: {},
    loaders: {},
    files: [{
      name: 'main.js',
      content: [
        '/*',
        '  Welcome to WebpackBin',
        '',
        '  - Add packages from NPM',
        '  - Add loaders for modern JavaScript, Css, Typescript, Coffeescript, Sass, Less etc.',
        '  - Use boilerplates to quickly load up packages with Hello World examples',
        '  - Use bin.log() in your code to log values',
        '  - There is a DOM element with ID "app" which you can render to',
        '*/'
      ].join('\n')
    }]
  });
  state.set('bin.selectedFileIndex', 0);
}

export default setDefaultBin;
