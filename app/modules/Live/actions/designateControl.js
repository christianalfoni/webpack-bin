function designateControl({input, state, services}) {
  if (input.name === 'You') {
    state.set('live.controllingUser', null);
    services.live.retractControl();
  } else {
    state.set('live.controllingUser', input.name);
    services.live.designateControl(input.name);
  }
}

export default designateControl;
