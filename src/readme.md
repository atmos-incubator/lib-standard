# Source

The library is split up into basic features generally described by a singular
form of the concept or data type of the feature.

`require`'s are managed by hand and should either be included in the
{root}/index.js file or in the respective folder's index.js file.

## Structure

@TODO: enforce these rules in preflight.js

1.  Top-level features have their own folder and maintain an index.js that
    organizes load order for files in that folder.

1.  Each directory should contain an index.js, feature.js, feature-test.js and
    a readme.md with detailed notes

        * This ensures readability in ide editor tabs while allowing for easy require('/src/feature') calls

1.  Most features associate 1-1 with a data type (array, object, string, etc).

1.  If a feature is simple enough it can go into the respective array.js or
    object.js file. If it needs more than a few dozen lines of code it should go
    into its own file in the feature folder and get required in the sibling
    index.js file.

1.  If a feature requires more than just the feature.js and feature-test.js
    files, or if it needs to be imported before other features then it should be
    promoted to its own top-level folder (refer to [src/ea/](./ea/readme.md) as
    an example).
