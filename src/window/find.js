
module.exports = win => {
  const nameReplacer = function(all, at, name, remain) {
    // @DOC: converts `@nameSelector` into `[name="nameSelector"]`
    return '[name="' + name + '"]' + remain;
  };

  const itrTypes = Object.create(null);
  Object.assign(itrTypes, {
    function: true,
    boolean: true,
    number: true
  });

  win.find = (selector, scope, itr) => {
    // @DOC: find('.listItem') will return the first item.
    // @DOC: find('.listItem', (el) => { ... }) will iterate over all found elements.
    // @DOC: find('.listItem', true) returns an array.
    assert(selector, 'Call to find() with missing selector');

    // @DOC: find('@username') will return elements with `name="username"`
    if (selector && selector.indexOf('@') >= 0) {
      selector = selector.replace(/(@)(.*?)([.: ]|$)/g, nameReplacer);
    }

    // Handle argument shifting
    if (!itr && scope && itrTypes[isa(scope)]) {
      itr = scope;
      scope = null;
    }

    // @DOC: scope defaults to document
    if (!scope) {
      scope = win.document;
    }

    if (!itr) {
      return scope.querySelector(selector) || nil;
    }

    // Find all results and return based on itr param data type
    var res = scope.querySelectorAll(selector);

    const is = isa(itr);
    if (is == 'function') {
      return ea(res, itr);
    } else if (is == 'number') {
      return res[itr];
    }

    return res.length ? res : nil;
  };

  Object.protoMap(win.HTMLDocument.prototype, {
    find: function(sel, itr) {
      if (sel === 'body') return win.document.body;
      return win.document.body.find(sel, itr);
    }
  });

  Object.protoMap(win.HTMLElement.prototype, {
    find: function(selector, itr) {
      return win.find(selector, this, itr);
    }
  });
};
