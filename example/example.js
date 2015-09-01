(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var jotun = require('../index'),
    mimir = require('mimir');

var list = [{
  name: 'joe',
  age: 40,
  dob: new Date(1975, 1, 28),
  description: 'a javascript programmer that loves heavy metal',
  contractor: true,
  code: {
    languages: ['javascript', 'java', 'c++'],
    foo: 'bar'
  }
}, {
  name: 'jack',
  age: 25,
  dob: new Date(1990, 2, 20),
  description: 'an ios programmer that pretends to like jazz',
  contractor: false,
  code: {
    languages: ['objective-c', 'some other hipsteria language', 'ruby'],
    foo: 'bar'
  }
}];

var dict = mimir.dict(list.map(function (o) {
  return o.description;
}));

var convert = jotun.converter({
  description: function description(_description) {
    return mimir.bow(_description, dict);
  },
  code: jotun.converter({})
});

list.forEach(function (obj) {
  console.log(convert(obj));
});

console.log.apply(console, ['converting:\n  {\n    a: {\n      b: \'c\',\n      d: true\n    },\n    c: [1, 2, 3]\n  } ->\n  ', jotun.converter()({
  a: {
    b: 'c',
    d: true,
    udef: undefined
  },
  c: [1, 2, 3]
})]);

},{"../index":2,"mimir":3}],2:[function(require,module,exports){
'use strict';

(function () {

  function _makeFlat(recursive) {
    return function flatt(list) {
      var value,
          result = [],
          idx = 0,
          j,
          ilen = list.length,
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
    };
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
    return array.map(function (elem) {
      return converters[elem.constructor.name](elem);
    });
  }

  var converters = {
    'String': stringToNumber,
    'Boolean': booleanToNumber,
    'Date': dateToNumber,
    'Number': numberToNumber,
    'Array': arrayToNumberArray,
    'undefined': function undefined() {
      return 0;
    },
    'Object': converter({})
  };

  function converter(map) {

    if (!map) {
      map = {};
    }

    return function (obj) {
      return flatten(Object.keys(obj).map(function (key) {
        return map[key] ? map[key](obj[key]) : !!obj[key] ? converters[obj[key].constructor.name](obj[key]) : 0;
      }));
    };
  }

  module.exports = {
    converter: converter
  };
})();

},{}],3:[function(require,module,exports){
(function () {

  function tokenize(text) {
    return text
      .replace(/'/g, '')
      .replace(/\W/g, ' ')
      .replace(/\s\s+/g, ' ')
      .split(' ').map(function (s) {
        return s.toLowerCase();
      });
  }

  function extractDictionary(textArray) {
    var dict = {},
      keys = [],
      words;
    textArray = Array.isArray(textArray) ? textArray : [textArray];
    textArray.forEach(function (text) {
      words = tokenize(text);
      words.forEach(function (word) {
        word = word.toLowerCase();
        if (!dict[word] && word !== '') {
          dict[word] = 1;
          keys.push(word);
        } else {
          dict[word] += 1;
        }
      });
    });

    return {
      words: keys,
      dict: dict
    };
  }

  function bow(text, vocabulary) {
    var dict = extractDictionary([text]).dict,
      vector = [];

    vocabulary.words.forEach(function (word) {
      vector.push(dict[word] || 0);
    });
    return vector;
  }

  function tf(word, text) {
    var input = word.toLowerCase();
    var dict = extractDictionary(text).dict;
    return dict[input] / tokenize(text).length;
  }

  function wordInDocsCount(word, textlist) {
    var sum = 0;
    textlist.forEach(function (text) {
      sum += tokenize(text).indexOf(word) > -1 ? 1 : 0;
    });
    return sum;
  }

  function idf(word, textlist) {
    return Math.log(textlist.length / (1 + wordInDocsCount(word, textlist)));
  }

  function tfidf(word, text, textlist) {
    return tf(word, text) * idf(word, textlist);
  }

  module.exports = {
    dict: extractDictionary,
    bow: bow,
    tfidf: tfidf,
    tokenize: tokenize
  };

}());

},{}]},{},[1]);
