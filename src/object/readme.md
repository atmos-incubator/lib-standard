# Standard Object

Standard objects are proxied objects with helpers that normalize access to Standard.features without affecting the Object.prototype or compromising access to the original object being wrapped.

Standard objects can even represent undefined and null.

## VERBOTEN Mode

If you are aware of the practical concerns with Object.prototype extensions then you can enable a more efficient mode via the `global.VERBOTEN` flag.

Activating Object.prototype extensions has the following consideration to manage:

1. Avoid common word property names, particularly noun-based names to avoid namespace eclipsing. Verb-based property names tend to denote an action and better avoid namespace conflicts with noun-based properties of an object[^1].

1. Use `Object.create(null)` for property maps.  If you are relying on an object to have an existing key to determine logic, ensure you use `Object.hasOwnProperty` to check for a local-only key or use `Object.create(null)` which will not inherit from the `Object.prototype`.

1. Be very careful when defining custom properties *directly* on the Object.prototype.  Standard.ize() uses a few tricks to make global access to that extension operable without infinite recursion.

## Architecture Notes

Properties that are attached to Standard objects are not implicitly wrapped so that each extension can dictate whether it wants to preserve access to the original object.

## Footnotes

[^1]: Some nouns are also verbs, English is funny. When in doubt, just use a variation of toNoun() or nounify().
