function currentLoader(get) {
  return get(`bin.currentBin.loaders.${get('bin.currentLoader')}`);
}

export default currentLoader;
