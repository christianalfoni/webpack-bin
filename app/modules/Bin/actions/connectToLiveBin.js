function connectToLiveBin({services, state}) {
  services.live.connect(state.get('bin.currentBin.id'));
}

export default connectToLiveBin;
