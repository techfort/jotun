let jotun = require('../index'),
  mimir = require('mimir');

let list = [{
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

let dict = mimir.dict(list.map(o => o.description));

let convert = jotun.converter({
  description: description => mimir.bow(description, dict),
  code: jotun.converter({})
});

list.forEach(obj => {
  console.log(convert(obj));
});

console.log(jotun.converter()({
  a: {
    b: 'c',
    d: true
  },
  c: [1, 2, 3]
}));
