// Simple Assertion Framework
let testsRun = 0;
let testsPassed = 0;
const logArea = document.getElementById('log-area');

function log(message, type = 'log') {
    if (logArea) {
        const entry = document.createElement('div');
        entry.textContent = message;
        entry.className = type === 'pass' ? 'log-pass' : (type === 'fail' ? 'log-fail' : '');
        logArea.appendChild(entry);
    }
    if (type === 'fail') {
        console.error(message);
    } else {
        console.log(message);
    }
}

function assertDeepEqual(actual, expected, testName) {
    testsRun++;
    // Sort function names for consistent comparison if actual is array of functions
    let actualToCompare = actual;
    if (Array.isArray(actual) && actual.every(i => typeof i === 'function')) {
        actualToCompare = actual.map(f => f.name).sort();
    }
    // Ensure expected is also sorted if it's an array of names
    let expectedToCompare = expected;
    if (Array.isArray(expected) && expected.every(i => typeof i === 'string')) {
        expectedToCompare = expected.sort();
    }

    if (_.isEqual(actualToCompare, expectedToCompare)) {
        log(`PASS: ${testName}`, 'pass');
        testsPassed++;
    } else {
        log(`FAIL: ${testName} | Expected: ${JSON.stringify(expectedToCompare)} | Got: ${JSON.stringify(actualToCompare)}`, 'fail');
    }
}

function summary() {
    const message = `--- Test Summary --- | ${testsPassed} out of ${testsRun} tests passed.`;
    log(message);
    if (testsPassed !== testsRun) {
        log(`${testsRun - testsPassed} tests failed.`, 'fail');
    }
    
    const resultsDiv = document.getElementById('test-results');
    if (resultsDiv) {
        resultsDiv.innerHTML = `<h3>Test Summary</h3><p>${testsPassed} / ${testsRun} passed.</p>`;
        if (testsPassed !== testsRun) {
            resultsDiv.innerHTML += `<p class="summary-fail">${testsRun - testsPassed} failed.</p>`;
        }
    }
}

// --- Test Cases ---
log('Starting tests...');

// Single String Examples
log('\n--- String Method Tests ---');
assertDeepEqual(searchByExample.find([{ input: "abc", args: [], output: "ABC" }]), ["toUpperCase"], "String toUpperCase");
assertDeepEqual(searchByExample.find([{ input: "  hello  ", args: [], output: "hello" }]), ["trim"], "String trim");
assertDeepEqual(searchByExample.find([{ input: "test", args: ["st"], output: true }]), ["endsWith", "startsWith"], "String endsWith/startsWith"); 
assertDeepEqual(searchByExample.find([{ input: "hello", args: ["l", 1], output: 2 }]), ["indexOf"], "String indexOf");


// Single Number Examples
log('\n--- Number Method Tests ---');
assertDeepEqual(searchByExample.find([{ input: -10, args: [], output: 10 }]), ["abs"], "Math.abs static");
assertDeepEqual(searchByExample.find([{ input: 123.456, args: [2], output: "123.46"}]), ["toFixed"], "Number toFixed");
assertDeepEqual(searchByExample.find([{ input: 10.3, args: [], output: 10 }]), ["floor", "trunc"], "Math.floor / Math.trunc");


// Single Array Examples
log('\n--- Array Method Tests ---');
assertDeepEqual(searchByExample.find([{ input: [1, 2], args: [[3, 4]], output: [1, 2, 3, 4] }]), ["concat"], "Array concat");
assertDeepEqual(searchByExample.find([{ input: [1, 2, 3], args: [], output: [3, 2, 1] }]), ["reverse"], "Array reverse");
assertDeepEqual(searchByExample.find([{ input: [1, 2, 3], args: [0, 1], output: [1] }]), ["slice"], "Array slice");


// Multiple Examples
log('\n--- Multiple Example Tests ---');
assertDeepEqual(searchByExample.find([{ input: "a", args: [], output: "A" }, { input: "b", args: [], output: "B" }]), ["toUpperCase"], "String toUpperCase multiple examples");
assertDeepEqual(searchByExample.find([{ input: "a", args: [], output: "A" }, { input: "b", args: [], output: "X" }]), [], "String toUpperCase multiple examples - fail case");
assertDeepEqual(searchByExample.find([{ input: 1, args: [], output: 1 }, { input: -2, args: [], output: 2 }]), ["abs"], "Math.abs multiple examples");


// Date Example
log('\n--- Date Method Tests ---');
assertDeepEqual(searchByExample.find([{ input: new Date("2023-01-15T12:00:00.000Z"), args: [], output: 2023 }]), ["getFullYear"], "Date getFullYear");
// Note: new Date().getTimezoneOffset() could be a candidate if the output is made consistent or args are used.
// For simplicity, using getFullYear as it's stable.

// RegExp Example (Revised)
log('\n--- RegExp Method Tests ---');
// r is 'new RegExp("")' in search.js, so it matches empty strings or any string if not anchored.
// The current implementation of r.test in search.js is `(new RegExp('')).test`.
// This will return true for any string because an empty regex matches the start of any string.
// To make this test meaningful for `r.test` as defined in `search.js` (which is `(new RegExp('')).test`):
// We need an example where `(new RegExp('')).test(input)` matches `output`.
// `(new RegExp('')).test("")` is true.
// `(new RegExp('')).test("abc")` is true.
// This test will identify `r.test` if the example output is `true` for any string input.
assertDeepEqual(searchByExample.find([{ input: "", args: [], output: true }]), ["test"], "RegExp test with empty string on generic empty regex (r.test)");
assertDeepEqual(searchByExample.find([{ input: "anyString", args: [], output: true }]), ["test"], "RegExp test with non-empty string on generic empty regex (r.test)");
// To get a false, we'd need a regex that doesn't match, but `r.test` is fixed to `(new RegExp('')).test`.
// So we cannot get a false for r.test with the current setup of search.js.
// The following test is more about ensuring no other function matches.
assertDeepEqual(searchByExample.find([{ input: "", args: [], output: false }]), [], "RegExp test for empty string expecting false (should find nothing for r.test)");


// JSON Static Methods
log('\n--- JSON Static Method Tests ---');
assertDeepEqual(searchByExample.find([{ input: {a:1,b:2}, args: [], output: '{"a":1,"b":2}' }]), ["stringify"], "JSON.stringify");
assertDeepEqual(searchByExample.find([{ input: '{"a":1,"b":2}', args: [], output: {a:1,b:2} }]), ["parse"], "JSON.parse");

// No Match
log('\n--- No Match Test ---');
assertDeepEqual(searchByExample.find([{ input: "impossible", args: ["example"], output: "not found" }]), [], "No function match");

// Strict Equality Test (using `equals` function)
log('\n--- Strict Equality Test ---');
assertDeepEqual(searchByExample.find([{ input: 2, args: [], output: "2" }]), [], "Strict equality (2 !== '2')");
assertDeepEqual(searchByExample.find([{ input: 0, args: [], output: false }]), [], "Strict equality (0 !== false)"); // `parse` could be a candidate if input was string "0"
assertDeepEqual(searchByExample.find([{ input: "", args: [], output: false }]), [], "Strict equality ('' !== false)");

log('\n--- All tests completed ---');
summary();
