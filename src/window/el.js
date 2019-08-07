module.exports = win => {
  Object.protoMap([win.Element.prototype, SVGSVGElement.prototype], {
    parent: function(selector) {
      let el = this.valueOf();
      if (!selector) return el.parentElement;
      while (el && !el.matches(selector)) {
        el = el.parentElement;
      }
      return el;
    },
    visible: function(b) {
      if (b === undefined) {
        return (
          this.cstyle('visibility') !== 'hidden' &&
          this.offsetWidth != 0 &&
          this.offsetHeight != 0
        );
      }
      this.style.visibility = b === false ? 'hidden' : 'visible';
      return this;
    },
    show: function(display) {
      // show or hide an element regardless of class definitions and inline styles
      // `display` can be one of the following:
      //   false : hide an element
      //   string : set display to string value
      //   undefined : equivalent to true
      //   true : show an element based on it's original computed display value

      // @NOTE: this is jacked up, I cannot find a better way to know for sure what style we should reset the display:none to
      if (this.cstyle('display') != 'none') {
        this.sys.display = this.cstyle('display');
      }

      if (display === false) {
        this.style.setProperty('display', 'none', 'important');
      } else {
        // @NOTE: Infer the display type based on previous inspection or assume based on the tag
        this.style.setProperty(
          'display',
          (isa(display, 'string') ? display : '') ||
            this.sys.display ||
            (this.isInline() ? 'inline' : 'block'),
          'important'
        );
        // @NOTE: el.show() denotes being able to see it under any circumstance.
        this.visible();
      }

      return this;
    },
    isInline: function() {
      return inlines.has(this.tagName.toLowerCase());
    },
    cstyle: function(prop) {
      // @CONSIDER: Make cstyle a proxy so that we can mimic style.visibility with cstyle.visibility
      const vals = getComputedStyle(this);
      if (prop) {
        return vals.getPropertyValue(prop.dasherize());
      } else {
        // return all properties
        var props = 'background background-attachment background-color background-image background-position background-repeat background-size border border-bottom border-bottom-color border-bottom-style border-bottom-width border-color border-left border-left-color border-left-style border-left-width border-right border-right-color border-right-style border-right-width border-style border-top border-top-color border-top-style border-top-width border-width clear clip color cursor display filter font font-family font-size font-variant font-weight height left letter-spacing line-height list-style list-style-image list-style-position list-style-type margin margin-bottom margin-left margin-right margin-top overflow padding padding-bottom padding-left padding-right padding-top page-break-after page-break-before position float text-align text-decoration text-indent text-transform top vertical-align visibility width z-index'.split(
          ' '
        );
        return props.ea(function(k) {
          ea.merge(k, vals.getPropertyValue(k));
        });
      }
    },
    focusable: function(bool) {
      // Toggle whether an element can receive focus
      if (bool === false) {
        // prevent focusing on the object
        if (!this.sys.focusId) {
          this.sys.focusId = this.on('focus', function() {
            this.blur();
          });
        }
        this.removeAttribute('tabIndex');
        delete this.tabIndex;
      } else {
        // assign a document flow tab index if not already defined to
        // @TODO: Test property based setting for tabIndex in IE to see if the default -1 goes away.
        if (!this.hasAttribute('tabIndex')) this.setAttribute('tabIndex', '0');
        if (this.sys.focusId) this.removeEventListener(this.sys.focusId);
      }
    },
    info: function() {
      // @DOC: Returns a summary of this node
      var res = '';

      // include id if set
      if (this.id) {
        res += '#' + this.id;
      }

      // include name if set
      if (this.name) {
        res += '[name=' + this.name + ']';
      }

      // include applied css classes
      if (this.classList.length) {
        this.classList.ea(function(v, k) {
          res += '.' + v;
        });
      }

      // include dom hierarchy location
      var p = this;
      res = p.tag() + res;
      while ((p = p.parent())) {
        res = p.tag() + ' > ' + res;
      }

      return res;
    },
    tag: function() {
      // there's no need to shout
      return this.tagName.toLowerCase();
    },
    remove: function() {
      // remove custom attributes, event handlers, event listeners and the dom node itself;
      var elem = this;

      // recurse first so we don't detach parent nodes before their children
      elem.children.remove();

      // remove listeners
      elem.removeAllEventListeners();

      // remove custom properties
      // @TODO: Create elem.prop that does a `setAttribute()` and a `.attribute =` operation
      // @: This ensures a `.outerHTML` includes the correct definition while ensuring that certain properties like aria-* still work.
      // @REF: https://stackoverflow.com/questions/7588846/when-to-access-the-attribute-vs-the-property/7590937#7590937
      // @REF: https://stackoverflow.com/questions/10280250/getattribute-versus-element-object-properties
      for (var p in elem) {
        if (elem.hasOwnProperty(p)) {
          delete elem[p];
        }
      }

      // clean sys map
      delete elem.sys;

      // finally remove the dom node
      // istanbul ignore else because there is no removing the document in a test
      if (elem.parentNode) elem.parentNode.removeChild(elem);

      elem = null;
    },
    appendHTML: function(html) {
      // grab a reference to the last node so that we can return a reference to the first node of whatever was inserted
      const el = this.lastElementChild;

      // inject arbitrary html into dom
      // @NOTE: newline prevents style blocks from vanishing in IE :/
      // @TODO: Test this behavior in edge, doubtful this is necessary anymore
      this.insertAdjacentHTML('beforeEnd', '\r\n' + html);

      // return ref of what was inserted;
      return el ? el.nextElementSibling : this.firstElementChild;
    },
    appendText: function(text) {
      this.appendChild(win.document.createTextNode(text));
      return this;
    }
  });

  // @DOC: Element.prototype.sys is like elem.dataset, but intended for system variables.
  const sysDef = () => {
    let props = {};
    return {
      set: function(v) {
        props = v;
      },
      get: function() {
        return props;
      }
      // configurable: true
    };
  };
  Object.defineProperty(win.Node.prototype, 'sys', sysDef());
  Object.defineProperty(win.NodeList.prototype, 'sys', sysDef());

  // @DOC: Allow removal of children inside a NodeList or HTMLCollection.
  Object.protoMap([win.NodeList.prototype, win.HTMLCollection.prototype], {
    remove: function() {
      for (var i = 0; i < this.length;) {
        win.Element.prototype.remove.call(this[i]);
      }
    }
  });

  // @NOTE: This is a list of elements that default to inline-display.
  // @TODO: Verify that this list is accurate in 2019
  const inlines = ea({
    b: 1,
    big: 1,
    i: 1,
    small: 1,
    tt: 1,
    abbr: 1,
    acronym: 1,
    cite: 1,
    code: 1,
    dfn: 1,
    em: 1,
    kbd: 1,
    strong: 1,
    samp: 1,
    var: 1,
    a: 1,
    bdo: 1,
    br: 1,
    img: 1,
    map: 1,
    object: 1,
    q: 1,
    script: 1,
    span: 1,
    sub: 1,
    sup: 1,
    button: 1,
    input: 1,
    label: 1,
    select: 1,
    textarea: 1
  });
};
