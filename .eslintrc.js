module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    mocha: true
  },
  extends: ['standard'],
  globals: {
    //testing
    describe: 'readonly',
    feature: 'readonly',
    assert: 'readonly',
    it: 'readonly',
    sinon: 'readonly',
    sandbox: 'readonly',
    afterEach: 'readonly',
    beforeEach: 'readonly',
    expect: 'readonly',

    //standard globals
    noop: 'readonly',
    guid: 'readonly',
    onInit: 'readonly',
    onLoad: 'readonly',
    onUnload: 'readonly',
    SP: 'readonly',
    isa: 'readonly',
    Standard: 'readonly',
    ea: 'readonly',
    debug: 'readonly',
    log: 'readonly',
    error: 'readonly',
    warn: 'readonly',
    nil: 'readonly',
    def: 'readonly',
    has: 'readonly',
    die: 'readonly',
    toss: 'readonly',
    undef: 'readonly',

    //es20xx
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    BigInt: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    semi: ['error', 'always'],
    'space-before-function-paren': ['error', 'never'],
    indent: 'off',
    eqeqeq: 'off',
    'no-eval': ['error', { allowIndirect: true }],
    'no-prototype-builtins': 'off',
    'no-extend-native': 'off',
    'no-new-wrappers': 'off',
  }
};
