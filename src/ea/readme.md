# Feature: `ea` Iterator

Iteration is one of the most common operations in software and the community has butchered the concept into a visceral mass. `ea()` unifies the interface into a single functional command for all objects of any type. With performant efficiency it serves as the foundation of chaining object property access regardless of the object type (including nulls and undefined).

Here is a preview of what `ea()` can do...

```javascript
// Iterate N times
ea(3, v => v); // [0, 1, 2]
3..ea(v => v * 2).sum(); // 6

// Iterate over concepts
ea(Infinity, (v) => {
  // Return early
  if (v == 4) ea.exit();
  return v;
}); // [0, 1, 2, 3]

// Iterate over Arrays and Objects
ea([0, 1, 2], v => v); // [0, 1, 2]
ea({ hello: 'world' }, (v, k) => v); // [ 'world' ]

// Reduce
ea([0, 1, 2], v => ea.merge('key', v)); // { key: 0 }
ea([0, 1, 2], v => ea.update('key', v)); // { key: 2 }

// Extend
ea(null).or(false); // false
ea(null).isa(); // nil
ea(null).isa(null); // true

// Find one
ea(3, v => {
  // Break the loop and return a specific value
  ea.exit(v));
}); // 0

// Async with callbacks...
ea(['foo', 'bar'].ea(next, v => {
  fetchJson('/term/' + v).then(next);
}, res => {
  res; // [ {...}, {...} ]
}))

// Async with promises
const res = await ea(['123', '456'].ea(next, v => {
  fetchJson('/product/' + v).then(next);
}, true);

// And access to all of the above is available as a prototype extension as well
0..ea(); //noop
[].ea(); //noop
true.ea(); // iterate once, over the boolean true
"test".ea(); // iterate over characters in 'test'

// When not using VERBOTEN mode, you have to wrap Objects with ea() first before accessing the extended features.
ea({}).ea(); //noop

```
