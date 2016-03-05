function toggleLogPath({input, state}) {
  state.set(['bin', 'logs', ...input.path, 'isCollapsed'], !state.get(['bin', 'logs', ...input.path, 'isCollapsed']));
  state.set('bin.selectedLogPath', input.path);
}

export default toggleLogPath;
