function connect({services, state, output}) {
  services.live.connect(state.get('bin.currentBin.id'))
    .then(output.success)
    .catch(output.error);
}

connect.async = true;

export default connect;
