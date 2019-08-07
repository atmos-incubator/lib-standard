# TODO Lib/Standard

Use ack or grep to find todo tasks.

## Backlog

@TODO: create a global.eq(a, b) that handles .toObject() comparisons on both args similar to ea(any).eq(any);

@TODO: ea({}).where(any) filter logic

@TODO: Need a construct json stream which returns JSON without newlines and prefixes a ','
//@: Anything that parses this stream will know based on the initial ',' that it's a stream.
//@: Attempt parsing and if it fails wrap with `{}` and try again.
//@EG: `,key: ["foo"]` would represent a streamable object
//@EG: `,{ key: ["foo"]}` would represent a streamable array

@TODO: "json/js/jss".parse() should detect the correct parse strategy
@: allow for json streams that use a prefixed ',' to denote stream format of json records
