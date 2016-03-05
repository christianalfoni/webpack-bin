function mergeSnapshot({input, state}) {
  state.merge(input.snapshot);
}

export default mergeSnapshot;
