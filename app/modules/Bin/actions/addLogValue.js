function addLogValue({input, state}) {
  state.push('bin.logs', input.value);
}

export default addLogValue;
