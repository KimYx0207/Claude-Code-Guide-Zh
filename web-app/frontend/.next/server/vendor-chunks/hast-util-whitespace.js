"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/hast-util-whitespace";
exports.ids = ["vendor-chunks/hast-util-whitespace"];
exports.modules = {

/***/ "(ssr)/./node_modules/hast-util-whitespace/lib/index.js":
/*!********************************************************!*\
  !*** ./node_modules/hast-util-whitespace/lib/index.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   whitespace: () => (/* binding */ whitespace)\n/* harmony export */ });\n/**\n * @typedef {import('hast').Nodes} Nodes\n */\n\n// HTML whitespace expression.\n// See <https://infra.spec.whatwg.org/#ascii-whitespace>.\nconst re = /[ \\t\\n\\f\\r]/g\n\n/**\n * Check if the given value is *inter-element whitespace*.\n *\n * @param {Nodes | string} thing\n *   Thing to check (`Node` or `string`).\n * @returns {boolean}\n *   Whether the `value` is inter-element whitespace (`boolean`): consisting of\n *   zero or more of space, tab (`\\t`), line feed (`\\n`), carriage return\n *   (`\\r`), or form feed (`\\f`); if a node is passed it must be a `Text` node,\n *   whose `value` field is checked.\n */\nfunction whitespace(thing) {\n  return typeof thing === 'object'\n    ? thing.type === 'text'\n      ? empty(thing.value)\n      : false\n    : empty(thing)\n}\n\n/**\n * @param {string} value\n * @returns {boolean}\n */\nfunction empty(value) {\n  return value.replace(re, '') === ''\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvaGFzdC11dGlsLXdoaXRlc3BhY2UvbGliL2luZGV4LmpzIiwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBLGFBQWEsc0JBQXNCO0FBQ25DOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGdCQUFnQjtBQUMzQjtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0Esa0NBQWtDO0FBQ2xDO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcYWRtaW5cXERlc2t0b3BcXEtpbVByb2plY3RcXOWFrOS8l+WPt+WGmeS9nOWKqeaJi1xcd2ViLWFwcFxcZnJvbnRlbmRcXG5vZGVfbW9kdWxlc1xcaGFzdC11dGlsLXdoaXRlc3BhY2VcXGxpYlxcaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCdoYXN0JykuTm9kZXN9IE5vZGVzXG4gKi9cblxuLy8gSFRNTCB3aGl0ZXNwYWNlIGV4cHJlc3Npb24uXG4vLyBTZWUgPGh0dHBzOi8vaW5mcmEuc3BlYy53aGF0d2cub3JnLyNhc2NpaS13aGl0ZXNwYWNlPi5cbmNvbnN0IHJlID0gL1sgXFx0XFxuXFxmXFxyXS9nXG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIGdpdmVuIHZhbHVlIGlzICppbnRlci1lbGVtZW50IHdoaXRlc3BhY2UqLlxuICpcbiAqIEBwYXJhbSB7Tm9kZXMgfCBzdHJpbmd9IHRoaW5nXG4gKiAgIFRoaW5nIHRvIGNoZWNrIChgTm9kZWAgb3IgYHN0cmluZ2ApLlxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKiAgIFdoZXRoZXIgdGhlIGB2YWx1ZWAgaXMgaW50ZXItZWxlbWVudCB3aGl0ZXNwYWNlIChgYm9vbGVhbmApOiBjb25zaXN0aW5nIG9mXG4gKiAgIHplcm8gb3IgbW9yZSBvZiBzcGFjZSwgdGFiIChgXFx0YCksIGxpbmUgZmVlZCAoYFxcbmApLCBjYXJyaWFnZSByZXR1cm5cbiAqICAgKGBcXHJgKSwgb3IgZm9ybSBmZWVkIChgXFxmYCk7IGlmIGEgbm9kZSBpcyBwYXNzZWQgaXQgbXVzdCBiZSBhIGBUZXh0YCBub2RlLFxuICogICB3aG9zZSBgdmFsdWVgIGZpZWxkIGlzIGNoZWNrZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3aGl0ZXNwYWNlKHRoaW5nKSB7XG4gIHJldHVybiB0eXBlb2YgdGhpbmcgPT09ICdvYmplY3QnXG4gICAgPyB0aGluZy50eXBlID09PSAndGV4dCdcbiAgICAgID8gZW1wdHkodGhpbmcudmFsdWUpXG4gICAgICA6IGZhbHNlXG4gICAgOiBlbXB0eSh0aGluZylcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBlbXB0eSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUucmVwbGFjZShyZSwgJycpID09PSAnJ1xufVxuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/hast-util-whitespace/lib/index.js\n");

/***/ })

};
;