function sendSnapshot({input, state, services}) {
  const bin = state.get('bin');
  const npm = state.get('npm');

  services.live.sendSnapshot(input.name, {
    bin: {
      ...bin,
      currentBin: {
        ...bin.currentBin,
        isOwner: false
      }
    },
    npm
  });
}

export default sendSnapshot;
