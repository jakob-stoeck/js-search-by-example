'use strict';
var searchByExample = {
  getArgs: function() {
    return {
      input: arguments[0],
      args: [].slice.call(arguments, 1, arguments.length-1),
      output: [].slice.call(arguments, -1)[0],
      object: typeof arguments[0] == 'string' ? new String() : new Number()
    };
  },
  objectInstanceFunctions: [
    // string
    'toUpperCase',
    'toLowerCase',
    'toLocaleUpperCase',
    'toLocaleLowerCase',
    'valueOf',
    'concat',
    'match',
    'search',
    'charCodeAt',
    'split',
    'replace',
    // number
    'toFixed',
    'toString',
    'toPrecision',
    'toExponential',
    'toLocaleString'
  ],
  isRight: function(fun) {
    try {
      var ret = this.object[fun].apply(this.input, this.args);
      return typeof ret === 'object' || typeof this.output === 'object'
        ? _.isEqual(ret, this.output)
        : ret == this.output;
    } catch (e) {
      // console.warn(e + '.  fun: ' + fun);
    }
  },
  find: function(args) {
    return this.objectInstanceFunctions.filter(this.isRight, args);
  }
};

var onEnter = function (event) {
  if (event.keyCode === 13) {
    var input = event.target.value;
    var output = '';
    try {
      var clean = input.split(';').filter(function(x) { return x; }).map(eval);
      var args = searchByExample.getArgs.apply(this, clean);
      output = searchByExample.find(args);
    } catch (e) {
      output = e;
    }
    document.getElementById('methods').value = output;
    event.preventDefault();
  }
}