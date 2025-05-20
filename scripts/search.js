(function() {
'use strict';
var s = new String()
  , n = new Number()
  , a = new Array()
  , d = new Date()
  , r = new RegExp('')
  , equals = function(a, b) {
    // If either is an object (includes null, arrays, actual objects), use _.isEqual
    if (typeof a === 'object' || typeof b === 'object') {
      return _.isEqual(a, b);
    }
    // Otherwise, they are both primitives (string, number, boolean, undefined, symbol, bigint)
    // Use strict equality for primitives.
    return a === b;
  }
  , searchByExample = {
  getArgs: function() {
    var examples = arguments[0]; // Due to .apply, the array is the first argument
    var objectInstance;

    if (examples && examples.length > 0 && examples[0].input !== undefined) {
      objectInstance = typeof examples[0].input === 'string' ? new String() : new Number();
    } else {
      objectInstance = new String(); // Default if no examples or input is undefined
    }

    return {
      examples: examples,
      object: objectInstance
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
    s.trim, 
    s.padStart, 
    s.padEnd, 
    s.substring, 
    s.substr, 
    s.includes, 
    s.startsWith, 
    s.endsWith, 
    s.repeat,
    n.toFixed,
    n.toString,
    n.toPrecision,
    n.toExponential,
    n.toLocaleString,
    a.join,
    // a.isArray, // Array.isArray is static
    a.slice,
    a.map, 
    a.filter, 
    a.reduce, 
    a.forEach, 
    a.indexOf, 
    a.lastIndexOf, 
    a.includes, 
    a.reverse, 
    a.sort, 
    a.flat, 
    a.flatMap,
    a.pop,
    a.shift,
    d.getFullYear, 
    d.getMonth, 
    d.getDate, 
    d.getDay, 
    d.getHours, 
    d.getMinutes, 
    d.getSeconds, 
    d.getMilliseconds, 
    d.getTime, 
    d.toISOString, 
    d.toLocaleDateString, 
    d.toLocaleTimeString,
    r.test,
    r.exec
  ],
  staticFun: [
    String.fromCharCode,
    Array.isArray, // Moved from instanceFun as it's static
    Number.isFinite,
    Number.isNaN,
    Number.parseInt,
    Number.parseFloat,
    Number.isInteger,
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
    Math.random, 
    Math.sign, 
    Math.trunc, 
    Math.hypot, 
    Math.atan2, 
    Math.imul, 
    Math.clz32, 
    Math.log10, 
    Math.log2, 
    Math.log1p, 
    Math.expm1, 
    Math.sinh, 
    Math.cosh, 
    Math.tanh, 
    Math.asinh, 
    Math.acosh, 
    Math.atanh,
    Object.keys,
    Object.values,
    Object.entries,
    Object.assign,
    Object.is,
    Object.freeze,
    Object.seal,
    JSON.stringify,
    JSON.parse
  ],
  // TODO by reference functions Array.push etc.
  tryInstance: function(fun) {
    if (!this.examples || !Array.isArray(this.examples) || this.examples.length === 0) {
      return false;
    }
    for (var i = 0; i < this.examples.length; i++) {
      var example = this.examples[i];
      try {
        var ret = fun.apply(example.input, example.args);
        if (!equals(ret, example.output)) {
          return false; // Mismatch
        }
      } catch (e) {
        return false; // Exception means not a match
      }
    }
    return true; // All examples matched
  },
  tryStatic: function(fun) {
    if (!this.examples || !Array.isArray(this.examples) || this.examples.length === 0) {
      return false;
    }
    for (var i = 0; i < this.examples.length; i++) {
      var example = this.examples[i];
      try {
        var constructedArgs = [example.input].concat(example.args);
        var ret = fun.apply(null, constructedArgs);
        if (!equals(ret, example.output)) {
          return false; // Mismatch
        }
      } catch (e) {
        return false; // Exception means not a match
      }
    }
    return true; // All examples matched
  },
  find: function(args) {
    args = this.getArgs.apply(this, args); // args is { examples: [...], object: ... }
    var inst = this.instanceFun.filter(this.tryInstance, args); // args becomes `this` in tryInstance
    // The line below is removed as per requirement:
    // args.args.unshift(args.input); 
    var stat = this.staticFun.filter(this.tryStatic, args);   // args becomes `this` in tryStatic
    return inst.concat(stat);
  }
}
  , onEnter = function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    var inputText = event.target.value;
    var output = '';
    try {
      var examplesArray = JSON.parse(inputText); 

      if (!Array.isArray(examplesArray)) {
        throw new Error("Input must be a JSON array of examples.");
      }
      // Assuming searchByExample.find or getArgs will handle malformed individual examples.
      // No need to iterate and validate each object's structure here as per subtask.

      output = searchByExample.find(examplesArray).join('\n');
    }
    catch (e) {
      // show syntax errors or other errors in output window
      output = e.toString(); // Using e.toString() for a potentially more descriptive error.
    }
    document.getElementById('methods').value = output;
  }
};
document.getElementById('example').onkeydown = onEnter;
})();
