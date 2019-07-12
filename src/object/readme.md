# Object Prototype Extensions

@TODO: Update these notes based on the new Proxy design and global.VERBOTEN flag

Base prototype extensions are a controversial subject. Lib/Standard purposely tries to make as little of a splash as it can, while obtaining the full benefits of prototype extensions for other data types. Under normal conditions no modifications are made. However you can selectively opt into this architecture by calling `ea(Object.prototype)`.

Activating Object.prototype extensions has some considerations to managed as follows:

1. Avoid common word property names, particularly noun-based names.

2. Verb-based property names tend to denote an action and avoid namespace conflicts with noun-based properties of an object.

3. Because window is global and an object, all prototype extensions should handle a global use of the function - meaning a `this === global` check and appropriate parameter shifts where `this` is passed in as the first argument.

   * @TODO: the above won't matter after Standard.features are auto-promoted to a global property to programmatically does the argument shifting.

When checking for property access on an object not created from null (`Object.create(null)`) you should use `.hasOwnProperty()` or `.has()` to avoid a false-positive prototype lookup via `obj[key]`.
