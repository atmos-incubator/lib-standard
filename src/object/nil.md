
# Nil

In lib/standard `nil`s are like `null`s but with a more accurate object behavior.  `typeof null` returns `"object"` but it's not _really_ an object.  At least not like `new Number(0)` or `new Boolean(false)`.  In JavaScript Objects are always truthy, and they allow for attached properties... except for `null`.

`nil` solves this problem and adds a bit of flourish to make them useful.  You can access any undefined property of a `nil` and you will get (the same instance of ) `nil`.

`Standard` objects return `nil` when a property is not found.  While this property is truthy (it's an object), it has a few helper functions that make working with them very convenient and readable (notably `nil.or()`).
