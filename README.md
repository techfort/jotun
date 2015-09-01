# jotun

convert javascript object to numerical 1-D array (vector) representation

![jotun](https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Rhinegold_and_the_Valkyries_p_032.jpg/470px-Rhinegold_and_the_Valkyries_p_032.jpg)

Jotun is the (anglicized) term used to describe the race of Giants living in Jotunheimr, one of the nine worlds in Norse mythology.
In this case it also means Javascript Objects To Numbers (however `jotn` sounded stupid and was only one `u`  away from keeping in line with all the other norse-themed repositories I have).

## but why????

Why on Midgard would you want to turn objects into vectors?

1. because a vector can be used in machine learning.

Pretty much that's it, but you can also use it for serialization purposes, or even create `ArrayBuffer`s to be used in `TypedArray`s so you can use `DataView`s?

## usage

Simple enough:
```
let jotun = require('jotun'),
  convert = jotun.converter();

let vector = convert({ foo: 'bar', quux: [2, 3, 4]});
// print [3, 2, 3, 4]
```

### default conversion

`jotun` will turn your objects into vectors with default converters following this behaviour:

1. numbers will be left untouched (except for NaN and Infinity)
2. strings will be converted to their length
3. booleans will be converted to 1 (true) and 0 (false)
4. Dates will be converted to their getTime() value
5. Objects will be converted to an array in which primitives are converted according to the above
6. undefined will turn to 0

The final resulting array will be flattened. 

### custom conversions

You may want to cater for special cases, like NaN or Infinity or undefined.
You can specify a map which defines the conversion behaviour. All you need to do is associate a conversion function for the object property. For instance, `example/example.es6.js` includes a conversion of text into bag-of-words vector representation:

```
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
```
