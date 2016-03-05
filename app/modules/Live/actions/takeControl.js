function takeControl({state, services}) {
  state.set('live.controllingUser', state.get('live.userName'));
  services.live.takeControl();
}

export default takeControl;
