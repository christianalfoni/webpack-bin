(function (window) {
  window.addEventListener("load", function () {
    window.parent.postMessage({type: "loaded"}, location.origin.replace('sandbox', 'www'));
  });

  document.addEventListener('click', function () {
    window.parent.postMessage({type: "click"}, location.origin.replace('sandbox', 'www'));
  });

  function getFunctionName(fun) {
    var ret = fun.toString();
    ret = ret.substr('function '.length);
    ret = ret.substr(0, ret.indexOf('('));
    return ret;
  }

  function createValue(initialValue) {
    var refs = [];
    function extractValue(value) {
      if (refs.indexOf(value) >= 0) {
        return {
          __webpackbin_type_circular: true
        };
      }

      if (typeof value === 'function') {
        return {
          __webpackbin_type_function: true,
          name: getFunctionName(value) || 'Anonymous'
        };
      } else if (Array.isArray(value)) {
        refs.push(value);
        return value.map(createValue);
      } else if (typeof value === 'object' && value !== null) {
        refs.push(value);
        return Object.keys(value).reduce(function (copy, key) {
          copy[key] = extractValue(value[key]);
          return copy;
        }, {});
      }
      return value;
    }

    return extractValue(initialValue);
  }

  window.onerror = function (message, file, line, column) {
    window.parent.postMessage({type: "log", value: {
      __webpackbin_type_error: true,
      message: message
    }}, location.origin.replace('sandbox', 'www'));
  };

  window.bin = {
    log: function (value) {
      window.parent.postMessage({type: "log", value: createValue(value)}, location.origin.replace('sandbox', 'www'));
    }
  };
}(window));
