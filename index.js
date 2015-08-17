(function () {
  var R = require('ramda');

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
    'Array': arrayToNumberArray
  };

  function converter(map) {

    if (!map) {
      map = {};
    }

    return obj => R.flatten(
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
