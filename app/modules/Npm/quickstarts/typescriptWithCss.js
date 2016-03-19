export default {
  packages: {},
  loaders: {
    typescript: {},
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
    <script src="main.ts"></script>
  </body>
</html>`
  }, {
    name: 'main.ts',
    content: 'import \'./styles.css\';',
    isEntry: true
  }, {
    name: 'styles.css',
    content: ''
  }]
};
