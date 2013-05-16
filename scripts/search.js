(function() {
'use strict';
var s = new String()
  , n = new Number()
  , a = new Array()
  , equals = function(a, b) {
    return typeof a === 'object' || typeof b === 'object'
        ? _.isEqual(a, b)
        : a == b;
  }
  , searchByExample = {
  getArgs: function() {
    return {
      input: arguments[0],
      args: [].slice.call(arguments, 1, arguments.length-1),
      output: [].slice.call(arguments, -1)[0],
      object: typeof arguments[0] == 'string' ? new String() : new Number()
    };
  },
  instanceFun: [
    s.toUpperCase,
    s.toLowerCase,
    s.toLocaleUpperCase,
    s.toLocaleLowerCase,
    s.valueOf,
    s.concat,
    s.match,
    s.search,
    s.charCodeAt,
    s.split,
    s.replace,
    n.toFixed,
    n.toString,
    n.toPrecision,
    n.toExponential,
    n.toLocaleString,
    a.join,
    a.isArray,
    a.slice
  ],
  staticFun: [
    String.fromCharCode,
    Math.abs,
    Math.cos,
    Math.exp,
    Math.log,
    Math.max,
    Math.min,
    Math.pow,
    Math.sin,
    Math.tan,
    Math.ceil,
    Math.sqrt,
    Math.floor,
    Math.round,
    Object.keys
  ],
  // TODO by reference functions Array.push etc.
  tryInstance: function(fun) {
    try {
      var ret = fun.apply(this.input, this.args);
      return equals(ret, this.output);
    } catch (e) {}
  },
  tryStatic: function(fun) {
    try {
      var ret = fun.apply(this, this.args);
      return equals(ret, this.output);
    } catch (e) {}
  },
  find: function(args) {
    args = this.getArgs.apply(this, args);
    var inst = this.instanceFun.filter(this.tryInstance, args);
    args.args.unshift(args.input);
    var stat = this.staticFun.filter(this.tryStatic, args);
    return inst.concat(stat);
  }
}
  , onEnter = function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    var input = event.target.value;
    var output = '';
    try {
      var clean = input.split(';')
        .filter(function(x) { return x; })
        .map(function(el) { return eval('('+el+')'); });
      output = searchByExample.find(clean).join('\n');
    }
    catch (e) {
      // show syntax errors in output window
      output = e;
    }
    document.getElementById('methods').value = output;
  }
};
document.getElementById('example').onkeydown = onEnter;
})();
