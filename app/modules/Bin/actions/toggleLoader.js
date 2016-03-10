const loaderTemplates = {
  babel: {
    stage0: true,
    es2015: true,
    react: false,
    jsx: false
  },
  css: {
    modules: false
  },
  typescript: {},
  coffeescript: {},
  less: {},
  sass: {},
  raw: {},
  json: {},
  jade: {},
  handlebars: {}
};

function toggleLoader({input, state}) {
  const loaders = state.get('bin.currentBin.loaders');

  if (input.name in loaders) {
    state.unset(`bin.currentBin.loaders.${input.name}`);
  } else {
    state.set(`bin.currentBin.loaders.${input.name}`, loaderTemplates[input.name]);
  }
}

export default toggleLoader;
