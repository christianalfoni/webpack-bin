export default {
  packages: {},
  loaders: {
    babel: {
      es2015: true
    },
    css: {}
  },
  files: [{
    name: 'index.html',
    content: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
  </head>
  <body>
    <script src="main.js"></script>
  </body>
</html>`
  }, {
    name: 'main.js',
    content: 'import \'./styles.css\';',
    isEntry: true
  }, {
    name: 'styles.css',
    content: ''
  }]
};
