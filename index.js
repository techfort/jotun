(function () {

  function _makeFlat(recursive) {
    return function flatt(list) {
      var value, result = [],
        idx = 0,
        j, ilen = list.length,
        jlen;
      while (idx < ilen) {
        if (Array.isArray(list[idx])) {
          value = recursive ? flatt(list[idx]) : list[idx];
          j = 0;
          jlen = value.length;
          while (j < jlen) {
            result[result.length] = value[j];
            j += 1;
          }
        } else {
          result[result.length] = list[idx];
        }
        idx += 1;
      }
      return result;
    }
  }

  var flatten = _makeFlat(true);

  function stringToNumber(str) {
    return str.length;
  }

  function booleanToNumber(bool) {
    return !!bool ? 1 : 0;
  }

  function dateToNumber(date) {
    return date.getTime();
  }

  function numberToNumber(num) {
    if (num < Infinity && num > -Infinity && num !== NaN) {
      return num;
    }
    throw new TypeError('Number is either Infinity or NaN');
  }

  function arrayToNumberArray(array) {
    return array.map(elem => converters[elem.constructor.name](elem));
  }

  var converters = {
    'String': stringToNumber,
    'Boolean': booleanToNumber,
    'Date': dateToNumber,
    'Number': numberToNumber,
    'Array': arrayToNumberArray,
    'Object': converter({})
  };

  function converter(map) {

    if (!map) {
      map = {};
    }

    return obj => flatten(
      Object
      .keys(obj)
      .map(key =>
        map[key] ? map[key](obj[key]) : converters[obj[key].constructor.name](obj[key]))
    );

  }

  module.exports = {
    converter: converter
  };

})();
