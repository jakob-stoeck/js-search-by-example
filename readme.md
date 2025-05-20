# JavaScript Search by Example

A Smalltalk browser-inspired search by example for built-in JavaScript methods.

[Demo](http://jakob-stoeck.github.io/js-search-by-example/)
*(Note: The online demo may not reflect the latest version with JSON input and other enhancements.)*

## Description

This tool allows you to find JavaScript functions by providing examples of their input and output. Instead of remembering the exact function name, you can show what you want to achieve.

The input is a JSON array of example objects. Each object must have the following properties:
*   `"input"`: The value the function/method is called on (for instance methods) or the first argument (for static methods).
*   `"args"`: An array of arguments to be passed to the function. For methods that take no arguments, use an empty array `[]`.
*   `"output"`: The expected result after the function is called with the given input and arguments.

The tool searches through a predefined list of built-in JavaScript instance and static methods.

## Examples

**String Concatenation:**
```json
[
  {"input": "Hello", "args": [" world"], "output": "Hello world"}
]
```
Expected result: `concat`

**String to Upper Case (single example):**
```json
[
  {"input": "a", "args": [], "output": "A"}
]
```
Expected result: `toUpperCase, toLocaleUpperCase`

**String to Upper Case (multiple examples to narrow down):**
```json
[
  {"input": "a", "args": [], "output": "A"},
  {"input": "b", "args": [], "output": "B"}
]
```
Expected result: `toUpperCase, toLocaleUpperCase` (In this case, multiple examples don't narrow it further than single, but demonstrates the feature)

**String Splitting:**
```json
[
  {"input": "a,a", "args": [","], "output": ["a","a"]}
]
```
Expected result: `split`

**Number Formatting (toFixed):**
```json
[
  {"input": 3.14159, "args": [2], "output": "3.14"}
]
```
Expected result: `toFixed`

**Character Code (charCodeAt):**
```json
[
  {"input": "a", "args": [0], "output": 97}
]
```
Expected result: `charCodeAt`

## Features

*   **JSON Input Format:** Examples are provided in a structured JSON format, allowing for clear and complex examples.
*   **Multiple Examples:** You can provide an array of example objects. A function must satisfy *all* examples to be considered a match, helping to narrow down the search.
*   **Expanded Function Library:** The tool searches a wide range of built-in methods for:
    *   String
    *   Number
    *   Array
    *   Date
    *   RegExp (basic common methods)
    *   Math (static methods)
    *   Object (static methods)
    *   JSON (static methods)
*   **Stricter Matching:** Uses strict equality (`===`) for comparing primitive types, avoiding type coercion issues (e.g., `2` will not match `"2"`). Object and array comparisons use deep equality.

## Unit Tests

Unit tests are available to verify the functionality of the search logic. You can run them by opening `tests/tests.html` in your browser.

## User-Defined Functions

For advanced users or specific use cases, it's possible to extend the search capabilities by adding custom functions to the search pool. If you have a programmatic reference to the `searchByExample` object (e.g., by modifying the script or in a browser console environment), you can push your own functions directly onto:
*   `searchByExample.instanceFun`: For functions that behave like instance methods (called with `input.myFunction(...args)`).
*   `searchByExample.staticFun`: For functions that behave like static methods (called with `MyClass.myFunction(input, ...args)`).

For example:
```javascript
// Assuming access to searchByExample object
searchByExample.staticFun.push(function myCustomStatic(input, arg1) { /* ... */ return input + arg1; });
```
A more formal registration system could be a future enhancement.
