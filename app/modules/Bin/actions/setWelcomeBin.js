function setWelcomeBin({state}) {
  state.set('bin.currentBin', {
    packages: {},
    loaders: {
      css: {},
      raw: {}
    },
    files: [{
      name: 'index.html',
      content: '<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset=\"utf-8\"/>\n  </head>\n  <body>\n    <div id=\"app\"></div>\n    <script src=\"main.js\"></script>\n  </body>\n</html>'
    }, {
      name: 'main.js',
      isEntry: true,
      content: [
        '// Just require css files to load them',
        'require(\'./styles.css\');',
        '',
        '// You can load HTML files and many other type of files',
        'var content = require(\'./welcome.html\');',
        '',
        '// Put your content in to the APP container',
        'document.querySelector(\'#app\').innerHTML = content;'
      ].join('\n')
    }, {
      name: 'welcome.html',
      content: [
        '<div>',
        '  <h1>Welcome to WebpackBin!</h1>',
        '  <ul>',
        '    <li>Use <b>bin.log()</b> in your code to log values</li>',
        '    <li>Use the DOM element with the ID <b>app</b> to render content</li>',
        '    <li>Load CSS by just requiring it in your code, like this welcome page does</li>',
        '    <li>Configure NPM packages and play around with libraries</li>',
        '    <li>Add Webpack loaders for modern JavaScript, Css modules, Typescript, Coffeescript, Sass, Less, Html, Json etc.</li>',
        '    <li>Check out the boilerplates to quickly load up some "Hello world" examples</li>',
        '    <li>Check out the introduction video under "Info"</li>',
        '  </ul>',
        '</div>'
      ].join('\n')
    }, {
      name: 'styles.css',
      content: [
        'body {',
        '  margin: 0;',
        '  padding: 20px;',
        '  font-family: Consolas, Arial;',
        '  color: #333;',
        '  background-color: #FAFAFA;',
        '}',
        '',
        'h1 {',
        '  text-align: center;',
        '  font-size: 46px;',
        '}',
        '',
        'ul {',
        '  font-size: 20px;',
        '}',
        '',
        'li {',
        '  margin-bottom: 10px;',
        '}'
      ].join('\n')
    }]
  });
  state.set('bin.selectedFileIndex', 0);
}

export default setWelcomeBin;
