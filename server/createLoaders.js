module.exports = function (currentLoaders) {

  var loaders = [];

  // BABEL
  if (currentLoaders.babel) {
    var loader = {
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: [],
        plugins: []
      }
    };
    if (currentLoaders.babel.es2015) {
      loader.query.presets.push(require.resolve("babel-preset-es2015"));
    }
    if (currentLoaders.babel.react) {
      loader.query.presets.push(require.resolve('babel-preset-react'));
    }
    if (currentLoaders.babel.stage0) {
      loader.query.presets.push(require.resolve('babel-preset-stage-0'));
    }
    if (currentLoaders.babel.jsx) {
      loader.query.plugins.push([
        'transform-react-jsx', {
          pragma: currentLoaders.babel.jsx.pragma
        }
      ]);
    }


    loaders.push(loader);
  }

  // CSS
  if (currentLoaders.css) {

    var loader = {
      test: /\.css?$/,
      loader: 'style!css'
    }

    if (currentLoaders.css.modules) {
      loader.loader = 'style!css?modules&localIdentName=[name]---[local]---[hash:base64:5]';
    }
    loaders.push(loader);
  }

  // TYPESCRIPT
  if (currentLoaders.typescript) {
    var loader = {
      test: /\.ts?$|\.tsx?$/,
      loader: 'ts',
      query: {
        transpileOnly: true,
        isolatedModules: true,
        silent: true,
        compilerOptions: {
          jsx: 'react',
          target: 'es5'
        }
      }
    }
    loaders.push(loader);
  }

  // CoffeeScript
  if (currentLoaders.coffeescript) {
    var loader = {
      test: /\.coffee?$/,
      loader: 'coffee'
    }
    loaders.push(loader);
  }

  // Less
  if (currentLoaders.css && currentLoaders.css.less) {
    var loader = {
      test: /\.less?$/,
      loader: 'style!css!less'
    }
    loaders.push(loader);
  }

  // Sass
  if (currentLoaders.css && currentLoaders.css.sass) {
    var loader = {
      test: /\.scss?$/,
      loader: 'style!css!sass'
    }
    loaders.push(loader);
  }

  // HTML
  if (currentLoaders.raw) {
    var loader = {
      test: /\.html?$/,
      loader: 'raw'
    }
    loaders.push(loader);
  }

  // JSON
  if (currentLoaders.json) {
    var loader = {
      test: /\.json?$/,
      loader: 'json'
    }
    loaders.push(loader);
  }

  // JADE
  if (currentLoaders.jade) {
    var loader = {
      test: /\.jade?$/,
      loader: 'jade'
    }
    loaders.push(loader);
  }

  // HANDLEBARS
  if (currentLoaders.handlebars) {
    var loader = {
      test: /\.handlebars?$/,
      loader: 'handlebars'
    }
    loaders.push(loader);
  }

  // VUE
  if (currentLoaders.vue) {
    var loader = {
      test: /\.vue?$/,
      loader: 'vue'
    }
    loaders.push(loader);
  }

  return loaders;
};
