function retractControl({state, services}) {
  state.set('live.controllingUser', null);
  services.live.releaseControl();
}

export default retractControl;
