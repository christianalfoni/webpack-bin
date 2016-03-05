const specialObjects = [
  '__webpackbin_type_circular',
  '__webpackbin_type_function',
  '__webpackbin_type_error'
];

function isSpecial(value) {
  return Boolean(specialObjects.filter((key) => {
    return key in value;
  }).length);
}

function convertValue(value) {
  if (Array.isArray(value)) {
    return {
      isCollapsed: value.length > 3 || value.length === 0,
      value: value.map(convertValue)
    };
  } else if (typeof value === 'object' && value !== null && !isSpecial(value)) {
    return {
      isCollapsed: Object.keys(value).length > 3 || Object.keys(length) === 0,
      value: Object.keys(value).reduce((newValue, key) => {
        newValue[key] = convertValue(value[key]);
        return newValue;
      }, {})
    };
  } else {
    return value;
  }
}

function addLogValue({input, state}) {
  state.push('bin.logs', convertValue(input.value));
}

export default addLogValue;
